# Arquivo responsável pela autenticação.
# Aqui ficam:
# - login
# - geração do token JWT
# - leitura do usuário logado
# - funções auxiliares de autenticação
# =========================================================

from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import UserModel


# =========================================================
# CONFIGURAÇÃO DO ROUTER
# =========================================================

router = APIRouter(tags=["Autenticação"])

# =========================================================
# CONFIGURAÇÃO DO TOKEN JWT
# =========================================================

SECRET_KEY = "sana-super-secret-2026"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# =========================================================
# ESQUEMA DE AUTENTICAÇÃO
# =========================================================
# O campo username será usado como email no login.
# =========================================================

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

# =========================================================
# MODELOS DE RESPOSTA
# =========================================================

class User(BaseModel):
    email: str
    nome: Optional[str] = None
    role: str
    ativo: bool


class Token(BaseModel):
    access_token: str
    token_type: str

# =========================================================
# FUNÇÕES AUXILIARES
# =========================================================

import bcrypt

def verify_password(plain_password: str, db_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode(), db_password.encode())
    except Exception:
        return False


def get_user_by_email(db: Session, email: str) -> Optional[UserModel]:
    return db.query(UserModel).filter(UserModel.email == email).first()


def authenticate_user(db: Session, email: str, password: str) -> Optional[UserModel]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.senha_hash):
        return None
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> UserModel:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não autorizado",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user_by_email(db, email)
    if user is None:
        raise credentials_exception

    if not user.ativo:
        raise HTTPException(status_code=400, detail="Usuário inativo")

    # Agora retorna o modelo completo do banco, que tem o campo id
    return user

# =========================================================
# ROTAS
# =========================================================

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    # O campo "username" do form será tratado como email
    user = authenticate_user(db, form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Adiciona o role no token
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me", response_model=User)
async def read_users_me(current_user: UserModel = Depends(get_current_user)):
    # Converte para schema de resposta (sem senha)
    return User(
        email=current_user.email,
        nome=current_user.nome,
        role=current_user.role,
        ativo=current_user.ativo
    )