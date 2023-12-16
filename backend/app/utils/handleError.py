from app.models.common import MiExcepcion, ResponseModel
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import ResponseValidationError
import json
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from psycopg2 import errors


async def custom_exception_handler(request, exc):
    code_status = 500
    if isinstance(exc, HTTPException):
        response = ResponseModel(status="error", data={}, message=exc.detail, code=exc.status_code) 
        return JSONResponse(
            status_code=exc.status_code,
            content=response.dict(),
        )
    elif isinstance(exc, MiExcepcion):
        if exc.error is None:
            code_status = exc.code
            error_response = ResponseModel(status="error", data={}, message=exc.mensaje, code=exc.code) 
        elif isinstance(exc.error, MiExcepcion):
            code_status = exc.error.code
            error_response = ResponseModel(status="error", data={}, message=exc.error.mensaje, code=exc.error.code) 
        elif isinstance(exc.error, IntegrityError):
            if isinstance(exc.error.orig, errors.ForeignKeyViolation):
                error_response = ResponseModel(status="Error en la clave foránea, verifique el id", data={}, message=exc.error.orig.diag.message_detail, code=500) 
            else:
                error_response = ResponseModel(status="Error de integridad de la base de datos", data={}, message=str(exc.error), code=500) 
        elif isinstance(exc.error, SQLAlchemyError):
            error_response = ResponseModel(status="Error SQL", data={}, message=str(exc.error), code=500) 
        else:
            error_response = ResponseModel(status="Error Generico", data={}, message=str(exc.error), code=500) 
    else:
        error_response = ResponseModel(status="Error en Servidor", data={}, message=str(exc), code=500) 

    return JSONResponse(
        status_code=code_status,
        content=error_response.to_dict(),
    )



async def validation_exception_handler(request: Request, exc: ResponseValidationError):
    errores = exc.errors()
    errores_serializables = []
    for error in errores:
        try:
            json.dumps(error)  # Verificar si el error es serializable en JSON
            errores_serializables.append(error)
        except TypeError:
            errores_serializables.append(str(error))  # Convertir a cadena si no es serializable
    json_errores = json.dumps(errores_serializables)
    error_response = ResponseModel(status="Error en Servidor", data={}, message=json_errores, code=400)
    return JSONResponse(
        status_code=400,
        content=error_response.dict()
    )