const firebaseConfig = {
    apiKey: "AIzaSyDjJGxz3rqwKRY1mQsakSqJPGVfF_rYdp0",
    authDomain: "gorrosqx.firebaseapp.com",
    databaseURL: "https://gorrosqx-default-rtdb.firebaseio.com",
    projectId: "gorrosqx",
    storageBucket: "gorrosqx.firebasestorage.app",
    messagingSenderId: "675780481076",
    appId: "1:675780481076:web:d048283127414361583a61"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let cacheProductos = null;

let filtroCategoria = 'Todas'; 
let filtroSubcategoria = 'Todas'; 
let busquedaTexto = "";

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
    // IMPORTANTE: Si la categoría no viene, le asignamos 'General' o buscamos en el cache
    let catFinal = categoria;
    if(!catFinal && typeof cacheProductos !== 'undefined' && cacheProductos) {
        // Buscamos el producto en el cache para sacar su categoría si no se pasó por parámetro
        Object.keys(cacheProductos).forEach(cat => {
            if(cacheProductos[cat][id]) catFinal = cat;
        });
    }

    let itemExistente = carritoQX.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carritoQX.push({
            id: id,
            nombre: nombre,
            precio: precio,
            imagen: imagen,
            tipo: tipo || 'individual',
            categoria: catFinal || 'General',
            cantidad: 1
        });
    }

    localStorage.setItem('carritoQX', JSON.stringify(carritoQX));
    actualizarContadorCarrito();
    
    if (typeof renderCarrito === 'function') {
        renderCarrito();
    } else if (typeof renderizarCarritoUI === 'function') {
        renderizarCarritoUI();
    }

    // 🚀 AQUÍ LANZAMOS LA ANIMACIÓN MÁGICA
    volarAlCarrito(imagen);
}

// ==============================================
// --- RASTREADOR DE CLICS (El GPS del mouse)
// ==============================================
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Cada que des un clic en cualquier lado de la página, guardamos las coordenadas
document.addEventListener('click', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

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
    flyingImg.style.left = `${mouseX - 35}px`; // Centramos la foto en la punta del mouse
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
                        <button class="btn-qty cursor-hover" onclick="cambiarCantidadCarrito('${item.id}', -1)">-</button>
                        <span class="item-qty">${item.cantidad}</span>
                        <button class="btn-qty cursor-hover" onclick="cambiarCantidadCarrito('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="btn-remove-item cursor-hover" onclick="eliminarDelCarrito('${item.id}')" title="Eliminar"><i class="fa-solid fa-trash-can"></i></button>
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

    // NÚMERO ACTUALIZADO
    const telefono = "525519178328";
    
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

// --- BUSCADOR ---
function toggleSearch() {
    const searchContainer = document.getElementById('search-container');
    const resultsBox = document.getElementById('predictive-results');
    const isVisible = searchContainer.style.display === 'flex';
    searchContainer.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible) document.getElementById('search-input').focus();
    else { resultsBox.style.display = 'none'; document.getElementById('search-input').value = ""; }
}

let timeoutBusqueda; // Controla la velocidad de escritura

// 🎲 FUNCIÓN EXTRA: Saca gorritos al azar de tu base de datos
function obtenerRecomendacionesAleatorias(cantidad) {
    let todosLosProductos = [];
    Object.keys(cacheProductos).forEach(cat => {
        Object.keys(cacheProductos[cat]).forEach(idProd => {
            todosLosProductos.push({ ...cacheProductos[cat][idProd], categoria: cat, id: idProd });
        });
    });
    
    // Revolvemos los productos como baraja (Fisher-Yates shuffle)
    for (let i = todosLosProductos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [todosLosProductos[i], todosLosProductos[j]] = [todosLosProductos[j], todosLosProductos[i]];
    }
    
    // Devolvemos solo la cantidad que pedimos (ej. 3)
    return todosLosProductos.slice(0, cantidad);
}

