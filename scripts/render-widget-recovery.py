"""Synthetic final native-tree preview; physical omission cannot be reproduced on Windows."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
exec((ROOT/'scripts/render-small-alignment-capsules.py').read_text(encoding='utf-8').split('\npayload=')[0],globals())
payload=json.loads((ROOT/'work/widget-recovery-trees-1.6.14.json').read_text(encoding='utf-8'))
out=Image.new('RGBA',(1460,900),'#171719');od=ImageDraw.Draw(out)
label=lambda size:ImageFont.truetype('C:/Windows/Fonts/arial.ttf',size)
od.text((28,18),'SIMULAÇÃO1.6.14 — árvores reais, dados fictícios — não é captura iOS',font=label(25),fill='white')
od.text((28,55),'Círculos nativos diretos, Pronta/Ociosa, origem preservada; sem frase no rodapé.',font=label(22),fill='#bcbcc2')
for col,item in enumerate(payload['previews']):
    x=38+col*710;y=110
    od.text((x,y),'Observação histórica fictícia' if item['historical'] else 'Observação atual fictícia (100%)',font=label(24),fill='white')
    canvas=Image.new('RGBA',(158*S,170*S),(0,0,0,0));draw=ImageDraw.Draw(canvas);render(item['tree'],0,0)
    out.alpha_composite(canvas,(x,y+40))
od.text((28,850),'Fontes/SF Symbols aproximados em Windows. Saldo real não foi fixado em100%. Teste físico pendente.',font=label(21),fill='#bcbcc2')
out.convert('RGB').save(ROOT/'validation/widget-recovery-1.6.14.png')
print('Rendered synthetic current/historical fixtures, direct native circles and no footer; not an iOS capture.')
