# =========================================================
# Este arquivo contém as rotas relacionadas a Relatórios.
# =========================================================

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from models import MovimentacaoModel, MaterialModel
from datetime import datetime
from typing import Optional
import pandas as pd
import io
from fastapi.responses import StreamingResponse

router = APIRouter(
    prefix="/relatorios",
    tags=["Relatórios"]
)

from datetime import datetime, timedelta   # <-- precisa importar timedelta

# -----------------------------------------------------
# GET - Relatório de movimentações filtradas
# -----------------------------------------------------
@router.get("/movimentacoes")
def relatorio_movimentacoes(
    db: Session = Depends(get_db),
    data_inicio: Optional[datetime] = Query(None),
    data_fim: Optional[datetime] = Query(None),
    categoria_id: Optional[int] = Query(None)
):
    query = db.query(MovimentacaoModel)

    if data_inicio:
        query = query.filter(MovimentacaoModel.data >= data_inicio)
    if data_fim:
        # adiciona 1 dia e subtrai 1 segundo para pegar até 23:59:59
        fim = data_fim + timedelta(days=1) - timedelta(seconds=1)
        query = query.filter(MovimentacaoModel.data <= fim)
    if categoria_id:
        query = query.join(MaterialModel).filter(MaterialModel.categoria_id == categoria_id)

    entradas = query.filter(MovimentacaoModel.tipo == "entrada").count()
    saidas = query.filter(MovimentacaoModel.tipo == "saida").count()

    return {
        "titulo": "Movimentações filtradas",
        "descricao": f"Entradas: {entradas}, Saídas: {saidas}",
        "data": datetime.utcnow().isoformat()
    }

# -----------------------------------------------------
# GET - Relatório de estoque atual com filtro de categoria
# -----------------------------------------------------
@router.get("/estoque-atual")
def relatorio_estoque_atual(
    db: Session = Depends(get_db),
    categoria_id: Optional[int] = Query(None)
):
    query = db.query(MaterialModel)
    if categoria_id:
        query = query.filter(MaterialModel.categoria_id == categoria_id)

    materiais = query.all()
    relatorio = [
        {
            "codigo": m.codigo,
            "nome": m.nome,
            "minimo": m.estoque_minimo,
            "estoque_atual": m.estoque_atual,
            "status": "ATENÇÃO" if m.estoque_atual <= m.estoque_minimo else "OK"
        }
        for m in materiais
    ]
    return {
        "titulo": "Estoque atual",
        "descricao": "Situação dos materiais em estoque",
        "data": datetime.utcnow().isoformat(),
        "materiais": relatorio
    }

from sqlalchemy import func

# -----------------------------------------------------
# GET - Relatório de estoque em uma data
# -----------------------------------------------------
@router.get("/estoque-em-data")
def relatorio_estoque_em_data(
    db: Session = Depends(get_db),
    data_fim: datetime = Query(...)
):
    materiais = db.query(MaterialModel).all()
    relatorio = []

    for m in materiais:
        entradas = db.query(func.sum(MovimentacaoModel.quantidade)).filter(
            MovimentacaoModel.material_id == m.id,
            MovimentacaoModel.tipo == "entrada",
            MovimentacaoModel.data <= data_fim
        ).scalar() or 0

        saidas = db.query(func.sum(MovimentacaoModel.quantidade)).filter(
            MovimentacaoModel.material_id == m.id,
            MovimentacaoModel.tipo == "saida",
            MovimentacaoModel.data <= data_fim
        ).scalar() or 0

        estoque = entradas - saidas

        relatorio.append({
            "codigo": m.codigo,
            "nome": m.nome,
            "estoque_em_data": estoque,
            "minimo": m.estoque_minimo,
            "status": "ATENÇÃO" if estoque <= m.estoque_minimo else "OK"
        })

    return {
        "titulo": f"Estoque em {data_fim.date()}",
        "descricao": "Situação dos materiais na data escolhida",
        "data": datetime.utcnow().isoformat(),
        "materiais": relatorio
    }
# -----------------------------------------------------
# GET - Exportar estoque atual em Excel
# -----------------------------------------------------
@router.get("/estoque-excel")
def exportar_estoque_excel(
    db: Session = Depends(get_db),
    categoria_id: Optional[int] = Query(None)
):
    query = db.query(MaterialModel)
    if categoria_id:
        query = query.filter(MaterialModel.categoria_id == categoria_id)

    materiais = query.all()

    # monta dataframe
    df = pd.DataFrame([{
        "Código": m.codigo,
        "Nome": m.nome,
        "Categoria": m.categoria,
        "Estoque Atual": m.estoque_atual,
        "Mínimo": m.estoque_minimo,
        "Status": "ATENÇÃO" if m.estoque_atual <= m.estoque_minimo else "OK"
    } for m in materiais])

    # salva em memória
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Estoque")
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=estoque.xlsx"}
    )