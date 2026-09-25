from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from conexion import get_connection, initDb
from sqlite3 import Connection
from manage.tiendaManage import TiendaManage
from model import Producto

tiendaManage = TiendaManage()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    initDb()

@app.get("/")
def read_root():
    return "hello world"

@app.get("/mostrar_productos")
def mostrarProducto(connexion: Connection = Depends(get_connection)):
    return tiendaManage.mostrarProductos(connexion)

@app.post("/agregar_productos")
def agregaProductos(producto: Producto, connexion: Connection = Depends(get_connection)):
    return tiendaManage.agregarProducto(producto, connexion)

@app.put("/editar_producto")
def editarProducto(id: int, producto: Producto, connexion: Connection = Depends(get_connection)):
    return tiendaManage.editarProducto(producto, connexion, id)

@app.get("/eliminar_producto")
def eliminarProducto(id: int, connexion: Connection = Depends(get_connection)):
    return tiendaManage.eliminarProducto(id, connexion)

@app.get("/filtrar_por_precio")
def filtrarPorPrecio(
    precio_min: int,
    precio_max: int,
    connexion: Connection = Depends(get_connection)
):
    return tiendaManage.filtrarPorPrecio(int(precio_min), int(precio_max), connexion)