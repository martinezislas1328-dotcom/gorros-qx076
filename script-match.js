let cachePaquetes = [];

/* EFECTO CAMALEON NAVEGADOR */
let isRosa = true;
const topBar = document.getElementById('top-bar');
if(topBar) {
    setInterval(() => {
        if (isRosa) { topBar.style.background = "var(--vino)"; } 
        else { topBar.style.background = "var(--rosa-banner)"; }
        isRosa = !isRosa;
    }, 5000);
}

/* BUSCADOR */
function toggleSearch() {
    const searchContainer = document.getElementById('search-container');
    const resultsBox = document.getElementById('predictive-results');
    const isVisible = searchContainer.style.display === 'flex';
    searchContainer.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible) document.getElementById('search-input').focus();
    else { resultsBox.style.display = 'none'; document.getElementById('search-input').value = ""; }
}

function ejecutarBusquedaPredictiva() {
    const texto = document.getElementById('search-input').value.toLowerCase();
    const resultsBox = document.getElementById('predictive-results');
    if (texto.length < 2) { resultsBox.style.display = 'none'; return; }
    let coincidencias = cachePaquetes.filter(p => p.Nombre.toLowerCase().includes(texto));
    if (coincidencias.length > 0) {
        resultsBox.style.display = 'block';
        resultsBox.innerHTML = coincidencias.map(p => `
            <div class="search-result-item" onclick="abrirModal('${p.id}'); toggleSearch();">
                <img src="${p.imagenGrupal}">
                <div class="search-result-info"><h4>${p.Nombre}</h4><p>Paquete - $${p.precioOferta || p.precioTotal} MXN</p></div>
            </div>
        `).join('');
    } else {
        resultsBox.innerHTML = '<p style="padding:15px; color:gray;">No se encontraron paquetes...</p>';
    }
}

/* CARGAR GALERÍA VIP */
db.ref('GaleriaMatch').on('value', (snapshot) => {
    const contenedorG = document.getElementById('contenedor-galeria');
    if(!contenedorG) return;
    contenedorG.innerHTML = ""; 
    if(!snapshot.exists()) return;
    snapshot.forEach((child) => {
        const foto = child.val();
        contenedorG.innerHTML += `<div class="gallery-item"><img src="${foto.imagen}" alt="QX076 Squad"></div>`;
    });
});