// 🚀 BUSCADOR PREDICTIVO TURBO + RECOMENDACIONES
function ejecutarBusquedaPredictiva() {
    clearTimeout(timeoutBusqueda);
    
    // Le bajamos a 150ms para que se sienta casi instantáneo sin trabar el cel
    timeoutBusqueda = setTimeout(() => {
        const inputBuscador = document.getElementById('search-input');
        const texto = inputBuscador.value.toLowerCase().trim();
        const resultsBox = document.getElementById('predictive-results');

        // 1️⃣ SI ESTÁ VACÍO: Mostramos recomendaciones
        if (texto.length === 0) {
            const recomendaciones = obtenerRecomendacionesAleatorias(3); 
            if(recomendaciones.length > 0) {
                resultsBox.style.display = 'block';
                resultsBox.innerHTML = `
                    <div style="padding: 10px 15px; font-size: 0.85rem; color: #888; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eee;">
                         Te podría interesar...
                    </div>
                    ${recomendaciones.map(p => `
                        <div class="search-result-item" onclick="abrirModal('${p.id}'); document.getElementById('predictive-results').style.display='none'; document.getElementById('search-input').value='';" style="cursor:pointer; display: flex; align-items: center; padding: 10px 15px; transition: 0.2s;">
                            <img src="${p.imagen}" loading="lazy" style="width: 50px; height: 50px; object-fit: cover; border-radius: 10px; margin-right: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <div class="search-result-info">
                                <h4 style="margin: 0; font-size: 1rem; color: var(--vino); font-family: 'Outfit', sans-serif;">${p.Nombre}</h4>
                                <p style="margin: 0; font-size: 0.85rem; color: gray;">${p.categoria.replace(/_/g, ' ')}</p>
                            </div>
                        </div>
                    `).join('')}
                `;
            } else {
                resultsBox.style.display = 'none';
            }
            return;
        }

        // 2️⃣ SI YA ESCRIBIÓ ALGO (desde 1 sola letra)
        let coincidencias = [];
        Object.keys(cacheProductos).forEach(cat => {
            Object.keys(cacheProductos[cat]).forEach(idProd => {
                const prod = cacheProductos[cat][idProd];
                const nombreProd = prod.Nombre.toLowerCase();
                
                // Si el nombre incluye lo que escribió, lo guardamos
                if (nombreProd.includes(texto)) {
                    coincidencias.push({ ...prod, categoria: cat, id: idProd });
                }
            });
        });

        // 🧠 INTELIGENCIA DE BÚSQUEDA: Los que EMPIEZAN con la letra van primero
        coincidencias.sort((a, b) => {
            const aEmpieza = a.Nombre.toLowerCase().startsWith(texto) ? -1 : 1;
            const bEmpieza = b.Nombre.toLowerCase().startsWith(texto) ? -1 : 1;
            return aEmpieza - bEmpieza;
        });

        // Mostramos máximo 5 resultados para no hacer una lista kilométrica
        coincidencias = coincidencias.slice(0, 5);

        if (coincidencias.length > 0) {
            resultsBox.style.display = 'block';
            resultsBox.innerHTML = coincidencias.map(p => {
                const precioMostrar = p.precioOferta || p.precio;
                return `
                <div class="search-result-item" onclick="abrirModal('${p.id}'); document.getElementById('predictive-results').style.display='none';" style="cursor:pointer; display: flex; align-items: center; padding: 10px 15px; transition: 0.2s; border-bottom: 1px solid #eee;">
                    <img src="${p.imagen}" loading="lazy" style="width: 50px; height: 50px; object-fit: cover; border-radius: 10px; margin-right: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <div class="search-result-info">
                        <h4 style="margin: 0; font-size: 1rem; color: var(--vino); font-family: 'Outfit', sans-serif;">${p.Nombre}</h4>
                        <p style="margin: 0; font-size: 0.85rem; color: gray;">$${precioMostrar} MXN</p>
                    </div>
                </div>
            `}).join('');
        } else {
            // Si no hay nada, mostramos mensaje amigable
            resultsBox.style.display = 'block';
            resultsBox.innerHTML = '<div style="padding: 20px; color: gray; text-align: center; font-family: \'Outfit\', sans-serif;">No encontramos gorros con ese nombre <br><span style="font-size: 0.8rem;">Intenta buscar por color o diseño</span></div>';
        }
    }, 150); // Tiempo de reacción súper rápido
}

