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

