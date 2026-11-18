'use strict';
// Original vector cels: irregular ink contours, flat pigment, and pencil hatching.
// Stepped playback deliberately holds each drawing like traditional animation.
(() => {
  const ink='#392b39', cream='#fff3ce';
  const path=(d,fill='none',stroke=ink,w=3)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const group=(body,x=0,y=0,rotate=0,scale=1)=>`<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})">${body}</g>`;
  const star=(color=cream)=>path('M0 -48 10 -18 35 -35 24 -8 49 2 22 12 32 38 7 24 -8 46 -15 20 -43 28 -27 4 -46 -12 -18 -15 -21 -40 -3 -24Z',color)+path('M-9 -9 7 -16 19 0M-16 8 -5 17', 'none','#fff9e5',4);
  const note=path('M-9 18V-23L17 -29V10M-9 -17 17 -23','none',ink,5)+path('M-10 11C-29 8 -31 29 -15 26 -5 24 -3 14 -10 11ZM16 4C0 0 -5 22 12 19 23 18 25 7 16 4Z','#79dbcf');
  const shard=path('M0 -47 18 -14 11 35 -5 48 -20 13 -14 -21Z','#bc8deb')+path('M0 -47 -3 9 -5 48M-20 13 -3 9 18 -14','none','#694c92',2)+path('M-8 -22 -11 -4','none','#fff3ff',4);
  const snow=path('M-30 -22Q-12 -41 12 -31L31 -15Q44 10 23 27L4 34Q-25 32 -34 10Z','#eefeff')+path('M-24 -10Q-13 -27 5 -24M18 19 25 10','none','#94cddd',4)+path('M-16 22 -8 26M-25 13 -19 18','none','#9fc9d1',2);
  const slash=(color,length=1)=>group(path('M-42 35Q-9 -5 43 -41Q22 -7 -31 41Z',color)+path('M-32 29 22 -23','none',cream,2),0,0,0,length);
  const rays=(f,color=cream)=>Array.from({length:7},(_,i)=>group(path(`M0 -${48+f*3}l-3 -13M5 -${54+f*3}l1 -6`,'none',color,3),0,0,i*51)).join('');
  const drawings={
    Tackle:f=>group(star('#ffd478'),0,0,f%2?7:-7,.65+f*.055)+rays(f,'#ffe6a4'),
    Scratch:f=>[-23,0,23].map((y,i)=>group(slash('#fff1cc',.8),0,y,10+i*5,Math.max(.1,Math.min(1,(f+1-i)*.4)))).join(''),
    'Claw Swipe':f=>[-27,0,27].map((y,i)=>group(slash('#f29a71'),0,y,-14,Math.max(.15,Math.min(1,(f-i+1)*.4)))).join('')+path('M-40 42 -32 48M-25 48 -17 53','none','#ffc591',3),
    'Fang Rush':f=>{const gap=Math.max(0,24-f*5);return group(path('M-48 -30Q0 -58 48 -30L32 -21 21 6 13 -23 -13 -23 -22 7 -33 -21Z','#fff4dc'),0,-gap)+group(path('M-44 28 -29 19 -20 -3 -11 23 12 23 22 -4 31 19 43 28Q0 52 -44 28Z','#fff4dc'),0,gap)+(f>3?rays(f,'#ffb183'):'');},
    Bounce:f=>{const s=f>4?1.35:.9;return group(path('M-35 -24Q-2 -45 29 -22 48 4 24 29 -7 47 -32 20 -46 1 -35 -24Z','#efb858')+path('M-27 -8Q-15 -26 4 -25M18 24 28 15','none',cream,4),0,0,f*19,s)+path('M-51 37Q-6 56 45 35M-37 46Q0 59 28 45','none','#ffe09a',3);},
    Spike:f=>[-26,0,27].map((x,i)=>group(shard,x,i===1?-9:10,(i-1)*26,.75+(f%2)*.04)).join(''),
    Snowball:f=>group(snow,0,0,f*25)+(f>4?Array.from({length:6},(_,i)=>group(snow,Math.cos(i)*60,Math.sin(i)*50,i*40,.18)).join(''):''),
    Strum:f=>[-1,0,1].map((i)=>group(note,i*39,Math.sin(f*.7+i)*15,i*14,.85)).join('')+path('M-62 36Q-10 55 53 32M-57 43Q1 62 59 39','none','#f9d888',3),
    Yell:f=>[0,1,2].map(i=>path(`M${-40+i*30} ${-22-i*12}Q${-5+i*39+f%2*4} 0 ${-40+i*30} ${22+i*12}`,'none',i===1?'#fff1b4':'#75d9cc',9)).join('')+path('M35 -49 45 -59M48 43 60 50','none',ink,3),
    Guard:f=>group(path('M0 -55 43 -38 38 9Q27 40 0 56 -29 41 -39 11L-44 -36Z','#8abed0')+path('M0 -43 31 -29 27 8Q19 30 0 43 -20 29 -28 8L-32 -27Z','#c0e5e1')+path('M0 -27V27M-20 -1H20','none',cream,7)+path('M-23 -23 -17 -29M18 23 23 15','none','#628e9e',2),0,0,f%2?1:-1),
    Focus:f=>path('M-48 29Q-9 9 45 27 62 40 21 48 -29 54 -48 29Z','none','#f6cc69',5)+[-1,0,1].map(i=>group(path('M0 15 -6 -4 0 -25 7 -5Z',cream),i*33,-22-(f%3)*7-i*5,0,.8)).join('')+path('M-18 -14 -3 -20 13 -13','none','#fff0ac',3),
    Sleep:f=>group(path('M15 -36Q-21 -20 5 9 -33 8 -33 -20 -30 -45 0 -49Z','#d2b2e9'),-17,0,-10)+[0,1,2].map(i=>group(path('M-10 -12H10L-10 10H11','none','#e2ceff',5),i*26-9,-i*19-(f%3)*5,0,1-i*.18)).join('')
  };
  Battle.moveArt={names:Object.keys(drawings),cel:(name,frame)=>drawings[name]?.(Math.max(0,Math.min(7,frame)))||star()};
  Battle.moveVisual=(actor,target,name,duration)=>{
    const from=Battle.fxPoint(actor),to=Battle.fxPoint(target);if(!from||!to)return ()=>{};
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const node=Battle.fxNode('drawn-move',to);node.dataset.move=name;
    Object.assign(node.style,{position:'absolute',width:'190px',height:'190px',pointerEvents:'none',transform:'translate(-50%,-50%)'});
    const life=Math.max(1,duration),start=performance.now();let timer;
    const local=['Scratch','Claw Swipe','Fang Rush','Tackle','Guard','Focus','Sleep'].includes(name);
    const paint=elapsed=>{
      const p=Math.min(1,elapsed/life),f=reduced?5:Math.min(7,Math.floor(p*8));
      const travel=reduced||local?1:Math.min(1,p/.7);
      node.style.left=(from.x+(to.x-from.x)*travel)+'px';
      node.style.top=(from.y+(to.y-from.y)*travel-(name==='Bounce'&&!reduced?Math.sin(travel*Math.PI)*90:0))+'px';
      const size=reduced?1:p<.7?.55+p*.65:1+(p-.7)*.3;
      node.style.opacity=p>.86?String((1-p)/.14):'1';
      node.dataset.cel=String(f);
      node.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-95 -95 190 190" width="190" height="190"><g transform="scale(${size})">${Battle.moveArt.cel(name,f)}</g></svg>`;
    };
    paint(0);
    const stop=()=>{clearInterval(timer);node.remove();};
    timer=setInterval(()=>{const elapsed=performance.now()-start;if(elapsed>=life||!node.isConnected)stop();else paint(elapsed);},1000/12);
    return stop;
  };
})();
