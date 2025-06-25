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
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Core configuration
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   ├── tests/              # Backend tests
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   ├── public/             # Static assets
│   └── package.json        # Node.js dependencies
├── tests/                  # Integration tests
│   └── test_sample.py      # Original test file
└── docker-compose.yml      # Docker configuration
```

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Docker (optional)

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# Integration tests
cd tests
pytest test_sample.py -svv
```

## API Endpoints

- `GET /api/domains/validate/{domain}` - Validate domain format
- `POST /api/spf/analyze` - Analyze SPF records
- `POST /api/dmarc/analyze` - Analyze DMARC records
- `GET /api/dns/records/{domain}` - Get DNS records
- `GET /api/health` - Health check

## Technologies Used

### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- pytest
- dns.resolver
- validators
- checkdmarc

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Axios
- React Query

### DevOps
- Docker
- Docker Compose
- GitHub Actions (CI/CD)

## Testing

The project includes comprehensive testing:
- Unit tests for backend services
- Integration tests for API endpoints
- Frontend component tests
- E2E tests for critical user flows

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License