# =========================================================
# Este arquivo contém as rotas relacionadas aos materiais.
#
# Rotas disponíveis:
# - GET    /materiais/         -> listar todos os materiais
# - GET    /materiais/{id}     -> buscar material por id
# - POST   /materiais/         -> cadastrar material
# - PUT    /materiais/{id}     -> atualizar material
# - DELETE /materiais/{id}     -> excluir material
# =========================================================

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import MaterialModel, CategoriaModel, MovimentacaoModel
from schemas import MaterialCreate, MaterialUpdate, MaterialOut
from datetime import datetime
import pytz
from routers.auth import get_current_user

brasilia = pytz.timezone("America/Sao_Paulo")

# =========================================================
# CONFIGURAÇÃO DO ROUTER
# =========================================================
# prefix -> faz todas as rotas começarem com /materiais
# tags   -> agrupa essas rotas no Swagger (/docs)
# =========================================================
router = APIRouter(
    prefix="/materiais",
    tags=["Materiais"]
)

# =========================================================
# FUNÇÃO AUXILIAR PARA CALCULAR O STATUS DO ESTOQUE
# =========================================================
# Regras:
# - estoque_atual < estoque_minimo  -> CRÍTICO
# - estoque_atual == estoque_minimo -> ATENÇÃO
# - estoque_atual > estoque_minimo  -> OK
# =========================================================
def calcular_status(estoque_atual, estoque_minimo) -> str:
    if estoque_atual < estoque_minimo:
        return "CRÍTICO"
    elif estoque_atual == estoque_minimo:
        return "ATENÇÃO"
    return "OK"

# =========================================================
# GET - LISTAR TODAS AS CATEGORIAS
# =========================================================
# Retorna todos os nomes de categorias cadastradas.
# Essa rota será usada pelo frontend para preencher o dropdown.
# =========================================================
@router.get("/categorias", response_model=list[str])
def listar_categorias(db: Session = Depends(get_db)):
    categorias = db.query(CategoriaModel).all()
    return [c.nome for c in categorias]

# =========================================================
# GET - Buscar materiais por nome/código (autocomplete)
# =========================================================
from fastapi import Query
from sqlalchemy import or_

@router.get("/search")
def buscar_materiais(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    materiais = db.query(MaterialModel).filter(
        or_(
            MaterialModel.nome.ilike(f"%{q}%"),
            MaterialModel.codigo.ilike(f"%{q}%")
        )
    ).all()

    return [
        {"id": m.id, "codigo": m.codigo, "nome": m.nome, "categoria": m.categoria}
        for m in materiais
    ]

# =========================================================
# GET - BUSCAR MATERIAL POR ID
# =========================================================
# Retorna um único material com base no id informado.
# Se não existir, devolve erro 404.
# =========================================================
@router.get("/{material_id}", response_model=MaterialOut)
def buscar_material(material_id: int, db: Session = Depends(get_db)):
    material = db.query(MaterialModel).filter(MaterialModel.id == material_id).first()
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material não encontrado"
        )
    return MaterialOut(
        id=material.id,
        codigo=material.codigo,
        nome=material.nome,
        categoria=material.categoria,
        categoria_id=material.categoria_id,
        unidade=material.unidade,
        estoque_minimo=material.estoque_minimo,
        estoque_atual=material.estoque_atual,
        localizacao=material.localizacao,
        ativo=material.ativo,
        status=calcular_status(material.estoque_atual, material.estoque_minimo)
    )

# =========================================================
# GET - LISTAR TODOS OS MATERIAIS
# =========================================================
# Busca todos os registros da tabela materiais.
# Se a tabela estiver vazia, devolve uma lista vazia [].
# =========================================================
@router.get("/", response_model=list[MaterialOut])
def listar_materiais(db: Session = Depends(get_db)):
    materiais = db.query(MaterialModel).all()
    return [
        MaterialOut(
            id=material.id,
            codigo=material.codigo,
            nome=material.nome,
            categoria=material.categoria,
            categoria_id=material.categoria_id,
            unidade=material.unidade,
            estoque_minimo=material.estoque_minimo,
            estoque_atual=material.estoque_atual,
            localizacao=material.localizacao,
            ativo=material.ativo,
            status=calcular_status(material.estoque_atual, material.estoque_minimo)
        )
        for material in materiais
    ]

