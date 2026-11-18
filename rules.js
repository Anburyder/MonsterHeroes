'use strict';
// Canonical six-stat values and passive descriptions: Monster Heroes Starter Evolutions.pdf.
// MP and Jester stats are provisional; neither is specified in that document.
const statLabels={hp:'HP',mp:'MP',attack:'Attack',specialAttack:'Special Attack',defense:'Defense',specialDefense:'Special Defense',speed:'Speed'};
const Abilities={Stretch:{name:'Stretch',description:'Single target moves hit all enemies.'},Acceleration:{name:'Acceleration',description:'Speed is raised by one stage each turn.'},Assassin:{name:'Assassin',description:'KOs raise attack by one stage.'},RefractionPrism:{name:'Refraction Prism',description:'Special attacking moves use the attack stat.'}};
const CharacterData={
 hero:{name:'Jester',types:['Silly'],ability:'Entertainer',stats:{hp:110,mp:20,attack:10,specialAttack:16,defense:4,specialDefense:17,speed:20}},
 bounkey:{name:'Bounkey',types:['Rubber'],ability:'Stretch',stats:{hp:65,mp:24,attack:70,specialAttack:30,defense:42,specialDefense:65,speed:38}},
 elastape:{name:'Elastape',types:['Rubber'],ability:'Stretch',stats:{hp:90,mp:24,attack:95,specialAttack:42,defense:58,specialDefense:88,speed:47}},
 rubberilla:{name:'Rubberilla',types:['Rubber','Fire'],ability:'Stretch',stats:{hp:115,mp:24,attack:125,specialAttack:50,defense:70,specialDefense:110,speed:60}},
 echo:{name:'Echokidna',types:['Sound'],ability:'Acceleration',stats:{hp:40,mp:24,attack:30,specialAttack:75,defense:60,specialDefense:35,speed:70}},
 accelhog:{name:'Accelhog',types:['Sound','Electric'],ability:'Acceleration',stats:{hp:55,mp:24,attack:40,specialAttack:100,defense:80,specialDefense:50,speed:95}},
 sonichidna:{name:'Sonichidna',types:['Sound','Electric'],ability:'Acceleration',stats:{hp:70,mp:24,attack:50,specialAttack:125,defense:105,specialDefense:60,speed:120}},
 glass:{name:'Glassassin',types:['Crystal'],ability:'Assassin',stats:{hp:40,mp:24,attack:90,specialAttack:48,defense:33,specialDefense:29,speed:70}},
 glassassinator:{name:'Glassassinator',types:['Crystal','Darkness'],ability:'Assassin',stats:{hp:55,mp:24,attack:125,specialAttack:65,defense:40,specialDefense:35,speed:100}},
 glassCannon:{name:'Glass Cannon',types:['Crystal','Light'],ability:'RefractionPrism',stats:{hp:65,mp:24,attack:160,specialAttack:85,defense:48,specialDefense:42,speed:130}}
};
function typeBadge(type){return '<span class="type-logo type-cartoon type-'+type+'" title="'+type+'"><img src="'+ASSETS['typeLogo'+type]+'" alt="'+type+' type" draggable="false"><span>'+type+'</span></span>';}
function typeMarkup(kind){return '<span class="type-logos">'+CharacterData[kind].types.map(typeBadge).join('')+'</span>';}
function abilityMarkup(kind){const a=Abilities[CharacterData[kind].ability];return '<small>ABILITY</small><h4>'+(a?a.name:'Not specified')+'</h4><p>'+(a?a.description:'No passive ability is assigned in this playtest.')+'</p>';}
function moveTargetLabel(kind,move){if(move.target==='self')return 'Single target · Self';if(move.target==='allEnemies'||CharacterData[kind]?.ability==='Stretch')return 'Multi target · All enemies';return 'Single target · One enemy';}
const stageMultiplier=stage=>(2+Math.max(0,Math.min(6,stage||0)))/2;
