// Non-fabricated UI: run compiled JavaScript/CSS/assets taken from signed APK.
// Platform hint is only to display native-only React screens, not to emulate Android plugins.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {chromium} from 'playwright';
const root=process.env.GITHUB_WORKSPACE;
const out=path.join(root,'capture');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const context=await browser.newContext({
  viewport:{width:432,height:900},deviceScaleFactor:2.5,isMobile:true,
  hasTouch:true,colorScheme:'light',locale:'en-MY'
});
await context.addInitScript(()=>{
  const cap=window.Capacitor||{};
  cap.platform='android';
  cap.getPlatform=()=> 'android';
  cap.isNativePlatform=()=>true;
  cap.isPluginAvailable=()=>false;
  cap.Plugins=cap.Plugins||{};
  window.Capacitor=cap;
});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(e.message.slice(0,200)));
page.on('requestfailed',r=>{
  if(r.url().startsWith('http://127.0.0.1:4173/')) errors.push('Asset request failed: '+r.url());
});
try{
  await page.goto('http://127.0.0.1:4173/#/',{waitUntil:'domcontentloaded',timeout:30000});
  await page.locator('.native-welcome[data-ready="true"]').waitFor({state:'visible',timeout:50000});
  const button=page.locator('.native-welcome__button');
  await button.waitFor({state:'visible',timeout:10000});
  await page.waitForFunction(()=>{
    const sign=document.querySelector('.native-welcome__sign');
    const wall=document.querySelector('.native-welcome__wall-image--day');
    return sign?.complete&&sign?.naturalWidth>100&&wall?.complete&&wall?.naturalWidth>100;
  },null,{timeout:20000});
  if(await button.isDisabled()) throw new Error('Real Get Started control remains disabled.');
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:path.join(out,'welcome.png'),animations:'disabled'});
  await button.click();
  await page.locator('.native-welcome').waitFor({state:'detached',timeout:20000});
  await page.waitForTimeout(3000);
  const details=await page.evaluate(()=>({
    route:location.hash,
    visible_text:(document.body?.innerText||'').trim().slice(0,400),
    has_main:!!document.querySelector('#main-content')
  }));
  if(!details.has_main||details.visible_text.length<20) throw new Error('Rendered post-welcome screen is empty.');
  await page.screenshot({path:path.join(out,'after-start.png'),animations:'disabled'});
  const origin=JSON.parse(await fs.readFile(path.join(out,'origin.json'),'utf8'));
  const hashes={};
  for(const name of ['welcome.png','after-start.png']){
    hashes[name]=crypto.createHash('sha256').update(await fs.readFile(path.join(out,name))).digest('hex');
  }
  const manifest={...origin,screen_capture:'Live compiled APK UI in Chromium mobile viewport',
    verification:'Real Get Started control clicked; original app removed welcome screen',
    post_welcome:details,screens:hashes,nonfatal_errors:errors.slice(0,10)};
  await fs.writeFile(path.join(out,'capture.json'),JSON.stringify(manifest,null,2));
  console.log('Captured APK-bundled web frontend. Post-welcome route:',details.route);
}catch(e){
  await fs.writeFile(path.join(out,'capture-failure.txt'),
    [e.stack||String(e),...errors].join('\n').slice(0,8000));
  throw e;
}finally{
  await browser.close();
}
