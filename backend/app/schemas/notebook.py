from typing import Optional
from pydantic import BaseModel

class NotebookSchema(BaseModel):
    id: Optional[int] = None
    marca: str
    modelo: str
    memoria: str
    disco_rigido_id: int
    placa_video: str
    precio: float

class NotebookUpdateSchema(BaseModel):
    marca: Optional[str] = None
    modelo: Optional[str] = None
    memoria: Optional[str] = None
    disco_rigido_id: Optional[int] = None
    placa_video: Optional[str] = None
    precio: Optional[float] = None