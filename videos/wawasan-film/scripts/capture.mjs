import {chromium} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const base=process.env.WAWASAN_CAPTURE_URL || 'http://127.0.0.1:4173/';
const out=path.resolve('public/assets');
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const errors=[];
try{
for(const cfg of [
 {name:'phone-home',wide:false,hash:'#/'},
 {name:'phone-order',wide:false,hash:'#/order'},
 {name:'wide-home',wide:true,hash:'#/'},
 {name:'wide-order',wide:true,hash:'#/order'}
]){
 const context=await browser.newContext({viewport:cfg.wide?{width:1440,height:900}:{width:390,height:844},deviceScaleFactor:2,
 isMobile:!cfg.wide,hasTouch:!cfg.wide,reducedMotion:'reduce',serviceWorkers:'block'});
 await context.addInitScript(()=>{
  try{
    localStorage.setItem('wawasan_language','bm');
    localStorage.setItem('app_theme','dark');
    localStorage.setItem('CapacitorStorage.app_theme','dark');
    localStorage.setItem('wawasan_ghost_demo_seen_v1','1');
    sessionStorage.setItem('wawasan_guest_allowed','true');
    sessionStorage.setItem('wawasan_session_started','true');
  }catch(_){}
 });
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(cfg.name+': '+String(e).slice(0,200)));
 await page.route('**/*',async route=>{
   const u=new URL(route.request().url());
   if(['127.0.0.1','localhost'].includes(u.hostname)){
     if(u.pathname==='/api/menu'){return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:true,menuItems:[]})});}
     if(u.pathname.startsWith('/api/')){return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:true,orders:[],sessions:[],items:[],settings:{}})});}
     return route.continue();
   }
   return route.abort('blockedbyclient');
 });
 await page.goto(base+cfg.hash,{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForTimeout(6400);
 const start=page.getByRole('button',{name:/Get Started|Mulakan/i}).first();
 if(await start.count()){
  try{if(await start.isVisible()){await start.click({timeout:2000}); await page.waitForTimeout(1100);}}catch(_){}
 }
 if(cfg.hash.includes('order')){await page.goto(base+'#/order',{waitUntil:'domcontentloaded'});await page.waitForTimeout(3400);}
 const text=(await page.locator('body').innerText()).trim();
 if(text.length<70) throw new Error('Capture contains almost no app content: '+cfg.name+' ('+text.slice(0,70)+')');
 await page.evaluate(async()=>{
  if(document.fonts&&document.fonts.ready) await document.fonts.ready;
  await Promise.all(Array.from(document.images).slice(0,20).map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.onload=resolve;img.onerror=resolve;setTimeout(resolve,3000);})));
 });
 const p=path.join(out,cfg.name+'.png');
 await page.screenshot({path:p,animations:'disabled'});
 const size=fs.statSync(p).size;
 if(size<22000) throw new Error('Screenshot unexpectedly small: '+cfg.name+' '+size+' bytes');
 console.log('CAPTURE_OK '+cfg.name+' '+size+' bytes; title '+(await page.title())+'; app text '+text.slice(0,90).replace(/\n/g,' / '));
 await context.close();
}
console.log('CAPTURE_COMPLETE: four genuine Wawasan browser UI screenshots; '+errors.length+' page errors');
if(errors.length)console.log('NON_FATAL_PAGE_ERRORS',JSON.stringify(errors.slice(0,8)));
}finally{await browser.close();}
