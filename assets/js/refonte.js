'use strict';
document.documentElement.classList.add('js');
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
menu.hidden=false;
menu.addEventListener('click',()=>menu.setAttribute('aria-expanded',String(menu.getAttribute('aria-expanded')!=='true')));
nav.addEventListener('click',()=>menu.setAttribute('aria-expanded','false'));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');menu.focus();}});
const viewer=document.querySelector('#viewer'),stage=document.querySelector('#image-stage'),canvas=document.querySelector('#image-canvas'),img=document.querySelector('#zoom-image');
const zin=document.querySelector('#zoom-in'),zout=document.querySelector('#zoom-out'),reset=document.querySelector('#zoom-reset'),close=document.querySelector('#close-view'),level=document.querySelector('#zoom-level');
let opener,scale=1,baseW=1,baseH=1,drag=null;
function sizeImage(){
 const centerX=(stage.scrollLeft+stage.clientWidth/2)/(parseFloat(img.style.width)||baseW);
 const centerY=(stage.scrollTop+stage.clientHeight/2)/(parseFloat(img.style.height)||baseH);
 img.style.width=baseW*scale+'px';img.style.height=baseH*scale+'px';
 canvas.style.width=Math.max(stage.clientWidth,baseW*scale)+'px';canvas.style.height=Math.max(stage.clientHeight,baseH*scale)+'px';
 stage.scrollLeft=centerX*baseW*scale-stage.clientWidth/2;stage.scrollTop=centerY*baseH*scale-stage.clientHeight/2;
 level.value=Math.round(scale*100)+' %';zin.disabled=scale>=5;zout.disabled=scale<=1;
}
function fit(){if(!img.naturalWidth)return;scale=1;const ratio=Math.min(stage.clientWidth/img.naturalWidth,stage.clientHeight/img.naturalHeight,1);baseW=img.naturalWidth*ratio;baseH=img.naturalHeight*ratio;sizeImage();stage.scrollLeft=stage.scrollTop=0;}
img.addEventListener('load',fit);
document.querySelectorAll('[data-zoom]').forEach(link=>link.addEventListener('click',e=>{
 e.preventDefault();opener=link;
 document.querySelector('#viewer-title').textContent=link.querySelector('span')?.textContent.includes('référentiel')?'Référentiel de la compétence':'Extrait agrandi';
 document.querySelector('#zoom-caption').textContent=link.dataset.caption;
 img.alt=link.dataset.caption;img.src=link.href;
 viewer.showModal();document.body.classList.add('modal-open');close.focus();if(img.complete)fit();
}));
zin.addEventListener('click',()=>{scale=Math.min(5,scale+.5);sizeImage();});
zout.addEventListener('click',()=>{scale=Math.max(1,scale-.5);sizeImage();});
reset.addEventListener('click',fit);close.addEventListener('click',()=>viewer.close());
viewer.addEventListener('close',()=>{document.body.classList.remove('modal-open');drag=null;stage.classList.remove('dragging');opener?.focus({preventScroll:true});});
viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close();}});
stage.addEventListener('pointerdown',e=>{if(scale<=1||e.pointerType==='touch')return;drag={x:e.clientX,y:e.clientY,left:stage.scrollLeft,top:stage.scrollTop};stage.setPointerCapture(e.pointerId);stage.classList.add('dragging');e.preventDefault();stage.focus();});
stage.addEventListener('pointermove',e=>{if(!drag)return;stage.scrollLeft=drag.left+drag.x-e.clientX;stage.scrollTop=drag.top+drag.y-e.clientY;});
for(const name of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(name,()=>{drag=null;stage.classList.remove('dragging');});
stage.addEventListener('keydown',e=>{const delta={ArrowLeft:[-90,0],ArrowRight:[90,0],ArrowUp:[0,-90],ArrowDown:[0,90]}[e.key];if(delta){e.preventDefault();stage.scrollBy(...delta);}if(e.key==='+'||e.key==='='){e.preventDefault();zin.click();}if(e.key==='-'){e.preventDefault();zout.click();}});
window.addEventListener('resize',()=>{if(viewer.open)fit();});
const reading=document.querySelector('.reading'),bar=reading.querySelector('progress'),percent=reading.querySelector('.percent'),lynx=reading.querySelector('.lynx');
const scroller=document.querySelector('.page-scroll');
// Dessin vectoriel original : lynx à oreilles à pinceaux, sans média tiers.
lynx.innerHTML='<svg viewBox="0 0 48 30" width="34" height="26" fill="currentColor" aria-hidden="true"><path d="M5 17Q9 7 21 10L30 13 34 8 35 2 39 7 43 2 44 10 47 15 43 20 37 21 34 18 28 20 26 28 22 28 23 20 13 20 10 28 6 28 8 18 2 16 2 12Z"/><circle cx="41" cy="12" r="1" fill="#f5f3e9"/></svg>';
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
function motion(){reading.classList.toggle('reduced',reduced.matches);update();}
let scheduled=false;
function update(){scheduled=false;const height=scroller.scrollHeight-scroller.clientHeight;const value=height>0?Math.min(100,Math.max(0,Math.round(scroller.scrollTop/height*100))):100;bar.value=value;bar.textContent=value+' %';percent.textContent=value+' %';reading.style.setProperty('--progress',value+'%');lynx.style.left=value+'%';}
reading.hidden=false;motion();reduced.addEventListener('change',motion);
scroller.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});
window.addEventListener('resize',update);window.addEventListener('load',update);
