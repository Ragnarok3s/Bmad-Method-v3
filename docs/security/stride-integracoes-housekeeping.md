# Matriz STRIDE — Integrações Housekeeping

| Ameaça | Descrição | Mitigação | Owner |
| ------ | --------- | --------- | ----- |
| Spoofing | Impersonação de parceiro enviando webhook falso | Assinatura HMAC + validação IP permitida | Thiago Ramos (Facilities) |
| Tampering | Alteração de payload durante trânsito | TLS mTLS obrigatório + versionamento de esquema | Bruno Carvalho (Platform Engineering) |
| Repudiation | Parceiro nega envio de evento | Logs imutáveis em S3 + correlação com IDs de mensagem | Gabriela Nunes (Parcerias) |
| Information Disclosure | Exposição de dados sensíveis no payload | Campos sensíveis criptografados; mascaramento em logs | Privacy Officer |
| Denial of Service | Explosão de eventos causando backlog | Limite de throughput e fila dedicada com circuit breaker | Mariana Lopes (Operations Manager) |
| Elevation of Privilege | Parceiro tenta executar comandos fora do escopo | Escopos OAuth restritos; auditoria semanal dos tokens | Security Champion |

## Atualizações 2024-07-22
- Revisão conjunta com Security Champion confirmando ausência de gaps críticos.
- Plano de testes de penetração agendado para Sprint 2, com owners nomeados.
