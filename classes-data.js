'use strict';
Abilities.Entertainer={name:'Entertainer',description:'All Silly-type moves used by your party deal 1.5× damage.'};
Abilities.BeastBoost={name:'Beast Boost',description:'All Beast-type moves used by your party deal 1.5× damage.'};
Abilities.ActiveImagination={name:'Active Imagination',description:'All Art-type moves used by your party deal 1.5× damage.'};
const HeroClasses={
 jester:{name:'Jester',art:'hero',types:['Silly'],ability:'Entertainer',description:'A playful entertainer who amplifies the whole party’s Silly attacks.',moves:['Strum','Tackle','Sleep','Guard'],data:CharacterData.hero},
 beastTamer:{name:'Beast Tamer',art:'tamer',types:['Beast'],ability:'BeastBoost',description:'A fearless companion to beasts. Starts with Frostbite, her Snow / Beast wolf.',moves:['Claw Swipe','Tackle','Focus','Guard'],data:{name:'Beast Tamer',types:['Beast'],ability:'BeastBoost',stats:{hp:110,mp:20,attack:28,specialAttack:20,defense:14,specialDefense:14,speed:25}}}
};
CharacterData.wolf={name:'Frostbite',types:['Snow','Beast'],ability:null,stats:{hp:70,mp:24,attack:70,specialAttack:55,defense:50,specialDefense:45,speed:60}};
function heroArt(){return HeroClasses[game.heroClass||'jester'].art;}
function setHeroClass(id){game.heroClass=Object.hasOwn(HeroClasses,id)?id:'jester';CharacterData.hero=HeroClasses[game.heroClass].data;}
function classDefaults(base){if(game.heroClass!=='beastTamer')return base;const wolf={id:'wolf',kind:'wolf',level:1,hp:70,mp:24};base.monsters.unshift(wolf);base.party.unshift('wolf');base.active=['wolf','bounkey'];base.equipment={...HeroClasses.beastTamer.equipment};base.hero={hp:125,mp:24};return base;}
