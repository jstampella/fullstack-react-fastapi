from pydantic import BaseModel
from typing import List, Union
from json import JSONEncoder

class ErrorResponse(BaseModel):
    detail: Union[List, str]
    code: int


class MiExcepcion(Exception):
    def __init__(self, error,mensaje):
        self.error = error
        self.mensaje = mensaje
    
    def __str__(self):
        return f'{self.error} - {self.mensaje}'