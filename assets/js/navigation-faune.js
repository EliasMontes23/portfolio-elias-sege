'use strict';
document.querySelectorAll('[data-top]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelector('.page-scroll').scrollTo({top:0,behavior:'instant'});document.querySelector('h1')?.setAttribute('tabindex','-1');document.querySelector('h1')?.focus({preventScroll:true});}));
const dropdown=document.querySelector('.competence-menu');
document.addEventListener('click',e=>{if(dropdown&&!dropdown.contains(e.target))dropdown.open=false;});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dropdown?.open){dropdown.open=false;dropdown.querySelector('summary').focus();}});
