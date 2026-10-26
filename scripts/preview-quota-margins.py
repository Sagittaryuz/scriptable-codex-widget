"""Margin schematic and guides over the existing full synthetic preview; no iOS claim."""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parents[1]
report=json.loads((ROOT/'validation/quota-margins-1.6.4.json').read_text(encoding='utf-8'))
image=Image.new('RGB',(900,1120),'#171719');d=ImageDraw.Draw(image)
def font(size): return ImageFont.truetype('C:/Windows/Fonts/arial.ttf',size)
d.text((24,15),'SIMULAÇÃO · medição de bordas externas · versão 1.6.4',font=font(24),fill='white')
d.text((24,48),'Escala horizontal 2x; verticais reorganizadas para comparação. Não é captura iOS.',font=font(17),fill='#bfc2c9')
for index,r in enumerate(report['results']):
    top=95+index*250; origin=60; scale=2; left=origin+r['contentLeft']*scale; right=origin+r['contentRight']*scale
    d.text((24,top),f"{r['family']} {r['width']}×{r['height']} · margem {r['leftMargin']:g} pt de cada lado",font=font(21),fill='white')
    d.line((origin,top+40,origin+r['width']*scale,top+40),fill='#66666b',width=1)
    d.text((origin,top+20),'widget',font=font(13),fill='#aaaab0')
    for i,label in enumerate(['ChatGPT','Codex','Voice','Dots']):
        x=left+i*(r['icons']['cellWidth']+r['icons']['gap'])*scale
        d.rounded_rectangle((round(x),top+60,round(x+r['icons']['cellWidth']*scale),top+102),radius=8,fill='#28282a')
        d.text((x+r['icons']['cellWidth']*scale/2,top+81),label,font=font(15),fill='white',anchor='mm')
    p=r['dots'];
    for i,color in enumerate(p['colors']):
        x=left+i*(p['pointWidth']+p['gap'])*scale
        d.rounded_rectangle((round(x),top+121,round(x+p['pointWidth']*scale),top+121+p['pointHeight']*scale),radius=p['radius']*scale,fill=color)
    d.line((left,top+164,right,top+164),fill='#aaaab0',width=2)
    for x in [left,right]:
        for y in range(top+42,top+175,8): d.line((round(x),y,round(x),y+4),fill='#36e0ff',width=1)
    d.text((left,top+181),f"L={r['contentLeft']:g}",font=font(17),fill='#36e0ff')
    d.text((right,top+181),f"R={r['contentRight']:g}",font=font(17),fill='#36e0ff',anchor='ra')
    d.text((24,top+209),f"Comprimento: {r['contentWidth']:g} pt · 23×{p['pointWidth']:.6f} + 22×{p['gap']:.6f} · Δ=0 pt",font=font(17),fill='#c7c7cd')
image.save(ROOT/'validation/quota-margins-1.6.4.png')

full=Image.open(ROOT/'validation/quota-widget-full-1.6.4.png').convert('RGB');fd=ImageDraw.Draw(full)
fd.rectangle((0,0,full.width,57),fill='#171719')
fd.text((20,8),'SIMULAÇÃO · bordas externas comuns: ícones, pontos e divisórias',font=font(21),fill='white')
r=report['results'][-1];scale=1080/338;left=r['contentLeft']*scale;right=r['contentRight']*scale
fd.text((20,34),f"L={r['contentLeft']:g} pt / {left:.2f} px · R={r['contentRight']:g} pt / {right:.2f} px · sem teste físico",font=font(17),fill='#36e0ff')
for x in [left,right]:
    for y in range(58,full.height,12):fd.line((round(x),y,round(x),y+6),fill='#36e0ff',width=2)
full.save(ROOT/'validation/quota-widget-margins-1.6.4.png')
print('Rendered four-size outer-edge schematic and guides over the existing synthetic full widget.');
