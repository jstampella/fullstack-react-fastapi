from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

app = FastAPI()
security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Aquí puedes implementar tu propia lógica para verificar el token
    token = credentials.credentials

    if not token:
        raise HTTPException(status_code=401, detail="Token requerido")
    elif token != "mi_token_secreto":
        raise HTTPException(status_code=403, detail="Token no válido")