:root {
    --vino: #850E35;    
    --rosa-pastel: #FBC9C9; 
    --crema-fondo: #FCF5EE;      
    --rosa-banner: #E96B85; 
    --blanco-trans: rgba(255, 255, 255, 0.7);
}

body { font-family: 'Outfit', sans-serif; margin: 0; background-color: var(--crema-fondo); color: #333; overflow-x: hidden; }

/* REVELACIÓN */
.reveal { opacity: 0; transform: translateY(40px); transition: all 0.8s ease-out; }
.reveal.active { opacity: 1; transform: translateY(0); }

/* BARRA DE NAVEGACIÓN - LOGO CENTRADO Y ICONOS SEPARADOS */
.promo-banner { 
    background: var(--rosa-banner); color: white; 
    padding: 15px 0; 
    position: sticky; top: 0; z-index: 1000; transition: background 0.8s ease; 
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.header-container {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 25px;
}

.header-nav-links { display: flex; gap: 20px; align-items: center; }
.nav-link-main {
    color: white; text-decoration: none; font-size: 0.9rem; font-weight: 700;
    display: flex; align-items: center;
}

.header-logo-area { text-align: center; }
.logo-top { font-weight: 800; font-size: 1.6rem; letter-spacing: 3px; }

.header-icons { display: flex; gap: 25px; justify-content: flex-end; align-items: center; }
.header-icons i { font-size: 1.5rem; cursor: pointer; transition: 0.3s; }
.icon-interactivo:hover { transform: scale(1.2); opacity: 0.8; }

/* BUSCADOR OVERLAY Y RESULTADOS */
#search-container {
    position: absolute; top: 100%; left: 0; width: 100%; background: white;
    padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); display: none;
    flex-direction: column; align-items: center; z-index: 2000;
}
#search-input {
    width: 60%; padding: 12px 25px; border: 2px solid var(--rosa-banner);
    border-radius: 30px; outline: none; font-family: 'Outfit'; font-size: 1rem;
}
#predictive-results {
    width: 60%; max-height: 350px; overflow-y: auto; background: white;
    margin-top: 10px; border-radius: 10px; display: none; border: 1px solid #eee;
}
.search-result-item {
    display: flex; align-items: center; gap: 15px; padding: 12px;
    border-bottom: 1px solid #f5f5f5; cursor: pointer; transition: 0.3s;
}
.search-result-item:hover { background: var(--crema-fondo); }
.search-result-item img { width: 45px; height: 45px; border-radius: 5px; object-fit: cover; }
.search-result-info h4 { margin: 0; font-size: 0.9rem; color: var(--vino); }
.search-result-info p { margin: 0; font-size: 0.8rem; color: #666; }

/* MENÚ DESPLEGABLE */
.dropdown-content {
    display: none; position: absolute; background-color: white; min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); z-index: 1; border-radius: 10px; top: 100%; overflow: hidden;
}
.dropdown-content a { color: var(--vino) !important; padding: 12px 16px; text-decoration: none; display: block; text-align: left; font-size: 0.9rem; }
.dropdown-content a:hover { background-color: var(--rosa-pastel); }
.dropdown:hover .dropdown-content { display: block; }

