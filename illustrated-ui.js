'use strict';
// Individual raster paintings are animated in layers; game text stays live and legible.
const PaintedUI=window.PaintedUI={
 image:(name,cls='')=>'<img class="painted-art '+cls+'" data-art="'+name+'" src="'+ASSETS['art'+name]+'" alt="" draggable="false">',
 reduced:()=>matchMedia('(prefers-reduced-motion: reduce)').matches
};
// Large embedded paintings exceed browser custom-property token limits; assign
// background images directly so the standalone build remains fully self-contained.
PaintedUI.frame=(node,name)=>{node.style.backgroundImage='url("'+ASSETS['art'+name]+'")';node.style.backgroundSize='100% 100%';node.style.backgroundRepeat='no-repeat';};
PaintedUI.frame($('dialog'),'DialogueFrame');
AdventureArt.card=PaintedUI.image('JokerFront','joker-front');
AdventureArt.coin=PaintedUI.image('GoldPouch','coin-art');
AdventureArt.shard=color=>PaintedUI.image(color==='#ed646c'?'AllyTurn':'EnemyTurn','shard-art');
ASSETS.itemJokerCard=ASSETS.artJokerFront;
ASSETS.itemHp=ASSETS.artHpPotion;ASSETS.itemMp=ASSETS.artMpPotion;
itemCatalog.dirtySocks={name:'Dirty Socks',slot:'accessory',icon:'itemDirtySocks',stats:{speed:1},cosmetic:'dirty-socks',description:'A questionably fragrant accessory. +1 Speed. Sell a spare pair at the General Store for 2 gold.'};
Battle.dropTables={practice:[{id:'dirtySocks',chance:1}],wild:[{id:'dirtySocks',chance:.25},{id:'hpPotion',chance:.2}]};
const paintedFinish=Battle.finish;
Battle.finish=()=>{const already=Battle.state?.result;paintedFinish();const s=Battle.state;if(already||!s?.result)return;s.result.drops=[];if(s.result.won){for(const drop of Battle.dropTables[s.mode]||[]){if((drop.chance===1||Battle.rng()<drop.chance)&&(Menus.state.items[drop.id]||0)<999){Menus.state.items[drop.id]=(Menus.state.items[drop.id]||0)+1;s.result.drops.push({id:drop.id,count:1});}}save();}};
const paintedStatuses={speed:'StatusSpeed',attack:'StatusAttack',defense:'StatusDefense',bleed:'StatusBleed',sleep:'StatusSleep',stun:'StatusStun',guard:'StatusGuard'};
PaintedUI.decorate=root=>{for(const img of root.querySelectorAll('img')){const name=img.src===ASSETS.itemHp?'HpPotion':img.src===ASSETS.itemMp?'MpPotion':img.src===ASSETS.itemJokerCard?'JokerFront':img.src===ASSETS.itemDirtySocks?'DirtySocks':null;if(name){img.classList.add('painted-art');img.dataset.art=name;}}};
const paintedShop=Shop.render;
Shop.sellPrices={dirtySocks:2,hpPotion:1,mpPotion:1,jokerCard:2};
Shop.sell=id=>{const price=Shop.sellPrices[id];if(!Shop.opened||Shop.mode!=='sell'||!price||!(Menus.state.items[id]>0)||Menus.state.gold+price>999999)return false;Menus.state.items[id]--;Menus.state.gold+=price;Shop.message='Sold '+itemCatalog[id].name+' for '+price+' gold.';save();Shop.render();return true;};
const paintedShopOpen=Shop.open;Shop.open=()=>{Shop.mode='buy';paintedShopOpen();};
Shop.render=()=>{paintedShop();shopRoot.classList.add('painted-shop');PaintedUI.frame(shopRoot,'ShopFrame');const stock=shopRoot.querySelector('.shop-stock'),tabs=document.createElement('div');tabs.className='shop-mode-tabs';tabs.setAttribute('role','tablist');for(const mode of ['buy','sell']){const b=menuButton(mode==='buy'?'Buy supplies':'Sell items',()=>{Shop.mode=mode;Shop.message=mode==='sell'?'Only spare items in your bag can be sold.':'Choose a supply for the road.';Shop.render();});b.setAttribute('role','tab');b.setAttribute('aria-selected',String((Shop.mode||'buy')===mode));tabs.append(b);}stock.before(tabs);if(Shop.mode==='sell'){stock.replaceChildren();stock.classList.add('shop-sell');for(const [id,price]of Object.entries(Shop.sellPrices)){const count=Menus.state.items[id]||0;if(!count)continue;const row=document.createElement('article');row.innerHTML=itemImage(itemCatalog[id].icon)+'<h3>'+itemCatalog[id].name+'</h3><p>'+itemCatalog[id].description+'</p><small>In bag: '+count+'</small>';const b=menuButton('Sell one · '+price+' gold',()=>Shop.sell(id));b.dataset.sell=id;b.disabled=Menus.state.gold+price>999999;row.append(b);stock.append(row);}if(!stock.children.length)stock.innerHTML='<p class="shop-sell-empty">No spare items to sell. Defeat the practice trainer for a pair of Dirty Socks.</p>';}PaintedUI.decorate(shopRoot);};
const paintedMenu=Menus.render;
Menus.render=()=>{paintedMenu();PaintedUI.decorate(menuRoot);const gold=menuRoot.querySelector('.inventory-gold');if(gold)gold.insertAdjacentHTML('afterbegin',PaintedUI.image('GoldPouch'));};
const paintedBattle=Battle.render;
Battle.render=()=>{paintedBattle();const s=Battle.state;if(!s)return;const result=battleRoot.querySelector('.battle-result');if(result){combatFX.replaceChildren();result.classList.add('painted-result',s.result.won?'painted-victory':'painted-defeat');PaintedUI.frame(result,s.result.won?'VictoryFrame':'DefeatFrame');result.querySelector('.result-emblem')?.remove();for(const drop of s.result.drops||[]){const row=document.createElement('div');row.className='loot-row';row.innerHTML=PaintedUI.image(drop.id==='dirtySocks'?'DirtySocks':'HpPotion')+'<strong>'+itemCatalog[drop.id].name+' ×'+drop.count+'</strong><small>Added to your bag</small>';result.querySelector('.xp-list').before(row);}result.querySelector('.reward-totals strong')?.insertAdjacentHTML('afterbegin',PaintedUI.image('GoldPouch'));const emblem=document.createElement('div');emblem.className='painted-result-sparkles';emblem.setAttribute('aria-hidden','true');emblem.innerHTML='<i></i><i></i><i></i>';result.append(emblem);}for(const badge of battleRoot.querySelectorAll('.status-badge')){const label=badge.getAttribute('aria-label'),kind=label.startsWith('Speed')?'speed':label.startsWith('Attack')?'attack':label.startsWith('Defense')?'defense':label.startsWith('Bleed')?'bleed':label.startsWith('Sleep')?'sleep':label.startsWith('Stun')?'stun':label.startsWith('Burn')?'burn':label.startsWith('Freeze')?'freeze':label.startsWith('Poison')?'poison':'guard';badge.querySelector('svg')?.remove();badge.insertAdjacentHTML('afterbegin',PaintedUI.image(paintedStatuses[kind]));}const wait=battleRoot.querySelector('.battle-wait');if(wait)wait.insertAdjacentHTML('afterbegin',PaintedUI.image('WaitMana'));};
Battle.cardFlash=async(actor,target,onImpact)=>{
 const point=Battle.fxPoint(target)||Battle.fxPoint(actor);if(!point){onImpact?.();return;}
 const duration=Math.max(1,Battle.delay),reduced=PaintedUI.reduced(),nodes=[];
 const card=Battle.fxNode('painted-card-switch',point,'<div class="card-turner">'+PaintedUI.image('JokerFront','card-front')+PaintedUI.image('JokerBack','card-back')+'</div>');nodes.push(card);
 try{
  card.animate(reduced?[{opacity:0},{opacity:1}]:[{opacity:0,transform:'translate(-50%,-25%) scale(.25) rotate(-24deg)'},{opacity:1,transform:'translate(-50%,-75%) scale(1.12) rotate(8deg)',offset:.65},{opacity:1,transform:'translate(-50%,-55%) scale(1) rotate(0deg)'}],{duration:duration*.65,fill:'forwards',easing:'ease-out'});
  if(!reduced)card.firstChild.animate([{transform:'rotateY(0deg)'},{transform:'rotateY(540deg)'}],{duration:duration*.7,fill:'forwards',easing:'ease-in-out'});
  await sleep(duration*.65);
  const flash=Battle.fxNode('painted-switch-flash',point,PaintedUI.image('SwitchFlash'));nodes.push(flash);
  flash.animate([{opacity:0,transform:'translate(-50%,-50%) scale(.25)'},{opacity:.95,transform:'translate(-50%,-50%) scale(1)',offset:.3},{opacity:0,transform:'translate(-50%,-50%) scale(1.3)'}],{duration:duration*.7,easing:'ease-out'});
  card.style.opacity='0';card.getAnimations().forEach(a=>a.cancel());onImpact?.();
  for(let i=0;i<6&&!reduced;i++){const mote=Battle.fxNode('painted-switch-mote',point,PaintedUI.image(i%2?'GoldCoins':'AllyTurn'));nodes.push(mote);const angle=i*Math.PI/3;mote.animate([{opacity:1,transform:'translate(-50%,-50%) scale(.5)'},{opacity:0,transform:`translate(calc(-50% + ${Math.cos(angle)*110}px),calc(-50% + ${Math.sin(angle)*90}px)) scale(.15) rotate(${i*40}deg)`}],{duration:duration*.7,easing:'ease-out'});}
  await sleep(duration*.7);
 }finally{nodes.forEach(n=>n.remove());}
};
const paintedMana=Battle.restoreMana;
Battle.restoreMana=(actor,fraction)=>{const amount=paintedMana(actor,fraction);if(amount){const popup=[...combatFX.querySelectorAll('.mana-popup')].at(-1);if(popup)popup.insertAdjacentHTML('afterbegin',PaintedUI.image(fraction===.35?'FocusMana':'WaitMana'));}return amount;};
const paintedMove=Battle.moveVisual;
Battle.moveVisual=(actor,target,name,duration)=>{
 if(name!=='Focus')return paintedMove(actor,target,name,duration);
 const point=Battle.fxPoint(actor);if(!point)return ()=>{};const n=Battle.fxNode('painted-focus-effect',point,PaintedUI.image('FocusMana'));n.dataset.move=name;
 n.animate(PaintedUI.reduced()?[{opacity:1},{opacity:0}]:[{opacity:0,transform:'translate(-50%,-30%) scale(.4) rotate(-30deg)'},{opacity:1,transform:'translate(-50%,-55%) scale(1.15) rotate(0deg)',offset:.6},{opacity:0,transform:'translate(-50%,-80%) scale(1) rotate(20deg)'}],{duration:Math.max(1,duration),fill:'forwards'});
 const timer=setTimeout(()=>n.remove(),duration+30);return ()=>{clearTimeout(timer);n.remove();};
};
const restScene=document.createElement('div');restScene.id='painted-rest';restScene.className='hidden';restScene.setAttribute('aria-hidden','true');restScene.innerHTML=PaintedUI.image('InnBed','rest-bed')+'<div class="rest-mana">'+PaintedUI.image('MpRestored')+'</div><div class="rest-glow"></div>';$('stage').append(restScene);
const originalRest=restAtInn;
restAtInn=async()=>{if(game.transition||game.map!=='inn')return;restScene.classList.remove('hidden');restScene.classList.add('rest-appearing');try{await originalRest();}finally{restScene.classList.remove('rest-appearing');restScene.classList.add('hidden');}};
// Effects also use the individual condition paintings, including stat-change popups.
const statObserver=new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes){if(!(node instanceof HTMLElement)||!node.classList.contains('stat-popup')||node.querySelector('.painted-art'))continue;const label=node.textContent;const key=label.startsWith('Speed')?'StatusSpeed':label.startsWith('Attack')?'StatusAttack':label.startsWith('Defense')?'StatusDefense':label.startsWith('Bleed')?'StatusBleed':label.startsWith('Sleep')?'StatusSleep':label.startsWith('Stun')?'StatusStun':label.startsWith('Guard')?'StatusGuard':label.startsWith('Burn')?'StatusBurn':label.startsWith('Freeze')?'StatusFreeze':label.startsWith('Poison')?'StatusPoison':null;if(key){node.querySelector('svg')?.remove();node.insertAdjacentHTML('afterbegin',PaintedUI.image(key));}}});statObserver.observe(combatFX,{childList:true});
