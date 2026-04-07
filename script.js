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

db.ref().on('value', (snapshot) => {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = "";
    
    snapshot.forEach((childSnapshot) => {
        const d = childSnapshot.val();
        if(!d.Nombre) return;

        const stock = parseInt(d.Stock || d.stock || 0);
        const esAgotado = stock <= 0;
        const color = esAgotado ? "#e74c3c" : "#2ecc71";
        const textoStatus = esAgotado ? "AGOTADO" : "DISPONIBLE";

        contenedor.innerHTML += `
            <div class="card" style="opacity: ${esAgotado ? '0.7' : '1'}">
                <span class="badge" style="background: ${color}">${textoStatus}</span>
                <div class="img-box">
                    <img src="https://i.postimg.cc/Mp1x5sXT/image.png">
                </div>
                <div class="info">
                    <p style="font-size: 0.6rem; color: #999; letter-spacing: 2px;">CARICATURAS</p>
                    <h3>${d.Nombre}</h3>
                    <div class="price">$${d.Precio || d.precio}</div>
                    
                    <p style="font-size: 0.8rem; margin-top: 10px; font-weight: bold; color:${color}">
                        ${textoStatus}
                    </p>

                    <a href="https://wa.me/525512345678?text=Hola, quiero el gorro ${d.Nombre}" class="btn-pedido">
                        Pedir por WhatsApp
                    </a>
                </div>
            </div>
        `;
    });
});
