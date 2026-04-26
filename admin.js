
  function verificarClave() {
        const clave = document.getElementById('clave-admin').value;
        if (clave === "gorro2026") {
            document.getElementById('pantalla-bloqueo').style.display = 'none';
        } else {
            alert("Acceso denegado. Contraseña incorrecta.");
            document.getElementById('clave-admin').value = "";
        }
    }


    
// ===============
// ========================================
// SUBIDA DE IMÁGENES A IMGBB CON COMPRESIÓN AUTOMÁTICA
// =======================================================
// =======================================================
// 🚀 SUBIDA DEFINITIVA A IMGBB (TRADUCE HEIC + COMPRIME)
// =======================================================
async function subirAImgBB(inputElement, targetInputId, statusTextId) {
    const archivo = inputElement.files[0];
    if (!archivo) return;

    const statusEl = document.getElementById(statusTextId);
    statusEl.style.display = 'block';
    statusEl.style.color = '#e67e22';
    statusEl.innerText = '⏳ Procesando foto (si es de iPhone tardará unos segunditos más)...';

    const procesarImagen = async (file) => {
        let archivoAProcesar = file;
        const nombreArchivo = file.name.toLowerCase();

        // 1. SI ES HEIC/HEIF: Lo traducimos a JPG primero usando la librería
        if (nombreArchivo.endsWith('.heic') || nombreArchivo.endsWith('.heif')) {
            console.log("📱 Archivo HEIC detectado. Traduciendo a JPG...");
            try {
                const convertedBlob = await heic2any({
                    blob: file,
                    toType: "image/jpeg",
                    quality: 0.8 // Ya le bajamos un poquito la calidad desde aquí
                });
                // heic2any a veces devuelve un array si es una foto con "movimiento"
                const blobFinal = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                archivoAProcesar = new File([blobFinal], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: 'image/jpeg' });
                console.log("✅ Traducido a JPG con éxito.");
            } catch (error) {
                console.error("❌ Error al traducir el HEIC:", error);
                throw new Error("No se pudo leer el archivo HEIC del iPhone.");
            }
        }

        // 2. AHORA SÍ, COMPRIMIMOS (Ya sea que entró como JPG normal o traducido del iPhone)
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(archivoAProcesar);
            
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800; 
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                    } else {
                        if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if(!blob) return reject(new Error("Error al exprimir la imagen."));
                        const archivoComprimido = new File([blob], "foto_optimizada.jpg", {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });
                        resolve(archivoComprimido);
                    }, 'image/jpeg', 0.75); // 0.75 es el nivel de compresión (perfecto para web)
                };
                
                img.onerror = () => reject(new Error("El navegador no pudo dibujar la imagen."));
            };
            
            reader.onerror = () => reject(new Error("No se pudo leer el archivo en tu dispositivo."));
        });
    };

    try {
        // Ejecutamos la bestia
        const archivoFinal = await procesarImagen(archivo);

        // Preparamos para ImgBB
        const formData = new FormData();
        formData.append('image', archivoFinal);
        const apiKey = '9dffd47ea3a69c56e2c99ae7dea49aa3';
        
        statusEl.innerText = '☁️ Subiendo imagen optimizada a la nube...';

        // Subimos
        const respuesta = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body: formData });
        const datos = await respuesta.json();
        
        if (datos.success) {
            document.getElementById(targetInputId).value = datos.data.url;
            statusEl.style.color = '#27ae60';
            statusEl.innerText = '✅ ¡Subida y optimizada con éxito!';
        } else {
            throw new Error("ImgBB rechazó la imagen.");
        }
    } catch (error) {
        statusEl.style.color = '#e74c3c';
        statusEl.innerText = `❌ Error: ${error.message}`;
        console.error(error);
    }
}

    const firebaseConfig = {
        apiKey: "AIzaSyDjJGxz3rqwKRY1mQsakSqJPGVfF_rYdp0",
        authDomain: "gorrosqx.firebaseapp.com",
        databaseURL: "https://gorrosqx-default-rtdb.firebaseio.com",
        projectId: "gorrosqx",
        storageBucket: "gorrosqx.firebasestorage.app"
    };
    if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
    const db = firebase.database();

    let cacheMatches = {}; 
    let cacheProductos = {};
    let cachePedidos = {};
if(!document.getElementById('modal-visor-foto')) {
    document.body.insertAdjacentHTML('beforeend', `
        <div id="modal-visor-foto" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); z-index:99999; justify-content:center; align-items:center; cursor:zoom-out; backdrop-filter: blur(5px);" onclick="this.style.display='none'">
            <img id="img-ampliada" src="" style="max-width:90%; max-height:90%; border-radius:15px; border:4px solid white; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
            <p style="position:absolute; bottom:20px; color:white; font-size:1.2rem; font-weight:bold; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">Haz clic en cualquier lado para cerrar</p>
        </div>
    `);
}

// Función que abre la foto
window.verFotoGorro = function(url) {
    if(!url) return;
    document.getElementById('img-ampliada').src = url;
    document.getElementById('modal-visor-foto').style.display = 'flex';
};
/* ==========================================
   GESTIÓN DE PEDIDOS PENDIENTES Y STOCK (VERSIÓN INTUITIVA)
   ========================================== */
