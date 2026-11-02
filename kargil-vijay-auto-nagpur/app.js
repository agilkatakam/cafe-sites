// Hero crossfade — 3 views, 1.6s fade, hold 5.6s, pause on hidden tab, still under reduced motion
(function(){
  var imgs=[].slice.call(document.querySelectorAll('.xfade'));
  if(imgs.length<2)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var i=0,timer=null;
  function step(){imgs[i].classList.remove('on');i=(i+1)%imgs.length;imgs[i].classList.add('on');}
  function start(){if(!timer)timer=setInterval(step,5600);}
  function stop(){clearInterval(timer);timer=null;}
  document.addEventListener('visibilitychange',function(){document.hidden?stop():start();});
  start();
})();

// Book the free pickup: pick the job, the note writes itself
(function(){
  var job=null,out=document.getElementById('picker-out'),btn=document.getElementById('book-btn');
  function update(){
    if(job){
      var subject='Pickup request: '+job;
      var body='Hello Kargil Vijay Auto Service,\n\nMy two-wheeler needs '+job+'. Could you collect it (free pickup), and roughly when?\n\nThank you.';
      btn.href='mailto:spfkargilvijay@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      out.textContent='Your request is filled: "'+job+'". The button below opens it addressed to the garage.';
    }else{
      btn.href=btn.dataset.base+'?subject='+encodeURIComponent('Pickup request');
      out.textContent='Pick what the bike needs.';
    }
  }
  document.getElementById('job-chips').addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    [].forEach.call(this.children,function(x){x.classList.remove('on');});
    b.classList.add('on');job=b.dataset.job;update();
  });
  update();
})();

// Entrances
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var els=[].slice.call(document.querySelectorAll('.cols,.mosaic,.showcase'));
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.12});
  els.forEach(function(el){io.observe(el);});
  setTimeout(function(){els.forEach(function(el){el.classList.add('in');});},1400);
})();
