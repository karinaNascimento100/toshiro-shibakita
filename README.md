Microstack: Nginx + Node (Express) + MySQL

Arquitetura
[Cliente] → Nginx (:80) → api_upstream (least_conn) → API (Express) → MySQL (appdb, volume dbdata)
O Nginx faz o balanceamento entre múltiplas instâncias da API usando o método least_conn. A API expõe dois endpoints: /healthz que retorna ok e / que consulta o MySQL (SELECT NOW()) e devolve um JSON com a data/hora.

Rodar
docker compose up -d --build
docker compose up -d --scale api=2

Testar
curl http://localhost/
curl http://localhost/healthz
for i in {1..6}; do curl -is http://localhost/ | grep -i '^X-Instance'; sleep 1; done

Notas
Nginx como reverse proxy com balanceamento de carga entre réplicas da API.

API Node/Express com MySQL.
Variáveis de ambiente via .env, rede dedicada, volume persistente e healthchecks configurados.

Operação do Docker
ocker compose down         # parar mantendo dados
docker compose up -d        # subir novamente
docker compose up -d --scale api=2
docker image prune -f       # limpar imagens órfãs
docker container prune -f   # limpar containers órfãos

Backup e Restore (opcional)
 Backup
docker exec microstack-db-1 mysqldump -udio -pdio123 appdb > backup_appdb.sql

# Restore
docker exec -i microstack-db-1 mysql -udio -pdio123 appdb < backup_appdb.sql

Troubleshooting rápido
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
docker compose logs --tail=80 db
docker compose logs --tail=80 api
docker compose logs --tail=80 reverse-proxy
docker compose config
