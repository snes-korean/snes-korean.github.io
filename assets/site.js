
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
