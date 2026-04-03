export function initBanner(){
  const banner=document.querySelector('.tech-banner');
  const track=document.querySelector('.tech-track');
  if(!banner || !track) return;

  function setSpeed(v){track.style.animationDuration=v+'s'}

  banner.addEventListener('mouseenter',()=>setSpeed(60));
  banner.addEventListener('mouseleave',()=>setSpeed(30));

  window.addEventListener('scroll',()=>{
    setSpeed(20);
    clearTimeout(window.t);
    window.t=setTimeout(()=>setSpeed(30),200);
  });
}
