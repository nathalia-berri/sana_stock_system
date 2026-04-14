# Arquivo principal da aplicação FastAPI.
# Aqui ficam:
# - criação da aplicação
# - CORS
# - criação das tabelas
# - inclusão dos routers
# - rota raiz
# =========================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from models import UserModel, CategoriaModel, MaterialModel
from routers.auth import router as auth_router
from routers.materiais import router as materiais_router


# =========================================================
# CRIAÇÃO DA APLICAÇÃO
# =========================================================

app = FastAPI(title="SANA API")


# =========================================================
# CONFIGURAÇÃO DE CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# CRIAÇÃO DAS TABELAS NO BANCO
# =========================================================
# Isso faz o SQLAlchemy criar as tabelas definidas nos models
# caso elas ainda não existam.
# =========================================================

Base.metadata.create_all(bind=engine)


# =========================================================
# INCLUSÃO DAS ROTAS
# =========================================================

app.include_router(auth_router)
app.include_router(materiais_router)


# =========================================================
# ROTA RAIZ
# =========================================================

@app.get("/")
def read_root():
    return {"message": "SANA Backend funcionando com MySQL!"}