# React Frontend for DNS/Email Security Testing

## Features
- Domain Validation Interface
- SPF Record Analysis Interface
- DMARC Record Analysis Interface
- DNS Record Lookup Interface
- Modern React with TypeScript
- Responsive Design with Tailwind CSS

## How to run
```bash
cd frontend
npm install
npm start
```

## Build Commands
```bash
# Install dependencies
npm install

# Development
npm start

# Build (includes environment check)
npm run build

# Preview build
npm run preview

# Analyze build
npm run analyze

# Test
npm test
```

## Environment Setup
- Copy `env.example` thành `.env` và chỉnh sửa giá trị.
- Build process sẽ tự động kiểm tra environment variables.
- Required variables: `REACT_APP_API_URL`

## API Integration
- Tự động gọi API từ NodeJS/Python backend
- Error handling và loading states
- Real-time validation feedback

## Tech stack
- React 18
- TypeScript
- Tailwind CSS
- Axios
- React Query
- React Router

## Testing
- Jest
- React Testing Library

## CI/CD & Deployment

### 1. Local Development
- Copy `env.example` thành `.env` và chỉnh sửa giá trị.
- Chạy:
  ```bash
  npm install
  npm start
  ```

### 2. Build & Deploy với Docker
- Build image:
  ```bash
  docker build -t your-frontend .
  ```
- Chạy container:
  ```bash
  docker run -p 3000:3000 --env-file .env your-frontend
  ```

### 3. CI/CD với GitHub Actions & Google Cloud Run
- Đảm bảo đã tạo Google Cloud Project, bật Cloud Run, tạo Service Account có quyền deploy.
- Lưu file key JSON của Service Account vào GitHub Secret: `GCP_SA_KEY`
- Lưu `GCP_PROJECT_ID`, `GCP_REGION`, `CLOUD_RUN_SERVICE` vào GitHub Secret.
- Workflow mẫu: `.github/workflows/deploy-frontend.yml`

---

# GitHub Actions (Cloud Run)

Tạo file `.github/workflows/deploy-frontend.yml` với nội dung:
```yaml
name: Deploy Frontend to Cloud Run

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
          gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/${{ secrets.CLOUD_RUN_SERVICE }} ./frontend
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy ${{ secrets.CLOUD_RUN_SERVICE }} \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/${{ secrets.CLOUD_RUN_SERVICE }} \
            --region ${{ secrets.GCP_REGION }} \
            --platform managed \
            --allow-unauthenticated \
            --set-env-vars REACT_APP_ENVIRONMENT=production,PORT=3000
``` 