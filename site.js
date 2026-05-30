/* ============================================================
   MARÍA RAILENZ — shared interactions
   custom cursor · page transitions · scroll reveals
   ============================================================ */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const fine   = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------------- custom cursor ---------------- */
  if(fine){
    const dot  = document.createElement('div'); dot.className='cursor';
    const ring = document.createElement('div'); ring.className='cursor-ring';
    const label= document.createElement('div'); label.className='cursor-label';
    document.body.append(dot,ring,label);

    let mx=innerWidth/2,my=innerHeight/2, rx=mx,ry=my;
    addEventListener('mousemove',e=>{
      mx=e.clientX;my=e.clientY;
      dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;
      label.style.transform=`translate(${mx}px,${my-44}px) translate(-50%,-50%) scale(${document.body.classList.contains('cur-view')?1:.4})`;
    });
    (function loop(){
      rx+=(mx-rx)*.18; ry+=(my-ry)*.18;
      ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();

    const hoverSel='a,button,[data-cursor]';
    document.addEventListener('mouseover',e=>{
      const t=e.target.closest(hoverSel); if(!t)return;
      const mode=t.getAttribute('data-cursor');
      if(mode==='view'){ document.body.classList.add('cur-view'); label.textContent=t.getAttribute('data-label')||'View'; }
      else document.body.classList.add('cur-hover');
    });
    document.addEventListener('mouseout',e=>{
      const t=e.target.closest(hoverSel); if(!t)return;
      document.body.classList.remove('cur-hover','cur-view');
    });
  }

  /* ---------------- scroll reveals ---------------- */
  const io=new IntersectionObserver((ents)=>{
    ents.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  },{threshold:0.12, rootMargin:'0px 0px -8% 0px'});
  function observe(){ document.querySelectorAll('.reveal,.clip,.line-mask').forEach(el=>{ if(!el.classList.contains('in')) io.observe(el); }); }
  observe();

  /* stagger groups: children of [data-stagger] get incremental delay */
  document.querySelectorAll('[data-stagger]').forEach(g=>{
    [...g.children].forEach((c,i)=>{ c.style.transitionDelay=(i*0.07)+'s'; });
  });

  /* ---------------- page transitions ---------------- */
  const tr=document.createElement('div'); tr.className='transition';
  const word=document.createElement('div'); word.className='t-word'; word.textContent='Railenz';
  tr.append(word); document.body.appendChild(tr);

  // reveal on entry
  function enter(){
    requestAnimationFrame(()=>{
      tr.classList.add('cover'); // ensure covering then reveal
      tr.style.transition='none'; tr.style.transform='scaleY(1)'; tr.style.transformOrigin='top';
      requestAnimationFrame(()=>{
        tr.style.transition='transform .6s var(--ease)';
        tr.style.transform='scaleY(0)';
      });
    });
  }
  if(!reduce) enter();

  function go(href,accent){
    if(accent) tr.style.setProperty('--accent',accent);
    tr.style.transition='transform .55s var(--ease)';
    tr.style.transformOrigin='bottom';
    tr.style.transform='scaleY(1)';
    tr.classList.add('cover');
    setTimeout(()=>{ location.href=href; }, 560);
  }

  document.addEventListener('click',e=>{
    const a=e.target.closest('a'); if(!a) return;
    const href=a.getAttribute('href');
    if(!href || a.target==='_blank' || a.hasAttribute('data-no-transition')) return;
    if(href.startsWith('http')||href.startsWith('#')||href.startsWith('mailto')||href.startsWith('tel')) return;
    e.preventDefault();
    if(reduce){ location.href=href; return; }
    const accent=a.getAttribute('data-accent')||getComputedStyle(document.documentElement).getPropertyValue('--accent');
    go(href, accent.trim());
  });
  // back/forward cache
  addEventListener('pageshow',e=>{ if(e.persisted){ tr.style.transition='none'; tr.style.transform='scaleY(0)'; } });

  /* ---------------- nav height CSS var ---------------- */
  const nav = document.querySelector('.nav');
  function syncNavHeight(){
    if(nav) document.documentElement.style.setProperty('--nav-h', nav.offsetHeight+'px');
  }
  syncNavHeight();
  new ResizeObserver(syncNavHeight).observe(nav||document.body);

  // expose
  window.__observe=observe;
})();
