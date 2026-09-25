from pydantic import BaseModel

class Producto(BaseModel):
    nombre: str
    precio: int
    stock: int