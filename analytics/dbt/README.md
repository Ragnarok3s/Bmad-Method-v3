# Analytics Lakehouse dbt Project

Este projeto dbt estrutura as camadas *bronze*, *silver* e *gold* do lakehouse de analytics.

- **Bronze**: ingestão quase bruta das mensagens Kafka persistidas em Delta Lake.
- **Silver**: aplicação de limpeza e enriquecimento (normalização de datas, cálculo de métricas).
- **Gold**: métricas executivas prontas para consumo via BI e APIs.

Execute `dbt deps && dbt build` apontando para o perfil `analytics` para compilar os modelos.
