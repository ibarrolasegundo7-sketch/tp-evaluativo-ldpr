import sqlite3
from model import Producto

class TiendaManage:
    def __init__(self):
        pass

    def filtrarPorPrecio(self, precio_min, precio_max, connecion: sqlite3.Connection):
        cursor = connecion.cursor()

        cursor.execute(
            "SELECT * FROM productos WHERE precio BETWEEN ? AND ?",
            (precio_min, precio_max)
        )

        productos = cursor.fetchall()

        return productos

    def mostrarProductos(self, connecion: sqlite3.Connection):
        res = connecion.execute("SELECT * FROM productos").fetchall()

        return [dict(item) for item in res]

    def agregarProducto(self, producto: Producto, connecion: sqlite3.Connection):
        connecion.execute(
            "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)",
            (producto.nombre, producto.precio, producto.stock)
        )
        connecion.commit()
        return {"mensaje": "producto agregado correctamente"}

    def editarProducto(self, producto: Producto, connection: sqlite3.Connection, id: int):
        connection.execute(
            "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?",
            (producto.nombre, producto.precio, producto.stock, id)
        )

        connection.commit()

        return {"mensaje": "Producto editado correctamente"}

    def eliminarProducto(self, id: int, connection: sqlite3.Connection):
        connection.execute(
            "DELETE FROM productos WHERE id = ?",
            (id,)
        )

        return {"mensaje": "producto eliminado correctamente"}