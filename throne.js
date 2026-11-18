const royalAddress = [
  "Come closer. There are four names we speak in this hall with the candles lit. Before you leave, you should know what those four did.",
  "Long ago, war broke out between humans and monsters. An army gathered under human banners. They meant to wipe out every monster, down to the last youngling in its den.",
  "Four heroes gained the power of monsters. When the army marched, those four stood beside the creatures it had come to kill. They broke its ranks. By dusk, the army lay dead.",
  "Then a hand reached out of the heap and took another by the wrist. Bloody corpses drew together, limb over limb, until the whole army stood again. It had become a single monster. We call him Amalgamemnon.",
  "He still claims the dead. Each body he draws into his own makes him stronger. Each day we wait gives him another day to grow.",
  "I believe you descend from one of those four heroes. I would give much to know it for certain. What you do with that inheritance must be your choice.",
  "Go down to Briarbell. Learn to fight beside your monsters. Grow strong enough to face Amalgamemnon, or the sacrifice of the four monstrous heroes will have been in vain."
];

function audience() {
  if (game.audiencePage >= royalAddress.length) {
    say('The King', 'When you are ready, take the south door to Briarbell. May you and your companions return together.');
    return;
  }
  say('The King', royalAddress[game.audiencePage], () => {
    game.audiencePage++;
    save();
    if (game.audiencePage < royalAddress.length) audience();
    else notify('Leave by the south door to reach Briarbell.');
  });
}

function makeThroneRoom() {
  game.bounds = {x:155,y:355,w:790,h:367};
  rect(310,335,480,42,'royal-dais');
  interaction('king',550,395,'Speak to the king',audience,110);
  interaction('merlin',425,395,'Speak to Grand Wizard Merlin',()=>say('Grand Wizard Merlin','Four heroes once learned to wield the power of monsters. The king believes their gift lives on in you.'),65);
  interaction('queen',675,395,'Speak to the queen',()=>say('The Queen','They lit four candles here the night the heroes went to war. I see to it that their flames are tended.'),65);
  interaction('south-door',550,700,'Leave for Briarbell',()=>{
    if (game.audiencePage < royalAddress.length) return say('Castle doors','The king waits at the north end of the carpet. Speak with him before you leave.');
    audio.door();
    const gate = {x:800,y:510};
    transitionTo('town',gate.x,gate.y,0);
  },70);
}

function drawThroneRoom() {
  ctx.save();
  ctx.imageSmoothingEnabled=true;
  ctx.drawImage(imgs.throneHall,0,85,VW,VH);
  for(const [id,x,height] of [['merlin',425,78],['king',550,92],['queen',675,76]]){
    const art=imgs[id], width=height*art.width/art.height;
    shadow(x,345,width*.43);
    ctx.drawImage(art,x-width/2,346-height,width,height);
  }
  for(const [x,y] of [[316,310],[784,310],[319,555],[781,555]]){
    const phase=game.time+x;
    const flutter=(Math.sin(phase*5)+Math.sin(phase*8.3))*.5;
    const radius=66+flutter*5;
    const glow=ctx.createRadialGradient(x,y,2,x,y,radius);
    glow.addColorStop(0,'rgba(255,200,111,'+(.28+flutter*.10)+')');
    glow.addColorStop(1,'rgba(255,169,83,0)');
    ctx.fillStyle=glow;
    ctx.fillRect(x-radius,y-radius,radius*2,radius*2);
  }
  ctx.restore();
}
