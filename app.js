
async function load(){
  const res = await fetch('data.json');
  let data = await res.json();
  data.sort((a,b)=>a.title.localeCompare(b.title));

  const grid = document.getElementById('grid');
  const tpl = document.getElementById('card-template');

  function render(list){
    grid.innerHTML='';
    list.forEach(d=>{
      const node = tpl.content.cloneNode(true);
      node.querySelector('.thumb').src = d.image;
      node.querySelector('.title').textContent = d.title;
      node.querySelector('.desc').textContent = d.description || '—';
      const priceEl = node.querySelector('.price');
      if(priceEl) priceEl.textContent = d.price_nomad || '—';
      node.querySelector('.cta').href = d.link || '#'; // MISMA pestaña
      grid.appendChild(node);
    });

    // Modal de imágenes
    document.querySelectorAll('.thumb.clickable').forEach(img=>{
      img.onclick = function(){
        modal.style.display = 'block';
        modalImg.src = this.src;
      }
    });
  }

  function applyFilters(){
    const q = document.getElementById('search').value.toLowerCase();
    const order = document.getElementById('order').value;
    const orderPriceEl = document.getElementById('orderPrice');
    const orderPrice = orderPriceEl ? orderPriceEl.value : '';

    let filtered = data.filter(d => (!q || d.title.toLowerCase().includes(q) || (d.description||'').toLowerCase().includes(q)));

    if(orderPrice==='asc') filtered.sort((a,b)=> (a.price_val||0)-(b.price_val||0));
    else if(orderPrice==='desc') filtered.sort((a,b)=> (b.price_val||0)-(a.price_val||0));
    else filtered.sort((a,b)=> order==='az'? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));

    render(filtered);
  }

  document.getElementById('apply').addEventListener('click', applyFilters);
  document.getElementById('clear').addEventListener('click', ()=>{
    document.getElementById('search').value='';
    document.getElementById('order').value='az';
    const orderPriceEl = document.getElementById('orderPrice');
    if(orderPriceEl) orderPriceEl.value='';
    render(data);
  });

  render(data);
}

let modal, modalImg;
document.addEventListener('DOMContentLoaded', ()=>{
  modal = document.getElementById('imgModal');
  modalImg = document.getElementById('modalImage');
  document.querySelector('.modal .close').onclick = ()=> modal.style.display='none';
  window.onclick = (e)=>{ if(e.target==modal) modal.style.display='none'; };
  load();
});
