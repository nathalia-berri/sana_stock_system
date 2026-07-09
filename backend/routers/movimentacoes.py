# =========================================================
# Este arquivo contém as rotas relacionadas às movimentações.
#
# Rotas disponíveis:
# - POST   /movimentacoes/     -> registrar movimentação
# - GET    /movimentacoes/     -> listar todas as movimentações
# - GET    /movimentacoes/{id} -> buscar movimentação por id
# =========================================================

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import MovimentacaoModel, MaterialModel, UserModel
from schemas import MovementCreate, MovementOut
from routers.auth import get_current_user, User
from datetime import datetime
import pytz
from routers.auth import get_current_user

# =========================================================
# CONFIGURAÇÃO DO ROUTER
# =========================================================
router = APIRouter(
    prefix="/movimentacoes",
    tags=["Movimentações"]
)

# =========================================================
# POST - REGISTRAR MOVIMENTAÇÃO
# =========================================================
@router.post("/", response_model=MovementOut, status_code=status.HTTP_201_CREATED)
def registrar_movimentacao(
    mov: MovementCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Bloqueia acesso se não for admin
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado")

    material = db.query(MaterialModel).filter(MaterialModel.id == mov.material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material não encontrado")

    if mov.tipo.lower() == "entrada":
        material.estoque_atual += mov.quantidade
    elif mov.tipo.lower() == "saida":
        if material.estoque_atual < mov.quantidade:
            raise HTTPException(status_code=400, detail="Estoque insuficiente")
        material.estoque_atual -= mov.quantidade
    else:
        raise HTTPException(status_code=400, detail="Tipo inválido (use 'entrada' ou 'saida')")

    brasilia = pytz.timezone("America/Sao_Paulo")

    nova_mov = MovimentacaoModel(
        material_id=mov.material_id,
        tipo=mov.tipo,
        quantidade=mov.quantidade,
        usuario_id=user.id,
        area=mov.area,
        responsavel=user.nome,
        data=datetime.now(brasilia)
    )

    db.add(nova_mov)
    db.commit()
    db.refresh(nova_mov)
    db.refresh(material)

    return {
        "id": nova_mov.id,
        "tipo": nova_mov.tipo,
        "quantidade": nova_mov.quantidade,
        "usuario_id": nova_mov.usuario_id,
        "area": nova_mov.area,
        "responsavel": nova_mov.responsavel,
        "data": nova_mov.data,
        "material_nome": material.nome
    }

# =========================================================
# GET - LISTAR TODAS AS MOVIMENTAÇÕES
# =========================================================
@router.get("/", response_model=list[MovementOut])
def listar_movimentacoes(db: Session = Depends(get_db)):
    movimentos = (
        db.query(MovimentacaoModel, MaterialModel.nome.label("material_nome"))
        .join(MaterialModel, MovimentacaoModel.material_id == MaterialModel.id)
        .all()
    )

    resultado = []
    for mov, material_nome in movimentos:
        resultado.append({
            "id": mov.id,
            "tipo": mov.tipo,
            "quantidade": mov.quantidade,
            "usuario_id": mov.usuario_id,
            "area": mov.area,
            "responsavel": mov.responsavel,
            "data": mov.data,
            "material_nome": material_nome 
        })
    return resultado

# =========================================================
# GET - BUSCAR MOVIMENTAÇÃO POR ID
# =========================================================
@router.get("/{mov_id}", response_model=MovementOut)
def buscar_movimentacao(mov_id: int, db: Session = Depends(get_db)):
    mov = (
        db.query(MovimentacaoModel, MaterialModel.nome.label("material_nome"))
        .join(MaterialModel, MovimentacaoModel.material_id == MaterialModel.id)
        .filter(MovimentacaoModel.id == mov_id)
        .first()
    )
    if not mov:
        raise HTTPException(status_code=404, detail="Movimentação não encontrada")

    mov_model, material_nome = mov
    return {
        "id": mov_model.id,
        "tipo": mov_model.tipo,
        "quantidade": mov_model.quantidade,
        "usuario_id": mov_model.usuario_id,
        "area": mov_model.area,
        "responsavel": mov_model.responsavel,
        "data": mov_model.data,
        "material_nome": material_nome
    }
