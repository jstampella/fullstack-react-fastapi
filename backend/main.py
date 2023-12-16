from app.models.common import MiExcepcion
from fastapi import FastAPI, HTTPException
from fastapi.exceptions import ResponseValidationError 
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router as app_router
from app.utils.handleError import custom_exception_handler, validation_exception_handler
from app.config.metadata import tags_metadata
from app.config.database import engine, metadata, database

metadata.create_all(engine)


app = FastAPI(
    title="Backend - LAB4",
    description="a REST API using python and postgres",
    version="0.0.1",
    openapi_tags=tags_metadata
)


# Configuración de CORS
origins = [
   "http://localhost:5173",
   "http://localhost:3000",
   "http://localhost"
]
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await  database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/")
async def root():
    return "Backend - LAB4"

# Incluir las rutas desde el archivo router/__init__.py
app.include_router(app_router)

app.exception_handler(HTTPException)(custom_exception_handler)
app.exception_handler(Exception)(custom_exception_handler)
app.exception_handler(MiExcepcion)(custom_exception_handler)
app.exception_handler(ResponseValidationError)(validation_exception_handler)