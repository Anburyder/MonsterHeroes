'use strict';
window.GameLoading=(()=>{
 const root=document.getElementById('game-loading'),bar=document.getElementById('loading-progress'),label=document.getElementById('loading-message'),retry=document.getElementById('loading-retry');
 let failed=false,finished=false;
 retry.onclick=()=>location.reload();
 const fail=()=>{if(finished)return;failed=true;root.setAttribute('role','alert');label.textContent='The game couldn’t finish loading. Please try again.';bar.hidden=true;retry.hidden=false;};
 const progress=(done,total)=>{if(!failed&&!finished){const percent=Math.round(done/total*100);bar.setAttribute('aria-valuenow',percent);bar.classList.add('determinate');bar.querySelector('.loading-fill').style.width=percent+'%';label.textContent='Preparing your adventure… '+percent+'%';}};
 const ready=async()=>{
  if(document.readyState==='loading')await new Promise(resolve=>document.addEventListener('DOMContentLoaded',resolve,{once:true}));
  await document.fonts.ready;
  await Promise.all(['headerLogo','titleLogo','titleBackdrop'].map(id=>document.getElementById(id)?.decode?.().catch(()=>{})));
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  if(failed)return;finished=true;document.documentElement.classList.remove('game-loading');document.querySelector('.shell').inert=!!window.mobileUnsupported;root.remove();
 };
 const onError=event=>{if(event.target?.tagName==='SCRIPT'||event.error)fail();};
 window.addEventListener('error',onError,true);
 window.addEventListener('unhandledrejection',()=>fail());
 return {progress,ready,fail};
})();
