
/* 누적 방문자: GoatCounter (설정에서 'Allow adding visitor counts' 켜야 함). 실패하면 칸을 숨긴 채로 둔다 */
(function(){
  var el=document.querySelector('.visits'); var gc=document.documentElement.getAttribute('data-gc');
  if(!el||!gc||!window.fetch)return;
  var b=el.querySelector('b');
  /* GoatCounter 서버는 같은 주소의 응답을 4시간 캐시한다(기록이 없던 때의 404 포함).
     end=내일(UTC) 을 붙이면 날마다 새 캐시 키가 되고, 범위는 '처음부터 내일까지'라 전체 누적과 같다. */
  var t=new Date(Date.now()+864e5).toISOString().slice(0,10);
  fetch('https://'+gc+'.goatcounter.com/counter/TOTAL.json?end='+t,{cache:'no-store'}).then(function(r){
     if(r.status===404){b.textContent='집계 중';el.hidden=false;return null}   /* 아직 기록 없음 또는 공개 설정 꺼짐 */
     if(!r.ok)throw 0;return r.json()})
   .then(function(j){if(j&&j.count!=null){b.textContent=j.count;el.hidden=false}}).catch(function(){});
})();
(function(){
  var m=document.querySelector('.menu'); if(m){var b=m.querySelector('button');
    b.addEventListener('click',function(e){e.stopPropagation();var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
    document.addEventListener('click',function(e){if(!m.contains(e.target)){m.classList.remove('open');b.setAttribute('aria-expanded','false')}});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){m.classList.remove('open');b.setAttribute('aria-expanded','false')}});}
  var links=[].slice.call(document.querySelectorAll('.toc a')); if(!links.length)return;
  var secs=links.map(function(a){return document.getElementById(a.getAttribute('href').slice(1))});
  var cur=-1;
  function spy(){var k=-1;for(var i=0;i<secs.length;i++){if(secs[i]&&secs[i].getBoundingClientRect().top<=130)k=i}
    if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-2)k=secs.length-1;
    if(k!==cur){cur=k;links.forEach(function(a,i){a.classList.toggle('on',i===k)});
      if(k>=0){var a=links[k],w=a.parentNode;w.scrollLeft=a.offsetLeft-w.clientWidth/2+a.offsetWidth/2}}}
  window.addEventListener('scroll',spy,{passive:true});window.addEventListener('resize',spy);spy();
})();
/* 화면 그림 크게 보기: .shots·.hero 그림을 누르면 화면에 맞는 가장 큰 정수 배율(도트가 뭉개지지 않게)로 띄운다.
   그림을 누르면 원본 1배 ↔ 확대 전환, 바깥·× 버튼·Esc로 닫기, ←→로 같은 페이지의 앞뒤 그림 */
(function(){
  var imgs=[].slice.call(document.querySelectorAll('.shots img, .hero figure img')); if(!imgs.length)return;
  var css=document.createElement('style');
  css.textContent='.lb{position:fixed;inset:0;z-index:999;background:rgba(20,16,12,.92);display:none;overflow:auto;-webkit-overflow-scrolling:touch}'+
   '.lb.on{display:block}.lb .in{min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:44px 8px 16px;box-sizing:border-box}'+
   '.lb img{image-rendering:pixelated;max-width:none;cursor:zoom-in;box-shadow:0 4px 24px rgba(0,0,0,.5);background:#000}.lb img.fit{cursor:zoom-out}'+
   '.lb p{color:#eee;font-size:14px;margin:10px 0 0;text-align:center}.lb p a{color:#f4c06a}'+
   '.lb button{position:fixed;top:8px;background:rgba(0,0,0,.5);color:#fff;border:1px solid rgba(255,255,255,.4);border-radius:6px;font-size:20px;line-height:1;padding:6px 12px;cursor:pointer}'+
   '.lb .x{right:10px}.lb .pv{left:10px}.lb .nx{left:58px}'+
   '.shots img,.hero figure img{cursor:zoom-in}';
  document.head.appendChild(css);
  var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-label','그림 크게 보기');
  lb.innerHTML='<div class="in"><img alt=""><p></p></div><button class="x" aria-label="닫기">×</button><button class="pv" aria-label="이전 그림">‹</button><button class="nx" aria-label="다음 그림">›</button>';
  document.body.appendChild(lb);
  var big=lb.querySelector('img'),cap=lb.querySelector('p'),idx=0,fit=true;
  function size(){var w=big.naturalWidth,h=big.naturalHeight;if(!w)return;
    var s=fit?Math.max(1,Math.floor(Math.min((window.innerWidth-16)/w,(window.innerHeight-90)/h))):1;
    if(fit&&s<1.01){s=Math.min((window.innerWidth-16)/w,1)}
    big.style.width=Math.round(w*s)+'px';big.style.height=Math.round(h*s)+'px';big.classList.toggle('fit',fit)}
  function show(i){idx=(i+imgs.length)%imgs.length;var im=imgs[idx];fit=true;
    var f=im.closest('figure'),fc=f&&f.querySelector('figcaption');
    big.onload=size;big.src=im.currentSrc||im.src;big.alt=im.alt;
    cap.innerHTML=(fc?fc.textContent+' · ':'')+'<a href="'+big.src+'" target="_blank" rel="noopener">원본 파일 열기</a> · 그림을 누르면 1배/확대 전환';
    lb.classList.add('on');document.documentElement.style.overflow='hidden';if(big.complete)size()}
  function close(){lb.classList.remove('on');document.documentElement.style.overflow=''}
  imgs.forEach(function(im,i){im.addEventListener('click',function(e){e.preventDefault();show(i)})});
  big.addEventListener('click',function(e){e.stopPropagation();fit=!fit;size()});
  lb.querySelector('.x').addEventListener('click',close);
  lb.querySelector('.pv').addEventListener('click',function(e){e.stopPropagation();show(idx-1)});
  lb.querySelector('.nx').addEventListener('click',function(e){e.stopPropagation();show(idx+1)});
  lb.addEventListener('click',function(e){if(e.target===lb||e.target.className==='in')close()});
  document.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;
    if(e.key==='Escape')close();else if(e.key==='ArrowLeft')show(idx-1);else if(e.key==='ArrowRight')show(idx+1)});
  window.addEventListener('resize',function(){if(lb.classList.contains('on'))size()});
})();
