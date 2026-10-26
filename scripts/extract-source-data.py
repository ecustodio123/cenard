import json,re,requests,concurrent.futures
from pathlib import Path
from bs4 import BeautifulSoup
from PIL import Image
from io import BytesIO

def load(n):return json.loads(Path('docs/source/'+n+'.json').read_text())
def soup(n):return BeautifulSoup(Path('docs/source/'+n+'.html').read_text(),'html.parser')
def save(n,data):Path('src/data/'+n+'.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
# Each public source remains separate; only identical national entries in duplicated O panel are removed.
people=[]
s=soup('listado-de-arbitros')
groups=[el for el in s.select('main .elementor-widget') if el.select('.elementskit-card-body li')]
for i,el in enumerate(groups):
 seen=set()
 for li in el.select('.elementskit-card-body li'):
  text=li.get_text(' ',strip=True)
  if not text or text in seen:continue
  seen.add(text)
  if i==0: name=text;profession='';specialty=''
  else:
   match=re.split(r'\s*-?\s*Abogado',text,maxsplit=1);name=match[0].rstrip(' -');profession='Abogado';specialty=re.sub(r'^\s*\(?Especialidad\s*:?\s*','',match[1],flags=re.I).rstrip(')') if len(match)>1 else ''
  people.append({'id':f'ar-{i}-{len(people)}','name':name,'profession':profession,'specialty':specialty,'group':'Nacionales' if i==0 else 'Contratación pública','kind':'arbitro','period':'2025'})
for row in load('nomina-de-adjudicadores')['tables'][0][1:]:
 if not row or not row[0].strip():continue
 people.append({'id':f'ad-{len(people)}','name':row[0],'profession':row[1] if len(row)>1 else '', 'specialty':row[2] if len(row)>2 else '', 'group':'Contratación pública','kind':'adjudicador','period':'2025'})
save('professionals',people)
# Documents preserve source context and never infer dates from upload directories.
documents=[]
for service in ['arbitraje','jprd']:
 for i,link in enumerate([x for x in load(service)['links'] if '.pdf' in (x['url'] or '').lower()]):
  title=link['text'].capitalize().replace('2025','2025').replace('jprd','JPRD').replace('arbitro /adjudicador','árbitro / adjudicador').replace('insicripcion','inscripción')
  typ='Reglamento' if 'reglamento' in title.lower() else 'Directiva' if 'directiva' in title.lower() else 'Ficha' if 'ficha' in title.lower() else 'Código de ética'
  documents.append({'id':service+'-'+str(i),'title':title,'service':'Arbitraje' if service=='arbitraje' else 'JPRD','type':typ,'context':'Archivo histórico hasta el 03/08/2025' if service=='arbitraje' and i>=7 else 'Publicado desde el 04/08/2025','status':'Histórico en la fuente' if service=='arbitraje' and i>=7 else 'Pendiente de validar vigencia','urlOrigin':load(service)['url'],'urlPublic':link['url']})
save('documents',documents)
certs=load('certificaciones')['links']
names=['Licencia de funcionamiento','Certificado ISO 37001','Certificado ISO 9001','Constancia CAJPRD C-000006-2025','Constancia IA C-000013-2025']
save('certifications',[{'id':str(i),'title':names[i],'url':x['url'],'status':'Versión y vigencia por confirmar' if i in [1,2] else 'Validación institucional pendiente'} for i,x in enumerate(certs)])
faq=[]
for el in soup('servicio-de-arbitraje').select('main .elementskit-card')[:5]:
 q=el.select_one('.ekit-accordion-title');a=el.select_one('.elementskit-card-body')
 faq.append({'q':q.get_text(' ',strip=True).replace('¿Cuales','¿Cuáles'),'a':a.get_text(' ',strip=True).replace('Texto Justificado ','').replace('proceso .','proceso.')})
save('faq',faq)
photos=[];council=[]
for i,el in enumerate(soup('alto-consejo').select('[id^="ekit_team_modal"]')):
 name=el.select_one('.ekit-team-modal-title').get_text(' ',strip=True)
 bio=el.select_one('.ekit-team-modal-content').get_text(' ',strip=True)
 url=el.select_one('img')['src']; photos.append((f'council-{i}',url))
 council.append({'name':name,'bio':bio,'image':f'/images/council-{i}.webp'})
save('council',council)
# Preserve unique sections of secretary bio once.
secretary=load('secretaria-general')['text'].split('\n')
save('secretary',{'name':'Dr. Ángel Alcalá Contreras','role':'Secretario General y Director','intro':secretary[2],'sections':[{'title':secretary[i],'text':secretary[i+1]} for i in [3,5,7,9,11]],'technical':{'name':'Elizabeth Pereira Samanez','role':'Secretaria arbitral / técnica'}})
def download(x):
 name,url=x;r=requests.get(url,timeout=45);r.raise_for_status();im=Image.open(BytesIO(r.content));im.thumbnail((600,900));im.convert('RGB').save('public/images/'+name+'.webp',quality=85)
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:list(pool.map(download,photos))
print('professionals',len(people),'docs',len(documents),'faq',len(faq))
# Inventory includes all captured source text and exact document destinations.
lines=['# Inventario de contenido','', 'Revisión de las páginas públicas: 24/10/2026. Fuentes archivadas en `docs/source/*.json` y HTML original. Sistemas excluidos no visitados.','']
for p in Path('docs/source').glob('*.json'):
 d=json.loads(p.read_text());lines += ['## '+d['title'], '',d['url'],'',d['text'],'','### Recursos','']+[f'- {x["text"]}: {x["url"]}' for x in d['links'] if x['url'] and not 'sistema.cenardarbitraje.com' in x['url']]+['','Validación: contenido editorial, cargos, fechas y vigencia pendientes de CENARD.','']
Path('docs/inventario-contenido.md').write_text('\n'.join(lines))
