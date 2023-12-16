from app.models.common import MiExcepcion
from app.utils.jwt import decode_token
from fastapi import FastAPI, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


app = FastAPI()
security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Aquí puedes implementar tu propia lógica para verificar el token
    token = credentials.credentials
    user_response = decode_token(token)
    if not token:
        raise MiExcepcion(code=401, mensaje="Token requerido")
    elif user_response is None:
        raise MiExcepcion(code=403, mensaje="Token no válido")