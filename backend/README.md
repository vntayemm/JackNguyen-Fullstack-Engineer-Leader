# NodeJS Backend for DNS/Email Security Testing

## Features
- Domain Validation
- SPF Record Analysis
- DMARC Record Analysis
- DNS Record Lookup (A, MX, TXT, ...)

## How to run
```bash
cd node-backend
npm install
npm run dev # or npm start
```

## Environment Variables
All environment variables can be set in a `.env` file (see `env.example`). These can also be set as secrets in CI/CD pipelines.

| Variable         | Default                | Description                                      |
|-----------------|------------------------|--------------------------------------------------|
| NODE_ENV        | development            | Node environment (development/production)         |
| PORT            | 8000                   | Port for the server                              |
| CORS_ORIGIN     | http://localhost:3000  | Allowed CORS origin                              |
| HELMET_ENABLED  | true                   | Enable helmet security middleware                |
| DNS_TIMEOUT     | 10000                  | DNS query timeout (ms)                           |
| DNS_RETRIES     | 3                      | Number of DNS query retries                      |
| LOG_LEVEL       | info                   | Logging level                                    |

**CI/CD Secrets:**
- For deployment, set sensitive values (API keys, service account JSON, etc.) as GitHub Secrets (e.g. `GCP_SA_KEY`, `GCP_PROJECT_ID`, `GCP_REGION`).
- Use `--env-file .env` or `--set-env-vars` with Docker/Cloud Run as needed.

## Build Commands
```bash
# Install dependencies
npm install

# Development
npm run dev

# Build (includes swagger generation)
npm run build

# Generate Swagger docs only
npm run swagger

# Test
npm test
```

## API Endpoints
- `GET /api/domains/validate/:domain` — Validate domain format
- `POST /api/spf/analyze` — Analyze SPF record (body: `{ domain, spf_record? }`)
- `POST /api/dmarc/analyze` — Analyze DMARC record (body: `{ domain, dmarc_record? }`)
- `GET /api/dns/records/:domain?record_type=TXT` — Get DNS records by type
- `GET /api/dns/records/:domain/all` — Get all supported DNS records
- `GET /health` — Health check

## Swagger Documentation
- **Auto-generated**: Run `npm run swagger` to generate `swagger.json`
- **UI Access**: `http://localhost:8000/api-docs`
- **Build Integration**: Swagger generation is included in `npm run build`

## Example request
```bash
curl http://localhost:8000/api/domains/validate/example.com
curl -X POST http://localhost:8000/api/spf/analyze -H 'Content-Type: application/json' -d '{"domain":"example.com"}'
curl -X POST http://localhost:8000/api/dmarc/analyze -H 'Content-Type: application/json' -d '{"domain":"example.com"}'
curl http://localhost:8000/api/dns/records/example.com?record_type=MX
```

## Tech stack
- NodeJS
- Express
- Built-in dns module
- validator
- dotenv, helmet, cors
- swagger-jsdoc, swagger-ui-express

## Testing
- Jest (npm test)

## CI/CD & Deployment

### 1. Local Development
- Copy `env.example` thành `.env` và chỉnh sửa giá trị.
- Chạy:  
  ```bash
  npm install
  npm run dev
  ```

### 2. Swagger API Docs
- Khi chạy app, truy cập: `http://localhost:8000/api-docs` để xem Swagger UI.

### 3. Build & Deploy với Docker
- Build image:
  ```bash
  docker build -t your-node-backend .
  ```
- Chạy container:
  ```bash
  docker run -p 8000:8000 --env-file .env your-node-backend
  ```

### 4. CI/CD với GitHub Actions & Google Cloud Run
- Đảm bảo đã tạo Google Cloud Project, bật Cloud Run, tạo Service Account có quyền deploy.
- Lưu file key JSON của Service Account vào GitHub Secret: `GCP_SA_KEY`
- Lưu `GCP_PROJECT_ID`, `GCP_REGION`, `CLOUD_RUN_SERVICE` vào GitHub Secret.
- Workflow mẫu: `.github/workflows/deploy-node-backend.yml`

---

# Swagger Setup

- Đã tích hợp sẵn Swagger UI tại `/api-docs`.
- Để thêm mô tả API, dùng JSDoc trong các file route.

# GitHub Actions (Cloud Run)

Tạo file `.github/workflows/deploy-node-backend.yml` với nội dung:
```yaml
name: Deploy Node Backend to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/setup-gcloud@v2
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ secrets.GCP_PROJECT_ID }}
          export_default_credentials: true
      - name: Build Docker image
        run: |
          gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/${{ secrets.CLOUD_RUN_SERVICE }} ./node-backend
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy ${{ secrets.CLOUD_RUN_SERVICE }} \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/${{ secrets.CLOUD_RUN_SERVICE }} \
            --region ${{ secrets.GCP_REGION }} \
            --platform managed \
            --allow-unauthenticated \
            --set-env-vars NODE_ENV=production,PORT=8000
``` 