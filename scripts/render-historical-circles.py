"""Render only approved historical-circle change from real compiled trees; synthetic, not iOS."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
# Reuse the validated simulation painter, without running its previous deliverable.
exec((ROOT/'scripts/render-small-alignment-capsules.py').read_text(encoding='utf-8').split('\npayload=')[0],globals())
payload=json.loads((ROOT/'work/historical-circles-trees.json').read_text(encoding='utf-8'))
out=Image.new('RGBA',(1540,1750),'#171719');od=ImageDraw.Draw(out)
label=lambda size:ImageFont.truetype('C:/Windows/Fonts/arial.ttf',size)
od.text((28,18),'SIMULAÇÃO — árvores TSX reais — dados sintéticos — não é captura iOS',font=label(26),fill='white')
od.text((28,54),'FINAL: cápsulas menores, três intervalos iguais, números protegidos e último estado com relógio.',font=label(21),fill='#bcbcc2')
metrics=json.loads((ROOT/'validation/capsule-spacing-1.6.13.json').read_text(encoding='utf-8'))['metrics']
for index,item in enumerate(payload['previews']):
    y=105+index*790
    for col,key in enumerate(['before','after']):
        x=38+col*770
        od.text((x,y),('Antes — 1.6.12' if col==0 else 'Revisão — 1.6.13')+f" — 158×{item['height']}",font=label(24),fill='white')
        canvas=Image.new('RGBA',(158*S,item['height']*S),(0,0,0,0));draw=ImageDraw.Draw(canvas);render(item[key],0,0)
        out.alpha_composite(canvas,(x,y+38))
        metric=metrics[index]
        caption=f"g={metric['gaps'][0]:.4f} pt ×3; cápsula={metric['capsuleHeight']:.4f} pt" if col else 'Base publicada antes da correção'
        od.text((x,y+48+item['height']*S),caption,font=label(19),fill='#bcbcc2')
od.text((28,1690),'Fontes/símbolos aproximados em Windows. Sem teste físico iOS. Saldo, crédito e datas fictícios.',font=label(22),fill='#bcbcc2')
out.convert('RGB').save(ROOT/'validation/historical-circles-comparison-1.6.13.png')
print('Rendered historical-circle comparison: synthetic actual TSX trees, approximate Windows font/symbols, no iOS claim.')
