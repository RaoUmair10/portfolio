// ---- load hero + project sections (separate HTML files) ----
async function loadSection(url, targetId){
  try{
    const res = await fetch(url);
    const html = await res.text();
    document.getElementById(targetId).innerHTML = html;
  }catch(err){
    console.error('Could not load section:', url, err);
    document.getElementById(targetId).innerHTML =
      `<p style="padding:20px;color:#e5675f;font-family:monospace;font-size:13px;">
        Could not load ${url}. If you opened this file directly (file://), run a local server instead,
        e.g. <code>python3 -m http.server</code> in this folder, then open http://localhost:8000
      </p>`;
  }
}

async function init(){
  await loadSection('sections/hero.html', 'hero-slot');
  await loadSection('sections/project.html', 'project-slot');

  renderClusters();
  initModal();
  initCodeScroll();
}

// ---- image fallback chain: png -> jpg -> jpeg -> webp -> favicon ----
const IMG_EXTS = ['png','jpg','jpeg','webp'];
function tryNextExt(img){
  const domain = img.dataset.domain;
  let i = parseInt(img.dataset.extI, 10) + 1;
  if(i < IMG_EXTS.length){
    img.dataset.extI = i;
    img.src = `images/sites/${domain}.${IMG_EXTS[i]}`;
  } else {
    img.onerror = null;
    img.src = `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
    img.classList.add('is-favicon');
  }
}

// ---- render client network cards ----
function renderClusters(){
  const root = document.getElementById('clusters');
  clusters.forEach(c=>{
    const sec = document.createElement('div');
    sec.className = 'cluster';
    sec.innerHTML = `
      <div class="cluster-head">
        <span class="name">${c.name}</span>
        <span class="tag">${c.sites.length} domains</span>
      </div>
      <div class="site-grid">
        ${c.sites.map(([idx,domain])=>`
          <div class="site-card" data-domain="${domain}" data-cluster="${c.name}" data-idx="${idx}">
            <div class="browser-chrome">
              <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
              <span class="bar">${domain}</span>
            </div>
            <div class="browser-body">
              <img src="images/sites/${domain}.png" alt="${domain} screenshot" loading="lazy"
                   data-domain="${domain}" data-ext-i="0"
                   onerror="tryNextExt(this)">
            </div>
            <div class="label"><span>${domain}</span><span class="idx">#${String(idx).padStart(2,'0')}</span></div>
          </div>
        `).join('')}
      </div>
    `;
    root.appendChild(sec);
  });
}

// ---- modal ----
function initModal(){
  const overlay = document.getElementById('overlay');
  document.getElementById('clusters').addEventListener('click', e=>{
    const card = e.target.closest('.site-card');
    if(!card) return;
    const domain = card.dataset.domain;
    document.getElementById('m-name').textContent = domain;
    document.getElementById('m-cluster').textContent = card.dataset.cluster;
    document.getElementById('m-domain').textContent = domain;
    document.getElementById('m-idx').textContent = '#' + String(card.dataset.idx).padStart(2,'0');
    document.getElementById('m-visit').href = 'https://' + domain;
    overlay.classList.add('open');
  });
  document.getElementById('m-close').addEventListener('click', ()=> overlay.classList.remove('open'));
  overlay.addEventListener('click', e=>{ if(e.target === overlay) overlay.classList.remove('open'); });
}

// ---- coding-screen hero background ----
function initCodeScroll(){
  const codeLines = [
    `<span class="kw">class</span> <span class="fn">CrmController</span> <span class="kw">extends</span> Controller`,
    `{`,
    `    <span class="kw">public function</span> <span class="fn">routeLead</span>(Request $request)`,
    `    {`,
    `        $site <span class="kw">=</span> Site::<span class="fn">where</span>(<span class="str">'domain'</span>, $request-&gt;host())`,
    `                     -&gt;<span class="fn">firstOrFail</span>();`,
    ``,
    `        <span class="cm">// route lead to correct brand queue</span>`,
    `        Lead::<span class="fn">create</span>([`,
    `            <span class="str">'site_id'</span>   <span class="kw">=&gt;</span> $site-&gt;id,`,
    `            <span class="str">'source'</span>     <span class="kw">=&gt;</span> $request-&gt;<span class="fn">input</span>(<span class="str">'utm_source'</span>),`,
    `            <span class="str">'status'</span>     <span class="kw">=&gt;</span> <span class="str">'new'</span>,`,
    `        ]);`,
    ``,
    `        ProcessLeadJob::<span class="fn">dispatch</span>($lead)-&gt;<span class="fn">onQueue</span>(<span class="str">'leads'</span>);`,
    `        <span class="kw">return</span> <span class="fn">response</span>()-&gt;<span class="fn">json</span>([<span class="str">'ok'</span> <span class="kw">=&gt;</span> <span class="kw">true</span>]);`,
    `    }`,
    `}`,
    ``,
    `<span class="cm">// deploy.sh — zero-downtime release</span>`,
    `<span class="fn">php</span> artisan down --refresh=15`,
    `git pull origin main`,
    `<span class="fn">composer</span> install --no-dev --optimize-autoloader`,
    `<span class="fn">php</span> artisan migrate --force`,
    `<span class="fn">php</span> artisan config:cache &amp;&amp; artisan route:cache`,
    `<span class="fn">php</span> artisan queue:restart`,
    `sudo systemctl reload nginx`,
    `<span class="fn">php</span> artisan up`,
    ``,
    `<span class="kw">Route</span>::<span class="fn">middleware</span>([<span class="str">'auth:sanctum'</span>])-&gt;<span class="fn">group</span>(<span class="kw">function</span> () {`,
    `    <span class="kw">Route</span>::<span class="fn">apiResource</span>(<span class="str">'tenants'</span>, TenantController::class);`,
    `});`,
  ];
  const block = codeLines.join('\n');
  const el = document.getElementById('codeScroll');
  if(el) el.innerHTML = block + '\n\n' + block;
}

document.addEventListener('DOMContentLoaded', init);
