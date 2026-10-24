import { Window } from './model'

// iOS association: /voice, /dots and wrapped /app/* destinations.
// /app/codex redirects to /codex on the official web host as its fallback.
export const HEADER_DESTINATIONS={
 chatgpt:'https://chatgpt.com/#native',
 codex:'https://chatgpt.com/app/codex',
 voice:'https://chatgpt.com/voice',
 dots:'https://chatgpt.com/dots',
} as const

export function shortcutLayout(width:number,height:number,small=false,large=false){
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<100||height<40)throw Error('Cabeçalho inválido.')
 const gap=small?3:large?6:5
 return {gap,cell:(width-gap*3)/4,height:height-8,shortcutFont:small?6:large?9:7,
  glyph:small?18:large?30:20,quota:small?6:large?8.5:7,bar:small?3:large?4:3,spacing:2}
}

export function compactReset(window:Window|undefined,now=Date.now()){
 if(window?.resetsAt==null||!Number.isFinite(window.resetsAt))return 'Sem data'
 if(window.resetsAt*1000<=now)return 'Pendente'
 const date=new Date(window.resetsAt*1000)
 const day=date.toLocaleDateString('pt-BR',{weekday:'short'})
 const time=date.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})
 return day.charAt(0).toUpperCase()+day.slice(1)+', '+time
}
