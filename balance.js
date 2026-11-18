'use strict';
// Level-one tuning: HP, MP, Attack, Special Attack, Defense, Special Defense, Speed.
const Balance={stats:values=>Object.fromEntries(['hp','mp','attack','specialAttack','defense','specialDefense','speed'].map((k,i)=>[k,values[i]]))};
const monsterBalance={
 bounkey:[90,24,50,30,50,55,35],echo:[75,24,30,58,40,45,62],glass:[70,24,62,30,38,38,62],
 wolf:[90,24,52,42,48,42,46],purcasso:[80,24,30,56,42,48,52],sillydog:[85,24,46,46,44,44,50],
 flamander:[90,24,38,56,48,44,38],koiboi:[85,24,32,52,44,56,45]
};
for(const [kind,values] of Object.entries(monsterBalance))CharacterData[kind].stats=Balance.stats(values);
for(const [base,evolutions] of Object.entries({bounkey:['elastape','rubberilla'],echo:['accelhog','sonichidna'],glass:['glassassinator','glassCannon']})){
 for(const [i,kind] of evolutions.entries())CharacterData[kind].stats=Object.fromEntries(Object.entries(CharacterData[base].stats).map(([key,n])=>[key,key==='mp'?24:Math.round(n*(i?1.55:1.25))]));
}
const heroBalance={
 jester:[90,20,34,46,42,46,48],beastTamer:[90,20,50,30,48,40,48],
 artist:[90,20,30,52,40,48,46],buccaneer:[90,20,48,40,46,42,44],pyromancer:[90,20,28,56,38,48,46]
};
for(const [id,values] of Object.entries(heroBalance)){
 const hero=HeroClasses[id];hero.data.stats=Balance.stats(values);
 const offense=id==='beastTamer'||id==='buccaneer'?'attack':'specialAttack';
 const gear={helmet:{mp:4},chest:{defense:3},legs:{defense:2},gloves:{[offense]:2},boots:{speed:2},accessory:{hp:15},weapon:{[offense]:4}};
 for(const [slot,item] of Object.entries(hero.equipment)){
  itemCatalog[item].stats=gear[slot];
  itemCatalog[item].description=itemCatalog[item].name+' · '+Object.entries(gear[slot]).map(([k,n])=>'+'+n+' '+statLabels[k]).join(', ');
 }
}
for(const ability of ['Entertainer','BeastBoost','ActiveImagination','FireMastery','WaterMastery'])Abilities[ability].description=Abilities[ability].description.replace('1.5×','1.25×');
const balancePartyBoost=Battle.partyBoost;
Battle.partyBoost=(actor,move)=>balancePartyBoost(actor,move)>1?1.25:1;
// The shared damage curve keeps neutral starter attacks near 20–30 damage.
const balanceDamage=Battle.damage;
Battle.damage=(actor,target,move)=>Math.max(1,Math.round(balanceDamage(actor,target,move)*.81*(actor.ability==='Stretch'&&Battle.targets(actor,move,target).length>1?.7:1)));
Abilities.Stretch.description='Single-target attacks hit all enemies, dealing 70% damage per target when spread.';
Battle.practiceTeam=()=>{
 const tamer=unit('practice','hero',true),wolf=unit('practice-wolf','wolf',true),bounkey=unit('practice-bounkey','bounkey',true);
 Object.assign(tamer,{name:'Beast Tamer',art:'tamer',types:['Beast'],type:'Beast',ability:'BeastBoost',moves:HeroClasses.beastTamer.moves.slice()});
 for(const [u,stats] of [[tamer,HeroClasses.beastTamer.data.stats],[wolf,CharacterData.wolf.stats],[bounkey,CharacterData.bounkey.stats]])Object.assign(u,stats,{maxHp:stats.hp,maxMp:stats.mp,hp:stats.hp,mp:stats.mp,attack:Math.round(stats.attack*.8),specialAttack:Math.round(stats.specialAttack*.8)});
 return [tamer,wolf,bounkey];
};
const balanceWild=Battle.startWild;
Battle.startWild=()=>{if(game.battle)return;balanceWild();if(Battle.state?.mode!=='wild')return;const u=Battle.state.enemy,stats=CharacterData[u.kind].stats;Object.assign(u,stats,{maxHp:stats.hp,maxMp:stats.mp,attack:Math.round(stats.attack*.8),specialAttack:Math.round(stats.specialAttack*.8)});Battle.render();};
// Fresh saves start full even when class defaults predate the current stat table.
const balanceLoad=Menus.load;
Menus.load=(data,selected)=>{balanceLoad(data,selected);if(!data){const stats=Menus.stats();Object.assign(Menus.state.hero,{hp:stats.hp,mp:stats.mp});for(const m of Menus.state.monsters)Object.assign(m,{hp:CharacterData[m.kind].stats.hp,mp:CharacterData[m.kind].stats.mp});}};
