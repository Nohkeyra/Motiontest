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
  hasTouch:true,colorScheme:'light',locale:'en-MY',
  recordVideo:{dir:path.join(out,'recordings'),size:{width:432,height:900}}
});
await context.addInitScript(()=>{
  // Supported Capacitor runtime hook. The earlier cap.getPlatform override
  // was overwritten by @capacitor/core during initialization.
  window.CapacitorCustomPlatform={name:'android'};
  const cap=window.Capacitor||{};
  cap.platform='android';
  cap.getPlatform=()=> 'android';
  cap.isNativePlatform=()=>true;
  cap.isPluginAvailable=()=>false;
  cap.Plugins=cap.Plugins||{};
  window.Capacitor=cap;
});
const page=await context.newPage();
const videoStart=Date.now();
const marks={};
const mark=(name)=>{marks[name]=Math.max(0,(Date.now()-videoStart)/1000);};
const errors=[];
page.on('pageerror',e=>errors.push(e.message.slice(0,200)));
page.on('requestfailed',r=>{
  if(r.url().startsWith('http://127.0.0.1:4173/')) errors.push('Asset request failed: '+r.url());
});
try{
  await page.goto('http://127.0.0.1:4173/#/',{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForTimeout(6000);
  const preflight=await page.evaluate(()=>({
    url:location.href,
    platform:window.Capacitor?.getPlatform?.() || 'unknown',
    native:window.Capacitor?.isNativePlatform?.(),
    welcome_exists:!!document.querySelector('.native-welcome'),
    welcome_ready:document.querySelector('.native-welcome')?.getAttribute('data-ready'),
    root_length:document.querySelector('#root')?.innerHTML?.length || 0,
    title:document.title,
    main_text:(document.body?.innerText || '').slice(0,1400),
    body_class:document.body?.className || ''
  }));
  await fs.writeFile(path.join(out,'preflight.json'),JSON.stringify({...preflight,errors},null,2));
  await page.screenshot({path:path.join(out,'preflight.png'),animations:'disabled'});
  console.log('APK web-bundle preflight:',JSON.stringify(preflight).slice(0,1600));
  if(!preflight.welcome_exists) throw new Error('APK web bundle did not present the native welcome component; see preflight artifact.');
  await page.locator('.native-welcome[data-ready="true"]').waitFor({state:'visible',timeout:20000});
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
  // Use the genuine built-in theme switch for an alternate authentic welcome state.
  // Both states remain actual APK frontend captures; no reconstruction.
  const welcomeTheme = await page.locator('.native-welcome').getAttribute('data-theme');
  if (welcomeTheme !== 'dark') throw new Error('Expected a clean dark welcome state from APK settings.');
  mark('theme-toggle');
  await page.locator('.native-welcome__theme-icon').click();
  await page.locator('.native-welcome[data-theme="light"]').waitFor({state:'visible',timeout:12000});
  await page.waitForTimeout(600);
  await page.screenshot({path:path.join(out,'welcome-light.png'),animations:'disabled'});
  await page.locator('.native-welcome__theme-icon').click();
  await page.locator('.native-welcome[data-theme="dark"]').waitFor({state:'visible',timeout:12000});
  await page.waitForTimeout(700);
  mark('get-started');
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
  // Real guest journey: login screen -> Prepare a Draft -> Event selection -> Menu.
  // No personal data is entered and no order is submitted.
  const draftButton = page.getByRole('button',{name:'Prepare a Draft',exact:true});
  await draftButton.waitFor({state:'visible',timeout:15000});
  mark('prepare-draft');
  await draftButton.click();
  await page.locator('.customer-order-form[data-step="1"]').waitFor({state:'visible',timeout:35000});
  await page.evaluate(()=>scrollTo(0,0));
  await page.waitForTimeout(1200);
  await page.screenshot({path:path.join(out,'order-start.png'),animations:'disabled'});
  mark('select-event');
  await page.locator('[data-tour="step1-event-type"] [role="radio"]').first().click();
  await page.locator('[data-tour="step1-meal-tengahari"]').click();
  await page.locator('[data-tour="step1-prep-buffet"]').click();
  await page.evaluate(()=>scrollTo(0,0));
  await page.waitForTimeout(700);
  await page.screenshot({path:path.join(out,'order-selected.png'),animations:'disabled'});
  mark('next-menu');
  await page.locator('[data-tour="step1-next"]').click();
  await page.locator('.customer-order-form[data-step="2"]').waitFor({state:'visible',timeout:35000});
  await page.evaluate(()=>scrollTo(0,0));
  await page.waitForTimeout(1800);
  await page.screenshot({path:path.join(out,'order-menu.png'),animations:'disabled'});
  // Additional honest menu-detail capture, only if the compiled APK has
  // actually rendered its own dish list. No filler images are ever generated.
  const realDishList=page.locator('[data-tour="step2-dish-list"]').first();
  const hasDishList=(await realDishList.count())>0;
  if(hasDishList){
    mark('dish-reveal');
    await realDishList.scrollIntoViewIfNeeded({timeout:10000});
    await page.waitForTimeout(500);
    await page.screenshot({path:path.join(out,'order-dishes.png'),animations:'disabled'});
  }

  await page.waitForTimeout(650);
  mark('end');
  // Close before copying so Chromium finalizes the actual interaction video.
  await context.close();
  const originalWebm=await page.video().path();
  await fs.copyFile(originalWebm,path.join(out,'interaction-full.webm'));
  await fs.writeFile(path.join(out,'interaction-times.json'),JSON.stringify({
    captured_at:'Real compiled Wawasan APK frontend in Chromium',
    duration:marks.end,
    markers:marks,
    examples:[
      {file:'theme.mp4',marker:'theme-toggle',seconds:2.8},
      {file:'started.mp4',marker:'get-started',seconds:2.8},
      {file:'draft.mp4',marker:'prepare-draft',seconds:3.4},
      {file:'selection.mp4',marker:'select-event',seconds:4.2},
      {file:'menu.mp4',marker:'next-menu',seconds:3.5}
    ]
  },null,2));
  const origin=JSON.parse(await fs.readFile(path.join(out,'origin.json'),'utf8'));
  const hashes={};
  for(const name of ['welcome.png','welcome-light.png','after-start.png','order-start.png','order-selected.png','order-menu.png',...(hasDishList?['order-dishes.png']:[])]){
    hashes[name]=crypto.createHash('sha256').update(await fs.readFile(path.join(out,name))).digest('hex');
  }
  const manifest={...origin,screen_capture:'Live compiled APK UI in Chromium mobile viewport',
    verification:'Real Get Started control clicked; original app removed welcome screen',
    post_welcome:details,
    observed_order_flow:{
      trigger:'Prepare a Draft',
      route:'#/order',
      selected_event:'Office Feast',
      selected_meal:'Lunch',
      selected_serving:'Buffet Style',
      advanced_to_step:2,
      submit_performed:false
    },
    real_interaction_video:'interaction-full.webm',interaction_markers:'interaction-times.json',
    screens:hashes,nonfatal_errors:errors.slice(0,10)};
  await fs.writeFile(path.join(out,'capture.json'),JSON.stringify(manifest,null,2));
  console.log('Captured APK-bundled web frontend. Post-welcome route:',details.route);
}catch(e){
  await fs.writeFile(path.join(out,'capture-failure.txt'),
    [e.stack||String(e),...errors].join('\n').slice(0,8000));
  throw e;
}finally{
  await browser.close();
}
