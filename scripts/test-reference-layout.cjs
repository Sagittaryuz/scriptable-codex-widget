const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const {referenceLayout}=require('../scripting/scripts/Codex/content-layout.ts');
for(const [family,width,height]of [['systemSmall',158,158],['systemSmall',158,170],['systemMedium',338,170],['systemLarge',338,360]]){
 const l=referenceLayout(family,width,height-17);assert(l.width>100&&l.row>10);assert(l.icon<=l.row-4);assert.equal(l.top+l.barY,height/2);assert(Math.abs(l.header+3*l.row-l.height)<1e-8);
 const textWidth=l.width-l.rowInset*2-l.icon-l.badgeWidth-l.chevron-3*l.rowGap;assert(textWidth>=55,'Task title remains usable');
 assert(l.top>=8&&l.left>=8);assert(l.top+l.height<=height-17);
}
for(const name of ['refresh-footer.tsx','codex-symbol.ts','background.ts']){
 const relative='scripting/scripts/Codex/'+name;
 const normalize=buffer=>buffer.toString('utf8').replace(/\r\n/g,'\n');
 assert.equal(normalize(fs.readFileSync(path.resolve(__dirname,'..',relative))),normalize(cp.execFileSync('git',['show','96555c6:'+relative],{cwd:path.resolve(__dirname,'..')})),name+' must keep its source and image data unchanged');
}
console.log('PASS reference: responsive header, three usable rows/status pills, original logo/background and untouched trapezoid. Native appearance pending.');