# =========================================================
# POST - CRIAR NOVO MATERIAL
# =========================================================
# Recebe apenas nome, quantidade e categoria.
# Busca o id da categoria pelo nome informado.
# Os demais campos são preenchidos com valores padrão.
# =========================================================
@router.post("/", response_model=MaterialOut, status_code=status.HTTP_201_CREATED)
def criar_material(
    material: MaterialCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Bloqueia acesso se não for admin
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    # Busca a categoria pelo nome informado
    categoria = db.query(CategoriaModel).filter(
        CategoriaModel.nome == material.categoria
    ).first()

    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Categoria não encontrada"
        )

    # -----------------------------------------------------
    # Gera um código automático para o material (ex: MAT-XXX)
    # -----------------------------------------------------
    codigo_gerado = f"MAT-{material.nome[:3].upper()}"

    # -----------------------------------------------------
    # Cria o objeto do material com valores padrão
    # -----------------------------------------------------
    novo_material = MaterialModel(
        codigo=codigo_gerado,
        nome=material.nome,
        categoria=material.categoria,
        categoria_id=categoria.id,   # usa o id real da categoria
        unidade="un",                # unidade padrão
        estoque_minimo=0,            # mínimo padrão
        estoque_atual=0,             # estoque inicial zero
        localizacao=None,            # opcional
        ativo=True                   # sempre ativo ao criar
    )

    # -----------------------------------------------------
    # Salva no banco
    # -----------------------------------------------------
    db.add(novo_material)
    db.commit()
    db.refresh(novo_material)

    # -----------------------------------------------------
    # Retorna o objeto criado
    # -----------------------------------------------------
    return MaterialOut(
        id=novo_material.id,
        codigo=novo_material.codigo,
        nome=novo_material.nome,
        categoria=novo_material.categoria,
        categoria_id=novo_material.categoria_id,
        unidade=novo_material.unidade,
        estoque_minimo=novo_material.estoque_minimo,
        estoque_atual=novo_material.estoque_atual,
        localizacao=novo_material.localizacao,
        ativo=novo_material.ativo,
        status=calcular_status(novo_material.estoque_atual, novo_material.estoque_minimo)
    )

# =========================================================
# PUT - ATUALIZAR MATERIAL
# =========================================================
# Atualiza os campos de um material já existente.
# Só altera os campos que vierem preenchidos.
# =========================================================
@router.put("/{material_id}", response_model=MaterialOut)
def atualizar_material(
    material_id: int, 
    dados: MaterialUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
        
    # Bloqueia acesso se não for admin
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado")

    material = db.query(MaterialModel).filter(MaterialModel.id == material_id).first()
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material não encontrado"
        )

    # Guarda o estoque anterior para calcular movimentação
    estoque_anterior = material.estoque_atual

    # Se o código for alterado, verifica duplicidade
    if dados.codigo is not None and dados.codigo != material.codigo:
        codigo_existente = db.query(MaterialModel).filter(
            MaterialModel.codigo == dados.codigo
        ).first()
        if codigo_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Já existe um material com esse código"
            )

    # Atualiza somente os campos enviados
    if dados.codigo is not None: material.codigo = dados.codigo
    if dados.nome is not None: material.nome = dados.nome
    if dados.categoria is not None: material.categoria = dados.categoria
    if dados.categoria_id is not None: material.categoria_id = dados.categoria_id
    if dados.unidade is not None: material.unidade = dados.unidade
    if dados.estoque_minimo is not None: material.estoque_minimo = dados.estoque_minimo
    if dados.estoque_atual is not None:
        material.estoque_atual = dados.estoque_atual

        # -----------------------------------------------------
        # Cria movimentação automática ao alterar estoque
        # -----------------------------------------------------
        tipo = "entrada" if dados.estoque_atual > estoque_anterior else "saida"
        quantidade = abs(dados.estoque_atual - estoque_anterior)

        nova_mov = MovimentacaoModel(
            material_id=material.id,
            tipo=tipo,
            quantidade=quantidade,
            usuario_id=1,  # aqui você coloca o id do usuário logado
            area="Estoque Central",
            responsavel="Sistema",
            data=datetime.now(brasilia)   # grava no horário de Brasília
        )
        db.add(nova_mov)

    if dados.localizacao is not None: material.localizacao = dados.localizacao
    if dados.ativo is not None: material.ativo = dados.ativo

    db.commit()
    db.refresh(material)

    return MaterialOut(
        id=material.id,
        codigo=material.codigo,
        nome=material.nome,
        categoria=material.categoria,
        categoria_id=material.categoria_id,
        unidade=material.unidade,
        estoque_minimo=material.estoque_minimo,
        estoque_atual=material.estoque_atual,
        localizacao=material.localizacao,
        ativo=material.ativo,
        status=calcular_status(material.estoque_atual, material.estoque_minimo)
    )
# =========================================================
# DELETE - EXCLUIR MATERIAL
# =========================================================
# Remove um material da tabela a partir do id.
# Se não encontrar o id, devolve erro 404.
# =========================================================
@router.delete("/{material_id}", status_code=status.HTTP_200_OK)
def deletar_material(
    material_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Bloqueia acesso se não for admin
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado")

    material = db.query(MaterialModel).filter(MaterialModel.id == material_id).first()
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material não encontrado"
        )

    db.delete(material)
    db.commit()

    return {"message": "Material excluído com sucesso"}
