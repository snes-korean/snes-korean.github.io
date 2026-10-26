
/* 누적 방문자: GoatCounter (설정에서 'Allow adding visitor counts' 켜야 함). 실패하면 칸을 숨긴 채로 둔다 */
(function(){
  var el=document.querySelector('.visits'); var gc=document.documentElement.getAttribute('data-gc');
  if(!el||!gc||!window.fetch)return;
  fetch('https://'+gc+'.goatcounter.com/counter/TOTAL.json').then(function(r){if(!r.ok)throw 0;return r.json()})
   .then(function(j){if(j&&j.count){el.querySelector('b').textContent=j.count;el.hidden=false}}).catch(function(){});
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
