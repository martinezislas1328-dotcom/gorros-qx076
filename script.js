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
let filtroActual = 'Todos';
let busquedaTexto = "";

// --- LÓGICA DE BÚSQUEDA ---
function toggleSearch() {
    const searchContainer = document.getElementById('search-container');
    const resultsBox = document.getElementById('predictive-results');
    const isVisible = searchContainer.style.display === 'flex';
    searchContainer.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible) {
        document.getElementById('search-input').focus();
    } else {
        resultsBox.style.display = 'none';
        document.getElementById('search-input').value = "";
    }
}

function ejecutarBusquedaPredictiva() {
    const texto = document.getElementById('search-input').value.toLowerCase();
    const resultsBox = document.getElementById('predictive-results');
    
    if (texto.length < 2) {
        resultsBox.style.display = 'none';
        return;
    }

    let coincidencias = [];
    Object.keys(cacheProductos).forEach(cat => {
        Object.values(cacheProductos[cat]).forEach(prod => {
            if (prod.Nombre.toLowerCase().includes(texto)) {
                coincidencias.push({ ...prod, categoria: cat });
            }
        });
    });

    if (coincidencias.length > 0) {
        resultsBox.style.display = 'block';
        resultsBox.innerHTML = coincidencias.map(p => `
            <div class="search-result-item" onclick="irAProducto('${p.Nombre}')">
                <img src="${p.imagen}">
                <div class="search-result-info">
                    <h4>${p.Nombre}</h4>
                    <p>${p.categoria.replace(/_/g, ' ')} - $${p.precio}</p>
                </div>
            </div>
        `).join('');
    } else {
        resultsBox.innerHTML = '<p style="padding:15px; color:gray;">No se encontraron gorros...</p>';
    }
}

function irAProducto(nombre) {
    toggleSearch();
    setTimeout(() => {
        const tarjetas = document.querySelectorAll('.card h3');
        tarjetas.forEach(t => {
            if (t.innerText.trim() === nombre.trim()) {
                t.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const card = t.closest('.card');
                card.style.boxShadow = "0 0 30px var(--vino)";
                setTimeout(() => card.style.boxShadow = "", 3000);
            }
        });
    }, 300);
}

// --- SLIDER PRINCIPAL ---
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const heroTitle = document.getElementById('hero-title');
const topBar = document.getElementById('top-bar');

function moveSlider() {
    if (!slides.length) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
    if (currentSlide === 1) { 
        heroTitle.style.color = "#ffffff";
        topBar.style.background = "var(--vino)";
    } else { 
        heroTitle.style.color = "var(--vino)";
        topBar.style.background = "var(--rosa-banner)";
    }
}
setInterval(moveSlider, 5000);

// --- OBSERVER ---
const iniciarObserver = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

function filtrar(sub) {
    filtroActual = sub;
    renderizarContenido();
}

// --- RENDERIZADO (FIREBASE) ---
function renderizarContenido() {
    if (!cacheProductos) return;
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = "";

    const menuColecciones = document.getElementById('menu-colecciones-dinamico');
    if(menuColecciones) {
        menuColecciones.innerHTML = Object.keys(cacheProductos).map(cat => `
            <a href="#cat-${cat}">${cat.replace(/_/g, ' ')}</a>
        `).join('');
    }

    Object.keys(cacheProductos).forEach((idCat) => {
        let htmlDeEstaSeccion = "";
        let tieneItems = false;

        Object.values(cacheProductos[idCat]).forEach((d) => {
            const subCat = d.subcategoria || "Todos";
            const coincideFiltro = (idCat !== 'Toons_Icons' || filtroActual === 'Todos' || subCat === filtroActual);
            const coincideBusqueda = d.Nombre.toLowerCase().includes(busquedaTexto);

            if (coincideFiltro && coincideBusqueda) {
                tieneItems = true;
                const stockActual = d.stock !== undefined ? parseInt(d.stock) : 10;
                const esDisponible = stockActual > 0;
                
                // --- LÓGICA DE PRECIO DE OFERTA ---
                let htmlPrecio = "";
                if (d.precioOferta && d.precioOferta.toString().trim() !== "") {
                    htmlPrecio = `
                        <span class="old-price-card">MXN $${d.precio}</span>
                        <span class="current-price" style="color: red;">MXN $${d.precioOferta}</span>
                    `;
                } else {
                    htmlPrecio = `
                        <span class="current-price">MXN $${d.precio}</span>
                    `;
                }
                
                htmlDeEstaSeccion += `
                    <div class="card reveal ${!esDisponible ? 'producto-agotado' : ''}" onclick="window.location.href='https://wa.me/525512345678?text=Hola, me interesa: ${d.Nombre}'">
                        <div class="img-box">
                            <img src="${d.imagen}">
                            <div class="status-tag">${esDisponible ? 'DISPONIBLE' : 'AGOTADO'}</div>
                        </div>
                        <div class="info">
                            <span class="category-label">${idCat.replace(/_/g, ' ')}</span>
                            <h3>${d.Nombre}</h3>
                            <div class="price-container">
                                ${htmlPrecio}
                            </div>
                            <div class="btn-pedido">${esDisponible ? 'PEDIR POR WHATSAPP' : 'SIN STOCK'}</div>
                        </div>
                    </div>
                `;
            }
        });

        if (tieneItems) {
            contenedor.innerHTML += `
                <div id="cat-${idCat}" class="reveal" style="grid-column: 1/-1; margin-top: 40px;">
                    <h2 style="font-family:'Playfair Display'; color:var(--vino); border-bottom:3px solid var(--rosa-banner); display:inline-block;">${idCat.replace(/_/g, ' ')}</h2>
                </div>
            ` + htmlDeEstaSeccion;
        }
    });
    iniciarObserver();
}

