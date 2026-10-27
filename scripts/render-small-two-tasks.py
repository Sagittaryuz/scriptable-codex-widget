"""Synthetic comparison from real TSX trees; no native iOS screenshot or asset editing."""
import base64, io, json, re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageColor
ROOT=Path(__file__).resolve().parents[1]
S=4
TOP=0
def font(size, bold=False):
    return ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf' if bold else 'C:/Windows/Fonts/arial.ttf', max(1,round(size*S)))
def rgba(value):
    if not isinstance(value,str): return 'white'
    if value.startswith('rgba'):
        r,g,b,a = map(float,re.findall(r'[\d.]+',value)); return (int(r),int(g),int(b),round(a*255))
    return value
def measure(n):
    p=n.get('props',{}); f=p.get('frame',{}); c=[x for x in n.get('children',[]) if isinstance(x,dict)]
    t=n['type']; sizes=[measure(x) for x in c]; gap=p.get('spacing',0)
    if t=='Text':
        size=p.get('font',14); text=''.join(str(x) for x in n.get('children',[])); w=len(text)*size*.52; h=size*1.2
    elif t in ('Image','Circle','RoundedRectangle','Rectangle'): w=h=p.get('font',14)*1.2
    elif t=='HStack': w=sum(a for a,b in sizes)+max(0,len(c)-1)*gap; h=max([b for a,b in sizes] or [0])
    elif t=='VStack': w=max([a for a,b in sizes] or [0]); h=sum(b for a,b in sizes)+max(0,len(c)-1)*gap
    else: w=max([a for a,b in sizes] or [0]); h=max([b for a,b in sizes] or [0])
    return f.get('width',w),f.get('height',h)
def box(x,y,w,h): return (round(x*S),round(y*S)+TOP,round((x+w)*S),round((y+h)*S)+TOP)
def render(n,x,y,forced_width=None):
    p=n.get('props',{}); t=n['type']; w,h=measure(n); w=w if forced_width is None else forced_width; children=[c for c in n.get('children',[]) if isinstance(c,dict)]
    if t=='Image':
        if p.get('image',{}).get('base64'):
            im=Image.open(io.BytesIO(base64.b64decode(p['image']['base64']))).convert('RGBA').resize((max(1,round(w*S)),max(1,round(h*S))),Image.Resampling.LANCZOS)
            canvas.alpha_composite(im,(round(x*S),round(y*S)+TOP))
        else:
            # SF Symbols approximated with vectors only in this preview.
            symbol=p.get('systemName'); color=rgba(p.get('foregroundStyle','white')); cx=(x+w/2)*S; cy=(y+h/2)*S+TOP; r=p.get('font',12)*S*.42; pen=max(1,round(r*.15))
            if symbol=='play.fill': draw.polygon([(cx-r*.65,cy-r),(cx+r,cy),(cx-r*.65,cy+r)],fill=color)
            elif symbol=='checkmark': draw.line([(cx-r,cy),(cx-r*.2,cy+r*.7),(cx+r,cy-r*.8)],fill=color,width=pen)
            elif symbol=='laptopcomputer':
                draw.rectangle((cx-r,cy-r*.7,cx+r,cy+r*.5),outline=color,width=pen);draw.line((cx-r*1.2,cy+r*.8,cx+r*1.2,cy+r*.8),fill=color,width=pen)
            elif symbol=='cloud.fill':
                draw.ellipse((cx-r,cy-r*.5,cx+r*.3,cy+r*.7),fill=color);draw.ellipse((cx-r*.4,cy-r,cx+r*.7,cy+r*.7),fill=color);draw.ellipse((cx,cy-r*.3,cx+r*1.2,cy+r*.7),fill=color)
            else:
                draw.rounded_rectangle((cx-r,cy-r*.65,cx+r,cy+r*.65),radius=r*.22,outline=color,width=pen)
                for dx in [-.5,0,.5]: draw.ellipse((cx+r*dx-pen,cy-pen,cx+r*dx+pen,cy+pen),fill=color)
    elif t in ('Circle','Rectangle','RoundedRectangle'):
        fill=rgba(p.get('fill','white')); bounds=box(x,y,w,h)
        if p.get('opacity') is not None:
            if isinstance(fill,str): fill=ImageColor.getrgb(fill)+(255,)
            fill=fill[:3]+(round(fill[3]*p['opacity']),)
        layer=Image.new('RGBA',canvas.size,(0,0,0,0)); d=ImageDraw.Draw(layer)
        if t=='Circle': d.ellipse(bounds,fill=fill)
        else: d.rounded_rectangle(bounds,radius=round((h/2 if p.get('clipShape')=='capsule' else p.get('cornerRadius',0))*S),fill=fill)
        canvas.alpha_composite(layer)
    elif t=='Text':
        text=''.join(str(c) for c in n.get('children',[])); size=p.get('font',14); f=font(size,p.get('fontWeight') in ('bold','semibold'))
        available=w*S
        if draw.textlength(text,font=f)>available and p.get('lineLimit')==1:
            minsize=size*p.get('minScaleFactor',1)
            while size>minsize and draw.textlength(text,font=f)>available: size-=.1; f=font(size,p.get('fontWeight') in ('bold','semibold'))
            while text and draw.textlength(text,font=f)>available: text=text[:-2]+'…'
        align=p.get('frame',{}).get('alignment','center'); left=align=='leading'
        draw.text((round((x if left else x+w/2)*S),round((y+h/2)*S)+TOP),text,font=f,fill=rgba(p.get('foregroundStyle','white')),anchor='lm' if left else 'mm')
    else:
        sizes=[measure(c) for c in children]; gap=p.get('spacing',0); cursor=0
        for child,(cw,ch) in zip(children,sizes):
            if t=='HStack' and child['type']=='Text': cw=min(cw,max(0,w-sum(a for c,(a,b) in zip(children,sizes) if c is not child)-gap*max(0,len(children)-1)))
            if t!='HStack' and child['type']=='Text': cw=min(cw,w)
            if child.get('props',{}).get('position'):
                pos=child['props']['position']; cx=x+pos['x']-cw/2; cy=y+pos['y']-ch/2
            elif t=='HStack': cx=x+cursor; cy=y+(h-ch)/2; cursor+=cw+gap
            elif t=='VStack': cx=x+(0 if p.get('alignment')=='leading' else (w-cw)/2); cy=y+cursor; cursor+=ch+gap
            else:
                leading=p.get('alignment') in ('topLeading','leading'); cx=x+(0 if leading else (w-cw)/2); cy=y+(0 if p.get('alignment')=='topLeading' else (h-ch)/2)
            render(child,cx,cy,cw if child['type']=='Text' else None)

