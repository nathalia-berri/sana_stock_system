```mermaid
flowchart LR

Funcionario[Funcionário]
Almoxarife[Almoxarife]
Admin[Administrador]

Sistema[SANA Stock System]

Funcionario -->|Consulta materiais| Sistema
Almoxarife -->|Registra entradas e saídas| Sistema
Admin -->|Gerencia usuários| Sistema

```


```mermaid
flowchart LR

User[Usuário]

subgraph Sistema SANA Stock
    Web[Frontend Web<br>HTML CSS JS]
    API[Backend API<br>Node.js + Express]
    DB[(MySQL Database)]
end

User --> Web
Web -->|REST API| API
API --> DB

```

```mermaid
flowchart TB

subgraph Backend API

AuthController[Auth Controller]
MaterialController[Material Controller]
MovController[Movimentacao Controller]
RelatorioService[Relatorio Service]

end

DB[(MySQL)]

AuthController --> DB
MaterialController --> DB
MovController --> DB
RelatorioService --> DB

```