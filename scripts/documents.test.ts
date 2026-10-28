import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const read = async (path: string) =>
  JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));

test("catalogue preserves all original service references while sharing identical files", async () => {
  const documents = await read("../src/data/documents.json");
  const expected: string[] = [];
  for (const service of ["arbitraje", "jprd"]) {
    const source = await read(`../docs/source/${service}.json`);
    for (const link of source.links.filter((link: { url: string }) =>
      link.url?.toLowerCase().endsWith(".pdf"),
    ))
      expected.push(`${service}|${link.url}`);
  }
  const actual = documents.flatMap(
    (doc: { services: string[]; urlPublic: string }) =>
      doc.services.map(
        (service) => `${service.toLowerCase()}|${doc.urlPublic}`,
      ),
  );
  assert.deepEqual([...actual].sort(), expected.sort());
  assert.equal(
    new Set(documents.map((doc: { id: string }) => doc.id)).size,
    documents.length,
  );
  assert.equal(
    new Set(documents.map((doc: { urlPublic: string }) => doc.urlPublic)).size,
    documents.length,
  );
  const directives = documents.filter((doc: { title: string }) =>
    doc.title.startsWith("Directiva 01"),
  );
  assert.equal(directives.length, 2);
  assert.notEqual(directives[0].id, directives[1].id);
  assert.notEqual(directives[0].urlPublic, directives[1].urlPublic);
  assert.ok(
    documents.some((doc: { services: string[] }) => doc.services.length > 1),
  );
  assert.ok(
    documents.some(
      (doc: { sourceGrouping: { kind: string } }) =>
        doc.sourceGrouping.kind === "historico",
    ),
  );
  for (const doc of documents) {
    assert.equal(doc.publicationDate, undefined);
    assert.equal(doc.version, undefined);
    assert.equal(doc.applicationPeriod, undefined);
    assert.deepEqual(
      [
        ...new Set(
          doc.references.map((ref: { service: string }) => ref.service),
        ),
      ].sort(),
      [...doc.services].sort(),
    );
  }
});
