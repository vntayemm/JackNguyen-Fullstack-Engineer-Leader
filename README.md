# DNS/Email Security Testing Project

A comprehensive fullstack application for testing and validating DNS records, SPF (Sender Policy Framework), and DMARC (Domain-based Message Authentication, Reporting & Conformance) configurations.

## Features

- **Domain Validation**: Validate domain names and check their format
- **SPF Record Analysis**: Parse and validate SPF records for email authentication
- **DMARC Record Checking**: Analyze DMARC policies and configurations
- **DNS Record Resolution**: Query and display various DNS record types
- **Web Interface**: Modern React frontend with real-time validation
- **API Backend**: FastAPI backend with comprehensive testing endpoints
- **Database Integration**: Store and track validation results

## Project Structure

```
├── backend/                # FastAPI backend
│   ├── scripts/            # This is auto generate the swagger. The slug is /api/docs
│   ├── src/
│   │   ├── controller/     # Validate the input, process the in/out put
│   │   ├── routes/         # Collect all of routed
│   │   ├── services/       # Business logic
├── frontend/               # React frontend
│   ├── scripts/            # Help developer to validate the environment
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── config/         # Collect important of config into index.ts and set default if empty
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   ├── public/             # Static assets
```

## Backend Setup
```bash
cd backend
npm i && npm run dev
```

## Frontend Setup
```bash
cd frontend
npm i && npm start
```

## Development
- Backend: http://localhost:8080/api/docs
- Frontend: http://localhost:3000

## Deployment
- Docker
- GitHub Actions (CI/CD). For now. We listen changes at the [main] branch
- Please set all Environment secrets into github
GCP_SA_KEY=key.json
GCP_PROJECT_ID=your-project-name
GCP_REGION=asia-southeast1

## Production with Cloud Run
- Backend: https://domain-validator-service-533675451276.asia-southeast1.run.app/api/docs
- Frontend: https://domain-validator-reactjs-533675451276.asia-southeast1.run.app

##  Database information - https://dashboard.render.com/new/database
Workspace: JackNguyen
Project: DomainValidator
dbname: domain_validator_db
user: jack_nguyen
region: Singapore (Southeast Asia)

##  Instance:
host: dpg-d1eaaf2li9vc739r9nbg-a
port: 5432
dbname: domain_validator_db
user: jack_nguyen
pass: DumPdGrF9K5y3EXVMzqj7nDggCquRGsv

#   internal url: 
postgresql://jack_nguyen:DumPdGrF9K5y3EXVMzqj7nDggCquRGsv@dpg-d1eaaf2li9vc739r9nbg-a/domain_validator_db
#   external url: 
postgresql://jack_nguyen:DumPdGrF9K5y3EXVMzqj7nDggCquRGsv@dpg-d1eaaf2li9vc739r9nbg-a.singapore-postgres.render.com/domain_validator_db
#   psql command:
PGPASSWORD=DumPdGrF9K5y3EXVMzqj7nDggCquRGsv psql -h dpg-d1eaaf2li9vc739r9nbg-a.singapore-postgres.render.com -U jack_nguyen domain_validator_db

const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: '459a0c001@smtp-brevo.com',
                pass: '7qa84DCrOzITKtG5'
            }
        })