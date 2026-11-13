import json
EM='vikimobile@gmail.com'
MAIL='mailto:'+EM+'?subject=Enquiry%20for%20Viki%20Mobile'
# desktop board 6x4
D={0:('h','Odisha, as it looks'),3:('f','Smartphones and accessories, per the listing'),11:('f','Manglabag, Cuttack 753001'),14:('f','Opposite Manyavar &amp; Amber'),18:('a','Email the shop')}
dt=[]
for i in range(24):
    c,r=i%6,i//6
    if i in D:
        k,t=D[i]
        if k=='h': dt.append(f'<div class="t t--h"><h2>{t}</h2></div>')
        elif k=='f': dt.append(f'<div class="t t--f"><p>{t}</p></div>')
        else: dt.append(f'<a class="t t--a" href="{MAIL}">{t}</a>')
    else:
        dt.append(f'<div class="t t--p" style="--c:{c};--r:{r}" aria-hidden="true"></div>')
# phone board 3x6 = 18 cells; heading spans 2
P={}
cells=[]
# order: r0: H(2) F ; r1: p p p ; r2: p F p ; r3: p p p ; r4: p p A ; r5: p p p
layout=['H','F1','p','p','p','p','F2','p','p','p','p','p','p','A','p','p','p']
# H takes cells 0,1 -> 17 elements fill 18 cells
pt=[];cell=0
for e in layout:
    c,r=cell%3,cell//3
    if e=='H': pt.append('<div class="t t--h t--wide"><h2>Odisha, as it looks</h2></div>'); cell+=2
    elif e=='F1': pt.append('<div class="t t--f"><p>Smartphones and accessories, per the listing</p></div>'); cell+=1
    elif e=='F2': pt.append('<div class="t t--f"><p>Manglabag, Cuttack 753001</p></div>'); cell+=1
    elif e=='A': pt.append(f'<a class="t t--a" href="{MAIL}">Email the shop</a>'); cell+=1
    else: pt.append(f'<div class="t t--p" style="--c:{c};--r:{r}" aria-hidden="true"></div>'); cell+=1
assert cell==18,cell
html=open('index.tpl.html').read().replace('@@DESK@@','\n      '.join(dt)).replace('@@PHONE@@','\n      '.join(pt)).replace('@@MAIL@@',MAIL).replace('@@EM@@',EM)
open('index.html','w').write(html)
