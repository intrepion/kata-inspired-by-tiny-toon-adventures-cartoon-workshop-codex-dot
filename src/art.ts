import {cameraAt,poseAt,type Actor,type Cartoon,type Cue} from './model';
export const names:Record<Actor,string>={pip:'Pip · seed courier',moth:'Moth · moon magician',moon:'Moonseed · prop'};
const ink='#233d47';
export function character(actor:Actor,action='stand',t=0):string {
 const swing=action==='walk'?Math.sin(t*1.5)*24:0;
 const wave=action==='wave'?-70+Math.sin(t)*25:swing;
 const shared=`stroke="${ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"`;
 if(actor==='moon')return `<g ${shared}><path d="M0 -84Q-35 -67 -25 -30Q-10 -4 18 -19Q-6 -21 -7 -43Q-13 -65 0 -84" fill="#ffd773"/><circle cx="-15" cy="-47" r="2" fill="${ink}"/><path d="M-33 -96l4 -10m20 12 8 -4m-38 80 -8 4" stroke="#fff0b5"/></g>`;
 const color=actor==='pip'?'#e9946c':'#a59add';
 return `<g ${shared}>
 <ellipse cx="0" cy="-2" rx="35" ry="7" fill="#233d4722" stroke="none"/>
 <g transform="rotate(${swing} -11 -27)"><path d="M-11 -27l-7 22 -13 2" fill="none"/><path d="M-34 -5q12 -8 23 0v6h-25z" fill="#fff3d7"/></g>
 <g transform="rotate(${-swing} 11 -27)"><path d="M11 -27l7 22 13 2" fill="none"/><path d="M12 -5q12 -8 23 0v6H11z" fill="#fff3d7"/></g>
 ${actor==='moth'?'<path d="M-6 -57Q-65 -100 -55 -48Q-60 -16 -17 -33M6 -57Q65 -100 55 -48Q60 -16 17 -33" fill="#d9cbea"/><path d="M-37 -58l15 14m59 -14 -15 14" stroke="#9385b2"/>':''}
 <path d="M-20 -61Q-32 -30 -15 -24h30q17 -6 5 -37z" fill="${color}"/>
 <path d="M-18 -57Q0 -46 20 -57v15Q0 -32 -22 -43z" fill="${actor==='pip'?'#547b64':'#5b547f'}"/>
 <g transform="rotate(${-swing} -21 -53)"><path d="M-21 -53l-14 21" fill="none"/><circle cx="-35" cy="-32" r="6" fill="#fff3d7"/></g>
 <g transform="rotate(${wave} 21 -53)"><path d="M21 -53l16 18" fill="none"/><path d="M33 -36l4 -8m0 9 7 -5m-7 5 8 1"/><circle cx="37" cy="-33" r="5" fill="#fff3d7"/></g>
 <ellipse cx="0" cy="-77" rx="29" ry="25" fill="${color}"/>
 ${actor==='pip'?'<path d="M-23 -92Q-36 -125 -13 -107l13 9Q15 -126 24 -110l-1 19" fill="#e9946c"/><path d="M-28 -91q26 -21 55 0" fill="#547b64"/><path d="M-13 -102q10 -25 26 -19 0 19 -26 19" fill="#b6ce82"/>':'<path d="M-13 -100l-9 -19m35 19 9 -19"/><circle cx="-23" cy="-121" r="5" fill="#ffd773"/><circle cx="23" cy="-121" r="5" fill="#ffd773"/>'}
 <ellipse cx="-10" cy="-80" rx="7" ry="10" fill="#fff9e9"/><ellipse cx="10" cy="-80" rx="7" ry="10" fill="#fff9e9"/><circle cx="-8" cy="-78" r="2.5" fill="${ink}"/><circle cx="12" cy="-78" r="2.5" fill="${ink}"/>
 <path d="M-7 -64q8 9 16 -1" fill="none"/><ellipse cx="0" cy="-70" rx="5" ry="3" fill="#ffd773" stroke="none"/>
 </g>`;
}
function scenery(scene:Cartoon['scene']):string {
 const stars=Array.from({length:28},(_,i)=>`<circle cx="${(i*173+30)%1400}" cy="${20+(i*37)%180}" r="${i%3+1}" fill="#fff2cc" opacity=".7"/>`).join('');
 const trees=Array.from({length:9},(_,i)=>`<g transform="translate(${i*180-40} 230)"><path d="M0 80V-30" stroke="#47646b" stroke-width="12"/><path d="M-50 15Q-90 -60 -25 -67Q-15 -120 30 -80Q100 -65 62 5Q40 40 -50 15" fill="${i%2?'#547c75':'#406b68'}"/><path d="M-25 -43Q0 -60 25 -39" fill="none" stroke="#79a08a" stroke-width="4"/></g>`).join('');
 if(scene==='theater')return `<rect width="1400" height="420" fill="#314754"/>${stars}<path d="M0 0h1400v85Q900 135 700 40Q300 150 0 85" fill="#aa5861"/><path d="M0 0h110l-25 280H0m1400 -280h-110l25 280h85" fill="#b96768"/><path d="M0 305h1400v115H0" fill="#b48b70"/>${Array.from({length:12},(_,i)=>`<path d="M${i*130} 305l-60 115" stroke="#896956" stroke-width="2"/>`).join('')}<ellipse cx="700" cy="350" rx="220" ry="45" fill="#f6d99944"/><path d="M650 290v-90h100v90" fill="#617f80" stroke="#203e48" stroke-width="5"/><text x="700" y="236" text-anchor="middle" fill="#fff0cb" font-size="18">MOONSEED</text><text x="700" y="260" text-anchor="middle" fill="#fff0cb" font-size="18">REVUE</text>`;
 if(scene==='rooftop')return `<rect width="1400" height="420" fill="#3c4767"/>${stars}<circle cx="920" cy="100" r="55" fill="#ffe1a1"/>${Array.from({length:12},(_,i)=>`<g><path d="M${i*130} 310V${180+i%3*30}h100v130" fill="${i%2?'#57627c':'#4d5875'}"/><path d="M${i*130+15} 230h18v25h-18m45 -25h18v25h-18" fill="#e6c38b"/></g>`).join('')}<path d="M0 307h1400v113H0" fill="#647582"/><path d="M0 305h1400v16H0" fill="#a0aaa2" stroke="#233d47" stroke-width="4"/>${Array.from({length:16},(_,i)=>`<path d="M${i*100} 322l-60 98" stroke="#435d6d" stroke-width="2"/>`).join('')}<path d="M620 305v-75h90v75" fill="#ac7e6b" stroke="#233d47" stroke-width="4"/><path d="M610 230h110v14H610" fill="#dfbb96"/>`;
 return `<rect width="1400" height="420" fill="#6b9295"/>${stars}<circle cx="1000" cy="86" r="42" fill="#f9ddb2"/><path d="M0 225Q180 100 400 220Q700 90 900 200Q1100 90 1400 180v240H0" fill="#91aa8b"/>${trees}<path d="M0 310Q350 270 650 312T1400 298v122H0" fill="#c9c893"/><path d="M0 356Q400 300 800 365t600 -10v65H0" fill="#ddcaa0"/><g stroke="#456466" stroke-width="5" fill="#bdd9b288"><path d="M600 300V180l100 -65 100 65v120z"/><path d="M600 180h200m-100 -65v185m-50 -150v150m100 -150v150"/><path d="M680 300v-65h40v65" fill="#557b73"/></g>${Array.from({length:20},(_,i)=>`<g transform="translate(${i*71} ${325+i%3*22})"><path d="M0 10v-15m0 6 -7 -7m7 12 8 -7" stroke="#6a8b63" stroke-width="3"/><circle cy="-8" r="5" fill="${i%2?'#ecad83':'#f7e1a3'}"/></g>`).join('')}`;
}
export function stage(p:Cartoon,frame:number,draft:Cue|null):string {
 const cam=cameraAt(p,frame);
 const figures=([0,1] as const).map(l=>{const c=poseAt(p,l,frame);return c?figure(c,frame-c.frame,false):'';}).join('');
 return `<svg viewBox="0 0 800 420" role="img" aria-label="Cartoon stage, frame ${frame}, camera ${Math.round(cam)}"><defs><pattern id="grain" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".5" fill="#fff" opacity=".09"/></pattern></defs><g transform="translate(${-cam} 0)">${scenery(p.scene)}${figures}${draft?figure(draft,0,true):''}<rect width="1400" height="420" fill="url(#grain)" pointer-events="none"/></g></svg>`;
}
function figure(c:Cue,t:number,ghost:boolean):string {
 const jump=c.action==='jump'?-Math.abs(Math.sin(t*.35))*65:0;
 const rotation=c.action==='spin'?Math.sin(t*.5)*30:0;
 return `<g transform="translate(${c.x} ${c.y+jump})" opacity="${ghost?.55:1}"><g transform="rotate(${rotation} 0 -50) scale(${c.vx<0?-1:1} 1)">${character(c.actor,c.action,t)}</g>${ghost?'<ellipse cx="0" cy="0" rx="42" ry="12" fill="none" stroke="#fce5a0" stroke-width="3" stroke-dasharray="5 5"/>':''}</g>`;
}
