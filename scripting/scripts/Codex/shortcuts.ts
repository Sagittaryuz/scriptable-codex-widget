import { Window } from './model'

// iOS association: /voice, /dots and wrapped /app/* destinations.
// /app/codex redirects to /codex on the official web host as its fallback.
export const HEADER_DESTINATIONS={
 codex:'https://chatgpt.com/app/codex',
 voice:'https://chatgpt.com/voice',
 dots:'https://chatgpt.com/dots',
} as const

export function shortcutLayout(width:number,height:number,small=false,large=false){
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<100||height<40)throw Error('Cabeçalho inválido.')
 const gap=small?4:large?6:5,available=width-gap*2,codex=available*.46,other=(available-codex)/2
 return {gap,codex,other,height:height-8,padding:small?3:large?6:4,logo:small?12:large?26:18,
  title:small?9:large?15:11,quota:small?7:large?10:8,reset:small?6:large?8:6,bar:small?3:large?4:3,
  shortcutFont:small?7:large?11:8,glyph:small?15:large?24:20}
}

export function compactReset(window:Window|undefined,now=Date.now()){
 if(window?.resetsAt==null||!Number.isFinite(window.resetsAt))return 'Sem data'
 if(window.resetsAt*1000<=now)return 'Pendente'
 const date=new Date(window.resetsAt*1000)
 const day=date.toLocaleDateString('pt-BR',{weekday:'short'})
 const time=date.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})
 return day.charAt(0).toUpperCase()+day.slice(1)+', '+time
}
