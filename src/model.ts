export const FPS=12;
export const actors=['pip','moth','moon'] as const;
export const actions=['stand','walk','jump','wave','spin'] as const;
export const scenes=['garden','rooftop','theater'] as const;
export type Actor=typeof actors[number];
export type Action=typeof actions[number];
export type Scene=typeof scenes[number];
export interface Cue {frame:number;actor:Actor;action:Action;x:number;y:number;vx:number;vy:number}
export interface Caption {frame:number;text:string;sound:boolean}
export interface Cartoon {version:1;scene:Scene;length:number;lanes:[Cue[],Cue[]];captions:Caption[]}
export const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
export const blank=(scene:Scene='garden'):Cartoon=>({version:1,scene,length:120,lanes:[[],[]],captions:[]});
export function film(p:Cartoon,lane:0|1,cue:Cue):Cartoon {
 const lanes:[Cue[],Cue[]]=[[...p.lanes[0]],[...p.lanes[1]]];
 lanes[lane]=[...lanes[lane].filter(c=>c.frame<cue.frame),{...cue}];
 return {...p,lanes};
}
export function poseAt(p:Cartoon,lane:0|1,frame:number):Cue|null {
 const cue=p.lanes[lane].findLast(c=>c.frame<=frame); if(!cue)return null;
 const elapsed=frame-cue.frame;
 return {...cue,x:clamp(cue.x+elapsed*cue.vx,50,1350),y:clamp(cue.y+elapsed*cue.vy,130,370)};
}
export function cameraAt(p:Cartoon,frame:number):number {
 const poses=([0,1] as const).map(l=>poseAt(p,l,frame)).filter(c=>c!==null);
 return poses.length?clamp(poses.reduce((sum,c)=>sum+c.x,0)/poses.length-400,0,600):0;
}
export function decode(raw:string|null):Cartoon|null {
 try {
 const p:unknown=JSON.parse(raw??'null'); if(!p||typeof p!=='object')return null;
 const q=p as Record<string,unknown>;
 const number=(v:unknown,min:number,max:number)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
 if(q.version!==1||!scenes.includes(q.scene as Scene)||!number(q.length,24,240)||!Number.isInteger(q.length)||!Array.isArray(q.lanes)||q.lanes.length!==2||!Array.isArray(q.captions))return null;
 for(const lane of q.lanes){if(!Array.isArray(lane)||lane.length>240)return null; let prev=-1; for(const v of lane){if(!v||typeof v!=='object')return null;const c=v as Record<string,unknown>;if(!number(c.frame,0,(q.length as number)-1)||!Number.isInteger(c.frame)||(c.frame as number)<=prev||!actors.includes(c.actor as Actor)||!actions.includes(c.action as Action)||!number(c.x,50,1350)||!number(c.y,130,370)||!number(c.vx,-6,6)||!number(c.vy,-3,3))return null;prev=c.frame as number;}}
 if(q.captions.length>240||q.captions.some((c:unknown)=>{if(!c||typeof c!=='object')return true;const v=c as Record<string,unknown>;return !number(v.frame,0,(q.length as number)-1)||!Number.isInteger(v.frame)||typeof v.text!=='string'||v.text.length>80||typeof v.sound!=='boolean';}))return null;
 return p as Cartoon;
 }catch{return null;}
}
export function resize(p:Cartoon,length:number):Cartoon{return {...p,length,lanes:[p.lanes[0].filter(c=>c.frame<length),p.lanes[1].filter(c=>c.frame<length)],captions:p.captions.filter(c=>c.frame<length)};}
