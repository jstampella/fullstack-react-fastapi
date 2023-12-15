from app.models.ErrorResponse import ErrorResponse, MiExcepcion
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import ResponseValidationError
import json
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from psycopg2 import errors


async def custom_exception_handler(request, exc):
    if isinstance(exc, HTTPException):
        error_response = ErrorResponse(detail=exc.detail, code=exc.status_code)
        return JSONResponse(
            status_code=exc.status_code,
            content=error_response.dict(),
        )
    elif isinstance(exc, MiExcepcion):
        if isinstance(exc.error, IntegrityError):
            if isinstance(exc.error.orig, errors.ForeignKeyViolation):
                error_response = ErrorResponse(detail=f'Error en la clave foránea, verifique el id: {exc.error.orig.diag.message_detail}', code=500)
            else:
                error_response = ErrorResponse(code=500, detail=f'Error de integridad de la base de datos: {str(exc.error)}')
        elif isinstance(exc.error, SQLAlchemyError):
            error_response = ErrorResponse(detail=f'Error SQL: {str(exc.error)}', code=500)
    
    if error_response is None:
        error_response = ErrorResponse(detail=f'Error Genérico: {str(exc)}', code=500)
    return JSONResponse(
        status_code=500,
        content=error_response.dict(),
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
    error_response = ErrorResponse(detail=json_errores, code=400)
    return JSONResponse(
        status_code=400,
        content=error_response.dict()
    )