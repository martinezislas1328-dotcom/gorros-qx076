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

db.ref('Productos').on('value', (snapshot) => {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = ""; 

    // Nombres limpios para las categorías
    const nombresSecciones = {
        "Toons_Icons": "Personajes Animados",
        "Art_Masterpieces": "Galería de Arte",
        "Nature_Wildlife": "Naturaleza y Animales",
        "Essentials": "Básicos y Corazones"
    };

    snapshot.forEach((categoriaSnapshot) => {
        const idCat = categoriaSnapshot.key;
        const tituloSeccion = nombresSecciones[idCat] || idCat;

        // Inyectamos el título de la categoría
        contenedor.innerHTML += `
            <div style="grid-column: 1 / -1; margin-top: 40px; text-align: left;">
                <h2 style="color: #850E35; border-bottom: 3px solid #EE6983; display: inline-block; padding-bottom: 5px; font-family: 'Playfair Display', serif; font-size: 1.8rem;">
                    ${tituloSeccion}
                </h2>
            </div>
        `;

        categoriaSnapshot.forEach((productoSnapshot) => {
            const d = productoSnapshot.val();
            const nombre = d.Nombre || d.nombre || "Gorro QX";
            const stock = parseInt(d.stock || d.Stock || 0);
            const esAgotado = stock <= 0;

            // La card con el botón color Vino
            contenedor.innerHTML += `
                <div class="card" style="opacity: ${esAgotado ? '0.7' : '1'}">
                    <span class="badge" style="background: ${esAgotado ? '#850E35' : '#EE6983'}">
                        ${esAgotado ? 'AGOTADO' : 'DISPONIBLE'}
                    </span>
                    <div class="img-box">
                        <img src="${d.imagen || d.Imagen}" onerror="this.src='https://via.placeholder.com/400?text=Cargando+Imagen...'">
                    </div>
                    <div class="info">
                        <p style="font-size: 0.7rem; color: #850E35; font-weight: bold; margin-bottom: 5px;">${idCat.replace('_', ' ')}</p>
                        <h3>${nombre}</h3>
                        <div class="price">$${d.precio || d.Precio}</div>
                        <a href="https://wa.me/525512345678?text=Hola, me interesa el gorro: ${nombre}" 
                           style="background: #850E35; color: white; text-decoration: none; padding: 12px; display: block; margin-top: 15px; border-radius: 8px; font-weight: 700; text-align: center; transition: 0.3s; border: 2px solid #850E35;"
                           onmouseover="this.style.background='white'; this.style.color='#850E35'"
                           onmouseout="this.style.background='#850E35'; this.style.color='white'"
                           target="_blank">
                            PEDIR POR WHATSAPP
                        </a>
                    </div>
                </div>
            `;
        });
    });
});
