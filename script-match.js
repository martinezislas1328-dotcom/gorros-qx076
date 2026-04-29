let cachePaquetes = [];

// ==============================================
// --- RASTREADOR DE CLICS (El GPS del mouse)
// ==============================================
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

document.addEventListener('click', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

/* EFECTO CAMALEON NAVEGADOR (CON GLASSMORPHISM INYECTADO) */
let isRosa = true;
const topBar = document.getElementById('top-bar');
if(topBar) {
    setInterval(() => {
        if (isRosa) { topBar.style.background = "rgba(133, 14, 53, 0.85)"; } 
        else { topBar.style.background = "rgba(233, 107, 133, 0.85)"; }
        isRosa = !isRosa;
    }, 5000);
}

// ==============================================
// --- LÓGICA DE LA ANIMACIÓN FLY-TO-CART (INFALIBLE)
// ==============================================
function volarAlCarrito(imagenUrl) {
    if (!imagenUrl) return;

    const countEl = document.getElementById('cart-count');
    if (!countEl) return;
    
    const carritoIcon = countEl.parentElement || countEl; 
    const cartRect = carritoIcon.getBoundingClientRect();

    // Creamos la foto clonada
    const flyingImg = document.createElement('img');
    flyingImg.src = imagenUrl;
    
    // Le damos estilo y la ponemos EXACTAMENTE donde diste el clic
    flyingImg.style.position = 'fixed';
    flyingImg.style.left = `${mouseX - 35}px`; 
    flyingImg.style.top = `${mouseY - 35}px`;
    flyingImg.style.width = '70px';
    flyingImg.style.height = '70px';
    flyingImg.style.borderRadius = '50%';
    flyingImg.style.objectFit = 'cover';
    flyingImg.style.zIndex = '9999999';
    flyingImg.style.pointerEvents = 'none';
    flyingImg.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4)';
    flyingImg.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)'; 

    document.body.appendChild(flyingImg);

    void flyingImg.offsetWidth;

    // Le damos la orden de volar al carrito
    flyingImg.style.left = `${cartRect.left}px`;
    flyingImg.style.top = `${cartRect.top}px`;
    flyingImg.style.width = '15px';
    flyingImg.style.height = '15px';
    flyingImg.style.opacity = '0.2';

    // Limpiamos cuando llega
    setTimeout(() => {
        if (document.body.contains(flyingImg)) {
            flyingImg.remove();
        }
        
        carritoIcon.style.transition = "transform 0.2s ease";
        carritoIcon.style.transform = "scale(1.3)";
        setTimeout(() => {
            carritoIcon.style.transform = "scale(1)";
        }, 200);
        
    }, 800);
}

// ==============================================
// --- LÓGICA DEL CARRITO DE COMPRAS
// ==============================================
let carritoQX = JSON.parse(localStorage.getItem('carritoQX')) || [];

function actualizarContadorCarrito() {
    const countEl = document.getElementById('cart-count');
    if(countEl) {
        const totalItems = carritoQX.reduce((sum, item) => sum + item.cantidad, 0);
        countEl.innerText = totalItems;
        countEl.style.transform = "scale(1.3)";
        setTimeout(() => countEl.style.transform = "scale(1)", 200);
    }
}

function agregarAlCarrito(id, nombre, precio, imagen, tipo, categoria) {
    let itemExistente = carritoQX.find(p => p.id === id);
    if(itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carritoQX.push({ id, nombre, precio, imagen, cantidad: 1, tipo: tipo, categoria: categoria });
    }
    
    localStorage.setItem('carritoQX', JSON.stringify(carritoQX));
    actualizarContadorCarrito();
    
    // AQUÍ ES DONDE SE ACTIVA LA MAGIA AL DAR CLIC
    volarAlCarrito(imagen);
    
    cerrarModalBtn(); 
}

function abrirCarrito() {
    const overlay = document.getElementById('cart-overlay');
    if(overlay) {
        renderizarCarritoUI();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }
}

