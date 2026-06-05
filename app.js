/* Splash handling */
setTimeout(()=>{
  document.getElementById('splash').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
},3000);

/* Navigation */
const menuLinks=document.querySelectorAll('.menu-item');
const pages=document.querySelectorAll('.page');
function showPage(hash){
  const id=hash.replace('#','');
  pages.forEach(p=>p.classList.toggle('active',p.id===id));
  menuLinks.forEach(l=>l.classList.toggle('active',l.getAttribute('href')===hash));
}
const startHash=location.hash||'#analytical-tools';
showPage(startHash);
menuLinks.forEach(l=>{
  l.addEventListener('click',e=>{
    e.preventDefault();
    const h=l.getAttribute('href');
    history.pushState(null,'',h);
    showPage(h);
  });
});

/* Toolkit – WebDAV via public CORS proxy */
const PROXY='https://cors-anywhere.herokuapp.com/';
const BASE='https://nextcloud.lombardia.cisl.it/remote.php/dav/files/';
const TOKEN='nr6SDkTNxDoKe4B';
function loadToolkit(){
  const url=`${PROXY}${BASE}${TOKEN}/`;
  fetch(url,{method:'PROPFIND',headers:{Depth:'1','X-Requested-With':'XMLHttpRequest'}})
    .then(r=>{if(!r.ok)throw new Error('Network error');return r.text();})
    .then(t=>{
      const parser=new DOMParser();
      const xml=parser.parseFromString(t,'application/xml');
      const hrefs=Array.from(xml.querySelectorAll('d\\:href,href'))
        .map(el=>decodeURIComponent(el.textContent))
        .filter(h=>h!=='/' && !h.endsWith(`/${TOKEN}/`));
      const ul=document.getElementById('toolkit-list');
      ul.innerHTML=hrefs.length?hrefs.map(f=>`<li>${f}</li>`).join(''):'<li>(empty)</li>';
    })
    .catch(err=>{document.getElementById('toolkit-list').innerHTML=`<li>Error: ${err.message}</li>`;});
}
window.addEventListener('hashchange',()=>{if(location.hash==='#toolkit')loadToolkit();});
if(startHash==='#toolkit')loadToolkit();
