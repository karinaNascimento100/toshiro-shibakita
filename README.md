# Microstack: Nginx + Node (Express) + MySQL

## Rodar
docker compose up -d --build
docker compose up -d --scale api=2

## Testar
curl http://localhost/
curl http://localhost/healthz
for i in {1..6}; do curl -is http://localhost/ | grep -i '^X-Instance'; sleep 1; done

## Notas
- Nginx como reverse proxy + balanceamento.
- API Node/Express com MySQL (`/` consulta NOW, `/healthz`).
- `.env`, rede dedicada, volume persistente, healthchecks.
