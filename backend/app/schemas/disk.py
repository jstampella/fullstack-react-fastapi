from typing import Optional
from pydantic import BaseModel

class DiskSchema(BaseModel):
    id: Optional[int] = None
    tipo: str
    tamanio: str
    marca: str
