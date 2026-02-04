
async function fetchJSON(path){const r=await fetch(path,{cache:"no-store"});if(!r.ok)throw new Error("Failed "+path+": "+r.status);return r.json();}
function el(t,a={},c=[]){const n=document.createElement(t);for(const[k,v]of Object.entries(a)){if(k==="class")n.className=v;else if(k.startsWith("on")&&typeof v==="function")n.addEventListener(k.slice(2),v);else n.setAttribute(k,v);} (Array.isArray(c)?c:[c]).forEach(x=>{if(x==null)return; n.appendChild(typeof x==="string"?document.createTextNode(x):x)});return n;}
function md(md){const esc=s=>s.replace(/[&<>"]/g,ch=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[ch]));const lines=md.split(/\r?\n/);let out=[],inList=false;const flush=()=>{if(inList){out.push("</ul>");inList=false;}};for(const raw of lines){const line=raw.trimEnd();if(!line.trim()){flush();continue;}const h=line.match(/^(#{1,3})\s+(.*)$/);if(h){flush();out.push(`<h${h[1].length}>${esc(h[2])}</h${h[1].length}>`);continue;}const li=line.match(/^\-\s+(.*)$/);if(li){if(!inList){out.push("<ul>");inList=true;}out.push(`<li>${esc(li[1])}</li>`);continue;}flush();out.push(`<p>${esc(line)}</p>`);}flush();return out.join("\n");}
async function loadProjectPaths(){try{const idx=await fetchJSON("/content/projects/index.json");return idx.items||[];}catch(e){return ["/content/projects/agentic-rag-platform.json"];}}
function setAccent(v){if(v)document.documentElement.style.setProperty("--accent",v);}
function renderSkills(sk){const g=document.getElementById("skillsGrid");g.innerHTML="";(sk.groups||[]).forEach(gr=>{g.appendChild(el("div",{class:"card"},[el("h3",{},gr.name||"Group"),el("div",{class:"chips"},(gr.items||[]).map(it=>el("span",{class:"pill"},it))) ]));});}
function renderRoles(exp){const w=document.getElementById("experienceList");w.innerHTML="";(exp.roles||[]).forEach(r=>{w.appendChild(el("div",{class:"card"},[el("h3",{},`${r.title||""} — ${r.company||""}`),el("div",{class:"muted",style:"font-weight:800;margin-top:6px"},r.dates||""),el("ul",{class:"muted",style:"font-weight:650"},(r.bullets||[]).map(b=>el("li",{},b))) ]));});}
function renderEdu(edu){const w=document.getElementById("educationList");w.innerHTML="";(edu.items||[]).forEach(i=>{w.appendChild(el("div",{class:"card"},[el("h3",{},i.label||""),el("div",{class:"muted",style:"font-weight:800;margin-top:6px"},i.details||"") ]));});}
function renderKpis(items){const w=document.getElementById("kpis");w.innerHTML="";(items||[]).forEach(k=>{w.appendChild(el("div",{class:"kpi"},[el("div",{class:"kpi__v"},k.value||""),el("div",{class:"kpi__l"},k.label||"") ]));});}
function renderSocial(items){const w=document.getElementById("socialLinks");w.innerHTML="";(items||[]).forEach(s=>w.appendChild(el("a",{class:"chip",href:s.href||"#",target:"_blank",rel:"noopener"},s.label||"Link")));}

function setupModal(){
  const modal=document.getElementById("projectModal");
  modal.querySelectorAll("[data-close]").forEach(x=>x.addEventListener("click",close));
  window.addEventListener("keydown",e=>{if(e.key==="Escape")close();});
  modal.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>{
    modal.querySelectorAll(".tab").forEach(x=>x.classList.remove("is-active"));
    t.classList.add("is-active");
    const name=t.getAttribute("data-tab");
    modal.querySelectorAll(".pane").forEach(p=>p.classList.remove("is-active"));
    modal.querySelector("#pane-"+name).classList.add("is-active");
  }));
  function open(p){
    document.getElementById("mTitle").textContent=p.title||"Project";
    document.getElementById("mSubtitle").textContent=p.subtitle||"";
    const tags=document.getElementById("mTags"); tags.innerHTML=""; (p.tags||[]).forEach(t=>tags.appendChild(el("span",{class:"pill"},t)));
    const links=document.getElementById("mLinks"); links.innerHTML=""; (p.links||[]).forEach(l=>links.appendChild(el("a",{href:l.href||"#",target:"_blank",rel:"noopener"},l.label||"Link")));
    document.getElementById("mOverview").textContent=p.overview||"";
    const imp=document.getElementById("mImpact"); imp.innerHTML=""; (p.impact||[]).forEach(i=>imp.appendChild(el("li",{},i)));
    document.getElementById("mDetails").innerHTML=md(p.details_markdown||"");
    const vid=document.getElementById("mVideo"); vid.src=(p.video_embed_url||"").trim();
    const diag=document.getElementById("mDiagram"); diag.src=p.architecture_diagram||""; diag.style.display=p.architecture_diagram?"block":"none";
    const gal=document.getElementById("mGallery"); gal.innerHTML=""; (p.gallery||[]).forEach(src=>gal.appendChild(el("img",{src,loading:"lazy",alt:"Screenshot"})));
    modal.classList.add("is-open"); modal.setAttribute("aria-hidden","false"); document.body.style.overflow="hidden";
  }
  function close(){ modal.classList.remove("is-open"); modal.setAttribute("aria-hidden","true"); document.body.style.overflow=""; document.getElementById("mVideo").src=""; }
  return {open};
}

(async function(){
  const site=await fetchJSON("/content/site.json");
  setAccent(site.theme?.accent);
  document.title=site.site?.title||"Portfolio";
  document.querySelector('meta[name="description"]').setAttribute("content",site.seo?.description||"");
  document.querySelector('meta[name="keywords"]').setAttribute("content",(site.seo?.keywords||[]).join(", "));
  document.getElementById("brandTitle").textContent=(site.site?.title||"Portfolio").split("—")[0].trim();
  document.getElementById("brandPill").textContent=(site.site?.tagline||"GenAI").split("•")[0].trim();
  document.getElementById("heroTitle").textContent=site.site?.title||"";
  document.getElementById("heroTagline").textContent=site.site?.tagline||"";
  document.getElementById("heroLocation").textContent=site.site?.location||"";
  const em=site.site?.email||""; const emEl=document.getElementById("heroEmail"); emEl.textContent=em; emEl.href="mailto:"+em;
  const img=document.getElementById("heroImage"); img.src=site.site?.hero_image||""; img.alt="Hero";
  const c1=document.getElementById("ctaPrimary"); c1.textContent=site.site?.cta_primary?.label||"View Projects"; c1.href=site.site?.cta_primary?.href||"#projects";
  const c2=document.getElementById("ctaSecondary"); c2.textContent=site.site?.cta_secondary?.label||"Contact"; c2.href=site.site?.cta_secondary?.href||"#contact";
  const resume=(site.site?.social||[]).find(x=>(x.label||"").toLowerCase().includes("resume")); if(resume?.href)document.getElementById("resumeLink").href=resume.href;
  document.getElementById("aboutTitle").textContent=site.about?.title||"About"; document.getElementById("aboutBody").innerHTML=md(site.about?.body||"");
  document.getElementById("skillsTitle").textContent=site.skills?.title||"Skills"; renderSkills(site.skills||{});
  document.getElementById("expTitle").textContent=site.experience?.title||"Experience"; renderRoles(site.experience||{});
  document.getElementById("eduTitle").textContent=site.education?.title||"Education & Certifications"; renderEdu(site.education||{});
  document.getElementById("contactTitle").textContent=site.contact?.title||"Contact"; document.getElementById("contactBody").innerHTML=md(site.contact?.body||"");
  const ce=(site.contact?.email||em); const btn=document.getElementById("contactEmailBtn"); btn.href="mailto:"+ce; btn.textContent=ce?("Email: "+ce):"Email me";
  renderKpis(site.highlights||[]); renderSocial(site.site?.social||[]);
  document.getElementById("year").textContent=String(new Date().getFullYear());
  document.getElementById("footerName").textContent=(site.site?.title||"Portfolio").split("—")[0].trim();

  const {open}=setupModal();
  const paths=await loadProjectPaths();
  const projs=[];
  for(const p of paths){try{projs.push(await fetchJSON(p));}catch(e){}}
  const grid=document.getElementById("projectsGrid"); grid.innerHTML="";
  projs.forEach(p=>{
    const card=el("div",{class:"card project"},[
      el("h3",{},p.title||"Project"),
      el("p",{class:"muted",style:"font-weight:750;margin-top:6px"},p.subtitle||""),
      el("div",{class:"chips",style:"margin-top:10px"},(p.tags||[]).slice(0,4).map(t=>el("span",{class:"pill"},t))),
      el("div",{class:"muted",style:"margin-top:10px;font-weight:650"},(p.overview||"").slice(0,110)+((p.overview||"").length>110?"…":""))
    ]);
    card.addEventListener("click",()=>open(p));
    grid.appendChild(card);
  });
})().catch(e=>{console.error(e); document.title="Portfolio (error)";});