payload=json.loads((ROOT/'work/small-two-tasks-trees.json').read_text(encoding='utf-8'))
out=Image.new('RGBA',(1540,1700),'#171719')
od=ImageDraw.Draw(out)
label=lambda size:ImageFont.truetype('C:/Windows/Fonts/arial.ttf',size)
od.text((28,18),'SIMULAÇÃO — árvores TSX reais — dados sintéticos — não é captura iOS',font=label(28),fill='white')
od.text((28,56),'Fontes Windows, SF Symbols e Canvas aproximados. Referência Popular 0.2.13 @765dc094.',font=label(20),fill='#bcbcc2')
for index,item in enumerate(payload['previews']):
    y=112+index*786
    h=item['height']
    for col,key in enumerate(['reference','codex']):
        x=38+col*770
        od.text((x,y),('Popular / Ativos 0.2.13' if col==0 else 'Codex 1.6.9 — duas tarefas')+f' — 158×{h}',font=label(24),fill='white')
        canvas=Image.new('RGBA',(158*S,h*S),(0,0,0,0));draw=ImageDraw.Draw(canvas)
        render(item[key],0,0)
        out.alpha_composite(canvas,(x,y+38))
        # Ruler stays outside the widget; no overlay changes the actual UI.
        for position in [h/2,8+(3*36+2.5*(2/3))*(h-16)/146]:
            yy=round(y+38+position*S)
            od.line((x+158*S+8,yy,x+158*S+23,yy),fill='#ffd60a',width=2)
            od.text((x+158*S+28,yy),f'{position:.2f}',font=label(15),fill='#ffd60a',anchor='lm')
        od.text((x,y+46+h*S),('Quatro linhas sintéticas na fonte de referência' if col==0 else 'Mesmos separadores da metade inferior; reserva vazia acima'),font=label(17),fill='#bcbcc2')
output=ROOT/'validation/small-two-tasks-comparison-1.6.9.png'
out.convert('RGB').save(output)
print(str(output))
