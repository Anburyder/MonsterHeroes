'use strict';
// Crisp geometric lines, with the glow confined to the ground beneath the fighter.
Battle.manaCircle=actor=>{
 const stage=$('stage').getBoundingClientRect(),sprite=$('battler-'+actor.id)?.querySelector('.battle-sprite')?.getBoundingClientRect();
 if(!sprite)return;
 const point={x:sprite.left-stage.left+sprite.width/2,y:sprite.top-stage.top+sprite.height*.92};
 const node=Battle.fxNode('mana-circle',point,'<svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="70"/><circle cx="80" cy="80" r="59"/><path d="M80 21 131 109H29ZM80 139 29 51H131Z"/><circle cx="80" cy="80" r="23"/><path d="M80 4V15M80 145V156M4 80H15M145 80H156"/></svg>');
 node.dataset.unit=actor.id;
 node.style.width=Math.min(150,sprite.width*.55)+'px';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 node.animate([{opacity:0,filter:'drop-shadow(0 0 2px #168dff)'},{opacity:1,filter:'drop-shadow(0 0 9px #168dff)',offset:.25},{opacity:.9,filter:'drop-shadow(0 0 14px #168dff)',offset:.65},{opacity:0,filter:'drop-shadow(0 0 2px #168dff)'}],{duration:reduced?650:1100,fill:'forwards'}).finished.then(()=>node.remove()).catch(()=>node.remove());
};
// Keep the numeric MP gain; replace the painted regeneration image entirely.
Battle.restoreMana=(actor,fraction)=>{
 const gain=Math.max(0,Math.min(actor.maxMp-actor.mp,Math.ceil(actor.maxMp*fraction)));actor.mp+=gain;
 if(gain){Battle.manaCircle(actor);const point=Battle.fxPoint(actor);if(point){const n=Battle.fxNode('stat-popup mana-popup',point,'MP +'+gain);n.animate([{opacity:1,transform:'translate(-50%,-20px)'},{opacity:0,transform:'translate(-50%,-60px)'}],{duration:1000}).finished.then(()=>n.remove()).catch(()=>n.remove());}}
 return gain;
};
const manaMoveVisual=Battle.moveVisual;
Battle.moveVisual=(actor,target,name,duration)=>name==='Focus'?()=>{}:manaMoveVisual(actor,target,name,duration);
