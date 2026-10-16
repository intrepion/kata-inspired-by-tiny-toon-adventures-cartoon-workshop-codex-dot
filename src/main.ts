import './style.css';
import {actions,actors,blank,cameraAt,clamp,decode,film,FPS,poseAt,resize,scenes,type Cartoon,type Cue,type Scene} from './model';
import {character,names,stage} from './art';
const KEY='pocket-picture-workshop.v1';
let status='Ready to direct';
let cartoon:Cartoon=blank();
try{const raw=localStorage.getItem(KEY);const saved=decode(raw);if(saved){cartoon=saved;status='Saved cartoon restored';}else if(raw)status='Unreadable save. Start a new take or save to replace it.';}catch{status='Storage unavailable. This take stays in memory.';}
let frame=0,lane:0|1=0,draft:Cue|null=null,step:'choose'|'place'|'motion'='choose';
let mode:'edit'|'playing'|'paused'|'ended'='edit';
let generation=0;
let last=0,accumulator=0,sound=false,audio:AudioContext|null=null;
let scenePending:Scene|null=null;
const app=document.querySelector<HTMLDivElement>('#app')!;
const el=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
function save(){try{localStorage.setItem(KEY,JSON.stringify(cartoon));status='Saved on this browser';}catch{status='Save failed — browser storage unavailable';}el('status').textContent=status;}
function mutate(p:Cartoon){cartoon=p;save();}
function render(){
 const editing=mode==='edit';
 app.innerHTML=`<header><a class="wordmark" href="./"><span class="logo">✳</span> POCKET PICTURE <small>WORKSHOP</small></a><div class="header-note">A LITTLE STUDIO. A BIG IMAGINATION.</div><button id="save">Save take <kbd>⌘ S</kbd></button></header>
 <main><section class="intro"><div><span class="eyebrow">THE MOONSEED FESTIVAL / YOUR DIRECTOR’S DESK</span><h1>Small cast. <em>Endless mischief.</em></h1><p>Cast your characters, give them a move, then roll the film.</p></div><button id="new" class="quiet">＋ New cartoon</button></section>
 <div class="studio"><aside class="panel cast"><div class="panel-heading"><span class="number">01</span><h2>Cast & action</h2></div><div class="slots"><button id="slot0" aria-pressed="${lane===0}">Actor 1</button><button id="slot1" aria-pressed="${lane===1}">Actor 2</button></div>
 <fieldset ${!editing?'disabled':''}><legend>Pick a performer</legend><div class="actors">${actors.map(a=>`<button class="actor-card ${(draft?.actor??poseAt(cartoon,lane,frame)?.actor??'pip')===a?'selected':''}" data-actor="${a}" aria-label="Cast ${names[a]}"><svg viewBox="-65 -135 130 145">${character(a)}</svg><span>${names[a].split(' · ')[0]}</span><small>${names[a].split(' · ')[1]}</small></button>`).join('')}</div>
 <label>Animation<select id="action">${actions.map(a=>`<option ${draft?.action===a?'selected':''}>${a}</option>`).join('')}</select></label><button id="prepare" class="wide">${step==='choose'?'Place this actor →':'Restart placement'}</button></fieldset>
 <div class="director-note"><span>DIRECTOR’S NOTE</span><p>Our seed courier and moon magician need a festival finale. Try a wave, a moonseed, and a perfectly timed leap.</p></div><details><summary>How to direct</summary><p>1. Choose actor slot, performer and action.<br>2. Place on stage with a click or arrow keys.<br>3. Set motion, then Film action.<br>4. Step forward and film another action. Rewind to add actor 2.</p><p>Filming replaces this slot’s later actions. Space plays / pauses. Esc returns to edit. Left / Right steps one frame outside fields. Tab and Enter operate controls.</p></details></aside>
 <section class="center"><div class="stage-top"><span><i></i> ${editing?'DIRECTING':mode==='ended'?'THAT’S A WRAP':mode==='paused'?'PAUSED':'ON AIR'}</span><span id="camera"></span></div><div id="stage" tabindex="0" aria-label="Stage placement; arrow keys move actor" class="stage"><div id="art"></div><div id="caption"></div><div class="stage-label">${cartoon.scene.toUpperCase()} / MOONSEED STUDIOS</div></div>
 <div class="transport"><button id="rewind" aria-label="Rewind to first frame">↤</button><button id="back" aria-label="Previous frame">‹</button><button id="play" class="play">${mode==='playing'?'Ⅱ Pause':mode==='paused'?'▶ Resume':'▶ Play cartoon'}</button><button id="next" aria-label="Next frame">›</button><button id="edit">↩ Return to edit</button><output id="counter"></output></div>
 <div class="film"><div class="film-heading"><h2><span class="number">02</span> Film desk</h2><label>Length <select id="length" ${!editing?'disabled':''}>${[24,60,120,180,240].map(n=>`<option value="${n}" ${cartoon.length===n?'selected':''}>${n/FPS} seconds</option>`).join('')}</select></label></div><label class="scrub-label">Frame <input id="scrub" type="range" min="0" max="${cartoon.length-1}" value="${frame}" aria-label="Frame playhead"></label><div class="ticks"><span>0s</span><span>${(cartoon.length/FPS/2).toFixed(1)}s</span><span>${cartoon.length/FPS}s</span></div><div id="cues"></div><p class="film-hint">Two actor slots · Film at the playhead · Rewind to layer a second performance</p></div>
 </section><aside class="panel direction"><div class="panel-heading"><span class="number">03</span><h2>Direct the take</h2></div><fieldset ${!editing?'disabled':''}><label>Scenery<select id="scene">${scenes.map(s=>`<option value="${s}" ${cartoon.scene===s?'selected':''}>${{garden:'Moonseed garden',rooftop:'Midnight rooftops',theater:'Festival theater'}[s]}</option>`).join('')}</select></label><div class="step-badge">${step==='choose'?'CHOOSE → PLACE → MOTION → FILM':step==='place'?'PLACE THE ACTOR': 'SET MOTION & FILM'}</div><p id="instruction">${step==='choose'?'Select a performer and animation, then place this actor.':step==='place'?'Click on the stage. Use arrows for fine placement, or enter coordinates below.':'Arrow length means speed. Each frame moves the actor by this many stage units.'}</p><div class="coordinates"><label>Position X<input id="x" type="number" min="50" max="1350" value="${draft?.x??240}" ${!draft?'disabled':''}></label><label>Position Y<input id="y" type="number" min="130" max="370" value="${draft?.y??320}" ${!draft?'disabled':''}></label></div><div class="coordinates"><label>Motion X<input id="vx" type="number" min="-6" max="6" value="${draft?.vx??0}" ${step!=='motion'?'disabled':''}></label><label>Motion Y<input id="vy" type="number" min="-3" max="3" value="${draft?.vy??0}" ${step!=='motion'?'disabled':''}></label></div><button id="film" class="accent wide" ${!draft?'disabled':''}>${step==='motion'?'● Film action':'Set motion →'}</button><button id="cancel" class="quiet wide" ${!draft?'disabled':''}>Cancel placement</button><button id="cut" class="quiet wide">✂ Delete cues from here</button><hr><label>Caption<select id="phrase"><option value="">No caption</option><option>One tiny seed. One giant idea.</option><option>Is this thing enchanted?</option><option>Ta-da! Almost on purpose.</option><option>Meet me under the moon!</option><option>That’s a wrap!</option></select></label><label class="check"><input id="cueSound" type="checkbox"> Add an original chime</label><button id="add-caption" class="wide">Set caption at frame ${frame}</button></fieldset><label class="check audio"><input id="audio" type="checkbox" ${sound?'checked':''}> Hear sound during playback</label><small>Sound starts after your click. Captions hold for 2 seconds.</small></aside></div><footer><span id="status" role="status">${status}</span><span>Made for making things. <a href="https://github.com/intrepion/kata-inspired-by-tiny-toon-adventures-cartoon-workshop-codex-dot">Source & field notes ↗</a></span></footer></main>
 ${scenePending?`<dialog open><h2>Start a fresh cartoon?</h2><p>A cartoon has one backdrop. Choosing ${scenePending} clears this take’s actors and captions.</p><button id="keep">Keep my take</button><button id="confirm" class="accent">Start fresh in ${scenePending}</button></dialog><div class="veil"></div>`:''}`;
 bind();paint();
}
function paint(){
 el('art').innerHTML=stage(cartoon,frame,mode==='edit'?draft:null);
 el('counter').textContent=`${String(frame).padStart(3,'0')} / ${cartoon.length-1} · ${(frame/FPS).toFixed(1)}s`;
 el<HTMLInputElement>('scrub').value=String(frame);
 el('camera').textContent=`CAM ${Math.round(cameraAt(cartoon,frame)).toString().padStart(3,'0')} · 12 FPS`;
 const caption=cartoon.captions.findLast(c=>c.frame<=frame&&frame<c.frame+24);
 el('caption').textContent=caption?.text??'';
 el('caption').hidden=!caption?.text;
 el('cues').innerHTML=([0,1] as const).map(l=>`<div class="cue-row"><b>${l+1}</b><div class="cue-track">${cartoon.lanes[l].map((c,i)=>`<button class="cue ${lane===l?'active':''}" data-lane="${l}" data-frame="${c.frame}" style="left:${c.frame/cartoon.length*100}%;width:${((cartoon.lanes[l][i+1]?.frame??cartoon.length)-c.frame)/cartoon.length*100}%" title="Actor ${l+1}: ${c.actor} ${c.action} at frame ${c.frame}" aria-label="Actor ${l+1} ${c.action} frame ${c.frame}">${c.action}</button>`).join('')||'<span class="empty-track">No performance yet — cast an actor</span>'}</div></div>`).join('');
 document.querySelectorAll<HTMLButtonElement>('.cue').forEach(b=>b.onclick=()=>{frame=Number(b.dataset.frame);lane=Number(b.dataset.lane) as 0|1;mode='edit';draft=null;step='choose';render();});
}
function bind(){
 el('save').onclick=save;
 el('new').onclick=()=>{scenePending=cartoon.scene;render();};
 for(const l of [0,1] as const)el(`slot${l}`).onclick=()=>{lane=l;draft=null;step='choose';render();};
 document.querySelectorAll<HTMLButtonElement>('[data-actor]').forEach(b=>b.onclick=()=>{const current=poseAt(cartoon,lane,frame);draft={frame,actor:b.dataset.actor as Cue['actor'],action:el<HTMLSelectElement>('action').value as Cue['action'],x:current?.x??(lane?540:240),y:current?.y??320,vx:0,vy:0};step='place';render();});
 el('prepare').onclick=()=>{const current=poseAt(cartoon,lane,frame);draft={frame,actor:draft?.actor??current?.actor??'pip',action:el<HTMLSelectElement>('action').value as Cue['action'],x:current?.x??240,y:current?.y??320,vx:0,vy:0};step='place';render();el('stage').focus();};
 el<HTMLSelectElement>('action').onchange=e=>{if(draft)draft.action=(e.target as HTMLSelectElement).value as Cue['action'];paint();};
 el('stage').onclick=e=>{if(!draft||mode!=='edit')return;const r=el('stage').getBoundingClientRect();draft.x=Math.round(clamp((e.clientX-r.left)/r.width*800+cameraAt(cartoon,frame),50,1350));draft.y=Math.round(clamp((e.clientY-r.top)/r.height*420,130,370));el<HTMLInputElement>('x').value=String(draft.x);el<HTMLInputElement>('y').value=String(draft.y);paint();};
 for(const [id,min,max] of [['x',50,1350],['y',130,370],['vx',-6,6],['vy',-3,3]] as const)el<HTMLInputElement>(id).onchange=e=>{if(!draft)return;const input=e.target as HTMLInputElement;const value=Number(input.value);draft[id]=Number.isFinite(value)?clamp(value,min,max):0;input.value=String(draft[id]);paint();};
 el('film').onclick=()=>{if(!draft)return;if(step==='place'){step='motion';render();}else{mutate(film(cartoon,lane,{...draft,frame}));draft=null;step='choose';render();}};
 el('cancel').onclick=()=>{draft=null;step='choose';render();};
 el('cut').onclick=()=>{const lanes:Cartoon['lanes']=[[...cartoon.lanes[0]],[...cartoon.lanes[1]]];lanes[lane]=lanes[lane].filter(c=>c.frame<frame);mutate({...cartoon,lanes});render();};
 el('back').onclick=()=>seek(frame-1);el('next').onclick=()=>seek(frame+1);el('rewind').onclick=()=>seek(0);
 el('play').onclick=toggle;el('edit').onclick=()=>{mode='edit';draft=null;step='choose';render();};
 el<HTMLInputElement>('scrub').oninput=e=>seek(Number((e.target as HTMLInputElement).value),false);
 el<HTMLInputElement>('scrub').onchange=()=>render();
 el<HTMLSelectElement>('length').onchange=e=>{const length=Number((e.target as HTMLSelectElement).value);mutate(resize(cartoon,length));frame=Math.min(frame,length-1);draft=null;step='choose';render();};
 el<HTMLSelectElement>('scene').onchange=e=>{scenePending=(e.target as HTMLSelectElement).value as Scene;render();};
 if(scenePending){el('keep').onclick=()=>{scenePending=null;render();};el('confirm').onclick=()=>{mutate(blank(scenePending!));scenePending=null;draft=null;step='choose';frame=0;mode='edit';render();};}
 el('add-caption').onclick=()=>{const text=el<HTMLSelectElement>('phrase').value;const cue={frame,text,sound:el<HTMLInputElement>('cueSound').checked};mutate({...cartoon,captions:[...cartoon.captions.filter(c=>c.frame!==frame),cue].sort((a,b)=>a.frame-b.frame)});render();};
 el<HTMLInputElement>('audio').onchange=e=>{sound=(e.target as HTMLInputElement).checked;if(sound){audio??=new AudioContext();void audio.resume();chime();}};
}
function seek(next:number,full=true){frame=clamp(next,0,cartoon.length-1);mode='edit';draft=null;step='choose';if(full)render();else paint();}
function toggle(){if(scenePending)return;if(mode==='playing'){mode='paused';render();return;}if(mode!=='paused')frame=0;mode='playing';draft=null;step='choose';last=performance.now();accumulator=0;render();playSound();const token=++generation;requestAnimationFrame(now=>tick(now,token));}
function playSound(){if(cartoon.captions.some(c=>c.frame===frame&&c.sound))chime();}
function chime(){if(!sound||!audio)return;const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.setValueAtTime(660,audio.currentTime);osc.frequency.exponentialRampToValueAtTime(990,audio.currentTime+.15);gain.gain.setValueAtTime(.06,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.35);osc.connect(gain);gain.connect(audio.destination);osc.start();osc.stop(audio.currentTime+.35);}
function tick(now:number,token:number){if(mode!=='playing'||token!==generation)return;accumulator+=Math.min(now-last,250);last=now;while(accumulator>=1000/FPS){accumulator-=1000/FPS;if(frame>=cartoon.length-1){mode='ended';render();return;}frame++;playSound();}paint();requestAnimationFrame(next=>tick(next,token));}
document.addEventListener('keydown',e=>{
 const target=e.target as HTMLElement;
 if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='s'){e.preventDefault();save();return;}
 if(e.key==='Escape'){scenePending=null;mode='edit';draft=null;step='choose';render();return;}
 if(scenePending||['INPUT','SELECT','TEXTAREA','BUTTON','SUMMARY'].includes(target.tagName))return;
 if(e.code==='Space'){e.preventDefault();toggle();return;}
 if(e.key.startsWith('Arrow')&&mode==='edit'){e.preventDefault();if(draft){const amount=e.shiftKey?10:2;draft.x=clamp(draft.x+(e.key==='ArrowRight'?amount:e.key==='ArrowLeft'?-amount:0),50,1350);draft.y=clamp(draft.y+(e.key==='ArrowDown'?amount:e.key==='ArrowUp'?-amount:0),130,370);el<HTMLInputElement>('x').value=String(draft.x);el<HTMLInputElement>('y').value=String(draft.y);paint();}else seek(frame+(e.key==='ArrowRight'||e.key==='ArrowUp'?1:-1));}
});
// All caption text is assigned through textContent; never interpolated into SVG or markup.
render();
