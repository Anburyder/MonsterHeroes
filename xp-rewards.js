'use strict';
TownAudio.prototype.xpRise=function(duration){
 if(!this.ctx||!this.enabled)return()=>{};
 const ctx=this.ctx,t=ctx.currentTime,osc=ctx.createOscillator(),gain=ctx.createGain();
 osc.type='sine';osc.frequency.setValueAtTime(400,t);osc.frequency.exponentialRampToValueAtTime(1150,t+duration);
 gain.gain.setValueAtTime(.0001,t);gain.gain.linearRampToValueAtTime(.055,t+.04);gain.gain.setValueAtTime(.055,t+Math.max(.05,duration-.08));gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
 osc.connect(gain);gain.connect(this.fx);osc.start(t);osc.stop(t+duration+.03);
 let stopped=false;osc.onended=()=>{osc.disconnect();gain.disconnect();};
 return()=>{if(stopped)return;stopped=true;try{osc.stop();}catch{}};
};
TownAudio.prototype.xpLevel=function(){if(!this.ctx||!this.enabled)return;[659.25,830.61,987.77,1318.51].forEach((hz,i)=>this.tone(hz,this.ctx.currentTime+i*.065,.35,.06,'triangle',this.fx));};
const xpResultScreen=Battle.resultScreen;
Battle.resultScreen=()=>{
 Battle.stopXP?.();
 xpResultScreen();const result=Battle.state.result,panel=battleRoot.querySelector('.battle-result');
 const rows=[...panel.querySelectorAll('.xp-list>div')],reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 result.xpStarted??=performance.now()+300;result.xpSounds??=new Set();
 const duration=1200,gap=220;
 const bars=rows.map((node,i)=>{
  const bar=document.createElement('div');bar.className='gold-xp-bar';bar.setAttribute('role','progressbar');bar.setAttribute('aria-label',result.rows[i].name+' experience');bar.setAttribute('aria-valuemin','0');
  const frame=document.createElement('img');frame.src=ASSETS.xpFrame;frame.alt='';bar.append(frame);
  const well=document.createElement('div');well.className='gold-xp-well';const fill=document.createElement('div');fill.className='gold-xp-fill';fill.style.backgroundImage='url("'+ASSETS.xpFill+'")';well.append(fill);bar.append(well);node.querySelector('progress').replaceWith(bar);node.dataset.xpMember=result.rows[i].id;
  return {node,bar,fill,label:node.querySelector('span'),caption:node.querySelector('small')};
 });
 let stopSound=()=>{},current=-1,frame,stopped=false;
 const stop=()=>{stopped=true;cancelAnimationFrame(frame);stopSound();};Battle.stopXP=stop;
 const draw=now=>{
  if(stopped||!panel.isConnected||!game.battle||Battle.state?.result!==result){stop();return;}
  let unfinished=false;
  bars.forEach(({node,bar,fill,label,caption},i)=>{
   const row=result.rows[i],p=row.gained?Math.max(0,Math.min(1,(now-result.xpStarted-i*(duration+gap))/duration)):1;
   unfinished||=p<1;const active=p>0&&p<1;
   node.classList.toggle('xp-gaining',active);node.dataset.xpState=p===0?'waiting':p===1?'complete':'filling';
   if(active&&current!==i){stopSound();current=i;const list=node.parentElement;list.scrollTop+=node.getBoundingClientRect().top-list.getBoundingClientRect().top-8;if(!result.xpSounds.has('row'+i)){result.xpSounds.add('row'+i);stopSound=audio.xpRise(Math.max(.1,(1-p)*duration/1000));}}
   const gained=Math.floor(row.gained*p);let level=row.startLevel??row.owner.level,xp=(row.startXp??row.owner.xp)+gained;
   while(level<100&&xp>=Progress.need(level)){xp-=Progress.need(level);level++;}
   if(level>=100)xp=0;
   const max=Progress.need(level),percent=level===100?100:xp/max*100;
   fill.style.width=(reduced&&p<1?(row.startXp||0)/Progress.need(row.startLevel||1)*100:percent)+'%';
   bar.setAttribute('aria-valuemax',max);bar.setAttribute('aria-valuenow',level===100?max:xp);
   label.textContent='+'+gained+' XP · Level '+level+(level>(row.startLevel||level)?' · Level up!':'');
   caption.textContent=level===100?'Maximum level':xp+' / '+max+' XP to next level';
   if(level>(row.startLevel||level)&&!result.xpSounds.has(i+':'+level)){result.xpSounds.add(i+':'+level);audio.xpLevel();}
  });
  if(unfinished)frame=requestAnimationFrame(draw);else stop();
 };
 frame=requestAnimationFrame(draw);
};
const closeXpRewards=Battle.close;
Battle.close=()=>{closeXpRewards();if(!game.battle){Battle.stopXP?.();battleRoot.querySelector('.battle-result')?.remove();}};
