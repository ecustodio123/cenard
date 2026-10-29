import test from 'node:test';
import assert from 'node:assert/strict';
import type { SupabaseClient } from '@supabase/supabase-js';
import { AdminAuthController, loginErrorMessage } from '../src/lib/admin/auth.ts';

const tick = () => new Promise(resolve => setTimeout(resolve, 10));
function fixture() {
  let event: (event: string) => void = () => {};
  let session = false;
  let permission: { data: unknown; error: unknown } = { data: { user_id: 'verified-user' }, error: null };
  let permissionPromise: Promise<typeof permission> | undefined;
  let loginError: unknown = null;
  let logoutError: unknown = null;
  let identityError: unknown = null;
  let loginCalls = 0;
  let unsubscribed = false;
  const query: unknown[][] = [];
  let credentials: unknown;
  const client = {
    auth: {
      onAuthStateChange(callback: typeof event) { event = callback; return { data: { subscription: { unsubscribe() { unsubscribed = true; } } } }; },
      async getSession() { return { data: { session: session ? {} : null }, error: null }; },
      async getUser() { return { data: { user: { id: 'verified-user' } }, error: identityError }; },
      async signInWithPassword(input: unknown) { credentials = input; loginCalls++; if (!loginError) { session = true; event('SIGNED_IN'); } return { error: loginError }; },
      async signOut() { if (!logoutError) { session = false; event('SIGNED_OUT'); } return { error: logoutError }; },
    },
    schema(value: string) { query.push(['schema', value]); return this; },
    from(value: string) { query.push(['from', value]); return this; },
    select(value: string) { query.push(['select', value]); return this; },
    eq(field: string, value: string) { query.push(['eq', field, value]); return this; },
    async maybeSingle() { return permissionPromise ?? permission; },
  };
  const controller = new AdminAuthController(() => client as unknown as SupabaseClient);
  return { controller, query, get credentials() { return credentials; }, get calls() { return loginCalls; }, get unsubscribed() { return unsubscribed; },
    setSession(value: boolean) { session = value; }, setPermission(data: unknown, error: unknown = null) { permission = { data, error }; },
    deferPermission(promise: Promise<typeof permission>) { permissionPromise = promise; },
    setLoginError(value: unknown) { loginError = value; }, setLogoutError(value: unknown) { logoutError = value; },
    setIdentityError(value: unknown) { identityError = value; }, emit(value: string) { event(value); } };
}