// 🎧 ESCUCHADOR DE EVENTOS: Que se active con solo darle clic al buscador
document.addEventListener('DOMContentLoaded', () => {
    const inputBuscador = document.getElementById('search-input');
    if (inputBuscador) {
        // Cuando le da clic (hace focus), mostramos las recomendaciones
        inputBuscador.addEventListener('focus', ejecutarBusquedaPredictiva);
        
        // Si da clic fuera del buscador, escondemos la cajita
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.search-container') && !event.target.closest('#predictive-results')) {
                document.getElementById('predictive-results').style.display = 'none';
            }
        });
    }
});

// --- SLIDER HERO Y NAVBAR (GLASSMORPHISM) ---
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const heroTitle = document.getElementById('hero-title');
const topBar = document.getElementById('top-bar');

function moveSlider() {
    if (!slides.length) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
    
    // Cambiar color de la barra usando RGBA para que el glassmorphism se mantenga
    if (currentSlide === 1) { 
        heroTitle.style.color = "#ffffff"; 
        topBar.style.background = "rgba(133, 14, 53, 0.85)"; // Vino semi-transparente
    } else { 
        heroTitle.style.color = "#ffffff"; 
        topBar.style.background = "rgba(233, 107, 133, 0.85)"; // Rosa semi-transparente
    }
}
setInterval(moveSlider, 5000);

const iniciarObserver = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

function aplicarFiltro(categoria, subcategoria) {
    filtroCategoria = categoria;
    filtroSubcategoria = subcategoria;

    document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('active-filter'));
    const btnActivo = document.querySelector(`.btn-filtro[data-cat="${categoria}"]`);
    if(btnActivo) btnActivo.classList.add('active-filter');

    renderizarContenido();
}

function renderizarFiltrosBarra() {
    const filterBar = document.getElementById('dynamic-filter-bar');
    if (!filterBar || !cacheProductos) return;

    const isTodasActive = filtroCategoria === 'Todas' ? 'active-filter' : '';
    let htmlFiltros = `<button class="btn-filtro ${isTodasActive}" data-cat="Todas" onclick="aplicarFiltro('Todas', 'Todas')">Todas las Colecciones</button>`;

    Object.keys(cacheProductos).forEach(cat => {
        const catName = cat.replace(/_/g, ' '); 
        const isActive = filtroCategoria === cat ? 'active-filter' : '';

        const subcats = new Set();
        Object.values(cacheProductos[cat]).forEach(p => {
            if(p.subcategoria && p.subcategoria.trim() !== "" && p.subcategoria.toLowerCase() !== "todos" && p.subcategoria.toLowerCase() !== "ninguna / otros") {
                subcats.add(p.subcategoria.trim());
            }
        });

        if (subcats.size > 0) {
            let htmlDropdown = `<a href="#" onclick="aplicarFiltro('${cat}', 'Todas'); return false;" style="border-bottom: 2px solid #f0f0f0; margin-bottom: 5px; color: var(--vino);"><strong>Ver toda la colección</strong></a>`;
            
            Array.from(subcats).forEach(sub => {
                htmlDropdown += `<a href="#" onclick="aplicarFiltro('${cat}', '${sub}'); return false;">${sub}</a>`;
            });

            htmlFiltros += `
            <div class="menu-item-dropdown">
                <button class="btn-filtro ${isActive}" data-cat="${cat}" onclick="aplicarFiltro('${cat}', 'Todas')">
                    ${catName} <i class="fa-solid fa-chevron-down" style="font-size:0.7rem;"></i>
                </button>
                <div class="submenu">
                    ${htmlDropdown}
                </div>
            </div>`;
        } else {
            htmlFiltros += `<button class="btn-filtro ${isActive}" data-cat="${cat}" onclick="aplicarFiltro('${cat}', 'Todas')">${catName}</button>`;
        }
    });

    filterBar.innerHTML = htmlFiltros;
}

