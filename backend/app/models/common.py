from pydantic import BaseModel, Field
from typing import List, Union, Type, Optional
from pydantic import BaseModel, create_model

class MiExcepcion(Exception):
    def __init__(self, mensaje="Error Generico", code=500, error=None):
        self.error = error
        self.mensaje = mensaje
        self.code = code

    def __str__(self):
        return f'code: {self.code} - {self.mensaje} - Detail: {self.error}'
    

from typing import TypeVar, Generic

DataT = TypeVar("DataT")

class ResponseModel(BaseModel, Generic[DataT]):
    status: str = Field(...)
    data: DataT
    message: str = Field(...)
    code: Optional[int] = None

    def to_dict(self):
        return {
            "status": self.status,
            "data": self.data,
            "message": self.message,
            "code": self.code,
        }
    

def create_response_model(name: str, model: Type[BaseModel]):
    return create_model(
        name,
        status=(str, Field(...)),
        data=(model, Field(...)),
        message=(str, Field(...)),
        code=(Optional[int], Field(0))
    )