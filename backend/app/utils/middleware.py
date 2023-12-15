from app.models.ErrorResponse import MiExcepcion
from fastapi import FastAPI, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

app = FastAPI()
security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Aquí puedes implementar tu propia lógica para verificar el token
    token = credentials.credentials

    if not token:
        raise MiExcepcion(code=401, mensaje="Token requerido")
    elif token != "mi_token_secreto":
        raise MiExcepcion(code=403, mensaje="Token no válido")