function renderizarContenido() {
    if (!cacheProductos) return;
    const contenedor = document.getElementById('contenedor-productos');
    
    // 🚀 BÚFER MÁGICO: Guardamos todo aquí y lo inyectamos al final (Adiós Lag)
    let htmlFinal = "";

    Object.keys(cacheProductos).forEach((idCat) => {
        if (filtroCategoria !== 'Todas' && idCat !== filtroCategoria) return;

        let htmlDeEstaSeccion = "";
        let tieneItems = false;

        Object.keys(cacheProductos[idCat]).forEach((idProd) => {
            const d = cacheProductos[idCat][idProd];
            const subCatDelProducto = d.subcategoria ? d.subcategoria.toLowerCase().trim() : "todas";
            const filtroSubLower = filtroSubcategoria.toLowerCase().trim();
            
            const coincideSubcategoria = (filtroSubLower === 'todas' || subCatDelProducto === filtroSubLower);
            const coincideBusqueda = d.Nombre.toLowerCase().includes(busquedaTexto);

            if (coincideSubcategoria && coincideBusqueda) {
                tieneItems = true;
                const stockActual = d.stock !== undefined ? parseInt(d.stock) : 10;
                const esDisponible = stockActual > 0;
                const precioVenta = d.precioOferta || d.precio;
                
                let htmlPrecio = d.precioOferta && d.precioOferta.toString().trim() !== "" 
                    ? `<span class="old-price-card">MXN $${d.precio}</span><span class="current-price" style="color: red;">MXN $${d.precioOferta}</span>` 
                    : `<span class="current-price">MXN $${d.precio}</span>`;
                
                let botonesHtml = '';

                if(esDisponible) {
                    botonesHtml = `
                        <div class="botones-card-container">
                            <button class="btn-pedido cursor-hover" onclick="comprarDirecto('${idProd}', '${d.Nombre}', ${precioVenta}, '${d.imagen}', 'individual', '${idCat}')">COMPRAR AHORA</button>
                            <button class="btn-pedido btn-add-carrito cursor-hover" onclick="agregarAlCarrito('${idProd}', '${d.Nombre}', ${precioVenta}, '${d.imagen}', 'individual', '${idCat}')">AGREGAR AL CARRITO</button>
                        </div>
                    `;
                } else {
                    botonesHtml = `
                        <div class="botones-card-container" style="width: 100%; display: flex;">
                            <button class="btn-pedido btn-agotado" disabled style="width: 100%; height: 95px; padding: 12px 0; font-size: 1rem; font-weight: bold; border: none; border-radius: 30px; background: #e2e8f0; color: #94a3b8; display: flex; justify-content: center; align-items: center;">
                                SIN STOCK
                            </button>
                        </div>
                    `;
                }
                
                // 🚀 LAZY LOADING: loading="lazy" decoding="async" hace que las imágenes carguen suave
                htmlDeEstaSeccion += `
                    <div class="card reveal ${!esDisponible ? 'producto-agotado' : ''}">
                        <div class="img-box cursor-hover" onclick="${esDisponible ? `abrirModal('${idProd}')` : ''}">
                            <img src="${d.imagen}" alt="${d.Nombre}" loading="lazy" decoding="async">
                            <div class="status-tag">${esDisponible ? 'DISPONIBLE' : 'AGOTADO'}</div>
                            <div class="ver-mas-overlay"><i class="fa-solid fa-magnifying-glass" style="margin-right:8px;"></i> Ver Detalles</div>
                        </div>
                        <div class="info">
                            <span class="category-label">${idCat.replace(/_/g, ' ')}</span>
                            <h3 class="cursor-hover" onclick="${esDisponible ? `abrirModal('${idProd}')` : ''}">${d.Nombre}</h3>
                            <div class="price-container">${htmlPrecio}</div>
                            ${botonesHtml}
                        </div>
                    </div>
                `;
            }
        });

        if (tieneItems) {
            htmlFinal += `
                <div id="cat-${idCat}" class="reveal" style="grid-column: 1/-1; margin-top: 10px; margin-bottom: -15px;">
                    <h2 style="font-family:'Playfair Display'; color:var(--vino); border-bottom:3px solid var(--rosa-banner); display:inline-block; padding-bottom:5px;">
                        ${filtroSubcategoria !== 'Todas' ? filtroSubcategoria : idCat.replace(/_/g, ' ')}
                    </h2>
                </div>
            ` + htmlDeEstaSeccion;
        }
    });
    
    // 🚀 UNA SOLA INYECCIÓN AL DOM: Carga instantánea
    contenedor.innerHTML = htmlFinal;
    
    iniciarObserver();
    vincularCursorDinamico();
}

