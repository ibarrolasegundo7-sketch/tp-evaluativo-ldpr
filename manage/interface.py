from abc import ABC, abstractmethod
import sqlite3

class TiendaManageInterface(ABC):
    @abstractmethod
    def filtrarPorPrecio(self, precio_min, precio_max, connecion: sqlite3.Connection):
        pass

    @abstractmethod
    def mostrarProductos(self, connecion: sqlite3.Connection):
        pass

    @abstractmethod
    def agregarProducto(self, producto: Producto, connecion: sqlite3.Connection):
        pass

    @abstractmethod
    def editarProducto(self, producto: Producto, connection: sqlite3.Connection, id: int):
        pass

    @abstractmethod
    def eliminarProducto(self, id: int, connection: sqlite3.Connection):
        pass