/* HERO SECTION */
.hero-boutique { position: relative; height: 75vh; width: 100%; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.slider-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
.hero-bg.slide { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 1.2s ease-in-out; }
.hero-bg.slide.active { opacity: 1; z-index: 2; }
.hero-overlay { position: relative; z-index: 3; text-align: center; color: white; background: rgba(0, 0, 0, 0.45); padding: 40px; border-radius: 15px; backdrop-filter: blur(3px); }
.hero-overlay h1 { font-family: 'Playfair Display', serif; font-size: 3.5rem; margin: 0; }
.btn-hero { display: inline-block; margin-top: 20px; padding: 12px 30px; border: 2px solid white; color: white; text-decoration: none; font-weight: 600; transition: 0.3s; }

/* --- SECCIÓN DE ANUNCIOS LLAMATIVA --- */
.promo-container-wrapper {
    position: relative;
    max-width: 1080px;
    margin: 60px auto;
    padding: 0 40px; 
}

.promo-split { 
    display: flex; 
    background: linear-gradient(to right, #ffffff, #fff5f7); 
    margin: 0 auto; 
    border-radius: 16px; 
    overflow: hidden; 
    box-shadow: 0 15px 35px rgba(133, 14, 53, 0.15); 
    border: 2px solid var(--rosa-pastel); 
    transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.promo-split:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 45px rgba(133, 14, 53, 0.25);
    border-color: var(--rosa-banner);
}

.slider-arrows-exterior {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    transform: translateY(-50%);
    z-index: 10;
    pointer-events: none; 
}

.arrow-btn-exterior {
    pointer-events: auto; 
    background: var(--vino);
    border: 4px solid var(--crema-fondo);
    width: 55px;
    height: 55px;
    border-radius: 50%;
    cursor: pointer;
    color: white;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
    transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.arrow-btn-exterior:hover { background: var(--rosa-banner); transform: scale(1.15); }

.promo-image { width: 45%; height: 420px; position: relative; }
.promo-image img, .promo-image video { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; transition: opacity 0.5s ease; }

.promo-details { width: 55%; padding: 40px 50px; display: flex; flex-direction: column; justify-content: center; }

.tag-anuncio { 
    color: white; 
    background: var(--rosa-banner); 
    padding: 8px 18px; 
    border-radius: 30px; 
    font-weight: 800; 
    font-size: 0.9rem; 
    letter-spacing: 2px; 
    width: fit-content; 
    margin-bottom: 15px; 
    box-shadow: 0 4px 10px rgba(233, 107, 133, 0.4);
}

.promo-details h2 { 
    color: var(--vino); 
    font-size: 3rem; 
    margin: 10px 0 20px 0; 
    font-family: 'Playfair Display', serif; 
    line-height: 1.1;
}

.promo-details p { 
    font-size: 1.3rem; 
    line-height: 1.6; 
    color: #444; 
    font-weight: 400;
}

/* DOTS DEL SLIDER */
.slider-dots { display: flex; gap: 12px; margin-top: 30px; }
.dot { width: 14px; height: 14px; border-radius: 50%; background: #ddd; transition: 0.3s; cursor: pointer; }
.dot.active { background: var(--vino); transform: scale(1.3); }

/* CHIPS FILTROS */
.filter-wrapper { grid-column: 1 / -1; text-align: center; margin: 40px 0; padding: 30px 20px; background: linear-gradient(135deg, #fff 0%, var(--rosa-pastel) 100%); border-radius: 30px; border: 1px solid rgba(233, 107, 133, 0.2); }
.filter-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
.chip { background: var(--blanco-trans); border: 1px solid var(--rosa-banner); color: var(--vino); padding: 10px 22px; border-radius: 50px; cursor: pointer; font-weight: 600; transition: 0.4s; }
.chip.active { background: var(--vino); color: white; border-color: var(--vino); }

/* SQUAD SECTION */
.squad-section { margin: 80px auto; max-width: 1100px; text-align: center; }
.squad-gallery { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 40px; }
.squad-item { border-radius: 20px; overflow: hidden; height: 500px; position: relative; }
.squad-item img { width: 100%; height: 100%; object-fit: cover; }

/* GRID PRODUCTOS */
.main-content { max-width: 1200px; margin: auto; padding: 40px 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 40px; }
.card { background: white; border-radius: 15px; overflow: hidden; position: relative; box-shadow: 0 10px 25px rgba(0,0,0,0.08); transition: 0.3s; cursor: pointer; }
.status-tag { position: absolute; top: 15px; right: 15px; background: var(--rosa-banner); color: white; padding: 5px 12px; border-radius: 10px; font-size: 0.65rem; font-weight: 800; z-index: 5; }
.img-box img { width: 100%; aspect-ratio: 1/1; object-fit: cover; transition: 0.5s; }
.card:hover .img-box img { transform: scale(1.05); }

/* INFO PRODUCTO */
.info { padding: 25px 20px; text-align: left; background-color: var(--rosa-pastel); }
.category-label { font-size: 0.7rem; color: var(--vino); font-weight: 700; margin-bottom: 8px; display: block; }
.info h3 { margin: 0 0 15px 0; font-size: 1.4rem; font-weight: 700; color: #1a1a1a; } 
.price-container { margin-bottom: 20px; display: block; }
.current-price { font-size: 1.2rem; font-weight: 700; color: var(--vino); }
.old-price-card { text-decoration: line-through; color: #777; font-size: 0.9rem; margin-right: 8px; }
.btn-pedido { display: block; width: 100%; background: var(--vino); color: white; text-align: center; padding: 14px 0; text-decoration: none; font-weight: 700; border-radius: 8px; transition: 0.3s; }

.footer-morado { background: var(--vino); color: white; padding: 50px; text-align: center; }
.producto-agotado { opacity: 0.7; filter: grayscale(1); }

@media (max-width: 768px) { 
    .grid { grid-template-columns: 1fr 1fr; gap: 15px; }
    .promo-split, .squad-gallery { flex-direction: column; }
    .header-container { grid-template-columns: 1fr 1fr; }
    .header-logo-area { display: none; } 
    .promo-container-wrapper { padding: 0 10px; margin: 40px auto; } 
    .arrow-btn-exterior { width: 40px; height: 40px; font-size: 0.9rem; }
    .promo-image { width: 100%; height: 300px; }
    .promo-details { width: 100%; padding: 30px; text-align: center; align-items: center; }
    .promo-details h2 { font-size: 2.2rem; }
    .promo-details p { font-size: 1.1rem; }
}
