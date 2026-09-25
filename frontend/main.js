const contenedorProductos = document.querySelector('.contenedorDeProductos');
const nav = document.querySelector('.nav');
const formEditar = document.querySelector('.formEditar')
const formAgregar = document.querySelector('.formAgregar')
const formBuscar = document.querySelector('.formBuscar')

async function obtenerProductos() {
    try {
        const response = await fetch('http://127.0.0.1:8000/mostrar_productos');

        if (!response.ok) throw new Error('Error en la solicitud');

        const data = await response.json();

        return data
    } catch (error) {
        console.error('Error:', error);
    }
}
async function eliminarProducto(idProducto) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/eliminar_producto?id=${idProducto}`);

        if (response.ok) {
            console.log('eliminado');
            location.reload();
        } else {
            console.error('Error:', response.status);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
}
async function editarProducto(id, nombre, precio, stock) {
    try {
        const response = await fetch(
            `http://127.0.0.1:8000/editar_producto?id=${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: nombre,
                    precio: precio,
                    stock: stock
                })
            }
        );

        const data = await response.json();

        console.log(data);

    } catch (error) {
        console.error("Error al editar el producto:", error);
    }
}
async function agregarProducto(nombre, precio, stock) {
    try {
        const response = await fetch('http://127.0.0.1:8000/agregar_productos', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre,
                precio: parseFloat(precio),
                stock: parseInt(stock)
            })
        });

        return await response.json();

    } catch (error) {
        console.error("Error:", error);
    }
}
async function filtrarBusqueda(precioMin, precioMax) {
    const response = await fetch(`http://127.0.0.1:8000/filtrar_por_precio?precio_min=${precioMin}&precio_max=${precioMax}`)

    try {
        if (!response.ok) throw new Error('Error en la solicitud');

        const data = await response.json();
        console.log(data)

        return data
    } catch (error) {
        console.error('Error:', error);
    }
}

const listaProductos = await obtenerProductos()



inicio()

function inicio() {
    renderizarProductos(listaProductos)
}

function crearTarjetaProducto(producto) {
    // creo el coontenedor
    const div = document.createElement('article');
    div.className = 'productoContent'

    // creo el contendor del nombre
    const nombreProducto = document.createElement('h3')
    nombreProducto.className = 'nombreProducto'
    nombreProducto.textContent = producto.nombre

    // creo el contendor del stock
    const stock = document.createElement('p')
    stock.className = 'stockProducto'
    stock.textContent = `stock disponible: ${producto.stock}`

    // creo el contendor del precio
    const precio = document.createElement('p')
    precio.className = 'precioProducto'
    precio.textContent = `$${producto.precio}`

    // creo el la img del carrito
    const carritoImg = document.createElement('img')
    carritoImg.className = 'carritoImg'
    carritoImg.src = "../img/carrito.svg"

    // creo el boton de eliminar
    const btnEliminar = document.createElement('img')

    btnEliminar.className = 'eliminarProducto'
    btnEliminar.src = "../img/eliminar.svg"

    btnEliminar.addEventListener("click", async function () {
        await eliminarProducto(producto.id);

        eliminarOEditarBtn(btnEliminar.className)
    });

    // creo el boton de editar
    const btnEditar = document.createElement("img");

    btnEditar.className = "EditarProducto";
    btnEditar.src = "../img/editar.svg";

    btnEditar.addEventListener("click", async function () {
        editarProductoForm(producto.id, producto.nombre, producto.stock, producto.precio);
        formEditar.style.display = "flex"
    });

    div.append(nombreProducto, stock, precio, carritoImg, btnEliminar, btnEditar)
    return div
}

function renderizarProductos(productos) {
    contenedorProductos.innerHTML = ''
    const fragment = document.createDocumentFragment();

    productos.forEach(producto => {
        const tarjeta = crearTarjetaProducto(producto);
        fragment.appendChild(tarjeta);
    });

    contenedorProductos.appendChild(fragment);
}



nav.addEventListener("click", function (event) {
    const e = event.target

    if (e.dataset.nombre == "eliminar" || e.dataset.nombre == "Editar") {

        eliminarOEditarBtn(e.dataset.nombre, e.dataset.contrario)

    } else if (e.dataset.nombre == "inicio") {
        inicio()
    } else if (e.dataset.nombre == "agregar") {
        formAgregar.style.display = 'flex'
    } else if (e.dataset.nombre == 'buscar'){
        formBuscar.style.display = 'flex'
    }

});

document.getElementById('cancelar').addEventListener("click", function () {
    formEditar.style.display = "none"
});

function eliminarOEditarBtn(accion, contrario) {

    const productos = document.querySelectorAll(`.${accion}Producto`);
    const productosContrarios = document.querySelectorAll(`.${contrario}Producto`);

    productos.forEach(elemento => {
        elemento.style.display =
            elemento.style.display === "block" ? "none" : "block";
    });


    productosContrarios.forEach(elemento => {
        elemento.style.display = "none";
    });
}

function editarProductoForm(id, nombreProducto, stockProducto, precioProducto) {
    const nombre = document.getElementById('nombre')
    const stock = document.getElementById('stock')
    const precio = document.getElementById('precio')
    const editar = document.getElementById('Editar')

    nombre.value = nombreProducto
    stock.value = stockProducto
    precio.value = precioProducto

    editar.addEventListener("click", async function (event) {
        event.preventDefault();

        await editarProducto(
            id,
            nombre.value,
            Number(precio.value),
            Number(stock.value)
        );

        location.reload();
    });
}

async function agregarProductoFrom() {
    const nombre = document.getElementById('nombreAgregar')
    const stock = document.getElementById('stockAgregar')
    const precio = document.getElementById('precioAgregar')

    await agregarProducto(nombre.value, parseInt(precio.value), parseInt(stock.value))

}

document.getElementById('agregarProducto').addEventListener('click', function () {
    agregarProductoFrom()
})

document.getElementById('buscar').addEventListener("click", async function(event){
    event.preventDefault()
    const precioMin = document.querySelector('.Min').value
    const precioMax = document.querySelector('.Max').value

    parseInt(precioMin)
    parseInt(precioMax)

    renderizarProductos(await filtrarBusqueda(precioMin, precioMax))
    formBuscar.style.display = 'none'
    precioMax = ''
    precioMin = ''
});

document.getElementById('cancelarBusqueda').addEventListener('click', function(event){
    event.preventDefault()
    formBuscar.style.display = 'none'
})