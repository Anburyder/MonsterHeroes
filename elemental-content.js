'use strict';
// Provisional playtest balance for the new Fire and Water characters.
Abilities.FireMastery={name:'Fire Mastery',description:'Party Fire moves deal 1.5× damage.'};
Abilities.WaterMastery={name:'Water Mastery',description:'Party Water moves deal 1.5× damage.'};
Object.assign(combatMoves,{
 'Fireball':{type:'Fire',mp:3,power:45,category:'special',target:'enemy',burnChance:0.15},
 'Water Jet':{type:'Water',mp:3,power:45,category:'special',target:'enemy'},
 'Cutlass':{type:'Water',mp:0,power:40,category:'physical',target:'enemy'}
});
Object.assign(moveDescriptions,{Fireball:'Launch a Fire attack using Special Attack, with a 15% chance to burn the target.','Water Jet':'Fire a Water jet using Special Attack.',Cutlass:'Strike one enemy with a Water-infused cutlass.'});
CharacterData.flamander={name:'Flamander',types:['Fire'],ability:null,stats:{hp:70,mp:24,attack:45,specialAttack:60,defense:50,specialDefense:45,speed:40}};
CharacterData.koiboi={name:'Koiboi',types:['Water'],ability:null,stats:{hp:60,mp:24,attack:40,specialAttack:60,defense:45,specialDefense:55,speed:50}};
labels.flamander='Flamander';
labels.koiboi='Koiboi';
const elementalHeroes=[
 ['buccaneer','Buccaneer','Water','WaterMastery','koiboi',['Cutlass','Water Jet','Focus','Guard']],
 ['pyromancer','Pyromancer','Fire','FireMastery','flamander',['Fireball','Tackle','Focus','Guard']]
];
for(const [id,name,type,ability,companion,moves] of elementalHeroes){
 HeroClasses[id]={name,art:id,types:[type],ability,description:'Starts with '+labels[companion]+'. Boosts party '+type+' attacks.',moves,data:{name,types:[type],ability,stats:{hp:110,mp:24,attack:20,specialAttack:26,defense:14,specialDefense:18,speed:23}},equipment:{}};
 const names=id==='buccaneer'?['Skull bandana','Buccaneer jacket','Sailing trousers','Sailor gloves','Sea boots','Wave charm','Cutlass']:['Red hood','Crimson cape','Dark trousers','Spellcaster wraps','Mage boots','Ember charm','Flame focus'];
 for(const [i,slot] of Object.keys(equipmentSlots).entries()){
  const item=id+'-'+slot;
  itemCatalog[item]={name:names[i],slot,icon:id+'Equipment'+i,stats:{},cosmetic:item,description:names[i]+' · Starter equipment'};
  HeroClasses[id].equipment[slot]=item;
 }
}
const beforeElementDefaults=classDefaults;
classDefaults=base=>{
 const profile=elementalHeroes.find(([id])=>id===game.heroClass);
 if(!profile)return beforeElementDefaults(base);
 const [id,,,,companion]=profile;
 const stats=CharacterData[companion].stats;
 base.monsters.unshift({id:companion,kind:companion,level:1,hp:stats.hp,mp:stats.mp});
 base.party.unshift(companion);
 base.active=[companion,'bounkey'];
 base.equipment={...HeroClasses[id].equipment};
 base.hero={hp:110,mp:24};
 return base;
};
const beforeElementLoad=Menus.load;
Menus.load=(data,selected)=>{
 beforeElementLoad(data,selected);
 for(const kind of ['flamander','koiboi']){
  if(!Menus.state.monsters.some(m=>m.kind===kind))Menus.addMonster(kind);
 }
};
const beforeElementPool=Summary.pool;
Summary.pool=kind=>kind==='flamander'?['Fireball','Scratch','Focus','Guard']:kind==='koiboi'?['Water Jet','Scratch','Focus','Guard']:beforeElementPool(kind);
const beforeElementBoost=Battle.partyBoost;
Battle.partyBoost=(actor,move)=>{
 if(!actor.enemy&&((Battle.state?.hero?.ability==='FireMastery'&&move.type==='Fire')||(Battle.state?.hero?.ability==='WaterMastery'&&move.type==='Water')))return 1.5;
 return beforeElementBoost(actor,move);
};
document.head.insertAdjacentHTML('beforeend','<style>.class-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.class-card .class-portrait{max-height:145px}#class-select{overflow-y:auto}.class-card p{margin:4px 0}</style>');

// Source battle artwork has mixed facing directions; overworld rows keep their own direction.
Battle.sourceFacesLeft=new Set(['koiboi','flamander','buccaneer']);
const beforeElementVisual=Battle.moveVisual;
Battle.moveVisual=(actor,target,name,duration)=>{
 const key={Fireball:'Fireball','Water Jet':'WaterJet',Cutlass:'Cutlass'}[name];
 if(!key)return beforeElementVisual(actor,target,name,duration);
 const from=Battle.fxPoint(actor),to=Battle.fxPoint(target);
 if(!from||!to)return()=>{};
 const node=Battle.fxNode('elemental-move-effect',from),pic=document.createElement('img');
 node.dataset.move=name;pic.alt='';node.append(pic);
 Object.assign(node.style,{position:'absolute',width:'150px',height:'150px',transform:'translate(-50%,-50%)',pointerEvents:'none',zIndex:5});
 Object.assign(pic.style,{width:'100%',height:'100%',objectFit:'contain',transform:to.x<from.x?'scaleX(-1)':''});
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,start=performance.now(),life=Math.max(1,duration);
 let timer;
 const stop=()=>{clearInterval(timer);node.remove();};
 const draw=()=>{
  const p=(performance.now()-start)/life;
  if(p>=1||!node.isConnected){stop();return;}
  const travel=reduced||name==='Cutlass'?1:Math.min(1,p/.7),frame=p<.2?0:p<.7?1:p<.86?2:3;
  pic.src=ASSETS['move'+key+frame];node.dataset.frame=String(frame);
  node.style.left=(from.x+(to.x-from.x)*travel)+'px';node.style.top=(from.y+(to.y-from.y)*travel)+'px';
  node.style.opacity=p>.86?String((1-p)/.14):'1';
 };
 draw();timer=setInterval(draw,30);return stop;
};
typeSoundRecipes.Fire=[180,90,'sawtooth'];
typeSoundRecipes.Water=[660,330,'sine'];

