from typing import Optional, List
from pydantic import BaseModel

class NotebookSchema(BaseModel):
    id: Optional[int] = None
    marca: str
    modelo: str
    memoria: str
    disco_rigido_id: int
    placa_video: Optional[str] = None
    precio: float

class NotebookUpdateSchema(BaseModel):
    marca: Optional[str] = None
    modelo: Optional[str] = None
    memoria: Optional[str] = None
    disco_rigido_id: Optional[int] = None
    placa_video: Optional[str] = None
    precio: Optional[float] = None


class NotebookSearchSchema(NotebookUpdateSchema):
    limit: Optional[int] = None
    page: Optional[int] = None

class NotebookPaginationSchema(BaseModel):
    data: List[NotebookSchema]
    total: int
    limit: int
    page: int