function abrirModal(id) {
    let producto = null;
    let categoriaProd = '';
    
    Object.keys(cacheProductos).forEach(cat => {
        if(cacheProductos[cat][id]) {
            producto = cacheProductos[cat][id];
            categoriaProd = cat;
        }
    });

    if(!producto) return;

    document.getElementById('modal-title').innerText = producto.Nombre;
    document.getElementById('modal-tag-categoria').innerText = categoriaProd.replace(/_/g, ' ').toUpperCase();
    document.getElementById('modal-desc').innerText = producto.descripcion || 'Pieza exclusiva de nuestra colección, hecha a mano con cuidado y precisión. Diseñada para brindar comodidad y estilo en su área de trabajo.';
    
    const precioModal = producto.precioOferta 
        ? `<span class="modal-price-old">$${producto.precio}</span> $${producto.precioOferta} <span>MXN</span>` 
        : `$${producto.precio} <span>MXN</span>`;
    document.getElementById('modal-price').innerHTML = precioModal;

    const btnContainer = document.getElementById('modal-btn-container');
    const stockActual = producto.stock !== undefined ? parseInt(producto.stock) : 10;
    const precioVenta = producto.precioOferta || producto.precio;

    if(stockActual > 0) {
        btnContainer.innerHTML = `
            <div class="botones-card-container">
                <button class="btn-wa-modal cursor-hover" style="width: 100%;" onclick="comprarDirecto('${id}', '${producto.Nombre}', ${precioVenta}, '${producto.imagen}', 'individual', '${categoriaProd}')">COMPRAR AHORA</button>
                <button class="btn-wa-modal btn-add-carrito cursor-hover" style="width: 100%;" onclick="agregarAlCarrito('${id}', '${producto.Nombre}', ${precioVenta}, '${producto.imagen}', 'individual', '${categoriaProd}')">AGREGAR AL CARRITO</button>
            </div>
        `;
    } else {
        btnContainer.innerHTML = `<button class="btn-wa-modal btn-agotado-modal" disabled>AGOTADO POR AHORA</button>`;
    }

    let imagenesArray = [producto.imagen];
    if(producto.fotosExtra && producto.fotosExtra.length > 0) {
        imagenesArray = imagenesArray.concat(producto.fotosExtra);
    }

    // 🚀 OPTIMIZACIÓN: Imagen Principal
    const imgMain = document.getElementById('modal-img-main');
    imgMain.decoding = "async"; // Evita que se congele la pantalla al decodificar la foto
    imgMain.loading = "lazy";
    imgMain.src = imagenesArray[0];

    const thumbsContainer = document.getElementById('modal-thumbnails-container');
    thumbsContainer.innerHTML = '';

    if(imagenesArray.length > 1) {
        imagenesArray.forEach((imgUrl, index) => {
            const claseActiva = index === 0 ? 'active' : '';
            // 🚀 OPTIMIZACIÓN: Miniaturas
            thumbsContainer.innerHTML += `<img src="${imgUrl}" class="modal-thumb cursor-hover ${claseActiva}" decoding="async" loading="lazy" onclick="cambiarImagenModal('${imgUrl}', this)">`;
        });
    }

    const modal = document.getElementById('producto-modal');
    
    // 🚀 OPTIMIZACIÓN: Aceleración por hardware para que la animación sea fluida
    modal.style.willChange = "transform, opacity"; 
    
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

// --- LÓGICA DEL SLIDER "PERRÍSIMO" ---
const beneficios = [
    // Nota: El botón de WhatsApp ahora incluye la clase 'magnetic' y el número correcto
    { tag: "TU ESTILO", titulo: "Diseños 100% a tu medida", desc: "¿De tu artista favorito, para parejas o un logo especial? Cuéntanos tu idea, nosotros le ponemos la magia y creamos un diseño único que vas a amar.", tipo: "image", src: "personalizado.png", boton: `<a href="https://wa.me/525519178328?text=Hola!%20Me%20gustaría%20cotizar%20un%20diseño%20personalizado" target="_blank" class="btn-whatsapp-slider magnetic"><i class="fab fa-whatsapp"></i> ¡Cotiza tu idea aquí!</a>` },
    
    { tag: "ENVÍOS", titulo: "¡De nuestra tienda a tu hospital!", desc: "Envíos rápidos y seguros a todo México para que nunca te falte estilo en tu turno.", tipo: "video", src: "video-envios.mp4" },
    
    { tag: "REGALOS", titulo: "El ramo que todo médico desea", desc: "Regala algo único: combina tus diseños favoritos y crea un detalle inolvidable con la magia de QX076.", tipo: "video", src: "ram.mp4", boton: `<a href="crea-tu-ramo.html" class="magnetic" style="display: inline-block; background: var(--rosa-banner); color: white; padding: 12px 25px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 1rem; margin-top: 15px; box-shadow: 0 5px 15px rgba(94, 10, 26, 0.93); transition: 0.3s;"> ¡Arma tu ramo aquí!</a>` },
    
    { tag: "PRÓXIMAMENTE", titulo: "Tu nuevo uniforme favorito", desc: "Los uniformes quirúrgicos a tu medida que estabas pidiendo ya casi están aquí. Prepárate para hacer match con tus gorros.", tipo: "image", src: "ban.png", colorTag: "var(--vino)" }
];

let beneIndex = 0;
let timerIdentidad; 

function updateIdentidad() {
    const imgEl = document.getElementById('identidad-img');
    const vidEl = document.getElementById('identidad-video');
    const tag = document.getElementById('identidad-tag');
    const tit = document.getElementById('identidad-titulo');
    const desc = document.getElementById('identidad-desc');
    const btnContainer = document.getElementById('identidad-btn-container');
    const dots = document.querySelectorAll('.dot');
    const animElements = document.querySelectorAll('.content-anim');
    
    if (!imgEl || !vidEl || !tag || !tit || !desc) return; 

    const currentItem = beneficios[beneIndex];
    clearTimeout(timerIdentidad);
    vidEl.onended = null; 

    imgEl.style.opacity = "0"; vidEl.style.opacity = "0";
    imgEl.classList.remove('show'); vidEl.classList.remove('show');
    animElements.forEach(el => el.classList.remove('show'));
    
    setTimeout(() => {
        tag.innerText = currentItem.tag; 
        tit.innerText = currentItem.titulo; 
        desc.innerText = currentItem.desc;
        
        if(currentItem.colorTag) {
            tag.style.borderColor = currentItem.colorTag;
            tag.style.color = currentItem.colorTag;
        } else {
            tag.style.borderColor = "var(--rosa-banner)";
            tag.style.color = "var(--vino)";
        }

        if(btnContainer) {
            if(currentItem.boton) {
                btnContainer.innerHTML = currentItem.boton;
                btnContainer.style.display = "block";
                vincularMagnetismo(); // Reactivamos el imán para el nuevo botón inyectado
            } else {
                btnContainer.innerHTML = "";
                btnContainer.style.display = "none";
            }
        }

        if (currentItem.tipo === "video") {
            vidEl.src = currentItem.src; 
            vidEl.style.opacity = "1"; 
            vidEl.classList.add('show');
            vidEl.loop = false; 
            let playPromise = vidEl.play();
            if (playPromise !== undefined) playPromise.catch(e => timerIdentidad = setTimeout(nextIdentidad, 6000));
            vidEl.onended = () => nextIdentidad();
        } else {
            imgEl.src = currentItem.src; 
            imgEl.style.opacity = "1"; 
            imgEl.classList.add('show');
            vidEl.pause();
            timerIdentidad = setTimeout(nextIdentidad, 6000);
        }

        animElements.forEach((el, index) => { setTimeout(() => el.classList.add('show'), index * 120); });

        dots.forEach((dot, i) => {
            if (i < beneficios.length) {
                dot.style.display = "block";
                dot.classList.toggle('active', i === beneIndex);
            } else {
                dot.style.display = "none";
            }
        });
    }, 400);
}

function nextIdentidad() { beneIndex = (beneIndex + 1) % beneficios.length; updateIdentidad(); }
function prevIdentidad() { beneIndex = (beneIndex - 1 + beneficios.length) % beneficios.length; updateIdentidad(); }

// --- ARRANQUE MÁGICO ---
db.ref('Productos').on('value', (snapshot) => {
    cacheProductos = snapshot.val() || {};
    renderizarFiltrosBarra(); 
    renderizarContenido();    
    updateIdentidad();        
});

document.addEventListener('DOMContentLoaded', () => {
    iniciarObserver();
    actualizarContadorCarrito();
    iniciarEfectosPremium(); // Activamos cursores e imanes
});

// ========================================================
// --- MENÚ DINÁMICO ---
// ========================================================
let categoriasBorradasCache = {};
let categoriasExtraCache = {};
const originalesBase = { "Toons_Icons": "Personajes Animados", "Art_Masterpieces": "Arte y Cuadros", "Marble_Luxury": "Línea Mármol", "Nature_Wildlife": "Animales y Flores", "Essentials": "Básicos y Corazones" };

db.ref('CategoriasBorradas').on('value', snap => { categoriasBorradasCache = snap.val() || {}; renderMenuCategoriasFrontend(); });
db.ref('CategoriasExtra').on('value', snap => { categoriasExtraCache = snap.val() || {}; renderMenuCategoriasFrontend(); });

function renderMenuCategoriasFrontend() {
    const menu = document.getElementById('menu-colecciones-dinamico');
    if(!menu) return; 
    let html = `<a href="#" onclick="aplicarFiltro('Todas', 'Todas'); window.scrollTo(0, document.getElementById('dynamic-filter-bar').offsetTop - 100); return false;" style="font-weight:bold; color:var(--vino);">Ver Todo el Catálogo</a>
                <a href="pagina-match.html" style="font-weight:bold; color:var(--azul-match);">🔥 Colección MATCH</a><hr style="margin: 5px 0; border: 0; border-top: 1px solid #eee;">`;

    for(const [id, nombre] of Object.entries(originalesBase)) {
        if(!categoriasBorradasCache[id]) { html += `<a href="#" onclick="aplicarFiltro('${id}', 'Todas'); window.scrollTo(0, document.getElementById('dynamic-filter-bar').offsetTop - 100); return false;">${nombre}</a>`; }
    }
    for(const [id, cat] of Object.entries(categoriasExtraCache)) {
        html += `<a href="#" onclick="aplicarFiltro('${id}', 'Todas'); window.scrollTo(0, document.getElementById('dynamic-filter-bar').offsetTop - 100); return false;">${cat.nombre}</a>`;
    }
    menu.innerHTML = html;
}

// ========================================================
// --- EFECTOS PREMIUM (CURSOR Y BOTONES MAGNÉTICOS) ---
// ========================================================
function iniciarEfectosPremium() {
    // 1. CURSOR PERSONALIZADO
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Solo activarlo si estamos en computadora (con mouse)
    if(window.matchMedia("(pointer: fine)").matches && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX; 
            const posY = e.clientY;
            
            // El punto sigue exacto
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            // El aro sigue con un pequeño retraso suave
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Detectar hover dinámico en toda la página
        document.body.addEventListener('mouseover', (e) => {
            if(e.target.closest('a, button, input, .card, .img-box, .icon-interactivo, i, .btn-filtro, .cursor-hover')) {
                cursorOutline.classList.add('hover');
            }
        });
        document.body.addEventListener('mouseout', (e) => {
            if(e.target.closest('a, button, input, .card, .img-box, .icon-interactivo, i, .btn-filtro, .cursor-hover')) {
                cursorOutline.classList.remove('hover');
            }
        });
    }

    // 2. BOTONES MAGNÉTICOS (Inicial)
    vincularMagnetismo();
}

function vincularMagnetismo() {
    // Si no es PC, no aplicamos magnetismo (en celulares es raro)
    if(!window.matchMedia("(pointer: fine)").matches) return;

    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(btn => {
        // Evitamos vincular dos veces si se vuelve a llamar la función
        if(btn.dataset.magnetized) return; 
        btn.dataset.magnetized = "true";

        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            // Calcular la distancia del centro del botón al mouse
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Mover el botón ligeramente (multiplicador 0.3)
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            // Regresar al centro al quitar el mouse
            btn.style.transform = `translate(0px, 0px)`;
        });
    });
}

// Dummy para re-bindear el cursor si aparecen elementos nuevos 
// (ya está en document.body dinámico, pero por si acaso)
function vincularCursorDinamico() {}

