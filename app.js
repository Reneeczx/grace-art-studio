(() => {
  'use strict';

  const D = window.GAS_DATA;
  const STORAGE_KEY = 'grace-art-studio-v1';
  const app = document.getElementById('app');
  const toastElement = document.getElementById('toast');
  const rMap = new Map(D.resources.map(r => [r.id, r]));
  let toastTimer = null;
  let currentPrompt = [pick(D.prompts.characters), pick(D.prompts.traits), pick(D.prompts.actions)];

  function defaultState() { return { favorites: [], tried: [], savedPrompts: [], recent: null }; }
  function loadState() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!raw || typeof raw !== 'object') return defaultState();
      return {
        favorites: Array.isArray(raw.favorites) ? raw.favorites.filter(x => typeof x === 'string') : [],
        tried: Array.isArray(raw.tried) ? raw.tried.filter(x => typeof x === 'string') : [],
        savedPrompts: Array.isArray(raw.savedPrompts) ? raw.savedPrompts.filter(x => x && typeof x.text === 'string') : [],
        recent: typeof raw.recent === 'string' ? raw.recent : null
      };
    } catch { return defaultState(); }
  }
  let state = loadState();
  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; }
    catch { toast('无法保存本地记录：请检查 Safari 的浏览器储存设置。'); return false; }
  }
  function esc(value) { return String(value ?? '').replace(/[&<>"']/g, x => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[x])); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function routeInfo() {
    const hash = (location.hash || '#/').slice(1);
    const index = hash.indexOf('?');
    const path = index === -1 ? hash : hash.slice(0,index);
    return { path: path.startsWith('/') ? path : '/', query: new URLSearchParams(index === -1 ? '' : hash.slice(index+1)) };
  }
  const route = url => '#' + url;
  const resUrl = id => D.lessons[id] ? `/learn/lessons/${id}` : `/learn/video/${id}`;
  function cleanTitle(id) { return D.lessons[id]?.title || rMap.get(id)?.title || '绘画练习'; }
  function sourceLink(r) { return `https://www.youtube.com/watch?v=${encodeURIComponent(r.videoId)}`; }
  function countForSkill(id) { return D.resources.filter(r => r.tags.includes(id)).length; }
  function labelForKind(kind) { return ({lesson:'跟着学技法',demo:'看画师示范',inspiration:'灵感与创作'})[kind] || '视频'; }
  function tagForLevel(level) { return ({easy:'轻松上手',explore:'按兴趣进阶',imagine:'看看灵感'})[level] || ''; }
  function initials(name) { return name.split(' ').map(p=>p.charAt(0)).slice(0,2).join(''); }
  function toast(message) { toastElement.textContent = message; toastElement.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toastElement.classList.remove('show'), 2800); }

  function header(path) {
    const active = path.startsWith('/learn') ? 'learn' : path.startsWith('/play') ? 'play' : path.startsWith('/desk') ? 'desk' : 'home';
    const links = [
      ['home','/','⌂','首页'],
      ['learn','/learn','◌','学画画'],
      ['play','/play','✧','灵感游乐场'],
      ['desk','/desk','♡','我的画桌']
    ];
    return `<header class="site-header"><div class="header-inner">
      <a class="brand" href="#/" aria-label="Grace’s Art Studio 首页"><span class="brand-mark">✎</span><span><strong class="brand-name">Grace’s Art Studio</strong><small class="brand-tagline">MY CREATIVE LITTLE ATELIER</small></span></a>
      <nav class="site-nav" aria-label="主导航">${links.map(([id,url,icon,text])=>`<a class="${active===id?'active':''}" href="${route(url)}" ${active===id?'aria-current="page"':''}><span class="nav-symbol">${icon}</span>${text}</a>`).join('')}</nav>
    </div></header>`;
  }
  function footer() {
    return `<footer class="site-footer"><div><strong>Grace’s Art Studio</strong> · 观察一点，尝试一下，再创造自己的版本。</div><div>画作留在纸上；收藏仅保存在当前浏览器。视频版权属于原作者。 <a href="#/learn/books">精选参考资源</a></div></footer>`;
  }
  function crumb(...items) { return `<div class="breadcrumbs">${items.map((it,i)=> i ? `<span>›</span><${it.url?'a':'span'} ${it.url?`href="${route(it.url)}"`:''}>${esc(it.text)}</${it.url?'a':'span'}>` : `<a href="${route(it.url||'/')}">${esc(it.text)}</a>`).join('')}</div>`; }
  function sectionHeading(title, description='',href='',action='查看全部') { return `<div class="section-head"><div><h2>${title}</h2>${description?`<p>${description}</p>`:''}</div>${href?`<a class="link-arrow" href="${route(href)}">${action} ↗</a>`:''}</div>`; }
  function skillTile(s) { return `<a class="paper-card skill-tile ${s.tone}" href="${route('/learn/skill/'+s.id)}"><span class="skill-mark" aria-hidden="true">${s.icon}</span><strong>${esc(s.name)}</strong><small>${esc(s.en)}</small></a>`; }
  function lessonPreview(id,tone='sage',icon='◌') {
    const lesson = D.lessons[id],r=rMap.get(id);
    return `<a href="${route(resUrl(id))}" class="paper-card feature-card"><div class="feature-art ${tone}"><span class="feature-glyph" aria-hidden="true">${icon}</span></div><div class="feature-content"><span class="badge sage">${esc(lesson.tag)} · ${r.duration}</span><h3>${esc(lesson.title)}</h3><p>${esc(lesson.question)}</p><div class="feature-footer"><span>打开学习卡</span><span class="arrow">↗</span></div></div></a>`;
  }

  function home() {
    const recent = state.recent && (D.lessons[state.recent] || state.recent === 'story') ? state.recent : null;
    return `<div class="shell">
      <section class="home-hero" aria-label="创作项目开始"><div class="hero-copy"><div class="kicker">✿ A little art adventure</div><h1><span>今天，</span>创造一只<br>幻想动物</h1><p>从一个形状开始，给它独特的个性，画出只属于你的故事。</p><div class="hero-actions"><a class="btn" href="#/project/character">开始创造我的角色 <span class="arrow">→</span></a><a class="btn secondary" href="#/play">先找点灵感 ✧</a></div></div><div class="hero-art" role="img" aria-label="原创几何形状幻想动物手绘插画"><div class="hero-fallback">✎</div><span class="art-note">Sketch · imagine · create</span></div></section>
      <div class="quick-grid" aria-label="快速开始"><a class="quick-tile peach" href="#/help"><span class="quick-icon">?</span><span><strong>我画不出来</strong><small>说说具体卡在哪里</small></span><span class="quick-go">→</span></a><a class="quick-tile green" href="#/learn"><span class="quick-icon">✎</span><span><strong>学一个小技巧</strong><small>看看原理，再动手试</small></span><span class="quick-go">→</span></a><a class="quick-tile purple" href="#/play"><span class="quick-icon">✧</span><span><strong>给我一点灵感</strong><small>抽出一个有趣的创意</small></span><span class="quick-go">→</span></a></div>
      ${recent?`<section class="section"><div class="paper-card" style="padding:19px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;background:#edf0e8"><div><strong>继续上次的创作</strong><div class="subtle small">${esc(recent==='story'?'给角色编两格故事':cleanTitle(recent))}</div></div><a class="btn sm sage" href="${route(recent==='story'?'/project/story':resUrl(recent))}">继续看看 →</a></div></section>`:''}
      <section class="section">${sectionHeading('精选学习卡','从最有趣的地方开始，没有必须先完成的课程。','/learn/resources','探索更多视频')}<div class="feature-grid">${lessonPreview('05','sage','◉')}${lessonPreview('09','butter','∿')}${lessonPreview('01','lavender','△')}</div></section>
      <section class="section">${sectionHeading('五种绘画本领','想学画人物、背景、色彩，还是想讲一个故事？','/learn','进入能力地图')}<div class="skill-grid">${D.skills.map(skillTile).join('')}</div></section>
      <section class="section"><div class="project-banner"><div><div class="kicker">✦ CREATIVE PROJECT</div><h2>让一只小动物<br>拥有自己的故事</h2><p>设计模样、性格、动作和心情，最后画一个两格小故事。任何一步都可以先玩。</p><div style="margin-top:20px"><a class="btn sm" href="#/project/character">探索角色项目 →</a></div></div><div class="project-stamp"><strong>5</strong><span>个自由探索步骤</span></div></div></section>
    </div>`;
  }

  function project() {
    const attempted = D.project.filter(p=>state.tried.includes(p.lesson || 'story')).length;
    return `<div class="shell">${crumb({text:'首页',url:'/'},{text:'创造一只幻想动物'})}
      <section class="page-intro"><div class="kicker">✿ PROJECT 01 · 我的原创角色</div><h1>创造一只属于你的幻想动物</h1><p>从一个圆形开始，让它拥有自己的模样、动作和小故事。你可以先选最感兴趣的一步，不规定几天完成，也不用上传作品。</p></section>
      <div class="project-banner"><div><div class="kicker">自由探索 · 不锁定步骤</div><h2>你的主角，会是谁呢？</h2><p>请在真实画纸上设计它。这里保存学习方向，故事和画作都由你自己决定。</p></div><div class="project-stamp"><strong>${attempted} / 5</strong><span>已尝试的项目步骤<br>不代表分数</span></div></div>
      <div class="project-steps">${D.project.map((p,i)=>`<div class="paper-card project-step"><span class="step-num">${String(i+1).padStart(2,'0')}</span><div><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p><span class="step-label">试着留下：${esc(p.output)}</span></div><a class="btn ${state.tried.includes(p.lesson||'story')?'secondary':''} sm" href="${route(p.lesson?resUrl(p.lesson):'/project/story')}">${state.tried.includes(p.lesson||'story')?'再玩一次 ↗':'试一试 ↗'}</a></div>`).join('')}</div>
      <div class="project-tool"><span class="tool-icon">∿</span><div style="flex:1"><h3 style="margin:0 0 3px">画不出来时，随时去线条热身站</h3><p>线条、圆形与椭圆形是辅助工具，不需要先做完才能创造动物。</p></div><a class="btn sm secondary" href="#/learn/lessons/09">打开卡 09 →</a></div>
    </div>`;
  }
  function projectStory() {
    return `<div class="shell">${crumb({text:'首页',url:'/'},{text:'角色创作项目',url:'/project/character'},{text:'两格小故事'})}<div class="page-intro"><div class="kicker">✧ ORIGINAL STORY CHALLENGE</div><h1>它经历了什么事情？</h1><p>不用再看一个视频。把之前创造的角色带进两格小故事，让别人不看文字也能猜到发生了什么。</p></div>
      <div class="paper-card" style="padding:29px;max-width:860px;margin:auto"><h2>在纸上画两个框</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:18px 0 25px"><div style="aspect-ratio:1.5;border:2px dashed #d8cabb;border-radius:16px;display:grid;place-items:center;color:#a89b8e;background:#fffaf2;text-align:center">第一格：<br>发生了什么？</div><div style="aspect-ratio:1.5;border:2px dashed #bdd0c4;border-radius:16px;display:grid;place-items:center;color:#8eaa9c;background:#f4f8f0;text-align:center">第二格：<br>主角怎样反应？</div></div><h3>试试这三个小步骤</h3><ol><li>给角色一个小意外：发现秘密、收到礼物，或迷路了。</li><li>第一格画发生的事情，第二格画角色的动作或表情。</li><li>盖住文字（如果写了），看看别人能否猜出故事。</li></ol><div class="lesson-reflect"><h3>画完想一想</h3><p>哪一处动作或表情，最能让别人看懂这个故事？</p></div><div class="task-actions" style="margin-top:20px"><button class="btn" data-action="tried" data-id="story" aria-pressed="${state.tried.includes('story')}">${state.tried.includes('story')?'✓ 我已经试过啦':'✓ 我试过啦'}</button><a class="btn secondary" href="#/project/character">回到角色项目</a></div></div>
    </div>`;
  }

  function videoPlayer(r) {
    return `<div class="paper-card video-card"><div class="video-shell" id="video-shell-${r.id}"><button class="video-trigger" data-action="load-video" data-video="${esc(r.videoId)}" data-title="${esc(r.title)}" aria-label="播放 ${esc(r.title)}"><span class="video-placeholder-sketch" aria-hidden="true">◌ ↗ ✧</span><span class="play-round" aria-hidden="true">▶</span><span>点击观看英文原视频</span></button></div><div class="video-meta"><div><strong>${esc(r.creator)} · ${r.duration}</strong><span class="source-title">${esc(r.title)}</span></div><a href="${sourceLink(r)}" target="_blank" rel="noopener noreferrer">在 YouTube 打开 ↗</a></div></div><div class="video-note">使用 YouTube 官方播放器；只有点击后才加载视频。如果无法站内播放，可以从上方链接在 YouTube 打开。视频结束后的推荐仍由 YouTube 控制。</div>`;
  }
  function favoriteButton(id,buttonClass='btn secondary') { const saved = state.favorites.includes(id); return `<button class="${buttonClass} fav-btn" data-action="favorite" data-id="${id}" aria-pressed="${saved}">${saved?'♥ 已收藏':'♡ 收藏'}</button>`; }
  function triedButton(id) {const tried = state.tried.includes(id);return `<button class="btn" data-action="tried" data-id="${id}" aria-pressed="${tried}">${tried?'✓ 我已经试过啦':'✓ 我试过啦'}</button>`;}
  function lessonPage(id) {
    const L=D.lessons[id],r=rMap.get(id);if(!L||!r)return notFound();
    state.recent=id;persist();
    return `<div class="shell">${crumb({text:'首页',url:'/'},{text:'学画画',url:'/learn'},{text:L.tag,url:'/learn/skill/'+r.tags[r.tags.length-1]},{text:L.title})}
      <div class="lesson-head"><span class="badge coral">完整学习卡 · ${esc(L.time)}</span> <span class="badge sage">${esc(L.materials)}</span><h1>${esc(L.title)}</h1><div class="english">${esc(L.sub)}</div></div>
      <div class="lesson-layout"><div class="video-column">${videoPlayer(r)}<div class="lesson-extras"><div class="paper-card"><h3>今天遇到的英文绘画词</h3><div class="terms">${L.terms.map(([en,zh])=>`<details class="term"><summary>${esc(en)} ⌄</summary><p>${esc(zh)}</p></details>`).join('')}</div></div>${L.chapters?`<div class="paper-card"><h3>原作者的视频章节</h3><div class="chapter-row">${L.chapters.map(([time,desc])=>`<span class="badge sage">${time} · ${esc(desc)}</span>`).join('')}</div><p class="small subtle" style="margin:12px 0 0">章节时间来自原视频公开简介；你可以回到播放器寻找对应片段。</p></div>`:''}<div class="lesson-reflect"><h3>画完想一想</h3><p>${esc(L.reflect)}</p><p class="small subtle" style="margin-top:10px">这不是考试，不用提交答案。${esc(L.success)}</p></div></div></div>
      <div class="task-column"><div class="paper-card task-card question"><h3>✦ 今天的问题</h3><p>${esc(L.question)}</p></div><div class="paper-card task-card observe"><h3>◌ 看视频时留意</h3><ul>${L.notice.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div class="paper-card task-card experiment"><h3>✎ 动手试一试 <span class="badge sage">3–5分钟</span></h3><ul class="check-list">${L.steps.map(x=>`<li><label><input type="checkbox"/><span>${esc(x)}</span></label></li>`).join('')}</ul></div><div class="paper-card task-card create"><h3>✧ 创造自己的版本</h3><p>${esc(L.creative)}</p></div>
        <details class="hint-box"><summary>💡 卡住了？给我一点提示</summary><div class="hint-content"><p>${esc(L.hints[0])}</p><details><summary>再给我一个具体起点</summary><p>${esc(L.hints[1])}</p></details></div></details><div class="task-actions">${triedButton(id)}${favoriteButton(id)}</div><div class="detail-links"><a class="link-arrow" href="#/project/character">← 返回角色项目</a>${L.next.map(n=>`<a class="link-arrow" href="${route(resUrl(n))}">下一步：${esc(cleanTitle(n))} ↗</a>`).join('')}</div></div></div>
    </div>`;
  }
  function resourceDetail(id) {
    const r=rMap.get(id);if(!r)return notFound();
    if(D.lessons[id])return lessonPage(id);
    return `<div class="shell">${crumb({text:'首页',url:'/'},{text:'学画画',url:'/learn'},{text:'视频资源',url:'/learn/resources'},{text:r.creator})}<div class="lesson-head"><span class="badge lavender">${labelForKind(r.kind)}</span> <span class="badge sage">${tagForLevel(r.level)}</span><h1>${esc(r.title)}</h1><div class="english">${esc(r.creator)} · ${r.duration}</div></div><div class="lesson-layout"><div>${videoPlayer(r)}</div><div class="task-column"><div class="paper-card task-card question"><h3>✦ 我可以观察什么？</h3><p>这条视频是精选资源，不是已经制作完整中文学习卡的课程。可以先观察画师如何表现这个主题，再按自己的方式动笔。</p></div><div class="paper-card task-card create"><h3>✎ 今天的小挑战</h3><p>${esc(r.micro)}</p></div><div class="paper-card task-card"><h3>准备材料</h3><p>${esc(r.materials||'纸和铅笔即可先进行简化实验。')}</p></div><div class="task-actions">${triedButton(id)}${favoriteButton(id)}</div><div class="detail-links"><a href="#/learn/resources" class="link-arrow">← 返回全部视频</a></div></div></div></div>`;
  }

  function learn() {
    return `<div class="shell"><section class="page-intro"><div class="kicker">✎ LITTLE LESSONS, BIG IDEAS</div><h1>从好奇开始，学着画出自己的世界</h1><p>每种本领都可以单独探索。先看一段英文原视频，试一个小实验，再画出自己的版本。</p></section>
      <div class="tabs"><a class="active" href="#/learn">能力地图</a><a href="#/learn/resources">视频资源库</a><a href="#/learn/creators">认识画师</a><a href="#/learn/books">图解与书架</a></div>
      <section class="section">${sectionHeading('五个绘画实验室','选择你今天最想探索的本领。')}<div class="skill-grid">${D.skills.map(skillTile).join('')}</div></section>
      <section class="section">${sectionHeading('从这些学习卡开始','五张完整卡片，也可以从任意一张开始。','/learn/resources','浏览全部20条视频')}<div class="feature-grid">${lessonPreview('05','sage','◉')}${lessonPreview('01','lavender','△')}${lessonPreview('02','butter','∿')}${lessonPreview('04','lavender','◡')}${lessonPreview('09','sage','○')}</div></section>
      <section class="section">${sectionHeading('不打开视频，也可以练观察','用真实物体来磨练眼睛和手。')}<div class="observation-grid">${D.observationTasks.map(t=>`<div class="paper-card observation-card"><div class="icon-big">${t.icon}</div><h3>${esc(t.title)}</h3><p>${esc(t.desc)}</p><div class="badge sage">想一想：${esc(t.reflect)}</div></div>`).join('')}</div></section>
    </div>`;
  }
  function skillPage(id) {
    const s=D.skills.find(x=>x.id===id);if(!s)return notFound();
    const rs=D.resources.filter(r=>r.tags.includes(id));
    return `<div class="shell">${crumb({text:'首页',url:'/'},{text:'学画画',url:'/learn'},{text:s.name})}<section class="page-intro"><div class="kicker">${esc(s.en)}</div><h1>${esc(s.name)}</h1><p>${esc(s.question)} ${esc(s.description)}</p></section><div class="project-banner" style="padding:25px"><div><strong>${rs.length} 条精选候选视频</strong><p style="margin-top:7px">如果还不知道从哪里开始，可以先试一张完整学习卡。</p><div style="margin-top:15px"><a class="btn sm" href="${route(resUrl(s.featured))}">推荐开始：${esc(cleanTitle(s.featured))} →</a></div></div><span class="skill-mark">${s.icon}</span></div><section class="section">${sectionHeading('相关视频与挑战','既有完整中文学习卡，也有按兴趣观看的英文原视频。')}<div class="resource-grid">${rs.map(resourceCard).join('')}</div></section></div>`;
  }

  function resourceCard(r) {
    const mainTag=D.skills.find(s=>r.tags.includes(s.id))||D.skills[0];
    return `<article class="paper-card resource-card"><a href="${route(resUrl(r.id))}"><div class="resource-art ${esc(mainTag.id)}"><span class="resource-symbol" aria-hidden="true">${mainTag.icon}</span><span class="duration">${r.duration}</span></div></a><div class="resource-info"><span class="badge ${r.kind==='inspiration'?'lavender':'sage'}">${labelForKind(r.kind)}</span> <span class="badge">${tagForLevel(r.level)}</span><h3>${esc(r.title)}</h3><p>${esc(r.creator)} · ${r.tags.map(t=>D.skills.find(s=>s.id===t)?.name).filter(Boolean).join(' / ')}</p><p>${esc(r.micro)}</p><div class="resource-actions"><a class="btn sm secondary" href="${route(resUrl(r.id))}">${D.lessons[r.id]?'打开学习卡':'观看与尝试'} ↗</a>${favoriteButton(r.id,'fav-btn')}</div></div></article>`;
  }
  function resourcesPage(query) {
    const skill=query.get('skill')||'',creator=query.get('creator')||'';
    return `<div class="shell">${crumb({text:'首页',url:'/'},{text:'学画画',url:'/learn'},{text:'视频资源库'})}<section class="page-intro"><div class="kicker">20 CURATED ORIGINAL VIDEOS</div><h1>找到想学的绘画视频</h1><p>20条由真实画师发布的英文原视频。五张完整学习卡可以直接跟着做，其余资源提供简短的原创小挑战。</p></section>
      <div class="tabs"><a href="#/learn">能力地图</a><a class="active" href="#/learn/resources">视频资源库</a><a href="#/learn/creators">认识画师</a><a href="#/learn/books">图解与书架</a></div>
      <div class="filter-bar"><input id="resource-search" type="search" placeholder="搜索作者、主题或视频名称" aria-label="搜索视频"/><select id="resource-skill" aria-label="按绘画能力筛选"><option value="">全部能力</option>${D.skills.map(s=>`<option value="${s.id}" ${skill===s.id?'selected':''}>${s.name}</option>`).join('')}</select><select id="resource-kind" aria-label="按视频类型筛选"><option value="">全部类型</option><option value="lesson">跟着学技法</option><option value="demo">看画师示范</option><option value="inspiration">灵感与创作</option></select><select id="resource-length" aria-label="按时长筛选"><option value="">任何时长</option><option value="short">7分钟内</option><option value="medium">7–15分钟</option><option value="long">15分钟以上</option></select><span class="filter-note" id="resource-count">20 条资源</span></div><div id="resource-results" class="resource-grid" data-creator="${esc(creator)}"></div>
    </div>`;
  }
  function creatorPage() {
    return `<div class="shell">${crumb({text:'首页',url:'/'},{text:'学画画',url:'/learn'},{text:'认识画师'})}<section class="page-intro"><div class="kicker">ARTISTS & TEACHERS</div><h1>跟不同画师学，发现不同的看法</h1><p>13个频道各有特色：有些擅长动画角色，有些喜欢水彩与想象。点击画师，可以查看本站收录的对应视频。</p></section><div class="tabs"><a href="#/learn">能力地图</a><a href="#/learn/resources">视频资源库</a><a class="active" href="#/learn/creators">认识画师</a><a href="#/learn/books">图解与书架</a></div><div class="creator-grid">${D.creators.map((c,i)=>{const n=D.resources.filter(r=>r.creator===c.name).length;return `<div class="paper-card creator-card"><div class="creator-avatar">${i%3===0?'✎':i%3===1?'◌':'✦'}</div><h3>${esc(c.name)}</h3><p>${esc(c.description)}</p><div class="badge sage">本站收录 ${n} 条视频</div><div style="margin-top:16px"><a class="link-arrow" href="${route('/learn/resources?creator='+encodeURIComponent(c.name))}">查看相关视频 ↗</a></div></div>`}).join('')}</div><p class="subtle small" style="margin-top:21px">画师的更多作品请通过对应视频进入其原始频道。本站不重新发布画师的课程或付费资料。</p></div>`;
  }
  function booksPage() {
    return `<div class="shell">${crumb({text:'首页',url:'/'},{text:'学画画',url:'/learn'},{text:'图解与书架'})}<section class="page-intro"><div class="kicker">BOOKS & FREE ILLUSTRATED GUIDES</div><h1>画师书架</h1><p>不是需要全部购买的书单。先利用免费图解，再按兴趣决定是否深入阅读。</p></section><div class="tabs"><a href="#/learn">能力地图</a><a href="#/learn/resources">视频资源库</a><a href="#/learn/creators">认识画师</a><a class="active" href="#/learn/books">图解与书架</a></div><div class="book-grid">${D.books.map((b,i)=>`<div class="paper-card book-card"><div class="book-cover">${i===0?'✎':i===1?'✧':'◌'}</div><span class="badge ${i===0?'sage':'butter'}">${esc(b.type)}</span><h3>${esc(b.name)}</h3><div class="subtle small" style="margin-bottom:13px">${esc(b.by)}</div><p>${esc(b.desc)}</p><a class="btn sm secondary" href="${esc(b.url)}" target="_blank" rel="noopener noreferrer">查看来源网站 ↗</a></div>`).join('')}</div></div>`;
  }

  function helpPage() {
    const items = [
      ['不知道从哪里开始','先画几条线和简单形状','09','∿'],
      ['动物总是画不出来','试着从大形状和比例开始','05','○'],
      ['所有角色看起来都一样','让圆、方、尖改变角色外形','01','△'],
      ['角色的动作好僵硬','从一条动作主线开始','02','↝'],
      ['表情都差不多','比较眉毛、眼睛和嘴巴','04','◡'],
      ['不会给角色画背景','先探索前景与远景','13','▱'],
      ['想不出画什么','去灵感游乐场抽一个新故事','play','✧']
    ];
    return `<div class="shell">${crumb({text:'首页',url:'/'},{text:'我画不出来'})}<section class="page-intro"><div class="kicker">✎ EVERY ARTIST GETS STUCK</div><h1>不是“我不会画”，而是卡在哪里？</h1><p>选一个最接近你现在的问题的小卡片，我们一起找一个容易开始的地方。</p></section><div class="help-grid">${items.map(([title,desc,id,icon])=>`<a class="paper-card help-card" href="${route(id==='play'?'/play':resUrl(id))}"><span class="help-icon">${icon}</span><span><strong>${esc(title)}</strong><small>${esc(desc)} ↗</small></span></a>`).join('')}</div><div class="project-tool" style="margin-top:26px"><div><h3>有时，没有“正确的画法”</h3><p>可以画一版、改一个地方、再试一次。画画的本领也来自不断比较和发现。</p></div></div></div>`;
  }

  function playPage() {
    const names=['谁是主角？','它有什么特别之处？','它在做什么？'];
    const icons=['◌','✧','↝'];
    const tones=['peach','green','purple'];
    return `<div class="shell"><section class="play-hero"><div class="kicker">✧ THE IDEA PLAYGROUND</div><h1>三个小点子，变成一个新故事</h1><p>不喜欢其中一个？只换那一张就好。真正的创意，不是全部接受随机结果，而是做出自己的选择。</p></section><div class="prompt-grid">${currentPrompt.map((v,i)=>`<div class="paper-card prompt-card ${tones[i]}"><div><span class="icon">${icons[i]}</span><div class="small subtle">${names[i]}</div></div><h3>${esc(v)}</h3><button class="btn sm" data-action="reroll" data-part="${i}" aria-label="重新选择${names[i]}">↻ 只换这一项</button></div>`).join('')}</div><div class="play-actions"><button class="btn" data-action="reroll" data-part="all">✧ 再给我一个灵感</button><button class="btn secondary" data-action="save-prompt">♡ 我喜欢这个，保存</button></div><div class="paper-card prompt-result"><h3>今天可以这样开始画：</h3><p>先用一个大形状画出「${esc(currentPrompt[0])}」，再想想「${esc(currentPrompt[1])}」会怎样改变它的模样。最后画出「${esc(currentPrompt[2])}」最有趣的一瞬间。</p><p class="small subtle" style="margin-top:14px">这是灵感，不是标准答案。你可以修改任何一项。</p></div></div>`;
  }
  function deskPage() {
    const fav=state.favorites.filter(id=>rMap.has(id));
    const tried=state.tried.filter(id=>rMap.has(id)||id==='story');
    return `<div class="shell"><section class="page-intro"><div class="kicker">♡ MY LITTLE CREATIVE DESK</div><h1>我的画桌</h1><p>真正的画作留在你的纸质画本里。这里帮你记住喜欢的课程、试过的小实验和想保存的灵感。</p></section><div class="desk-grid">
      <div class="paper-card desk-section"><h2>♡ 我收藏的课程 <span class="badge">${fav.length}</span></h2><div class="desk-list">${fav.length?fav.map(id=>`<div class="desk-item"><div><strong>${esc(cleanTitle(id))}</strong><small>${esc(rMap.get(id).creator)}</small></div><a class="btn sm secondary" href="${route(resUrl(id))}">打开 ↗</a></div>`).join(''):'<div class="empty-state">还没有收藏。遇到喜欢的视频或练习，点一下♡就可以保存在这里。</div>'}</div></div>
      <div class="paper-card desk-section"><h2>✓ 我试过的练习 <span class="badge sage">${tried.length}</span></h2><div class="desk-list">${tried.length?tried.map(id=>`<div class="desk-item"><div><strong>${id==='story'?'给角色编两格故事':esc(cleanTitle(id))}</strong><small>可以随时重新试一次</small></div><a class="btn sm secondary" href="${route(id==='story'?'/project/story':resUrl(id))}">再试 ↗</a></div>`).join(''):'<div class="empty-state">做完一个小实验后，点「我试过啦」，这里就会记下来。</div>'}</div></div>
      <div class="paper-card desk-section" style="grid-column:1/-1"><h2>✧ 我保存的灵感 <span class="badge lavender">${state.savedPrompts.length}</span></h2><div class="desk-list">${state.savedPrompts.length?state.savedPrompts.map(p=>`<div class="desk-item"><div><strong>${esc(p.text)}</strong><small>画的时候可以任意修改</small></div><button class="btn sm ghost" data-action="remove-prompt" data-id="${esc(p.id)}">移除</button></div>`).join(''):'<div class="empty-state">灵感游乐场里有很多有趣组合。喜欢的那一组，可以保存到这里。</div>'}</div><div style="margin-top:15px"><a href="#/play" class="link-arrow">去找一点新灵感 ↗</a></div></div>
    </div><p class="small subtle" style="margin-top:19px">这些记录只存在当前 iPad 的 Safari 网站数据中，不会自动同步或上传。清除浏览器数据后可能丢失。</p></div>`;
  }
  function notFound() {return `<div class="shell not-found"><div class="kicker">✎ LOST IN THE SKETCHBOOK</div><h1>这一页还没画出来</h1><p class="subtle">可以回首页，继续探索绘画的小世界。</p><a class="btn" href="#/">返回首页 →</a></div>`;}

  function render(scroll=true) {
    const {path,query}=routeInfo();
    let main;
    if(path==='/')main=home();
    else if(path==='/project/character')main=project();
    else if(path==='/project/story')main=projectStory();
    else if(path==='/help')main=helpPage();
    else if(path==='/learn')main=learn();
    else if(path==='/learn/resources')main=resourcesPage(query);
    else if(path==='/learn/creators')main=creatorPage();
    else if(path==='/learn/books')main=booksPage();
    else if(path.startsWith('/learn/skill/'))main=skillPage(path.split('/').pop());
    else if(path.startsWith('/learn/lessons/'))main=lessonPage(path.split('/').pop());
    else if(path.startsWith('/learn/video/'))main=resourceDetail(path.split('/').pop());
    else if(path==='/play')main=playPage();
    else if(path==='/desk')main=deskPage();
    else main=notFound();
    app.innerHTML = header(path)+`<main id="main">${main}</main>`+footer();
    if(path==='/learn/resources')filterResources();
    if(scroll) window.scrollTo({top:0,behavior:'instant'});
  }
  function durationSecs(r){const [m,s]=r.duration.split(':').map(Number);return m*60+s;}
  function filterResources(){
    const container=document.getElementById('resource-results');if(!container)return;
    const q=(document.getElementById('resource-search')?.value||'').toLocaleLowerCase();
    const skill=document.getElementById('resource-skill')?.value||'';
    const kind=document.getElementById('resource-kind')?.value||'';
    const len=document.getElementById('resource-length')?.value||'';
    const creator=container.dataset.creator||'';
    const data=D.resources.filter(r=>{
      const secs=durationSecs(r);
      return (!q||[r.title,r.creator,r.micro,...r.tags.map(t=>D.skills.find(s=>s.id===t)?.name||'')].join(' ').toLocaleLowerCase().includes(q))
        &&(!skill||r.tags.includes(skill))&&(!kind||r.kind===kind)&&(!creator||r.creator===creator)
        &&(!len||(len==='short'&&secs<420)||(len==='medium'&&secs>=420&&secs<=900)||(len==='long'&&secs>900));
    });
    container.innerHTML=data.length?data.map(resourceCard).join(''):'<div class="paper-card empty-state" style="grid-column:1/-1">没有找到完全符合的资源。试着放宽一个筛选条件。</div>';
    const count=document.getElementById('resource-count');if(count)count.textContent=`${data.length} 条资源`;
  }
  function syncButtons(id,action){
    document.querySelectorAll(`[data-action="${action}"][data-id="${id}"]`).forEach(btn=>{
      if(action==='favorite') {const yes=state.favorites.includes(id);btn.textContent=yes?'♥ 已收藏':'♡ 收藏';btn.setAttribute('aria-pressed',String(yes));}
      if(action==='tried') {const yes=state.tried.includes(id);btn.textContent=yes?'✓ 我已经试过啦':'✓ 我试过啦';btn.setAttribute('aria-pressed',String(yes));}
    });
  }
  document.addEventListener('click', event=>{
    const button=event.target.closest('[data-action]');if(!button)return;
    const action=button.dataset.action,id=button.dataset.id;
    if(action==='load-video'){
      const videoId=button.dataset.video||'';
      if(!/^[a-zA-Z0-9_-]{11}$/.test(videoId))return;
      const shell=button.closest('.video-shell');if(!shell)return;
      const iframe=document.createElement('iframe');iframe.src=`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&playsinline=1`;
      iframe.title='YouTube 绘画教程：'+(button.dataset.title||'original video');
      iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.allowFullscreen=true;iframe.loading='eager';
      shell.replaceChildren(iframe);
      return;
    }
    if(action==='favorite' && id){
      state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[id,...state.favorites];
      persist();syncButtons(id,'favorite');toast(state.favorites.includes(id)?'已收藏到我的画桌 ♡':'已取消收藏');return;
    }
    if(action==='tried' && id){
      state.tried=state.tried.includes(id)?state.tried.filter(x=>x!==id):[id,...state.tried];
      if(id!=='story')state.recent=id;
      persist();syncButtons(id,'tried');toast(state.tried.includes(id)?'记下啦！想画时随时可以再试。':'已取消尝试记录');return;
    }
    if(action==='reroll'){
      const part=button.dataset.part;
      if(part==='all')currentPrompt=[pick(D.prompts.characters),pick(D.prompts.traits),pick(D.prompts.actions)];
      else {const n=Number(part);if(!Number.isInteger(n)||n<0||n>2)return;const arr=[D.prompts.characters,D.prompts.traits,D.prompts.actions][n];let next=pick(arr);if(arr.length>1)while(next===currentPrompt[n])next=pick(arr);currentPrompt[n]=next;}
      render(false);return;
    }
    if(action==='save-prompt'){
      const text=currentPrompt.join(' · ');
      if(state.savedPrompts.some(p=>p.text===text)) {toast('这个灵感已经在我的画桌里了。');return;}
      state.savedPrompts.unshift({id:'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),text});
      persist();toast('喜欢的灵感已经保存到我的画桌 ✧');return;
    }
    if(action==='remove-prompt'){
      state.savedPrompts=state.savedPrompts.filter(p=>p.id!==id);persist();render(false);toast('已从我的画桌移除这个灵感。');return;
    }
  });
  document.addEventListener('input',event=>{if(event.target.id==='resource-search')filterResources();});
  document.addEventListener('change',event=>{if(['resource-skill','resource-kind','resource-length'].includes(event.target.id))filterResources();});
  window.addEventListener('hashchange',()=>render(true));
  render(true);
})();
