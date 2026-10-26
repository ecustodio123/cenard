from bs4 import BeautifulSoup
import requests,json,concurrent.futures
from pathlib import Path
base='https://cenardarbitraje.com/web/'
slugs=['','conocenos','arbitraje','jprd','servicio-de-arbitraje','secretaria-general','alto-consejo','organigrama','certificaciones','listado-de-arbitros','nomina-de-adjudicadores','atalaya-de-integridad','calculadora']
def fetch(slug):
    url=base+ (slug+'/' if slug else '')
    r=requests.get(url,timeout=45); r.raise_for_status()
    soup=BeautifulSoup(r.text,'html.parser')
    Path('docs/source/'+(slug or 'inicio')+'.html').write_text(r.text)
    main=soup.find('main') or soup
    for el in main.select('script,style,header,footer,nav'): el.decompose()
    data={'slug':slug,'url':url,'title':soup.title.get_text() if soup.title else '', 'text':main.get_text('\n',strip=True),'links':[{'text':a.get_text(' ',strip=True),'url':a.get('href')} for a in main.select('a[href]')], 'images':[{'alt':i.get('alt'),'src':i.get('src'),'srcset':i.get('srcset')} for i in soup.select('img')], 'tables':[[[c.get_text(' ',strip=True) for c in tr.select('td,th')] for tr in t.select('tr')] for t in main.select('table')], 'accordions':[{'q':x.select_one('.elementor-tab-title').get_text(' ',strip=True),'a':x.select_one('.elementor-tab-content').get_text(' ',strip=True)} for x in main.select('.elementor-accordion-item') if x.select_one('.elementor-tab-title') and x.select_one('.elementor-tab-content')]}
    Path('docs/source/'+(slug or 'inicio')+'.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
    print(slug or 'inicio',len(data['text']),len(data['images']),len(data['tables']),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:list(pool.map(fetch,slugs))
