import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { AdminArbitratorError, adaptAdminArbitrators, adminArbitratorColumns, arbitratorDraft, createAdminArbitratorsApi, sortAdminArbitrators, validateArbitratorDraft } from '../src/lib/admin/arbitrators.ts';
import { emptyRosterDraft } from '../src/lib/admin/rosters.ts';
const userId='00000000-0000-4000-8000-000000000001';
const id='00000000-0000-4000-8000-000000000002';
const row=(patch={})=>({id,apellidos_nombres:'Álvarez Núñez, Prueba',profesion_publicada:null,especialidad_publicada:null,grupos:['Nacionales'],habilitaciones:[],visible:false,...patch});
const draft=(patch={})=>({...emptyRosterDraft(),name:'  Álvarez Núñez, Prueba  ',groups:['Nacionales'],...patch});
const signal=()=>new AbortController().signal;
function fixture() {
  const requests: {url:URL;method:string;body:unknown}[]=[];
  let authorized=true,identity=true,permissionError=false,mutationError=false,emptyAffected=false;
  let rows=[row()];
  let userDelay: Promise<void> | undefined;
  const client=createClient('https://example.supabase.co','sb_publishable_crud_test',{
    auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},
    global:{fetch:async(input,init)=>{
      const url=new URL(typeof input==='string'?input:input instanceof URL?input.href:input.url);
      const method=init?.method??'GET'; const body=init?.body?JSON.parse(String(init.body)):null;
      requests.push({url,method,body});
      const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
      if(url.pathname.endsWith('nominas_administradores')) return permissionError?json({message:'offline'},503):json(authorized?[{user_id:userId}]:[]);
      if(method==='GET') return json(rows);
      if(mutationError) return json({code:'42501',message:'denied'},403);
      if(emptyAffected) return json(null);
      if(method==='DELETE') { rows=[]; return json({id}); }
      const updated=method==='POST'?row({...body,id,visible:true}):row({...rows[0],...body});
      rows=[updated]; return json(updated);
    }},
  });
  client.auth.getUser=(async()=>{ await userDelay; return identity?{data:{user:{id:userId}},error:null}:{data:{user:null},error:{name:'AuthSessionMissingError',status:400}}; }) as typeof client.auth.getUser;
  const api=createAdminArbitratorsApi(client,userId);
  return {api,requests,setAuthorized(v:boolean){authorized=v;},setIdentity(v:boolean){identity=v;},setPermissionError(v:boolean){permissionError=v;},setMutationError(v:boolean){mutationError=v;},setEmptyAffected(v:boolean){emptyAffected=v;},setRows(v:ReturnType<typeof row>[]){rows=v;},deferIdentity(p:Promise<void>){userDelay=p;}};
}
test('only name and groups are required; optional fields become NULL and empty qualifications []',()=>{
  assert.deepEqual(validateArbitratorDraft(emptyRosterDraft()).errors,{name:'Ingresa los apellidos y nombres.',groups:'Selecciona al menos un grupo válido.'});
  const valid=validateArbitratorDraft(draft({specialty:'  ',profession:' '})); assert.deepEqual(valid.errors,{});
  assert.deepEqual(valid.payload,{apellidos_nombres:'Álvarez Núñez, Prueba',profesion_publicada:null,especialidad_publicada:null,grupos:['Nacionales'],habilitaciones:[]});
  assert.ok(validateArbitratorDraft(draft({profession:'—'})).errors.profession);
  assert.ok(validateArbitratorDraft(draft({specialty:'—'})).errors.specialty);
  assert.ok(validateArbitratorDraft(draft({specialty:'Sin información publicada'})).errors.specialty);
  assert.ok(validateArbitratorDraft(draft({groups:['unsupported']})).errors.groups);
  assert.ok(validateArbitratorDraft(draft({qualifications:['unsupported']})).errors.qualifications);
});
test('both groups and all qualification combinations are accepted; exact content survives trim',()=>{
  const options=['Presidente de tribunal arbitral','Árbitro único','Árbitro de parte'];
  for(let bits=0;bits<8;bits++) {
    const selected=options.filter((_,i)=>bits&(1<<i));
    const r=validateArbitratorDraft(draft({groups:['Nacionales','Contratación pública'],qualifications:selected,profession:'Ingeniero',specialty:'  Contratación  pública y arbitraje  '}));
    assert.deepEqual(r.errors,{}); assert.deepEqual(r.payload.habilitaciones,selected);assert.equal(r.payload.grupos.length,2);assert.equal(r.payload.especialidad_publicada,'Contratación  pública y arbitraje');
  }
});
test('admin adapter retains hidden rows and nulls; editing has empty fields without mutating arrays',()=>{
  const records=adaptAdminArbitrators([row(),row({id:'00000000-0000-4000-8000-000000000003',visible:true})]);
  assert.equal(records[0].visible,false); assert.equal(records[0].profession,null);
  const edit=arbitratorDraft(records[0]); assert.equal(edit.profession,''); assert.equal(edit.specialty,''); assert.deepEqual(edit.qualifications,[]);
  edit.groups.push('Contratación pública'); assert.deepEqual(records[0].groups,['Nacionales']);
  assert.throws(()=>adaptAdminArbitrators([row({visible:null})])); assert.throws(()=>adaptAdminArbitrators([row(),row()]));
});
test('administrative list selects necessary columns, sorts and never filters visible',async()=>{
  const f=fixture(); const rows=await f.api.list(signal()); assert.equal(rows[0].visible,false);
  const request=f.requests.find(r=>r.url.pathname.endsWith('nomina_arbitros'))!;
  assert.equal(request.method,'GET');assert.equal(request.url.searchParams.get('select'),adminArbitratorColumns);assert.equal(request.url.searchParams.has('visible'),false);assert.equal(request.url.searchParams.get('order'),'apellidos_nombres.asc,id.asc');
  assert.equal(f.requests[0].url.searchParams.get('select'),'user_id');assert.equal(f.requests[0].url.searchParams.get('user_id'),`eq.${userId}`);
});
test('INSERT sends editable fields and visible true, lets database generate UUID and dates, returns confirmed row',async()=>{
  const f=fixture();const record=await f.api.save(draft({groups:['Nacionales','Contratación pública']}),null,signal());
  const request=f.requests.find(r=>r.method==='POST')!;const payload=request.body as Record<string,unknown>;
  assert.equal(record.id,id);assert.equal(record.visible,true); assert.equal(payload.visible,true);assert.equal(payload.id,undefined);assert.equal(payload.created_at,undefined);assert.equal(payload.updated_at,undefined);assert.deepEqual(payload.grupos,['Nacionales','Contratación pública']);
});
test('UPDATE is filtered by UUID, clears optional fields, and never overwrites visibility or identity',async()=>{
  const f=fixture();const record=await f.api.save(draft(),id,signal());const request=f.requests.find(r=>r.method==='PATCH')!;
  const payload=request.body as Record<string,unknown>; assert.equal(request.url.searchParams.get('id'),`eq.${id}`);
  assert.equal(record.visible,false);assert.equal(payload.visible,undefined);assert.equal(payload.id,undefined);assert.equal(payload.profesion_publicada,null);assert.equal(payload.especialidad_publicada,null);assert.deepEqual(payload.habilitaciones,[]);assert.ok(!f.requests.some(r=>r.method==='POST'));
});
test('visibility updates only visible by UUID, and supports hide then show',async()=>{
  const f=fixture();assert.equal((await f.api.visibility(id,true,signal())).visible,true);assert.equal((await f.api.visibility(id,false,signal())).visible,false);
  assert.deepEqual(f.requests.filter(r=>r.method==='PATCH').map(r=>r.body),[{visible:true},{visible:false}]);
  for(const r of f.requests.filter(r=>r.method==='PATCH')) assert.equal(r.url.searchParams.get('id'),`eq.${id}`);
});
test('DELETE confirms returned UUID; no affected row is an error even without a database error',async()=>{
  const f=fixture(); assert.equal(await f.api.remove(id,signal()),id);const request=f.requests.find(r=>r.method==='DELETE')!;
  assert.equal(request.url.searchParams.get('id'),`eq.${id}`);assert.equal(request.url.searchParams.get('select'),'id');
  f.setEmptyAffected(true);await assert.rejects(f.api.remove(id,signal()),/No se confirmó/);
});
test('empty successful list differs from query failure and no affected INSERT/UPDATE',async()=>{
  const f=fixture();f.setRows([]); assert.deepEqual(await f.api.list(signal()),[]);
  f.setPermissionError(true);await assert.rejects(f.api.list(signal()),/conexión/);f.setPermissionError(false);f.setEmptyAffected(true);
  await assert.rejects(f.api.save(draft(),null,signal()),/No se confirmó/);await assert.rejects(f.api.save(draft(),id,signal()),/No se confirmó/);
});
test('visitors, unauthorized users and expired sessions are blocked before roster writes',async()=>{
  for(const kind of ['visitor','unauthorized','denied']) {
    const f=fixture();if(kind==='visitor')f.setIdentity(false);if(kind==='unauthorized')f.setAuthorized(false);if(kind==='denied')f.setMutationError(true);
    await assert.rejects(f.api.save(draft(),null,signal()),error=>error instanceof AdminArbitratorError&&error.accessLost);
    if(kind!=='denied')assert.ok(!f.requests.some(r=>r.method!=='GET'));
  }
});
test('aborting after signout while identity is pending prevents a late write',async()=>{
  const f=fixture();let release!:()=>void;f.deferIdentity(new Promise(resolve=>{release=resolve;}));const c=new AbortController();const request=f.api.save(draft(),null,c.signal);
  c.abort();release();await assert.rejects(request);assert.ok(!f.requests.some(r=>r.method!=='GET'));
});
test('homonyms retain independent UUIDs and deterministic sorting never mutates inputs',()=>{
  const records=adaptAdminArbitrators([row({id:'00000000-0000-4000-8000-000000000003'}),row()]);const before=JSON.stringify(records);const sorted=sortAdminArbitrators(records);
  assert.equal(sorted.length,2);assert.equal(sorted[0].id,id);assert.equal(JSON.stringify(records),before);
});
