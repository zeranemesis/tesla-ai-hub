(() => {
'use strict';
const $ = s => document.querySelector(s), $$ = s => Array.from(document.querySelectorAll(s));
const KEY='tesla-ai-hub:v1', TITLES={accueil:'Accueil',projets:'Mes projets',prompts:'Prompts rapides',reglages:'Réglages'};
const defaults=[
{id:'mp4',name:'Mario Party 4',description:'Port PC natif et netplay',chatUrl:'',repoUrl:'https://github.com/zeranemesis/Marioparty4'},
{id:'sunshine',name:'Super Mario Sunshine',description:'Port PC et mods',chatUrl:'',repoUrl:'https://github.com/zeranemesis/sms-port'},
{id:'shelf',name:'DecompShelf',description:'Assistant IA et guides de jeu',chatUrl:'',repoUrl:''},
{id:'mkds',name:'Mario Kart DS',description:'Décompilation et port PC',chatUrl:'',repoUrl:'https://github.com/zeranemesis/mkds-eur-decomp'}];
const templates=[
['DÉVELOPPEMENT','Faire avancer un projet','Analyser mon dépôt et proposer les prochaines tâches.','Analyse mon projet et son dépôt GitHub connecté. Identifie les blocages, les risques de régression et les trois améliorations prioritaires. Propose un plan testable, puis demande mon accord avant toute modification importante.'],
['DÉBOGAGE','Diagnostiquer un bug','Construire des hypothèses et des tests.','Aide-moi à diagnostiquer un bug. Propose des hypothèses vérifiables, les logs nécessaires, une procédure de reproduction et le correctif minimal. Distingue toujours un test réellement exécuté d’un simple raisonnement.'],
['PLANIFICATION','Planifier une session','Transformer une idée en étapes concrètes.','Prépare ma prochaine session de développement de 90 minutes. Définis les dépendances, les étapes testables et les critères d’acceptation.'],
['REVUE DE CODE','Examiner les changements','Chercher les régressions dans les commits.','Examine les derniers changements de mon dépôt GitHub. Identifie les régressions possibles et les tests manquants en citant les fichiers concernés.'],
['IDÉES','Brainstorming à la voix','Imaginer une nouvelle fonctionnalité.','Discutons à la voix d’une fonctionnalité pour mon projet. Pose-moi des questions courtes une par une puis prépare un cahier des charges et une feuille de route.'],
['COMPTE RENDU','Résumer notre discussion','Conserver les décisions et les tâches.','Résume nos décisions et prépare la liste des prochaines tâches, des points ouverts et un prompt pour reprendre le projet ultérieurement.']];
const esc = x => String(x ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ico = n => '<svg aria-hidden="true"><use href="#i-'+n+'"></use></svg>';
function https(raw,chat=false){
if(!raw||typeof raw!=='string')return '';
try{const u=new URL(raw);if(u.protocol!=='https:'||u.username||u.password)return '';if(chat && u.hostname!=='chatgpt.com')return '';return u.href;}
catch{return '';}
}
function clean(p){return {id:String(p.id||'').slice(0,80),name:String(p.name||'').trim().slice(0,50),description:String(p.description||'').slice(0,90),chatUrl:https(p.chatUrl,true),repoUrl:https(p.repoUrl)};}
function fresh(){return {theme:'dark',projects:defaults.map(clean)};}
function load(){try{const obj=JSON.parse(localStorage.getItem(KEY)||'null');if(obj&&Array.isArray(obj.projects)&&obj.projects.length<=40){return {theme:obj.theme==='light'?'light':'dark',projects:obj.projects.filter(p=>p&&typeof p==='object').map(clean).filter(p=>p.id&&p.name)};}}catch{}return fresh();}
let state=load(),toastTimer;
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3400);}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{toast('Stockage local indisponible sur ce navigateur.');}}
function theme(){document.body.classList.toggle('light',state.theme==='light');$('#themeDark').classList.toggle('active',state.theme==='dark');$('#themeLight').classList.toggle('active',state.theme==='light');document.querySelector('meta[name="theme-color"]').content=state.theme==='light'?'#f0f4fa':'#0b0e13';}
function route(){let section;try{section=decodeURIComponent((location.hash||'#accueil').slice(1));}catch{section='accueil';}if(!TITLES[section])section='accueil';$$('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===section));$$('[data-nav]').forEach(n=>{let active=n.dataset.nav===section;n.classList.toggle('active',active);if(active)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');});$('#currentSection').textContent=TITLES[section];}
function projectCard(p,i){const chat=p.chatUrl?'<a class="project-btn primary-link" href="'+esc(p.chatUrl)+'" rel="noopener">'+ico('message')+' Ouvrir ChatGPT</a>':'<button type="button" class="project-btn primary-link" data-action="edit" data-id="'+esc(p.id)+'">'+ico('plus')+' Ajouter lien ChatGPT</button>';
const repo=p.repoUrl?'<a class="project-btn" href="'+esc(p.repoUrl)+'" rel="noopener">'+ico('github')+' Dépôt / documentation</a>':'';
return '<article class="project-card"><div class="project-top"><span class="project-logo '+['','mint','purple','amber'][i%4]+'">'+ico('folder')+'</span><div style="min-width:0"><div class="project-title">'+esc(p.name)+'</div><div class="project-subtitle">'+esc(p.description||'Projet personnel')+'</div></div></div><div class="project-actions">'+chat+repo+'<button type="button" class="project-btn icon-only" data-action="edit" data-id="'+esc(p.id)+'" aria-label="Modifier '+esc(p.name)+'">'+ico('pencil')+'</button></div></article>';}
function render(){let cards=state.projects.map(projectCard);$('#homeProjects').innerHTML=cards.slice(0,4).join('')||'<p class="footnote">Ajoutez votre premier projet.</p>';$('#allProjects').innerHTML=cards.join('')||'<p class="footnote">Aucun projet enregistré.</p>';$('#projectCount').textContent=state.projects.length;}
function renderPrompts(){$('#promptCatalog').innerHTML=templates.map((p,i)=>'<article class="prompt-card"><span class="prompt-category">'+esc(p[0])+'</span><h3>'+esc(p[1])+'</h3><p>'+esc(p[2])+'</p><button type="button" class="btn secondary" data-action="prompt" data-index="'+i+'">'+ico('copy')+' Utiliser ce prompt</button></article>').join('');}
const show = dlg => typeof dlg.showModal==='function'?dlg.showModal():dlg.setAttribute('open','');
const close = dlg => typeof dlg.close==='function'?dlg.close():dlg.removeAttribute('open');
function edit(id=''){const p=state.projects.find(p=>p.id===id);$('#projectForm').reset();$('#projectId').value=p?.id||'';$('#projectName').value=p?.name||'';$('#projectDescription').value=p?.description||'';$('#projectChatUrl').value=p?.chatUrl||'';$('#projectRepoUrl').value=p?.repoUrl||'';$('#projectDialogTitle').textContent=p?'Modifier le projet':'Ajouter un projet';$('#deleteProject').hidden=!p;$('#projectError').textContent='';show($('#projectDialog'));}
function onSave(ev){ev.preventDefault();const id=$('#projectId').value;const name=$('#projectName').value.trim();const chatRaw=$('#projectChatUrl').value.trim(),repoRaw=$('#projectRepoUrl').value.trim();const chatUrl=https(chatRaw,true),repoUrl=https(repoRaw);const err=$('#projectError');if(!name){err.textContent='Donnez un nom au projet.';return;}if(chatRaw&&!chatUrl){err.textContent='Lien ChatGPT : adresse HTTPS sur chatgpt.com uniquement.';return;}if(repoRaw&&!repoUrl){err.textContent='Utilisez un lien HTTPS valide.';return;}const obj=clean({id:id||'custom-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),name,description:$('#projectDescription').value,chatUrl,repoUrl});const i=state.projects.findIndex(p=>p.id===id);if(i>=0)state.projects[i]=obj;else{if(state.projects.length>=40){err.textContent='40 projets maximum.';return;}state.projects.unshift(obj);}save();render();close($('#projectDialog'));toast('Projet enregistré.');}
function onPrompt(index){const p=templates[Number(index)];if(!p)return;$('#promptDialogTitle').textContent=p[1];$('#promptText').value=p[3];show($('#promptDialog'));}
async function copy(){const el=$('#promptText');let ok=false;try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(el.value);ok=true;}}catch{}if(!ok){try{el.select();ok=document.execCommand('copy');}catch{}}toast(ok?'Prompt copié.':'Sélectionnez le prompt et copiez-le manuellement.');}
async function mic(){const el=$('#micResult');if(!navigator.mediaDevices?.getUserMedia){el.textContent='Ce navigateur ne propose pas le test microphone standard.';return;}el.textContent='Demande d’autorisation en cours…';try{const s=await navigator.mediaDevices.getUserMedia({audio:true});s.getTracks().forEach(t=>t.stop());el.textContent='Microphone autorisé sur AI Hub. Testez également le mode vocal ChatGPT.';}catch(e){el.textContent='Micro indisponible ou refusé ('+String(e.name||'erreur')+').';}}
function exportData(){const blob=new Blob([JSON.stringify({version:1,...state},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='tesla-ai-hub-projets.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);toast('Export préparé.');}
async function importData(file){if(!file||file.size>100000){toast('Fichier invalide ou trop volumineux.');return;}try{const obj=JSON.parse(await file.text());if(!Array.isArray(obj.projects)||obj.projects.length>40||!obj.projects.every(p=>p&&typeof p.name==='string'&&typeof p.id==='string'))throw Error('invalid');state={theme:obj.theme==='light'?'light':'dark',projects:obj.projects.map(clean).filter(p=>p.name&&p.id)};save();theme();render();toast('Projets importés.');}catch{toast('Fichier JSON non valide.');}}
function clock(){const d=new Date();$('#clock').textContent=d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});$('#dateLabel').textContent=d.toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'});}
document.addEventListener('click',ev=>{const link=ev.target.closest('a[href^="#"]');if(link){const page=link.getAttribute('href').slice(1);if(TITLES[page]){ev.preventDefault();location.hash=page;route();return;}}const btn=ev.target.closest('[data-action]');if(btn){if(btn.dataset.action==='edit')edit(btn.dataset.id);if(btn.dataset.action==='prompt')onPrompt(btn.dataset.index);}});
window.addEventListener('hashchange',route);
$('#addProject').addEventListener('click',()=>edit());
$('#projectForm').addEventListener('submit',onSave);
$('#closeProject').addEventListener('click',()=>close($('#projectDialog')));
$('#cancelProject').addEventListener('click',()=>close($('#projectDialog')));
$('#deleteProject').addEventListener('click',()=>{const id=$('#projectId').value;if(!id)return;if(!confirm('Supprimer ce raccourci ?'))return;state.projects=state.projects.filter(p=>p.id!==id);save();render();close($('#projectDialog'));toast('Projet supprimé.');});
$('#closePrompt').addEventListener('click',()=>close($('#promptDialog')));
$('#copyPrompt').addEventListener('click',copy);
$('#testMic').addEventListener('click',mic);
$('#themeDark').addEventListener('click',()=>{state.theme='dark';theme();save();});
$('#themeLight').addEventListener('click',()=>{state.theme='light';theme();save();});
$('#exportSettings').addEventListener('click',exportData);
$('#importSettings').addEventListener('click',()=>$('#importFile').click());
$('#importFile').addEventListener('change',ev=>{importData(ev.target.files?.[0]);ev.target.value='';});
$('#resetSettings').addEventListener('click',()=>{if(confirm('Effacer tous les projets et réglages personnalisés ?')){state=fresh();save();theme();render();toast('Réglages réinitialisés.');}});
render();renderPrompts();theme();route();clock();setInterval(clock,30000);
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
})();