/* CARGAR PRODUCTOS EN LA PÁGINA */
db.ref('PaquetesMatch').on('value', (snapshot) => {
    const contenedor = document.getElementById('contenedor-productos');
    if(!contenedor) return;
    contenedor.innerHTML = ""; 
    cachePaquetes = [];
    
    if(!snapshot.exists()) return;

    snapshot.forEach((child) => {
        const paquete = child.val();
        paquete.id = child.key; 
        cachePaquetes.push(paquete);

        const stockActual = paquete.stock !== undefined ? parseInt(paquete.stock) : 10;
        const esDisponible = stockActual > 0;
        
        const precioMostrado = paquete.precioOferta 
            ? `<span class="old-price-card">MXN $${paquete.precioTotal}</span> <span class="current-price" style="color:red;">MXN $${paquete.precioOferta}</span>` 
            : `<span class="current-price">MXN $${paquete.precioTotal}</span>`;

        const cardHtml = `
            <div class="card reveal ${!esDisponible ? 'producto-agotado' : ''}">
                <div class="img-box" onclick="abrirModal('${paquete.id}')" style="cursor:pointer;" title="Ver detalles">
                    <img src="${paquete.imagenGrupal}">
                    <div class="status-tag">${esDisponible ? 'DISPONIBLE' : 'AGOTADO'}</div>
                    <div class="ver-mas-overlay"><i class="fa-solid fa-magnifying-glass" style="margin-right:8px;"></i> Ver Detalles</div>
                </div>
                <div class="info">
                    <span class="category-label">PAQUETE COMPLETO</span>
                    <h3 onclick="abrirModal('${paquete.id}')" style="cursor:pointer; color:var(--vino);" title="Ver detalles">${paquete.Nombre}</h3>
                    <p style="color:#666; font-size:0.85rem; margin-top:0;">${paquete.descripcion || ''}</p>
                    <div class="price-container">
                        ${precioMostrado}
                    </div>
                    <button onclick="abrirModal('${paquete.id}')" class="btn-pedido ${!esDisponible ? 'btn-agotado' : ''}">
                        ${esDisponible ? 'VER PAQUETE COMPLETO' : 'SIN STOCK'}
                    </button>
                </div>
            </div>
        `;
        contenedor.innerHTML += cardHtml;
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

/* ==============================================
   LÓGICA DEL MODAL (VERSIÓN PREMIUM VIP)
============================================== */
function abrirModal(id) {
    const paquete = cachePaquetes.find(p => p.id === id);
    if(!paquete) return;

    document.getElementById('modal-title').innerText = paquete.Nombre;
    document.getElementById('modal-desc').innerText = paquete.descripcion || 'Sin descripción adicional.';
    
    const precioModal = paquete.precioOferta 
        ? `<span class="modal-price-old">$${paquete.precioTotal}</span> $${paquete.precioOferta} <span>MXN</span>` 
        : `$${paquete.precioTotal} <span>MXN</span>`;
    document.getElementById('modal-price').innerHTML = precioModal;

    const btnContainer = document.getElementById('modal-btn-container');
    const stockActual = paquete.stock !== undefined ? parseInt(paquete.stock) : 10;
    const precioVenta = paquete.precioOferta || paquete.precioTotal;
    const urlWa = `https://wa.me/525512345678?text=Hola,%20me%20interesa%20el%20Paquete%20Match:%20${encodeURIComponent(paquete.Nombre)}%20por%20$${precioVenta}`;

    if(stockActual > 0) {
        btnContainer.innerHTML = `<a href="${urlWa}" target="_blank" style="text-decoration:none;"><button class="btn-wa-modal">LO QUIERO AHORA <i class="fa-brands fa-whatsapp" style="font-size: 1.4rem;"></i></button></a>`;
    } else {
        btnContainer.innerHTML = `<button class="btn-wa-modal btn-agotado-modal"><i class="fa-solid fa-lock"></i> AGOTADO POR AHORA</button>`;
    }

    let imagenesArray = [paquete.imagenGrupal];
    
    if(paquete.fotosExtra && paquete.fotosExtra.length > 0) {
        imagenesArray = imagenesArray.concat(paquete.fotosExtra);
    } else {
        if(paquete.img2) imagenesArray.push(paquete.img2);
        if(paquete.img3) imagenesArray.push(paquete.img3);
        if(paquete.img4) imagenesArray.push(paquete.img4);
    }

    document.getElementById('modal-img-main').src = imagenesArray[0];

    const thumbsContainer = document.getElementById('modal-thumbnails-container');
    thumbsContainer.innerHTML = '';

    if(imagenesArray.length > 1) {
        imagenesArray.forEach((imgUrl, index) => {
            const claseActiva = index === 0 ? 'active' : '';
            thumbsContainer.innerHTML += `<img src="${imgUrl}" class="modal-thumb ${claseActiva}" onclick="cambiarImagenModal('${imgUrl}', this)">`;
        });
    }

    const modal = document.getElementById('producto-modal');
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
    document.body.style.overflow = 'hidden'; 
}

function cambiarImagenModal(url, elementoClickeado) {
    const imgMain = document.getElementById('modal-img-main');
    imgMain.style.opacity = 0;
    setTimeout(() => {
        imgMain.src = url;
        imgMain.style.opacity = 1;
    }, 150);

    document.querySelectorAll('.modal-thumb').forEach(thumb => thumb.classList.remove('active'));
    elementoClickeado.classList.add('active');
}

function cerrarModal(e) {
    if(e.target.id === 'producto-modal') cerrarModalBtn();
}

function cerrarModalBtn() {
    const modal = document.getElementById('producto-modal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; 
    }, 300);
}