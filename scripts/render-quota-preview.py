"""Synthetic Pillow preview of real TSX tree. No iOS or original-reference rendering."""
import base64, io, json, math, re, os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
VERSION=os.environ.get('CODEX_PREVIEW_VERSION','1.6.4')
GALLERY_VERSION=os.environ.get('CODEX_PREVIEW_GALLERY_VERSION',VERSION)
OUTPUT=Path(os.environ.get('CODEX_PREVIEW_OUTPUT',str(ROOT/'validation')))
OUTPUT.mkdir(parents=True,exist_ok=True)
data = json.loads((ROOT / 'work/quota-full-widget-tree.json').read_text(encoding='utf-8'))
S = 1080 / 338
TOP = 58
canvas = Image.new('RGBA', (1080, round(360*S)+TOP), '#171719')
draw = ImageDraw.Draw(canvas)
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
render(data['tree'],0,0)
draw.text((24,12),'SIMULAÇÃO · árvore TSX real · dados sintéticos · fontes/SF Symbols aproximados',font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',20),fill='white')
canvas.convert('RGB').save(OUTPUT/f'quota-widget-full-{VERSION}.png')

# Render the actual exported line at 971px, matching the measured reference line.
gallery=json.loads((ROOT/f'validation/quota-dots-{GALLERY_VERSION}.json').read_text(encoding='utf-8'))['gallery']
scenario=next(s for s in gallery[-1]['scenarios'] if s['name']=='86%')
detail=Image.new('RGB',(1080,200),'#1e1e1e'); d=ImageDraw.Draw(detail); scale=971/304
d.text((25,15),'SIMULAÇÃO · 86% · 20 acesos + 3 apagados · linha de 971px',font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',23),fill='white')
for i,node in enumerate(scenario['line']['children']):
    p=node['props']; w=p['frame']['width']*scale; h=p['frame']['height']*scale; x=54+i*(p['frame']['width']+scenario['line']['props']['spacing'])*scale
    d.rounded_rectangle((round(x),80,round(x+w),round(80+h)),radius=p['cornerRadius']*scale,fill=p['fill'])
d.text((540,145),''.join(scenario['summary']['children']),font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',27),fill='white',anchor='mm')
detail.save(OUTPUT/f'quota-dots-86-detail-{VERSION}.png')
import xml.etree.ElementTree as ET
svg=ET.parse(ROOT/f'validation/quota-dots-{GALLERY_VERSION}.svg').getroot(); out=Image.new('RGB',(int(svg.attrib['width'])*2,int(svg.attrib['height'])*2),'#1e1e1e'); gd=ImageDraw.Draw(out)
for el in list(svg)[1]:
    a=el.attrib; tag=el.tag.split('}')[-1]
    if tag=='rect':
        x,y,w,h=[float(a[k])*2 for k in ['x','y','width','height']];gd.rounded_rectangle((x,y,x+w,y+h),radius=float(a.get('rx',0))*2,fill=a['fill'])
    elif tag=='text':
        f=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',round(float(a['font-size'])*2));gd.text((float(a['x'])*2,float(a['y'])*2),el.text or '',font=f,fill=a['fill'],anchor='ms' if a.get('text-anchor')=='middle' else 'ls')
out.save(OUTPUT/f'quota-dots-{VERSION}.png')
print('Rendered full synthetic widget at 1080px width (971px line) and enlarged 86% line; no native iOS rendering.')
