
(function(){
  function smoothScrollTo(el){
    if(!el) return;
    el.scrollIntoView({behavior:'smooth', block:'center'});
    el.style.transition = 'background 0.6s';
    const orig = el.style.backgroundColor;
    el.style.backgroundColor = '#ffff99';
    setTimeout(()=>{el.style.backgroundColor=orig;}, 1200);
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const tshirtCard = document.getElementById('k2')?.closest('.stat-card');
    const slotCard   = document.getElementById('k3')?.closest('.stat-card');
    const tshirtDetails = document.getElementById('tshirtsDetails');
    const slotDetails   = document.getElementById('slotsDetails');
    if(tshirtCard && tshirtDetails){
      tshirtCard.style.cursor='pointer';
      tshirtCard.onclick=()=>{
        tshirtDetails.classList.remove('hidden');
        smoothScrollTo(tshirtDetails);
      };
    }
    if(slotCard && slotDetails){
      slotCard.style.cursor='pointer';
      slotCard.onclick=()=>{
        slotDetails.classList.remove('hidden');
        smoothScrollTo(slotDetails);
      };
    }
    // Hide old links if they exist
    document.getElementById('showTshirts')?.classList.add('hidden');
    document.getElementById('showSlots')?.classList.add('hidden');
  });
})();