function cerrarCarrito() {
    const overlay = document.getElementById('cart-overlay');
    if(overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function renderizarCarritoUI() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');
    
    if(carritoQX.length === 0) {
        container.innerHTML = `<div class="cart-empty-msg"><i class="fa-solid fa-basket-shopping" style="font-size:3rem; color:#ccc; margin-bottom:15px; display:block;"></i> Tu carrito está vacío. <br>Agrega productos para continuar.</div>`;
        totalEl.innerText = "$0 MXN";
        return;
    }

    let html = "";
    let total = 0;

    carritoQX.forEach(item => {
        const subtotalItem = item.precio * item.cantidad;
        total += subtotalItem;
        
        html += `
            <div class="cart-item">
                <img src="${item.imagen}" class="cart-item-img" alt="${item.nombre}">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.nombre}</h4>
                    <span class="cart-item-price">$${item.precio} MXN c/u</span>
                    <div class="cart-controls">
                        <button class="btn-qty" onclick="cambiarCantidadCarrito('${item.id}', -1)">-</button>
                        <span class="item-qty">${item.cantidad}</span>
                        <button class="btn-qty" onclick="cambiarCantidadCarrito('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="btn-remove-item" onclick="eliminarDelCarrito('${item.id}')" title="Eliminar"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
    });

    container.innerHTML = html;
    totalEl.innerText = `$${total} MXN`;
}

function cambiarCantidadCarrito(id, delta) {
    let item = carritoQX.find(p => p.id === id);
    if(item) {
        item.cantidad += delta;
        if(item.cantidad <= 0) {
            eliminarDelCarrito(id);
        } else {
            localStorage.setItem('carritoQX', JSON.stringify(carritoQX));
            actualizarContadorCarrito();
            renderizarCarritoUI();
        }
    }
}

function eliminarDelCarrito(id) {
    carritoQX = carritoQX.filter(p => p.id !== id);
    localStorage.setItem('carritoQX', JSON.stringify(carritoQX));
    actualizarContadorCarrito();
    renderizarCarritoUI();
}

// ==============================================
// --- LÓGICA DE COMPRAS (FIREBASE + WA)
// ==============================================

function vaciarCarritoPostCompra() {
    carritoQX = [];
    localStorage.removeItem('carritoQX');
    actualizarContadorCarrito();
    renderizarCarritoUI();
    cerrarCarrito();
}

function procesarCompraWa() {
    if(carritoQX.length === 0) {
        alert("Tu carrito de compras está vacío. Por favor, agrega productos antes de continuar.");
        return;
    }

    const telefono = "2201332906";
    
    let mensaje = "*TICKET DE PEDIDO - GORROS QX076*\n";
    mensaje += "-----------------------------------------------\n";
    mensaje += "Hola, deseo procesar la siguiente compra:\n\n";
    
    let totalPagar = 0;

    carritoQX.forEach((item) => {
        const subtotal = item.precio * item.cantidad;
        totalPagar += subtotal;
        mensaje += `${item.cantidad}x ${item.nombre} ... $${subtotal} MXN\n`;
    });

    mensaje += "-----------------------------------------------\n";
    mensaje += `*TOTAL A PAGAR: $${totalPagar} MXN*\n`;
    mensaje += "-----------------------------------------------\n\n";
    mensaje += "Quedo en espera de las instrucciones para el método de pago y el envío. Gracias.";

    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://wa.me/${telefono}?text=${mensajeCodificado}`;

    // REGISTRO SILENCIOSO EN FIREBASE
    const orderId = 'pedido_' + Date.now();
    db.ref('Pedidos/' + orderId).set({
        fecha: new Date().toLocaleString(),
        estado: 'pendiente',
        total: totalPagar,
        items: carritoQX
    });

    window.open(urlWhatsApp, '_blank');
    vaciarCarritoPostCompra();
}

function comprarDirecto(id, nombre, precio, imagen, tipo, categoria) {
    const telefono = "2201332906";
    
    let msjWa = `*TICKET DE PEDIDO - GORROS QX076*\n`;
    msjWa += `-----------------------------------------------\n`;
    msjWa += `Hola, deseo procesar la siguiente compra directa:\n\n`;
    msjWa += `1x ${nombre} ... $${precio} MXN\n`;
    msjWa += `-----------------------------------------------\n`;
    msjWa += `*TOTAL A PAGAR: $${precio} MXN*\n`;
    msjWa += `-----------------------------------------------\n\n`;
    msjWa += `Quedo en espera de las instrucciones para el método de pago y el envío. Gracias.`;
    
    const urlWa = `https://wa.me/${telefono}?text=${encodeURIComponent(msjWa)}`;

    // REGISTRO SILENCIOSO EN FIREBASE
    const orderId = 'pedido_' + Date.now();
    db.ref('Pedidos/' + orderId).set({
        fecha: new Date().toLocaleString(),
        estado: 'pendiente',
        total: precio,
        items: [{ 
            id: id, 
            nombre: nombre, 
            precio: precio, 
            imagen: imagen, // <- Agregado para que tu panel vea la foto
            cantidad: 1, 
            tipo: tipo || 'individual', 
            categoria: categoria || 'General' 
        }]
    });

    window.open(urlWa, '_blank');
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

/* CARGAR GALERÍA VIP (🚀 OPTIMIZADO) */
db.ref('GaleriaMatch').on('value', (snapshot) => {
    const contenedorG = document.getElementById('contenedor-galeria');
    if(!contenedorG) return;
    
    if(!snapshot.exists()) {
        contenedorG.innerHTML = ""; 
        return;
    }

    let htmlFinal = ""; // 🚀 BUFFER: Guardamos todo aquí
    snapshot.forEach((child) => {
        const foto = child.val();
        htmlFinal += `<div class="gallery-item cursor-hover"><img src="${foto.imagen}" alt="QX076 Squad" loading="lazy" decoding="async"></div>`;
    });
    
    contenedorG.innerHTML = htmlFinal; // 🚀 INYECCIÓN ÚNICA
});

/* CARGAR PRODUCTOS EN LA PÁGINA (🚀 OPTIMIZADO) */
db.ref('PaquetesMatch').on('value', (snapshot) => {
    const contenedor = document.getElementById('contenedor-productos');
    if(!contenedor) return;
    
    cachePaquetes = [];
    if(!snapshot.exists()) {
        contenedor.innerHTML = ""; 
        return;
    }

    let htmlFinal = ""; // 🚀 BUFFER: Guardamos todas las tarjetas aquí

    snapshot.forEach((child) => {
        const paquete = child.val();
        paquete.id = child.key; 
        cachePaquetes.push(paquete);

        const stockActual = paquete.stock !== undefined ? parseInt(paquete.stock) : 10;
        const esDisponible = stockActual > 0;
        
        const precioMostrado = paquete.precioOferta 
            ? `<span class="old-price-card">MXN $${paquete.precioTotal}</span> <span class="current-price" style="color:red;">MXN $${paquete.precioOferta}</span>` 
            : `<span class="current-price">MXN $${paquete.precioTotal}</span>`;

        const precioReal = paquete.precioOferta || paquete.precioTotal;
        
        let botonesHtml = '';

        if(esDisponible) {
            botonesHtml = `
                <div class="botones-card-container">
                    <button class="btn-pedido magnetic" onclick="comprarDirecto('${paquete.id}', '${paquete.Nombre}', ${precioReal}, '${paquete.imagenGrupal}', 'match', 'PaquetesMatch')">COMPRAR AHORA</button>
                    <button class="btn-pedido btn-add-carrito magnetic" onclick="agregarAlCarrito('${paquete.id}', '${paquete.Nombre}', ${precioReal}, '${paquete.imagenGrupal}', 'match', 'PaquetesMatch')">AGREGAR AL CARRITO</button>
                </div>
            `;
        } else {
            botonesHtml = `
                <div style="width: 100%; min-height: 105px; display: flex; align-items: flex-end; margin-top: auto;">
                    <div class="botones-card-container">
                        <button class="btn-pedido btn-agotado" disabled>SIN STOCK</button>
                    </div>
                </div>
            `;
        }
        
        htmlFinal += `
            <div class="card reveal ${!esDisponible ? 'producto-agotado' : ''}">
                <div class="img-box" onclick="${esDisponible ? `abrirModal('${paquete.id}')` : ''}" style="cursor:pointer;" title="Ver detalles">
                    <img src="${paquete.imagenGrupal}" loading="lazy" decoding="async">
                    <div class="status-tag">${esDisponible ? 'DISPONIBLE' : 'AGOTADO'}</div>
                    <div class="ver-mas-overlay"><i class="fa-solid fa-magnifying-glass" style="margin-right:8px;"></i> Ver Detalles</div>
                </div>
                <div class="info">
                    <span class="category-label">SQUAD MATCH</span>
                    <h3 onclick="${esDisponible ? `abrirModal('${paquete.id}')` : ''}" style="cursor:pointer; color:var(--vino);" title="Ver detalles">${paquete.Nombre}</h3>
                    <div class="price-container">${precioMostrado}</div>
                    ${botonesHtml}
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = htmlFinal; // 🚀 INYECCIÓN ÚNICA

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    if(typeof vincularMagnetismo === 'function') vincularMagnetismo();
});

/* ABRIR MODAL CON BOTONES DOBLES (🚀 OPTIMIZADO) */
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

    if(stockActual > 0) {
        btnContainer.innerHTML = `
            <div class="botones-card-container">
                <button class="btn-wa-modal cursor-hover" style="width: 100%;" onclick="comprarDirecto('${id}', '${paquete.Nombre}', ${precioVenta}, '${paquete.imagenGrupal}', 'match', 'PaquetesMatch')">COMPRAR AHORA</button>
                <button class="btn-wa-modal btn-add-carrito cursor-hover" style="width: 100%;" onclick="agregarAlCarrito('${id}', '${paquete.Nombre}', ${precioVenta}, '${paquete.imagenGrupal}', 'match', 'PaquetesMatch')">AGREGAR AL CARRITO</button>
            </div>
        `;
    } else {
        btnContainer.innerHTML = `<button class="btn-wa-modal btn-agotado-modal" disabled>AGOTADO POR AHORA</button>`;
    }

    let imagenesArray = [paquete.imagenGrupal];
    if(paquete.fotosExtra && paquete.fotosExtra.length > 0) {
        imagenesArray = imagenesArray.concat(paquete.fotosExtra);
    } else {
        if(paquete.img1) imagenesArray.push(paquete.img1);
        if(paquete.img2) imagenesArray.push(paquete.img2);
        if(paquete.img3) imagenesArray.push(paquete.img3);
        if(paquete.img4) imagenesArray.push(paquete.img4);
    }

    const imgMain = document.getElementById('modal-img-main');
    imgMain.decoding = "async"; // 🚀 Evita trabas de CPU
    imgMain.loading = "lazy";
    imgMain.src = imagenesArray[0];

    const thumbsContainer = document.getElementById('modal-thumbnails-container');
    
    // 🚀 BÚFER DE MINIATURAS
    let thumbsHtml = "";
    if(imagenesArray.length > 1) {
        imagenesArray.forEach((imgUrl, index) => {
            const claseActiva = index === 0 ? 'active' : '';
            thumbsHtml += `<img src="${imgUrl}" class="modal-thumb cursor-hover ${claseActiva}" decoding="async" loading="lazy" onclick="cambiarImagenModal('${imgUrl}', this)">`;
        });
    }
    thumbsContainer.innerHTML = thumbsHtml;

    const modal = document.getElementById('producto-modal');
    modal.style.willChange = "transform, opacity"; // 🚀 GPU acelerada
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
    document.body.style.overflow = 'hidden'; 
}

function cambiarImagenModal(url, elementoClickeado) {
    const imgMain = document.getElementById('modal-img-main');
    imgMain.style.opacity = 0;
    imgMain.decoding = "async"; // 🚀 Carga suave entre fotos
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

// Inicializar el carrito al abrir la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorCarrito();
    iniciarEfectosPremium(); // INYECCIÓN: Arrancar efectos
});

// ========================================================
// --- INYECCIÓN FINAL: LÓGICA DE CURSOR PREMIUM Y MAGNETISMO ---
// ========================================================
function iniciarEfectosPremium() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if(window.matchMedia("(pointer: fine)").matches && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX; const posY = e.clientY;
            cursorDot.style.left = `${posX}px`; cursorDot.style.top = `${posY}px`;
            cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
        });

        document.body.addEventListener('mouseover', (e) => {
            if(e.target.closest('a, button, input, .card, .img-box, .icon-interactivo, i, .btn-filtro, .cursor-hover, .gallery-item, .search-result-item')) {
                cursorOutline.classList.add('hover');
            }
        });
        document.body.addEventListener('mouseout', (e) => {
            if(e.target.closest('a, button, input, .card, .img-box, .icon-interactivo, i, .btn-filtro, .cursor-hover, .gallery-item, .search-result-item')) {
                cursorOutline.classList.remove('hover');
            }
        });
    }
    vincularMagnetismo();
}

function vincularMagnetismo() {
    if(!window.matchMedia("(pointer: fine)").matches) return;
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(btn => {
        if(btn.dataset.magnetized) return; 
        btn.dataset.magnetized = "true";
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });
}
