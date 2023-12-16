from app.models.common import MiExcepcion
from app.models.user import UserModel
from sqlalchemy.orm import class_mapper
import base64
from cryptography.hazmat.primitives import hashes
from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import json

password_provided = "TuTextoUnicoYRaro"  # Este debe ser reemplazado por tu propio texto
password = password_provided.encode()  # Convertimos el texto a bytes

salt = b"2"*16  # Elige tu propio valor para la salt
kdf = PBKDF2HMAC(
    algorithm=hashes.SHA256,
    length=32,
    salt=salt,
    iterations=100000,
)
key = base64.urlsafe_b64encode(kdf.derive(password))  # Se puede usar directamente base64.urlsafe_b64encode(key)

fernet = Fernet(key)


def encript_pass(password:str):
    encrypted_password = fernet.encrypt(password.encode("utf-8"))
    encrypted_password_str = base64.urlsafe_b64encode(encrypted_password).decode()
    return encrypted_password_str

def decript_pass(password:str):
    try:
    # Suponiendo que 'stored_password_str' proviene de la base de datos
        stored_password_bytes = base64.urlsafe_b64decode(password)
        # Desencriptación
        decrypted_password = fernet.decrypt(stored_password_bytes).decode("utf-8")
        return decrypted_password
    except InvalidToken:
        raise MiExcepcion(code=404, mensaje="Error al decodificar password")
    except Exception:
        raise MiExcepcion(code=500, mensaje="Ocurrio un Error con el password")


def encode_token(payload: UserModel):
     # Convertir el objeto en un diccionario serializable
    payload_dict = {
        column.key: getattr(payload, column.key)
        for column in class_mapper(payload.__class__).mapped_table.c
    }
    # Convertir el JSON a cadena y luego a bytes
    json_str = json.dumps(payload_dict)
    json_bytes = json_str.encode('utf-8')
    encrypted_password_bytes = fernet.encrypt(json_bytes)
    encrypted_password_str = base64.urlsafe_b64encode(encrypted_password_bytes).decode()
    return encrypted_password_str


def decode_token(token:str):
    try:
        stored_password_bytes = base64.urlsafe_b64decode(token)
        decrypted_password_bytes = fernet.decrypt(stored_password_bytes)
        decrypted_password_str = decrypted_password_bytes.decode("utf-8")
        decrypted_json = json.loads(decrypted_password_str)
        return decrypted_json
    except InvalidToken as e:
        raise MiExcepcion(code=400, mensaje="El token es invalido")
    except Exception as e:
        raise MiExcepcion(code=500, mensaje="Ocurrio un Error con el token")