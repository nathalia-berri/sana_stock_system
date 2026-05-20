```mermaid
flowchart LR

    %% Estilos
    classDef person fill:#08427b,stroke:#052e56,color:#fff
    classDef system fill:#1168bd,stroke:#0b4884,color:#fff

    Funcionario["Funcionário<br><br>Retira materiais do estoque e consulta movimentações"]

    Admin["Administrador / Almoxarife<br><br>Gerencia materiais, estoque, relatórios e auditoria"]

    SanaSystem["Sana Stock System<br><br>Sistema web para controle de estoque, rastreamento de movimentações e relatórios gerenciais"]

    Funcionario -->|Registra retirada de materiais<br>React Web App| SanaSystem

    Admin -->|Gerencia estoque e relatórios<br>React Web App| SanaSystem

    class Funcionario,Admin person
    class SanaSystem system
```
