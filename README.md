# sana_stock_system

Sistema web completo para gestão de almoxarifado com controle de estoque, rastreabilidade de movimentações e relatórios gerenciais.

O projeto SANA Stock System surge da necessidade de modernizar o controle de materiais em almoxarifados. Processos manuais em papel são suscetíveis a erros de contagem, perdas não identificadas e falta de rastreabilidade sobre quem retirou cada item. A simples digitalização (planilhas Excel) não resolve problemas como estoque desatualizado em tempo real, validação de saídas por funcionário ou alertas automáticos de estoque mínimo.
O sistema proposto é uma solução completa para gestão de estoque de materiais, voltada para organizações que precisam controlar entradas, saídas, responsáveis e níveis de estoque com precisão e segurança. Ele foi planejado para tornar o processo mais rápido, confiável e totalmente auditável.

---

# Domínio do Problema

**SANA Stock System** resolve os problemas clássicos dos almoxarifados manuais:
❌ Estoque desatualizado entre planilhas e realidade física
❌ Sem rastreabilidade: "Quem retirou este material?"
❌ Perdas não identificadas sem responsável vinculado
❌ Alertas tardios de reposição (ruptura de estoque)

---

## Requisitos Funcionais (RF)
RF01 - CRUD completo de Materiais (código único, categoria, estoque atual/mínimo)
RF02 - CRUD de Categorias para organização
RF03 - CRUD de Funcionários (nome, matrícula, área)
RF04 - Autenticação JWT com 3 perfis: Admin, Almoxarife, Colaborador
RF05 - Registro de ENTRADAS com atualização automática de estoque
RF06 - Registro de SAÍDAS validadas (saldo suficiente + funcionário responsável)
RF07 - Histórico completo de movimentações (quem, quando, o quê)
RF08 - Dashboard com alertas de estoque mínimo
RF09 - Relatório semanal (entradas/saídas, top funcionários, áreas consumidoras)

## Requisitos Não Funcionais (RNF)
RNF01 - API REST com autenticação JWT
RNF02 - Transações ACID para integridade de estoque
RNF03 - Senhas criptografadas (bcrypt)
RNF04 - Performance < 500ms para movimentações
RNF05 - Interface responsiva desktop/mobile
RNF06 - Logs de auditoria completos

---

# TECNOLOGIAS ESCOLHIDAS

- **Backend: Python com FastAPI**, escolhido por sua eficiência no desenvolvimento de APIs REST assíncronas, documentação automática (Swagger/OpenAPI), type hints nativos do Python e performance comparável ao Node.js.

- **Banco de Dados: SQLite**, por ser um banco de dados embutido em arquivo único (.db), sem necessidade de servidor externo, transações ACID garantidas para controle de estoque, instalação instantânea e deploy fácil.

- **ORM: SQLAlchemy**, escreve SQL automaticamente, valida dados antes de salvar, gerencia relacionamentos entre tabelas (Material ↔ Movimentação)

- **Frontend: React com Vite**, moderna biblioteca JavaScript para criar interfaces responsivas e rápidas, com recarregamento automático durante desenvolvimento e integração perfeita com APIs REST via Axios.
  
- **Autenticação: JWT (PyJWT) + bcrypt (passlib)**, garantindo controle seguro de acesso com tokens stateless e hashing robusto de senhas nativo do Python.

- **Controle de Versão: Git/GitHub**, permitindo colaboração eficiente, controle de versões do código e rastreabilidade de todas as alterações feitas no sistema.

---

# Organização de Tarefas - Dupla

## Sprint 1: Setup + Autenticação (Semana 1)

**👩‍💻 Nathalia:**
- [ ] Configurar repo GitHub + .gitignore + estrutura pastas
- [ ] Backend FastAPI: main.py + login/register endpoints + JWT middleware
- [ ] Frontend React: Vite setup + tela login + Axios para API

**👨‍💻 Anselmo:**
- [ ] SQLite config + SQLAlchemy model User
- [ ] Tabela users + testes básicos autenticação
- [ ] CORS no FastAPI + primeiro deploy Railway/Vercel

## Sprint 2: Core Estoque (Semana 2)

**👩‍💻 Nathalia:**
- [ ] Backend: SQLAlchemy models (categorias + materiais) + CRUD endpoints FastAPI
- [ ] Frontend React: Listagem materiais + formulário CRUD

**👨‍💻 Anselmo:**
- [ ] Backend: Model funcionarios + CRUD simples
- [ ] Frontend: Dashboard React com cards (totais, alertas estoque mínimo)

## Sprint 3: Movimentações (Semana 3)

**👩‍💻 Nathalia:**
- [ ] Backend: Model movimentacoes + endpoint ENTRADA (validação + update estoque)
- [ ] Frontend: Tela listagem movimentações + filtros (data, tipo)

**👨‍💻 Anselmo:**
- [ ] Backend: Endpoint SAÍDA (validação saldo + funcionário obrigatório + transação)
- [ ] Frontend: Formulários entrada/saída React

## Sprint 4: Relatórios + Deploy (Semana 4)

**👩‍💻 Nathalia:**
- [ ] Backend: Endpoint relatório semanal (agregações SQLAlchemy)
- [ ] Frontend: Tela relatórios + tabela/export CSV

**👨‍💻 Anselmo:**
- [ ] Frontend: Responsividade mobile + charts simples (opcional Chart.js)
- [ ] Deploy final: Railway (backend+SQLite) + Vercel (React)
- [ ] Testes manuais + vídeo demo + documentação Swagger

---

# Arquitetura do Sistema
Arquitetura Monolítica + MVC

## Componentes da Arquitetura

**Frontend (React SPA)**:
- Interface única (Single Page Application)
- Requisições via Axios para API backend
- Estados gerenciados por React Hooks (useState, useEffect)
- Responsivo mobile/desktop

**Backend (FastAPI Python)**:
- API REST com endpoints documentados automaticamente (/docs)
- Middleware JWT para autenticação em todas rotas protegidas
- SQLAlchemy para comunicação segura com SQLite
- Validações Pydantic automáticas

**Banco de Dados (SQLite)**:
- Arquivo único `sana.db` (local ou deploy)
- 5 tabelas principais: users, categorias, materiais, funcionarios, movimentacoes
- Transações ACID garantem integridade de estoque
