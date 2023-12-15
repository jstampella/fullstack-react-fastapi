from pydantic import BaseModel
from typing import List, Union
from json import JSONEncoder

class ErrorResponse(BaseModel):
    detail: Union[List, str]
    code: int
    def to_dict(self):
        return {
            "detail": self.detail,
            "code": self.code,
        }


class MiExcepcion(Exception):
    def __init__(self, mensaje="Error Generico", code=500, error=None):
        self.error = error
        self.mensaje = mensaje
        self.code = code

    def __str__(self):
        return f'code: {self.code} - {self.mensaje} - Detail: {self.error}'