db.ref('Pedidos').on('value', snap => {
    const container = document.getElementById('lista-pedidos');
    container.innerHTML = '';
    cachePedidos = snap.val() || {}; 
    let hayPendientes = false;

    Object.keys(cachePedidos).forEach(orderId => {
        const pedido = cachePedidos[orderId];
        
        if(pedido.estado === 'pendiente' || !pedido.estado) {
            hayPendientes = true;
            
            // 1. COLUMNA DE IMÁGENES (Se quedan chicas, ya tienen el zoom)
            let fotosHtml = '';
            if(pedido.items) {
                pedido.items.forEach(it => {
                    fotosHtml += `
                        <div style="position: relative; margin-bottom: 12px; width: 100%;">
                            <img src="${it.imagen || 'https://via.placeholder.com/110'}" 
                                 onclick="verFotoGorro('${it.imagen}')"
                                 title="Clic para ampliar"
                                 style="width: 100%; height: 90px; object-fit: cover; border-radius: 10px; border: 2px solid #ddd; display: block; cursor: zoom-in; transition: 0.2s;" 
                                 onmouseover="this.style.borderColor='var(--vino)';" 
                                 onmouseout="this.style.borderColor='#ddd';">
                            <span style="position: absolute; top: -8px; right: -8px; background: var(--vino); color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold; border: 2px solid white;">
                                ${it.cantidad}
                            </span>
                        </div>`;
                });
            }

            // 2. DIBUJAR LOS ITEMS DEL PEDIDO
            let htmlItems = '';
            if(pedido.items) {
                pedido.items.forEach(it => {
                    // VERIFICAMOS SI ES UN RAMO
                    let esRamo = (it.tipo === 'ramo' || it.nombre.toLowerCase().includes('ramo'));
                    
                    let tipoTexto = esRamo ? '💐 RAMO PERSONALIZADO' : ((it.tipo === 'match' || it.categoria === 'PaquetesMatch') ? 'Paquete Match' : `Gorro Individual`);
                    
                    let detallesHTML = '';
                    
                    // SI ES RAMO, CREAMOS LA CAJA ROSA INTUITIVA
                    if(esRamo) {
                        let gorrosText = (it.detalles && it.detalles.gorros) ? it.detalles.gorros.join(', ') : 'Gorros no especificados';
                        let papelText = (it.detalles && it.detalles.papel) ? it.detalles.papel : 'Papel no especificado';
                        let notaText = (it.detalles && it.detalles.nota) ? it.detalles.nota : 'Sin dedicatoria';

                        // Detectar el color del papel para ponerle un circulito visual
                        let colorCirculo = '#ddd';
                        let papelLower = papelText.toLowerCase();
                        if(papelLower.includes('negro')) colorCirculo = '#222';
                        else if(papelLower.includes('blanco')) colorCirculo = '#fff';
                        else if(papelLower.includes('rosa')) colorCirculo = '#ffb6c1';
                        else if(papelLower.includes('dorado')) colorCirculo = '#d4af37';
                        else if(papelLower.includes('kraft')) colorCirculo = '#c2a68c';

                        detallesHTML = `
                            <div style="background: #FFE4E1; padding: 20px; border-radius: 12px; margin-top: 15px; border: 2px solid #FFB6C1; box-shadow: 0 4px 10px rgba(233,107,133,0.15);">
                                <h4 style="margin: 0 0 15px 0; color: #850E35; font-size: 1.2rem; display: flex; align-items: center; gap: 8px;">
                                    <i class="fas fa-gift"></i> Detalles de este Ramo
                                </h4>
                                
                                <div style="margin-bottom: 12px; font-size: 1.1rem; color: #333;">
                                    <strong>🎩 Gorros que lleva adentro:</strong> 
                                    <div style="background: white; padding: 8px 12px; border-radius: 8px; font-weight: bold; border: 1px solid #fbc9c9; margin-top: 5px; color: var(--vino);">
                                        ${gorrosText}
                                    </div>
                                </div>
                                
                                <div style="margin-bottom: 12px; font-size: 1.1rem; display: flex; align-items: center; gap: 10px; color: #333;">
                                    <strong>📜 Color del Papel:</strong>
                                    <span style="display: inline-block; width: 25px; height: 25px; background-color: ${colorCirculo}; border-radius: 50%; border: 2px solid #888; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></span>
                                    <span style="font-weight: 800; font-size: 1.2rem; text-transform: uppercase;">${papelText}</span>
                                </div>
                                
                                <div style="margin-top: 15px; padding-top: 15px; border-top: 2px dashed #E96B85;">
                                    <strong style="color: #850E35; font-size: 1.1rem;"><i class="fas fa-comment-dots"></i> Nota para el cliente:</strong>
                                    <div style="background: white; padding: 15px; border-radius: 10px; margin-top: 8px; font-style: italic; color: #111; font-size: 1.1rem; border-left: 6px solid #E96B85; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);">
                                        "${notaText}"
                                    </div>
                                </div>
                            </div>
                        `;
                    }

                    htmlItems += `
                    <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px dashed #eee;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 1.1rem; color: #222; font-weight: bold;">
                                <span style="background: var(--vino); color: white; padding: 2px 8px; border-radius: 5px; margin-right: 5px;">${it.cantidad}x</span> 
                                ${it.nombre}
                            </span>
                            <span style="font-weight: 900; color: #27ae60; font-size: 1.2rem;">$${it.precio * it.cantidad}</span>
                        </div>
                        <small style="color: #E96B85; font-size: 0.85rem; font-weight: 800; display: block; margin-top: 5px;">${tipoTexto}</small>
                        ${detallesHTML}
                    </div>`;
                });
            }

            // 3. ARMAR EL TICKET
            container.innerHTML += `
                <div class="ticket-contenedor" style="background: #fff; border-radius: 15px; box-shadow: 0 8px 25px rgba(0,0,0,0.1); margin-bottom: 35px; overflow: hidden; display: flex; border: 2px solid #eee; border-left: 10px solid var(--vino);">
                    
                    <div style="background: #fdfdfd; padding: 15px; width: 20%; min-width: 110px; display: flex; flex-direction: column; align-items: center; border-right: 2px dashed #eee;">
                        <span style="color: #999; font-weight: 900; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 15px; letter-spacing: 1px;">Fotos</span>
                        ${fotosHtml}
                    </div>

                    <div style="flex: 1; padding: 25px; display: flex; flex-direction: column;">
                        
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; background: #f9f9f9; padding: 15px; border-radius: 10px;">
                            <div>
                                <span style="display: block; font-weight: 900; font-size: 1.3rem; color: #000;">TICKET #${orderId.replace('pedido_', '').slice(-5).toUpperCase()}</span>
                                <small style="color: #666; font-weight: bold;"><i class="far fa-clock"></i> ${pedido.fecha || 'Fecha no registrada'}</small>
                            </div>
                            <div style="text-align: right; background: #e8f8f5; padding: 10px 20px; border-radius: 10px; border: 1px solid #a3e4d7;">
                                <small style="color: #117a65; font-weight: bold; text-transform: uppercase;">Total a cobrar</small>
                                <strong style="font-size: 1.8rem; color: #0b5345; display: block;">$${pedido.total}</strong>
                            </div>
                        </div>

                        <div style="flex: 1;">
                            ${htmlItems}
                        </div>

                        <div style="display: flex; gap: 15px; margin-top: 25px; border-top: 2px solid #eee; padding-top: 20px;">
                            <button onclick="confirmarPedido('${orderId}')" style="background:#27ae60; color: white; border: none; padding: 15px; border-radius: 12px; font-weight: 900; cursor: pointer; flex: 4; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(39, 174, 96, 0.3); transition: 0.2s;">
                                <i class="fas fa-check-circle" style="font-size: 1.3rem;"></i> ¡PAGADO Y ENTREGADO!
                            </button>
                            <button onclick="rechazarPedido('${orderId}')" style="background:#fff; color: #c0392b; border: 2px solid #c0392b; padding: 15px; border-radius: 12px; font-weight: bold; cursor: pointer; flex: 1; font-size: 1.1rem; transition: 0.2s;" onmouseover="this.style.background='#c0392b'; this.style.color='#fff';" onmouseout="this.style.background='#fff'; this.style.color='#c0392b';">
                                <i class="fas fa-trash-alt"></i> ELIMINAR
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    if(!hayPendientes) {
        container.innerHTML = `
            <div style="text-align: center; padding: 80px 20px; background: white; border-radius: 20px; border: 3px dashed #e0e0e0;">
                <i class="fas fa-mug-hot" style="font-size: 4rem; color: #ddd; margin-bottom: 20px;"></i>
                <h3 style="color: #888; font-size: 1.5rem; margin: 0;">Todo tranquilo</h3>
                <p style="color: #aaa; font-size: 1.1rem;">No hay pedidos pendientes en este momento.</p>
            </div>`;
    }
});

function confirmarPedido(orderId) {
    if(!confirm("💰 ¿Deseas marcar este ticket como PAGADO? \n\nEsto va a descontar los productos de tu inventario y el ticket desaparecerá de aquí.")) return;

    const pedido = cachePedidos[orderId];
    if(!pedido || !pedido.items) return;

    let promesasStock = [];

    pedido.items.forEach(item => {
        let esRamo = (item.tipo === 'ramo' || item.nombre.toLowerCase().includes('ramo'));
        if (esRamo) return; 

        let rutaStock = "";
        
        if (item.categoria === "PaquetesMatch" || item.tipo === "match") {
            rutaStock = `PaquetesMatch/${item.id}/stock`;
        } else {
            let categoria = item.categoria || "Estampados"; 
            rutaStock = `Productos/${categoria}/${item.id}/stock`;
        }

        let p = db.ref(rutaStock).once('value').then(snap => {
            let stockActual = snap.val();
            if (stockActual !== null) {
                let nuevoStock = Math.max(0, parseInt(stockActual) - parseInt(item.cantidad));
                return db.ref(rutaStock).set(nuevoStock);
            }
        });
        promesasStock.push(p);
    });

    Promise.all(promesasStock).then(() => {
        db.ref('Pedidos/' + orderId).remove().then(() => {
            alert("✅ ¡Venta registrada con éxito! El inventario se ha actualizado.");
        });
    }).catch(err => {
        console.error("Error al actualizar stock:", err);
        alert("⚠️ Hubo un detalle al actualizar el inventario, revisa la consola.");
    });
}

function rechazarPedido(orderId) {
    if(confirm("🗑️ ¿Estás seguro de que quieres ELIMINAR este pedido? \n\nEl ticket se borrará para siempre y el inventario NO se tocará.")) {
        db.ref(`Pedidos/${orderId}`).remove().then(() => {
            alert("🗑️ Pedido eliminado correctamente.");
        }).catch(err => {
            alert("❌ Error al intentar eliminar: " + err);
        });
    }
}
    /* ==========================================
       LÓGICA DE CATEGORÍAS
       ========================================== */
    let borradasCache = {};
    let extraCache = {};
    let subExtraCache = {};

    db.ref('CategoriasBorradas').on('value', (snap) => {
        borradasCache = snap.val() || {};
        renderCategorias(); renderSubcategorias();
    });
    db.ref('CategoriasExtra').on('value', (snap) => {
        extraCache = snap.val() || {};
        renderCategorias();
    });
    db.ref('SubcategoriasMenu').on('value', (snap) => {
        subExtraCache = snap.val() || {};
        renderSubcategorias();
    });

    function renderCategorias() {
        const selectCat = document.getElementById('categoria');
        const selectBorrar = document.getElementById('borrar-cat-select');
        const valActual = selectCat.value; 
        
        selectCat.innerHTML = ''; selectBorrar.innerHTML = '<option value="">Seleccione una opción...</option>';
        const originales = { "Toons_Icons": "Personajes Animados (Toons)", "Art_Masterpieces": "Arte y Cuadros (Art)", "Marble_Luxury": "Línea Mármol (Marble Luxury)", "Nature_Wildlife": "Animales y Flores", "Essentials": "Básicos y Corazones" };
        
        for(const [id, nombre] of Object.entries(originales)) {
            if(!borradasCache[id]) {
                selectCat.innerHTML += `<option value="${id}">${nombre}</option>`;
                selectBorrar.innerHTML += `<option value="${id}">${nombre}</option>`;
            }
        }
        for(const [id, cat] of Object.entries(extraCache)) {
            selectCat.innerHTML += `<option value="${id}">${cat.nombre}</option>`;
            selectBorrar.innerHTML += `<option value="${id}">${cat.nombre}</option>`;
        }
        if(valActual) selectCat.value = valActual;
    }

    function agregarCategoriaAdmin() {
        const nombre = document.getElementById('nueva-cat-admin').value.trim();
        if(!nombre) return alert("Ingrese un nombre válido.");
        const idCat = nombre.replace(/\s+/g, '_'); 
        db.ref('CategoriasExtra/' + idCat).set({ nombre: nombre }).then(() => {
            document.getElementById('nueva-cat-admin').value = ""; alert("Categoría registrada.");
        });
    }

    function borrarCategoriaAdmin() {
        const select = document.getElementById('borrar-cat-select');
        const id = select.value;
        if(!id) return alert("Seleccione categoría.");
        if(confirm("¿Ocultar/Eliminar categoría?")) {
            const originales = ["Toons_Icons", "Art_Masterpieces", "Marble_Luxury", "Nature_Wildlife", "Essentials"];
            if(originales.includes(id)) db.ref('CategoriasBorradas/' + id).set(true).then(() => alert("Ocultada."));
            else db.ref('CategoriasExtra/' + id).remove().then(() => alert("Eliminada."));
        }
    }

    function renderSubcategorias() {
        const selectSub = document.getElementById('subcategoria');
        const selectBorrarSub = document.getElementById('borrar-sub-select');
        const valActual = selectSub.value;
        
        selectSub.innerHTML = '<option value="Todos">Ninguna / Otros</option>';
        selectBorrarSub.innerHTML = '<option value="">Seleccione una opción...</option>';
        const originalesSub = ["Stitch", "Snoopy", "Princesas", "Bob Esponja", "Clásicos Disney", "Pixar"];
        
        originalesSub.forEach(sub => {
            const idBorr = "sub_" + sub.replace(/\s+/g, '_');
            if(!borradasCache[idBorr]) {
                selectSub.innerHTML += `<option value="${sub}">${sub}</option>`;
                selectBorrarSub.innerHTML += `<option value="${idBorr}">${sub}</option>`;
            }
        });
        
        for(const [id, subObj] of Object.entries(subExtraCache)) {
            selectSub.innerHTML += `<option value="${subObj.nombre}">${subObj.nombre}</option>`;
            selectBorrarSub.innerHTML += `<option value="${id}">${subObj.nombre}</option>`;
        }
        if(valActual) selectSub.value = valActual;
    }

    function agregarSubcategoriaAdmin() {
        const nombre = document.getElementById('nueva-sub-admin').value.trim();
        if(!nombre) return alert("Ingrese un nombre válido.");
        const idSub = nombre.replace(/\s+/g, '_'); 
        db.ref('SubcategoriasMenu/' + idSub).set({ nombre: nombre }).then(() => {
            document.getElementById('nueva-sub-admin').value = ""; alert("Subcategoría registrada.");
        });
    }

    function borrarSubcategoriaAdmin() {
        const select = document.getElementById('borrar-sub-select');
        const id = select.value;
        if(!id) return alert("Seleccione subcategoría.");
        if(confirm("¿Eliminar esta subcategoría?")) {
            if(id.startsWith("sub_")) db.ref('CategoriasBorradas/' + id).set(true).then(() => alert("Ocultada."));
            else db.ref('SubcategoriasMenu/' + id).remove().then(() => alert("Eliminada."));
        }
    }

    /* ==========================================
       GESTIÓN DE PRODUCTOS INDIVIDUALES
       ========================================== */
    function agregarInputFotoExtraInd(url = "") {
        const container = document.getElementById('contenedor-fotos-extra-ind');
        const idUnico = 'extra_ind_' + Date.now() + Math.floor(Math.random() * 100);
        const div = document.createElement('div');
        div.style.display = 'flex'; div.style.gap = '10px'; div.style.marginBottom = '8px';
        div.innerHTML = `
            <input type="text" id="${idUnico}" class="input-foto-dinamica-ind" placeholder="URL..." value="${url}" style="flex: 1; margin: 0;" readonly>
            <label class="btn-upload">📁 Subir <input type="file" accept="image/*" style="display: none;" onchange="subirAImgBB(this, '${idUnico}', 'estado-${idUnico}')"></label>
        `;
        const p = document.createElement('p'); p.id = `estado-${idUnico}`; p.className = 'status-msg';
        container.appendChild(div); container.appendChild(p);
    }

    function guardarProducto() {
        const idExistente = document.getElementById('edit-id').value;
        const catAnterior = document.getElementById('edit-cat').value;
        const nombre = document.getElementById('nombre').value;
        const precio = document.getElementById('precio').value;
        const precioOferta = document.getElementById('precioOferta').value;
        const imagen = document.getElementById('imagen').value;
        const stock = document.getElementById('stock').value;
        const desc = document.getElementById('desc-ind').value;
        const cat = document.getElementById('categoria').value;
        const sub = document.getElementById('subcategoria').value;

        let fotosExtraArray = [];
        document.querySelectorAll('.input-foto-dinamica-ind').forEach(input => { if(input.value.trim() !== "") fotosExtraArray.push(input.value.trim()); });

        if(!nombre || !precio || !imagen) return alert("Faltan campos obligatorios.");
        if(idExistente && catAnterior !== cat) db.ref('Productos/' + catAnterior + '/' + idExistente).remove();

        const idFinal = idExistente || nombre.replace(/\s+/g, '_').toLowerCase();
        db.ref('Productos/' + cat + '/' + idFinal).set({
            Nombre: nombre, precio: precio, precioOferta: precioOferta || "", imagen: imagen, categoria: cat, subcategoria: sub, stock: parseInt(stock), descripcion: desc, fotosExtra: fotosExtraArray
        }).then(() => { alert("Producto registrado."); cancelarEdicion(); });
    }

    function cargarEdicion(cat, id) {
        const data = cacheProductos[cat][id];
        if(!data) return;
        document.getElementById('titulo-form').innerText = "✏️ Editando: " + data.Nombre;
        document.getElementById('edit-id').value = id;
        document.getElementById('edit-cat').value = cat;
        document.getElementById('nombre').value = data.Nombre;
        document.getElementById('precio').value = data.precio;
        document.getElementById('precioOferta').value = data.precioOferta || "";
        document.getElementById('imagen').value = data.imagen;
        document.getElementById('desc-ind').value = data.descripcion || "";
        
        const selectCat = document.getElementById('categoria');
        if(!Array.from(selectCat.options).some(opt => opt.value === cat)) selectCat.innerHTML += `<option value="${cat}">${cat.replace(/_/g, ' ')}</option>`;
        selectCat.value = cat;

        const subReal = data.subcategoria || "Todos";
        const selectSub = document.getElementById('subcategoria');
        if(!Array.from(selectSub.options).some(opt => opt.value === subReal)) selectSub.innerHTML += `<option value="${subReal}">${subReal}</option>`;
        selectSub.value = subReal;

        document.getElementById('stock').value = data.stock !== undefined ? data.stock : 10;
        document.getElementById('contenedor-fotos-extra-ind').innerHTML = "";
        if(data.fotosExtra) data.fotosExtra.forEach(url => agregarInputFotoExtraInd(url));

        document.getElementById('btn-main').innerText = "Guardar Cambios";
        document.getElementById('btn-cancel').style.display = "block";
        window.scrollTo(0,0); 
    }

    function cancelarEdicion() {
        document.getElementById('titulo-form').innerText = "📦 Registrar Nuevo Producto";
        document.getElementById('edit-id').value = ""; document.getElementById('edit-cat').value = "";
        document.getElementById('nombre').value = ""; document.getElementById('precio').value = "";
        document.getElementById('precioOferta').value = ""; document.getElementById('imagen').value = "";
        document.getElementById('desc-ind').value = ""; document.getElementById('contenedor-fotos-extra-ind').innerHTML = "";
        document.getElementById('categoria').selectedIndex = 0; document.getElementById('subcategoria').value = "Todos";
        document.getElementById('btn-main').innerText = "Guardar Producto"; document.getElementById('btn-cancel').style.display = "none";
    }

    db.ref('Productos').on('value', (snapshot) => {
    const lista = document.getElementById('lista-inventario');
    lista.innerHTML = ""; cacheProductos = snapshot.val() || {};
    Object.keys(cacheProductos).forEach((cat) => {
        Object.keys(cacheProductos[cat]).forEach((id) => {
            const p = cacheProductos[cat][id];
            const precioMostrado = p.precioOferta ? `<span style="text-decoration:line-through; color:gray;">$${p.precio}</span> <span style="color:red; font-weight:bold;">$${p.precioOferta}</span>` : `$${p.precio}`;
            
            // ==========================================
            // 🚨 SEMÁFORO DE STOCK (Se activa si queda 1)
            // ==========================================
            let alertaStockStyle = "";
            let textoAlerta = "";
            let stockActual = p.stock !== undefined ? p.stock : 10;

            if (stockActual === 1) {
                alertaStockStyle = "border: 2px solid #ff4d4d; background: #fff5f5;";
                textoAlerta = `<span style="color: #d63031; font-weight: bold; font-size: 0.85rem; display: block; margin-top: 5px; padding: 3px; background: #ffe0e0; border-radius: 5px;">⚠️ ¡ÚLTIMA PIEZA EN STOCK!</span>`;
            }

            lista.innerHTML += `
                <div class="producto-item" style="${alertaStockStyle}">
                    <div class="info-admin">
                        <img src="${p.imagen}">
                        <div>
                            <strong>${p.Nombre}</strong><br>
                            <small style="color:#666;">${cat.replace(/_/g, ' ')}</small><br>
                            <small>${precioMostrado}</small>
                            ${textoAlerta} </div>
                    </div>
                    <div class="controles">
                        Stock: <input type="number" class="stock-input" value="${stockActual}" onchange="updateStockInd('${cat}','${id}',this.value)">
                        <button class="btn-edit" onclick="cargarEdicion('${cat}','${id}')">Editar</button>
                        <button class="btn-del" onclick="borrarInd('${cat}','${id}')">Eliminar</button>
                    </div>
                </div>`;
        });
    });
});
    function updateStockInd(cat, id, v) { db.ref('Productos/'+cat+'/'+id).update({stock:parseInt(v)}); }
    function borrarInd(cat, id) { if(confirm("¿Confirma la eliminación definitiva?")) db.ref('Productos/'+cat+'/'+id).remove(); }

    /* ==========================================
       GESTIÓN DE PAQUETES MATCH
       ========================================== */
    function agregarInputFotoExtra(url = "") {
        const container = document.getElementById('contenedor-fotos-extra');
        const idUnico = 'extra_match_' + Date.now() + Math.floor(Math.random() * 100);
        const div = document.createElement('div');
        div.style.display = 'flex'; div.style.gap = '10px'; div.style.marginBottom = '8px';
        div.innerHTML = `
            <input type="text" id="${idUnico}" class="input-foto-dinamica" placeholder="URL..." value="${url}" style="flex: 1; margin: 0;" readonly>
            <label class="btn-upload">📁 Subir <input type="file" accept="image/*" style="display: none;" onchange="subirAImgBB(this, '${idUnico}', 'estado-${idUnico}')"></label>
        `;
        const p = document.createElement('p'); p.id = `estado-${idUnico}`; p.className = 'status-msg';
        container.appendChild(div); container.appendChild(p);
    }

    function guardarMatch() {
        const idExistente = document.getElementById('edit-match-id').value;
        const nombre = document.getElementById('match-nombre').value;
        const precio = document.getElementById('match-precio').value;
        const precioOferta = document.getElementById('match-precio-oferta').value;
        const stock = document.getElementById('match-stock').value;
        const imagen = document.getElementById('match-imagen').value;
        const desc = document.getElementById('match-desc').value;

        let fotosExtraArray = [];
        document.querySelectorAll('.input-foto-dinamica').forEach(input => { if(input.value.trim() !== "") fotosExtraArray.push(input.value.trim()); });

        if(!nombre || !precio || !imagen) return alert("Faltan datos.");
        const idMatch = idExistente || nombre.replace(/\s+/g, '_').toLowerCase() + "_" + Date.now();
        db.ref('PaquetesMatch/' + idMatch).set({ 
            Nombre: nombre, precioTotal: precio, precioOferta: precioOferta || "", stock: parseInt(stock), imagenGrupal: imagen, descripcion: desc, fotosExtra: fotosExtraArray
        }).then(() => { alert("Paquete guardado."); cancelarEdicionMatch(); });
    }

    function cargarEdicionMatch(id) {
        const data = cacheMatches[id];
        if(!data) return;
        document.getElementById('titulo-form-match').innerText = "✏️ Editando Paquete: " + data.Nombre;
        document.getElementById('edit-match-id').value = id;
        document.getElementById('match-nombre').value = data.Nombre;
        document.getElementById('match-precio').value = data.precioTotal;
        document.getElementById('match-precio-oferta').value = data.precioOferta || "";
        document.getElementById('match-stock').value = data.stock !== undefined ? data.stock : 10;
        document.getElementById('match-imagen').value = data.imagenGrupal;
        document.getElementById('match-desc').value = data.descripcion || "";
        
        document.getElementById('contenedor-fotos-extra').innerHTML = "";
        if(data.fotosExtra) data.fotosExtra.forEach(url => agregarInputFotoExtra(url));

        document.getElementById('btn-match-main').innerText = "Guardar Cambios";
        document.getElementById('btn-match-cancel').style.display = "block";
        window.scrollTo(0, document.getElementById('titulo-form-match').offsetTop - 20); 
    }

    function cancelarEdicionMatch() {
        document.getElementById('titulo-form-match').innerText = "👥 Registrar Paquete MATCH";
        document.getElementById('edit-match-id').value = ""; document.getElementById('match-nombre').value = "";
        document.getElementById('match-precio').value = ""; document.getElementById('match-precio-oferta').value = "";
        document.getElementById('match-stock').value = "10"; document.getElementById('match-imagen').value = "";
        document.getElementById('match-desc').value = ""; document.getElementById('contenedor-fotos-extra').innerHTML = ""; 
        document.getElementById('btn-match-main').innerText = "Guardar Paquete";
        document.getElementById('btn-match-cancel').style.display = "none";
    }

    db.ref('PaquetesMatch').on('value', (snapshot) => {
        const listaMatch = document.getElementById('lista-match');
        listaMatch.innerHTML = ""; cacheMatches = snapshot.val() || {};
        Object.keys(cacheMatches).forEach((id) => {
            const p = cacheMatches[id];
            const precioMostrado = p.precioOferta ? `<span style="text-decoration:line-through; color:gray;">$${p.precioTotal}</span> <span style="color:red; font-weight:bold;">$${p.precioOferta}</span>` : `$${p.precioTotal}`;
            listaMatch.innerHTML += `
                <div class="producto-item" style="border-left-color:var(--azul-match)">
                    <div class="info-admin"><img src="${p.imagenGrupal}">
                    <div><strong>${p.Nombre}</strong><br><small>MXN ${precioMostrado}</small></div></div>
                    <div class="controles">
                        Stock: <input type="number" class="stock-input" value="${p.stock !== undefined ? p.stock : 10}" onchange="updateStockMatch('${id}',this.value)">
                        <button class="btn-edit" onclick="cargarEdicionMatch('${id}')">Editar</button>
                        <button class="btn-del" onclick="borrarMatch('${id}')">Eliminar</button>
                    </div>
                </div>`;
        });
    });
    function updateStockMatch(id, v) { db.ref('PaquetesMatch/'+id).update({stock:parseInt(v)}); }
    function borrarMatch(id) { if(confirm("¿Confirma la eliminación definitiva?")) db.ref('PaquetesMatch/'+id).remove(); }

    /* ==========================================
       GALERÍA DE CLIENTES
       ========================================== */
    function guardarFotoGaleria() {
        const imagen = document.getElementById('galeria-imagen').value;
        if(!imagen) return alert("Selecciona imagen.");
        const idFoto = "galeria_" + Date.now();
        db.ref('GaleriaMatch/' + idFoto).set({ imagen: imagen }).then(() => { location.reload(); });
    }
    db.ref('GaleriaMatch').on('value', (snapshot) => {
        const listaGaleria = document.getElementById('lista-galeria');
        listaGaleria.innerHTML = "";
        snapshot.forEach((child) => {
            const f = child.val(); const id = child.key;
            listaGaleria.innerHTML += `<div class="producto-item" style="border-left-color:var(--verde-gallery)"><div class="info-admin"><img src="${f.imagen}"></div><div class="controles"><button class="btn-del" onclick="borrarFotoGaleria('${id}')">Eliminar</button></div></div>`;
        });
    });
    function borrarFotoGaleria(id) { if(confirm("¿Eliminar de galería?")) db.ref('GaleriaMatch/'+id).remove(); }


/* =======================================================
   🤖 ROBOT COMPRESOR MASIVO "PRO" (Portada + Fotos Extra)
   ======================================================= */
async function optimizarTodaLaBaseDeDatos() {
    if(!confirm("⚠️ ¿Seguro que quieres iniciar el robot compresor PRO?\n\nEsto va a escanear todo tu catálogo, COMPRIMIRÁ LA PORTADA Y TODAS LAS FOTOS EXTRA que estén pesadas, las resubirá solitas y actualizará Firebase. Puede tardar varios minutos si tienes muchos productos, NO CIERRES LA PESTAÑA hasta que termine.")) return;
    
    let portadasActualizadas = 0;
    let fotosExtraActualizadas = 0;
    const apiKey = '9dffd47ea3a69c56e2c99ae7dea49aa3'; // Tu llave de ImgBB
    
    console.log("🚀 Iniciando escaneo PRO de la base de datos...");
    const statusGlobal = alert("⌛ Iniciando proceso. Revisa la consola (F12) para ver el progreso real. Esto tardará.");

    // Función interna para comprimir y subir (para reutilizar código)
    const procesarYSubirImagen = async (urlOriginal, nombreProd, tipoFoto) => {
        try {
            // 1. Descargamos la imagen original
            const img = new Image();
            img.crossOrigin = "Anonymous"; 
            img.src = urlOriginal;
            
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${urlOriginal}`));
            });
            
            // 2. ¿Es muy grande?
            if (img.width <= 800 && img.height <= 800) {
                console.log(`   ✅ ${tipoFoto} de "${nombreProd}" ya está ligerita.`);
                return null; // Retornamos null para indicar que no hubo cambios
            }
            
            console.log(`   ⚠️ ${tipoFoto} de "${nombreProd}" pesada (${img.width}x${img.height}). Comprimiendo...`);

            // 3. Comprimimos
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
            } else {
                if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // 4. Convertimos a Blob ligero
            const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.75));
            const file = new File([blob], "optimizada.jpg", { type: 'image/jpeg' });
            
            // 5. Subimos a ImgBB
            const formData = new FormData();
            formData.append('image', file);
            
            const respuesta = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body: formData });
            const datos = await respuesta.json();
            
            if (datos.success) {
                return datos.data.url; // Retornamos la nueva URL
            } else {
                throw new Error("Error en respuesta de ImgBB");
            }
        } catch(e) {
            console.error(`   ❌ Falló el proceso para ${tipoFoto} de ${nombreProd}.`, e);
            return null;
        }
    };

    // --- BÚCLE PRINCIPAL ---
    // Recorremos toda la base de datos que ya tenemos cargada en cacheProductos
    for (const cat in cacheProductos) {
        for (const id in cacheProductos[cat]) {
            const prod = cacheProductos[cat][id];
            console.log(`------ 📦 Procesando Producto: ${prod.Nombre} ------`);
            
            let cambiosEnFirebase = {};
            let necesitaActualizar = false;

            // --- A. PROCESAR PORTADA ---
            if (prod.imagen) {
                const nuevaUrlPortada = await procesarYSubirImagen(prod.imagen, prod.Nombre, "Foto Portada");
                if (nuevaUrlPortada) {
                    cambiosEnFirebase.imagen = nuevaUrlPortada;
                    necesitaActualizar = true;
                    portadasActualizadas++;
                }
            }

            // --- B. PROCESAR FOTOS EXTRA (LA PARTE QUE ME FALTÓ, GÜEY) ---
            if (prod.fotosExtra && Array.isArray(prod.fotosExtra) && prod.fotosExtra.length > 0) {
                console.log(`   🔍 Revisando ${prod.fotosExtra.length} fotos extra...`);
                let nuevasFotosExtra = [...prod.fotosExtra]; // Copia del array original
                let huboCambioEnExtras = false;

                for (let i = 0; i < nuevasFotosExtra.length; i++) {
                    const urlExtra = nuevasFotosExtra[i];
                    const nuevaUrlExtra = await procesarYSubirImagen(urlExtra, prod.Nombre, `Foto Extra #${i+1}`);
                    
                    if (nuevaUrlExtra) {
                        nuevasFotosExtra[i] = nuevaUrlExtra; // Reemplazamos la URL vieja por la nueva
                        huboCambioEnExtras = true;
                        fotosExtraActualizadas++;
                    }
                }

                if (huboCambioEnExtras) {
                    cambiosEnFirebase.fotosExtra = nuevasFotosExtra;
                    necesitaActualizar = true;
                }
            }

            // --- C. ACTUALIZAR FIREBASE SI HUBO CAMBIOS ---
            if (necesitaActualizar) {
                await db.ref(`Productos/${cat}/${id}`).update(cambiosEnFirebase);
                console.log(`🔥 ¡BASE DE DATOS ACTUALIZADA para ${prod.Nombre}!`);
            } else {
                console.log(`✅ ${prod.Nombre} ya estaba optimizado al 100%.`);
            }
        }
    }
    
    alert(`🎉 ¡TRABAJO TERMINADO, GÜEY!\n\nEl robot PRO limpió todo:\n- Portadas arregladas: ${portadasActualizadas}\n- Fotos Extra arregladas: ${fotosExtraActualizadas}\n\nTu catálogo y tus modals ya deben volar.`);
    console.log("Terminó el proceso masivo PRO.");
}


/* ==========================================
   SWITCH DE EMERGENCIA (MODO MANTENIMIENTO)
   ========================================== */
function toggleMantenimiento(estado) {
    if(confirm(estado ? "¿Seguro que quieres APAGAR la tienda? Los clientes verán la pantalla de mantenimiento." : "¿Seguro que quieres PRENDER la tienda? Ya podrán comprar de nuevo.")) {
        db.ref('Configuracion/mantenimiento').set(estado)
        .then(() => {
            alert(estado ? "🛑 Tienda APAGADA (Modo Mantenimiento)" : "✅ Tienda EN LÍNEA");
        }).catch(err => {
            alert("Hubo un error: " + err);
        });
    }
}
