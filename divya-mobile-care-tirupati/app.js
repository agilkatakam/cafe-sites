// Tabs
(function(){
  var tabs=[].slice.call(document.querySelectorAll('.tab'));
  tabs.forEach(function(t){
    t.addEventListener('click',function(){
      tabs.forEach(function(x){x.classList.remove('on');});
      t.classList.add('on');
      ['repairs','hours','find'].forEach(function(k){
        document.getElementById('tab-'+k).classList.toggle('hidden',k!==t.dataset.tab);
      });
    });
  });
})();

// Fill the job card: device + trouble chips build the enquiry, both Write actions carry it
(function(){
  var device=null,trouble=null,out=document.getElementById('picker-out'),bar=document.getElementById('reply-bar'),act=document.getElementById('write-act');
  function update(){
    var href;
    if(device&&trouble){
      var subject='Repair enquiry: '+device+' - '+trouble;
      var body='Hello Divya Mobile Care,\n\nMy '+device+' needs '+trouble+'. Could I bring it in, and roughly when?\n\nThank you.';
      href='mailto:knok95@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      out.textContent='Your job card is filled: "'+device+' - '+trouble+'". The button below opens it addressed to the shop.';
    }else{
      href='mailto:knok95@gmail.com?subject='+encodeURIComponent('Repair enquiry');
      out.textContent=device?'Now pick the trouble.':(trouble?'Now pick the device.':'Pick the device, then the trouble.');
    }
    bar.href=href;act.href=href;
  }
  function wire(id,key){
    var box=document.getElementById(id);
    box.addEventListener('click',function(e){
      var b=e.target.closest('button');if(!b)return;
      [].forEach.call(box.children,function(x){x.classList.remove('on');});
      b.classList.add('on');
      if(key==='device')device=b.dataset.device;else trouble=b.dataset.trouble;
      update();
    });
  }
  wire('device-chips','device');wire('trouble-chips','trouble');update();
})();

// Entrances (transform-only, with a settle fallback so nothing stays hidden)
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var els=[].slice.call(document.querySelectorAll('.intro,.showcase,.sheet'));
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.15});
  els.forEach(function(el){io.observe(el);});
  setTimeout(function(){els.forEach(function(el){el.classList.add('in');});},1400);
})();
