'use strict';
// Guard: one steady shield forming in front of the fighter, without mirrored flicker.
const guardVisual=Battle.moveVisual;
Battle.moveVisual=(actor,target,name,duration)=>{
 if(name!=='Guard')return guardVisual(actor,target,name,duration);
 const point=Battle.fxPoint(actor);if(!point)return()=>{};
 point.x+=actor.enemy?-20:20;
 const node=Battle.fxNode('guard-shield-effect',point,'<svg viewBox="0 0 120 150" aria-hidden="true"><path class="shield-body" d="M60 8 106 25 101 82Q93 119 60 141 27 119 19 82L14 25Z"/><path class="shield-rim" d="M60 19 95 33 91 80Q84 110 60 128 36 110 29 80L25 33Z"/><path class="shield-mark" d="M60 40V103M37 67H83"/><path class="shield-glint" d="M31 40 52 32M29 50 42 45"/></svg>');
 node.dataset.move='Guard';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 node.animate(reduced?[{opacity:0},{opacity:.9,offset:.25},{opacity:0}]:[{opacity:0,transform:'translate(-50%,-50%) scale(.65)'},{opacity:1,transform:'translate(-50%,-50%) scale(1.06)',offset:.28},{opacity:.9,transform:'translate(-50%,-50%) scale(1)',offset:.72},{opacity:0,transform:'translate(-50%,-50%) scale(1)'}],{duration:Math.max(1,duration),fill:'forwards'});
 const timer=setTimeout(()=>node.remove(),duration+40);return()=>{clearTimeout(timer);node.remove();};
};
TownAudio.prototype.guard=function(){if(!this.ctx||!this.enabled)return;const t=this.ctx.currentTime;[440,660,880].forEach((f,i)=>this.tone(f,t+i*.035,.32,.045,'sine',this.fx));};
// Result music uses a separate bus so the battle theme fades out immediately.
const resultStart=TownAudio.prototype.start;
TownAudio.prototype.start=async function(mood='town'){
 const result=mood==='victory'||mood==='defeat';
 await resultStart.call(this,mood);
 if(!this.resultMusic){this.resultMusic=this.ctx.createGain();this.resultMusic.gain.value=0;this.resultMusic.connect(this.master);}
 const t=this.ctx.currentTime;
 this.resultMusic.gain.cancelScheduledValues(t);this.resultMusic.gain.setTargetAtTime(result?.5:0,t,.08);
 if(result){this.music.gain.cancelScheduledValues(t);this.music.gain.setTargetAtTime(0,t,.06);this.next=t+1.15;this.step=0;}
};
TownAudio.prototype.resultSting=function(won){
 if(!this.ctx)return;const t=this.ctx.currentTime,hz=n=>440*2**((n-69)/12);
 const notes=won?[60,64,67,72,76,79]:[67,63,60,55];
 notes.forEach((n,i)=>this.tone(hz(n),t+i*(won?.085:.16),won?.45:.85,.11,won?'triangle':'sine',this.fx));
 const chord=won?[60,64,67,72]:[48,51,55];chord.forEach(n=>this.tone(hz(n),t+(won?.48:.5),1.2,.045,'triangle',this.fx));
};
TownAudio.prototype.resultNote=function(step,t){
 const won=this.mood==='victory',hz=n=>440*2**((n-69)/12),beat=won?.22:.42;
 const chords=won?[[60,64,67],[65,69,72],[67,71,74],[60,64,67]]:[[57,60,64],[53,57,60],[50,53,57],[52,56,59]];
 const melody=won?[72,76,79,0,76,79,84,79,81,79,77,76,74,0,77,81,79,0,83,81,79,77,76,74,76,79,72,0,67,71,72,0]:[76,0,72,0,71,69,0,0,72,0,69,0,67,65,0,0,69,0,65,0,64,62,0,0,64,0,68,0,71,0,0,0];
 const chord=chords[Math.floor(step/8)%4],note=melody[step%32];
 if(note)this.tone(hz(note),t,won?.35:1.1,won?.1:.075,won?'triangle':'sine',this.resultMusic);
 if(step%8===0)chord.forEach(n=>this.tone(hz(n-12),t,beat*7,.035,'sine',this.resultMusic));
 if(won&&step%2===0)this.tone(hz(chord[(step/2)%3]),t,.22,.05,'triangle',this.resultMusic);
 if(won&&step%4===0)this.tone(85,t,.13,.075,'sine',this.resultMusic);
};
const resultSchedule=TownAudio.prototype.schedule;
TownAudio.prototype.schedule=function(){
 if(!['victory','defeat'].includes(this.mood))return resultSchedule.call(this);
 if(!this.ctx||this.ctx.state!=='running'||!this.resultMusic)return;
 const now=this.ctx.currentTime;if(this.next<now-.5)this.next=now+.05;
 while(this.next<now+.3){this.resultNote(this.step++,this.next);this.next+=this.mood==='victory'?.22:.42;}
};
const finishWithResults=Battle.finish;
Battle.finish=()=>{
 const already=Battle.state?.result;finishWithResults();const result=Battle.state?.result;
 if(already||!result)return;
 const mood=result.won||result.captured?'victory':'defeat';
 audio.start(mood);audio.resultSting(mood==='victory');
};
