export function initReveal(){
  const elements = document.querySelectorAll('.reveal');

  elements.forEach(el=>{
    el.classList.add('show');
  });
}