const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
},{
  threshold:0.15
});

document.querySelectorAll('.reveal').forEach(el=>{
  observer.observe(el);
});

const glow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e)=>{
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});


document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn=>{
  btn.addEventListener('mousemove', e=>{
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;

    btn.style.transform = `translate(${x*0.1}px, ${y*0.1}px)`;
  });

  btn.addEventListener('mouseleave', ()=>{
    btn.style.transform = `translate(0,0)`;
  });
});