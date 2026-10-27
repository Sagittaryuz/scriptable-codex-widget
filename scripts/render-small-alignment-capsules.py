"""Actual TSX trees, synthetic metadata, approximate Windows raster; not iOS."""
import base64, io, json, re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageColor, ImageChops
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
        size=p.get('font',14); text=''.join(str(x) for x in n.get('children',[])); w=font(size,p.get('fontWeight') in ('bold','semibold')).getlength(text)/S; h=size*1.2
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
            if symbol=='questionmark': draw.text((cx,cy),'?',font=font(p.get('font',12)),fill=color,anchor='mm')
            elif symbol=='play.fill': draw.polygon([(cx-r*.65,cy-r),(cx+r,cy),(cx-r*.65,cy+r)],fill=color)
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
        if p.get('mask'):
            partial=p['mask']['children'][0]['props']['frame']['width']
            mask=Image.new('L',canvas.size,0)
            # Pixel extent uses an exclusive right edge, preserving the actual native leading mask.
            ImageDraw.Draw(mask).rectangle((round(x*S),round(y*S)+TOP,round((x+partial)*S)-1,round((y+h)*S)+TOP-1),fill=255)
            layer.putalpha(ImageChops.multiply(layer.getchannel('A'),mask))
        canvas.alpha_composite(layer)
    elif t=='Text':
        text=''.join(str(c) for c in n.get('children',[])); size=p.get('font',14); f=font(size,p.get('fontWeight') in ('bold','semibold'))
        available=w*S
        if draw.textlength(text,font=f)>available and p.get('lineLimit')==1:
            minsize=size*p.get('minScaleFactor',1)
            while size>minsize and draw.textlength(text,font=f)>available: size-=.1; f=font(size,p.get('fontWeight') in ('bold','semibold'))
            if draw.textlength(text,font=f)>available:
                while text and draw.textlength(text+'…',font=f)>available: text=text[:-1]
                text=text+'…' if text else ''
        align=p.get('frame',{}).get('alignment','center'); left=align=='leading'; trailing=align=='trailing'
        draw.text((round((x+w if trailing else x if left else x+w/2)*S),round((y+h/2)*S)+TOP),text,font=f,fill=rgba(p.get('foregroundStyle','white')),anchor='rm' if trailing else 'lm' if left else 'mm')
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

payload=json.loads((ROOT/'work/small-alignment-capsule-trees.json').read_text(encoding='utf-8'))
fit=[]
for item in payload['previews']+[{'after':s['tree']} for s in payload['capsuleScenarios']]:
    tree=item['after']; caps=tree['children'][1]['children'][0]['children'][0]['children'][2]['children']
    for c in caps:
        group=c['children'][1]; first=group['children'][0]
        for n in first['children']+[group['children'][1]]:
            p=n['props']; text=''.join(n['children']); actual=font(p['font'],p.get('fontWeight')=='bold').getlength(text)/S
            available=p['frame']['width']
            assert actual<=available+.25,(text,actual,available)
            fit.append({'text':text,'font':p['font'],'measuredWidth':actual,'availableWidth':available})
(ROOT/'validation/capsule-glyph-fit-1.6.12.json').write_text(json.dumps({'simulation':True,'nativeIOS':False,'font':'Arial/Arial Bold, Windows approximate; native SF typography pending','measurements':fit},ensure_ascii=False,indent=2),encoding='utf-8')
out=Image.new('RGBA',(1540,2780),'#171719');od=ImageDraw.Draw(out)
label=lambda size:ImageFont.truetype('C:/Windows/Fonts/arial.ttf',size)
od.text((28,18),'SIMULAÇÃO — árvores TSX reais — dados sintéticos — não é captura iOS',font=label(26),fill='white')
od.text((28,54),'Fontes/símbolos Windows aproximados. Saldo, tarefas, crédito e datas são fictícios.',font=label(21),fill='#bcbcc2')
items=payload['previews']+[payload['offlinePreviews'][0]]
for index,item in enumerate(items):
    y=112+index*796
    for col,key in enumerate(['before','after']):
        x=38+col*770
        od.text((x,y),('Antes - 1.6.11' if col==0 else 'Final - 1.6.12')+f" - 158×{item['height']}"+(' - histórico' if index==2 else ' - atual'),font=label(22),fill='white')
        canvas=Image.new('RGBA',(158*S,item['height']*S),(0,0,0,0));draw=ImageDraw.Draw(canvas);render(item[key],0,0)
        out.alpha_composite(canvas,(x,y+38))
        od.text((x,y+46+item['height']*S),('Títulos truncados e sinal histórico repetido' if index==2 and col==0 else 'Bloco maior + origem colorida + datas dentro das cápsulas' if col else 'Base publicada preservada para comparação'),font=label(18),fill='#bcbcc2')
od.text((38,2510),'Ampliação da escala real de 8%: 1 ponto completo + 84% do próximo; outros 21 vazios',font=label(23),fill='white')
fractions=json.loads((ROOT/'work/quota-fraction-gallery.json').read_text(encoding='utf-8'))
line=next(x['line'] for x in fractions['gallery'] if x['name']=='8%')
S=9
canvas=Image.new('RGBA',(round(line['props']['frame']['width']*S),100),(0,0,0,0));draw=ImageDraw.Draw(canvas)
line['props'].pop('position',None);render(line,0,2)
out.alpha_composite(canvas,(38,2560))
od.text((38,2670),'Histórico: proporção preservada com cores atenuadas + um aviso datado; não representa conexão atual.',font=label(22),fill='#bcbcc2')
od.text((38,2710),'Sem teste físico iOS. O alinhamento numérico é validado nas árvores nativas; tipografia aqui é aproximada.',font=label(21),fill='#bcbcc2')
out.convert('RGB').save(ROOT/'validation/small-alignment-capsules-comparison-1.6.12.png')
print('Rendered synthetic before/after with real unchanged assets; no physical iOS test.')
