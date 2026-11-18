'use strict';
const TownNPC={
 shopkeeper:{name:'Mara · Shopkeeper',hello:'Welcome to Briarbell’s General Store! Potions for a rough day, Joker Cards for a new friend. What can I help you with?'},
 innkeeper:{name:'Poppy · Innkeeper',hello:'Welcome to the Amberleaf Inn, dear! There’s room by the fire for you and every one of your companions. A good rest will restore your party’s HP and MP.'}
};
TownNPC.show=(kind,text,choices)=>{
 const speaker=TownNPC[kind],dialog=$('dialog');
 say(speaker.name,text);dialog.classList.add('npc-dialog');
 dialog.querySelectorAll('.npc-portrait,.npc-choices').forEach(n=>n.remove());
 const portrait=document.createElement('img');portrait.className='npc-portrait';portrait.src=ASSETS[kind+'0'];portrait.alt='';dialog.prepend(portrait);
 const buttons=document.createElement('div');buttons.className='npc-choices';
 for(const [label,action] of choices){const button=document.createElement('button');button.textContent=label;button.onclick=action;buttons.append(button);}
 dialog.querySelector('div:not(.npc-choices)').append(buttons);$('dialogClose').textContent='Goodbye';buttons.querySelector('button')?.focus();
};
TownNPC.talk=kind=>{
 const info=()=>TownNPC.show(kind,kind==='shopkeeper'?'Joker Cards work on wild monsters, not a trainer’s team. Weaken a wild monster first for a better chance. You can earn five gold by winning practice battles east of the fountain.':'The shop is across the plaza to the west. You can practice battles east of the fountain, and a wild Bounkey likes the southern path. Stop by for a rest whenever your party needs one.',[['Back',()=>TownNPC.talk(kind)]]);
 const service=()=>{closeDialog();if(kind==='shopkeeper')Shop.open();else restAtInn();};
 TownNPC.show(kind,TownNPC[kind].hello,[[kind==='shopkeeper'?'Browse supplies':'Rest my party · Free',service],[kind==='shopkeeper'?'How do Joker Cards work?':'Tell me about Briarbell',info]]);
};
const closeNpcDialog=closeDialog;
closeDialog=()=>{const dialog=$('dialog');dialog.classList.remove('npc-dialog');dialog.querySelectorAll('.npc-portrait,.npc-choices').forEach(n=>n.remove());$('dialogClose').textContent='Continue';closeNpcDialog();};
$('dialogClose').onclick=()=>closeDialog();
document.addEventListener('keydown',e=>{
 if(!game.dialog||!$('dialog').classList.contains('npc-dialog'))return;
 if(['Enter','Space'].includes(e.code)&&e.target.closest?.('#dialog button')){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)e.target.click();}
 if(e.code==='Tab'){const buttons=[...$('dialog').querySelectorAll('button')],i=buttons.indexOf(document.activeElement);e.preventDefault();e.stopImmediatePropagation();buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus();}
},true);
const roomsWithoutKeepers=makeRoom;
makeRoom=kind=>{
 roomsWithoutKeepers(kind);
 const id=kind==='shop'?'shopkeeper':'innkeeper',x=kind==='shop'?735:690,y=kind==='shop'?465:470;
 game.objects.push({id,kind:'npc',asset:id+'0',x,y,width:56,height:84,depth:y});rect(x-12,y-13,24,18,id);
 interaction(id,x,y+32,'Talk to '+TownNPC[id].name,()=>TownNPC.talk(id),68);
 if(kind==='shop'){const counter=game.interactions.find(i=>i.id==='counter');counter.label='Talk to Mara · Shopkeeper';counter.action=()=>TownNPC.talk('shopkeeper');}
};
const objectsWithoutKeepers=drawObject;
drawObject=o=>{
 if(o.kind!=='npc')return objectsWithoutKeepers(o);
 shadow(o.x,o.y-1,12);ctx.save();ctx.imageSmoothingEnabled=true;
 drawSprite(o.id+(Math.floor(game.time/1.1)%2),o.x-o.width/2,o.y-o.height,o.width,o.height);ctx.restore();
};
