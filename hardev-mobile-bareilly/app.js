// Hero crossfade — 3 photographs, 1.6s fade, hold 5.6s, pauses on hidden tab, still for reduced motion
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

// Tabs
(function(){
  var tabs=[].slice.call(document.querySelectorAll('.tab'));
  tabs.forEach(function(t){
    t.addEventListener('click',function(){
      tabs.forEach(function(x){x.classList.remove('on');});
      t.classList.add('on');
      ['repairs','brands','hours'].forEach(function(k){
        document.getElementById('tab-'+k).classList.toggle('hidden',k!==t.dataset.tab);
      });
    });
  });
})();

// Say what's wrong: brand + issue chips build the enquiry email
(function(){
  var brand=null,issue=null,out=document.getElementById('picker-out'),act=document.getElementById('write-act');
  function update(){
    if(brand&&issue){
      var subject='Repair enquiry: '+brand+' - '+issue;
      var body='Hello Hardev Mobile Communication,\n\nMy '+brand+' phone needs '+issue+'. Is this something you can look at, and roughly when?\n\nThank you.';
      act.href='mailto:hardevmobile@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      out.textContent='Your note is ready: "'+brand+' - '+issue+'". The Write button below now opens it addressed to the shop.';
    }else{
      act.href=act.dataset.base+'?subject='+encodeURIComponent('Repair enquiry');
      out.textContent=brand?'Now pick the problem.':(issue?'Now pick your brand.':'Pick your brand, then the problem.');
    }
  }
  function wire(id,key){
    var box=document.getElementById(id);
    box.addEventListener('click',function(e){
      var b=e.target.closest('button');if(!b)return;
      [].forEach.call(box.children,function(x){x.classList.remove('on');});
      b.classList.add('on');
      if(key==='brand')brand=b.dataset.brand;else issue=b.dataset.issue;
      update();
    });
  }
  wire('brand-chips','brand');wire('issue-chips','issue');update();
})();

// Entrances
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var els=[].slice.call(document.querySelectorAll('.intro,.features,.showcase,.cta,.foot'));
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.12});
  els.forEach(function(el){io.observe(el);});
  setTimeout(function(){els.forEach(function(el){el.classList.add('in');});},1400);
})();
