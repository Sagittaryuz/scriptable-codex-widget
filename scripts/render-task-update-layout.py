"""Side-by-side geometric reference, synthetic labels; no native iOS capture."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
exec((ROOT/'scripts/render-small-alignment-capsules.py').read_text(encoding='utf-8').split('\npayload=')[0],globals())
payload=json.loads((ROOT/'work/task-update-layout-trees.json').read_text(encoding='utf-8'))
metrics=json.loads((ROOT/'validation/task-update-layout-1.6.15.json').read_text(encoding='utf-8'))['metrics']
out=Image.new('RGBA',(2160,1740),'#171719');od=ImageDraw.Draw(out)
label=lambda size:ImageFont.truetype('C:/Windows/Fonts/arial.ttf',size)
od.text((28,18),'SIMULAÇÃO — árvores reais Codex + geometria capturada Ativos0.2.21 — não é captura iOS',font=label(26),fill='white')
od.text((28,56),'Dados/títulos/ícones/curvas ilustrativos. Fontes e SF Symbols Windows aproximados. Atualização real por tarefa.',font=label(23),fill='#bcbcc2')
for index,item in enumerate(payload['previews']):
    y=115+index*790
    for col,key in enumerate(['before','codex','ativos']):
        x=30+col*710
        od.text((x,y),['Codex1.6.14 anterior','Codex1.6.15 final','Ativos0.2.21 — geometria'][col]+f" — 158×{item['height']}",font=label(23),fill='white')
        canvas=Image.new('RGBA',(158*S,item['height']*S),'#1E1E1E');draw=ImageDraw.Draw(canvas);render(item[key],0,0)
        out.alpha_composite(canvas,(x,y+40))
    rows=[m for m in metrics if m['width']==158 and m['height']==item['height']]
    for m in rows:
        gy=round(y+40+m['codeCenter']*S)
        # Guide only through gutters, leaving glyphs and task/asset labels unobscured.
        od.line((30+710+158*S+2,gy,30+1420-2,gy),fill='#64D2FF',width=2)
        od.line((30+710-12,gy,30+710-2,gy),fill='#64D2FF',width=2)
    od.text((740,y+50+item['height']*S),'Centros linha2 = '+', '.join(f"{m['codeCenter']:.4f} pt" for m in rows)+'; diferença0 pt',font=label(19),fill='#64D2FF')
od.text((28,1680),'HH:mm hoje / DD/MM em outro dia / † histórico / — sem updatedAt comprovado. observedAt nunca substitui atualização.',font=label(23),fill='#bcbcc2')
out.convert('RGB').save(ROOT/'validation/task-update-layout-1.6.15.png')
print('Rendered three-column before/final/Ativos geometry comparison with synthetic labels, no iOS claim.')
