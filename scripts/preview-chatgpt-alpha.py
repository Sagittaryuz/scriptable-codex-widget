"""Composite real unedited PNG assets on test backgrounds; this is not an asset editor."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import subprocess
ROOT=Path(__file__).resolve().parents[1]
old=Image.open(__import__('io').BytesIO(subprocess.check_output(['git','show','4086ab9:assets/header-chatgpt.png'],cwd=ROOT))).convert('RGBA')
new=Image.open(ROOT/'assets/header-chatgpt.png').convert('RGBA')
canvas=Image.new('RGBA',(944,760),'#18181b');d=ImageDraw.Draw(canvas)
font=lambda n:ImageFont.truetype('C:/Windows/Fonts/arial.ttf',n)
d.text((24,15),'SIMULAÇÃO · assets reais · 256×256 preservados · não iOS',font=font(24),fill='white')
d.text((24,50),'PNG novo copiado do ICO oficial; composição de teste, sem editar os pixels do asset.',font=font(17),fill='#ccccd2')
for row,label in enumerate(['Antes: fundo opaco incorporado','1.6.5: transparência original oficial, margem visual preservada']):
    top=110+row*330;d.text((24,top-30),label,font=font(20),fill='white')
    for col,background in enumerate(['#242426','#dedee3','checker']):
        tile=Image.new('RGBA',(256,256),background if background!='checker' else '#ccccd0')
        if background=='checker':
            td=ImageDraw.Draw(tile)
            for y in range(0,256,16):
                for x in range(0,256,16):
                    if (x//16+y//16)%2:td.rectangle((x,y,x+15,y+15),fill='#f0f0f3')
        if row==0:tile.alpha_composite(old)
        else:
            # Display-only resampling matches the Scripting inner Image frame.
            size=round(256*210/254);mark=new.resize((size,size),Image.Resampling.LANCZOS);offset=(256-size)//2;tile.alpha_composite(mark,(offset,offset))
        x=40+col*304;canvas.alpha_composite(tile,(x,top));d.text((x+128,top+270),['Escuro','Claro','Quadriculado'][col],font=font(18),fill='white',anchor='mm')
canvas.convert('RGB').save(ROOT/'validation/chatgpt-alpha-preview-1.6.5.png')
print('Rendered real-asset light/dark/checker previews; production PNG bytes were not edited.')