test('no session never queries permissions or opens panel', async () => {
  const f = fixture(); await f.controller.start(); await tick();
  assert.equal(f.controller.getSnapshot().status, 'signed-out'); assert.deepEqual(f.query, []); f.controller.stop(); assert.ok(f.unsubscribed);
});
test('real login trims only email, prevents duplicate submissions and verifies UUID permission', async () => {
  const f = fixture(); await f.controller.start(); await tick();
  await Promise.all([f.controller.login(' person@example.test ', ' password '), f.controller.login('another@example.test', 'other')]); await tick();
  assert.deepEqual(f.credentials, { email: 'person@example.test', password: ' password ' }); assert.equal(f.calls, 1);
  assert.deepEqual(f.controller.getSnapshot(), { status: 'authorized', userId: 'verified-user' });
  assert.deepEqual(f.query, [['schema','public'], ['from','nominas_administradores'], ['select','user_id'], ['eq','user_id','verified-user']]); f.controller.stop();
});
test('restored session requires verified identity and authorization on every mount', async () => {
  const f = fixture(); f.setSession(true); await f.controller.start(); await tick(); assert.equal(f.controller.getSnapshot().status,'authorized');
  f.controller.stop(); f.setPermission(null); await f.controller.start(); await tick(); assert.equal(f.controller.getSnapshot().status,'unauthorized'); f.controller.stop();
});
test('invalid credentials and rate limits never grant access', async () => {
  const f = fixture(); await f.controller.start(); await tick(); f.setLoginError({ code:'invalid_credentials', status:400 });
  await f.controller.login('person@example.test','wrong'); assert.equal(f.controller.getSnapshot().status,'signed-out'); assert.equal(f.query.length,0);
  assert.match(loginErrorMessage({status:429}),/Demasiados/); assert.match(loginErrorMessage({status:503}),/conexión/); f.controller.stop();
});
test('permission network failure blocks access, retry succeeds without treating error as denial', async () => {
  const f = fixture(); f.setSession(true); f.setPermission(null,{message:'offline'}); await f.controller.start(); await tick();
  assert.equal(f.controller.getSnapshot().status,'error'); f.setPermission({user_id:'verified-user'}); f.controller.retry(); await tick();
  assert.equal(f.controller.getSnapshot().status,'authorized'); f.controller.stop();
});
test('identity errors and mismatched authorization never authorize', async () => {
  const f = fixture(); f.setSession(true); f.setIdentityError({status:503}); await f.controller.start(); await tick();
  assert.equal(f.controller.getSnapshot().status,'error'); assert.equal(f.query.length,0);
  f.setIdentityError(null); f.setPermission({user_id:'someone-else'}); f.controller.retry(); await tick(); assert.equal(f.controller.getSnapshot().status,'error'); f.controller.stop();
});
test('stale permission response cannot reopen panel after signout', async () => {
  const f = fixture(); let resolve!: (value: {data: unknown; error: unknown}) => void;
  f.deferPermission(new Promise(r => {resolve=r;})); f.setSession(true); await f.controller.start(); await tick();
  await f.controller.logout(); resolve({data:{user_id:'verified-user'},error:null}); await tick(); assert.equal(f.controller.getSnapshot().status,'signed-out'); f.controller.stop();
});
test('logout hides panel immediately; failure stays blocked even on auth events until retried', async () => {
  const f = fixture(); f.setSession(true); await f.controller.start(); await tick(); f.setLogoutError({status:503});
  const exiting=f.controller.logout(); assert.equal(f.controller.getSnapshot().status,'checking'); await exiting;
  assert.equal(f.controller.getSnapshot().status,'error'); f.emit('SIGNED_IN'); await tick(); assert.equal(f.controller.getSnapshot().status,'error');
  f.setLogoutError(null); await f.controller.logout(); assert.equal(f.controller.getSnapshot().status,'signed-out'); f.controller.stop();
});
test('external signout and stopped controllers discard outstanding verification', async () => {
  const f = fixture(); f.setSession(true); await f.controller.start(); await tick(); f.setSession(false); f.emit('SIGNED_OUT');
  assert.equal(f.controller.getSnapshot().status,'signed-out'); f.controller.stop(); f.emit('SIGNED_IN'); await tick(); assert.equal(f.controller.getSnapshot().status,'signed-out');
});
test('missing configuration blocks access with actionable message', async () => {
  const c=new AdminAuthController(()=>{throw new Error('missing');}); await c.start(); assert.equal(c.getSnapshot().status,'error'); c.stop();
});
test('stale permission response cannot authorize after the session changes', async () => {
  const f = fixture(); let resolve!: (value: {data: unknown; error: unknown}) => void;
  f.deferPermission(new Promise(r=>{resolve=r;})); f.setSession(true); await f.controller.start(); await tick();
  f.setSession(false); f.emit('SIGNED_IN'); await tick(); resolve({data:{user_id:'verified-user'},error:null}); await tick();
  assert.equal(f.controller.getSnapshot().status,'signed-out'); f.controller.stop();
});
test('revoked identity signs out without querying administrative permissions', async () => {
  const f=fixture(); f.setSession(true); f.setIdentityError({status:401}); await f.controller.start(); await tick();
  assert.equal(f.controller.getSnapshot().status,'signed-out'); assert.deepEqual(f.query,[]); f.controller.stop();
});
test('unauthorized account remains blocked if automatic signout fails', async () => {
  const f=fixture(); f.setSession(true); f.setPermission(null); f.setLogoutError({status:503}); await f.controller.start(); await tick();
  const state=f.controller.getSnapshot(); assert.equal(state.status,'error');
  if(state.status==='error') { assert.ok(state.exitOnly); assert.match(state.message,/no tiene permisos/); }
  f.controller.stop();
});