// --- MINI SLIDER IDENTIDAD (CON SOPORTE PARA VIDEOS) ---
const beneficios = [
    { 
        tag: "TU ESTILO", 
        titulo: "Diseños a tu Medida", 
        desc: "¿No ves a tu personaje favorito? Lo creamos desde cero para ti. El límite es tu imaginación en el quirófano.", 
        tipo: "image", 
        src: "personalizado.png" 
    },
    { 
        tag: "ENVÍOS", 
        titulo: "¡Llegamos a tu Hospital!", 
        desc: "Envíos directos y 100% seguros a cualquier rincón de México. Tu único trabajo es salvar vidas, nosotros te llevamos el estilo.", 
        tipo: "video", 
        src: "video-envios.mp4" 
    },
    { 
        tag: "REGALOS", 
        titulo: "¡Conoce la Magia QX!", 
        desc: "El detalle perfecto que inspira a doctores y enfermeros. Increíble para celebrar graduaciones, cumpleaños o simplemente una guardia terminada.", 
        tipo: "video", 
        src: "ram.mp4" 
    }
];

let beneIndex = 0;
let timerIdentidad; 

function updateIdentidad() {
    const imgEl = document.getElementById('identidad-img');
    const vidEl = document.getElementById('identidad-video');
    const tag = document.getElementById('identidad-tag');
    const tit = document.getElementById('identidad-titulo');
    const desc = document.getElementById('identidad-desc');
    const dots = document.querySelectorAll('.dot');
    
    const currentItem = beneficios[beneIndex];

    clearTimeout(timerIdentidad);
    vidEl.onended = null; 

    imgEl.style.opacity = "0";
    vidEl.style.opacity = "0";
    
    setTimeout(() => {
        tag.innerText = currentItem.tag;
        tit.innerText = currentItem.titulo;
        desc.innerText = currentItem.desc;

        if (currentItem.tipo === "video") {
            vidEl.src = currentItem.src;
            vidEl.style.opacity = "1";
            vidEl.loop = false; 
            
            let playPromise = vidEl.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.log("El autoplay se bloqueó", e);
                    timerIdentidad = setTimeout(nextIdentidad, 6000);
                });
            }

            vidEl.onended = () => {
                nextIdentidad();
            };

        } else {
            imgEl.src = currentItem.src;
            imgEl.style.opacity = "1";
            vidEl.pause();
            timerIdentidad = setTimeout(nextIdentidad, 6000);
        }

        dots.forEach((dot, i) => dot.classList.toggle('active', i === beneIndex));
    }, 300);
}

function nextIdentidad() { beneIndex = (beneIndex + 1) % beneficios.length; updateIdentidad(); }
function prevIdentidad() { beneIndex = (beneIndex - 1 + beneficios.length) % beneficios.length; updateIdentidad(); }

updateIdentidad(); 

db.ref('Productos').on('value', (snapshot) => {
    cacheProductos = snapshot.val();
    renderizarContenido();
});

document.addEventListener('DOMContentLoaded', iniciarObserver);
