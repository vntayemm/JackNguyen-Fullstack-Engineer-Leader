# Cloud Run Deployment Guide

This guide explains how to deploy the DNS/Email Security Backend to Google Cloud Run with Python support.

## Prerequisites

1. **Google Cloud SDK** installed and configured
2. **Docker** installed locally
3. **Google Cloud Project** with billing enabled
4. **Required APIs enabled**:
   - Cloud Run API
   - Container Registry API
   - Cloud Build API

## Quick Deployment

### Option 1: Using the deployment script

1. Update the `PROJECT_ID` in `deploy.sh`:
   ```bash
   PROJECT_ID="your-actual-project-id"
   ```

2. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

### Option 2: Manual deployment

1. **Build and push the Docker image**:
   ```bash
   # Set your project ID
   export PROJECT_ID="your-project-id"
   
   # Build the image
   docker build -t gcr.io/$PROJECT_ID/dns-email-security-backend .
   
   # Push to Container Registry
   docker push gcr.io/$PROJECT_ID/dns-email-security-backend
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy dns-email-security-backend \
     --image gcr.io/$PROJECT_ID/dns-email-security-backend \
     --platform managed \
     --region asia-southeast1 \
     --allow-unauthenticated \
     --port 8080 \
     --memory 1Gi \
     --cpu 1 \
     --max-instances 10 \
     --timeout 300 \
     --set-env-vars NODE_ENV=production,PORT=8080
   ```

### Option 3: Using Cloud Build

1. **Enable Cloud Build API**:
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   ```

2. **Deploy using Cloud Build**:
   ```bash
   gcloud builds submit --config cloudbuild.yaml .
   ```

## Configuration

### Environment Variables

The following environment variables can be set in Cloud Run:

- `NODE_ENV`: Set to `production` for production deployment
- `PORT`: Port number (default: 8080, Cloud Run will override this)
- `CORS_ORIGIN`: Frontend URL for CORS (e.g., your frontend Cloud Run URL)
- `FRONTEND_URL`: Frontend URL for email verification links
- `HELMET_ENABLED`: Enable security headers (true/false)
- `DNS_TIMEOUT`: DNS resolution timeout in milliseconds
- `DNS_RETRIES`: Number of DNS retry attempts
- `LOG_LEVEL`: Logging level (info, debug, warn, error)

### Setting Environment Variables

```bash
gcloud run services update dns-email-security-backend \
  --region asia-southeast1 \
  --set-env-vars NODE_ENV=production,CORS_ORIGIN=https://your-frontend-url.com
```

## Python Dependencies

The Docker image includes the following Python packages for domain testing:

- `pytest==8.4.1`: Testing framework
- `dnspython==2.7.0`: DNS toolkit
- `validators==0.35.0`: Data validation
- `checkdmarc==4.8.0`: DMARC/SPF validation

These are automatically installed during the Docker build process.

## Health Check

The application includes a health check endpoint at `/health` that returns:

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "environment": "production",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## Troubleshooting

### Common Issues

1. **Python dependencies not found**:
   - Ensure `requirements.txt` is present in the backend directory
   - Check that the Dockerfile copies the requirements file before installing Python packages

2. **DNS resolution timeouts**:
   - The Python script includes timeout configurations (10 seconds)
   - Cloud Run has network access to perform DNS lookups

3. **Memory issues**:
   - Default memory allocation is 1Gi
   - Increase if you experience memory-related errors

4. **Cold start delays**:
   - First request may take longer due to container startup
   - Consider using Cloud Run's minimum instances feature

### Logs

View application logs:
```bash
gcloud logs read --service=dns-email-security-backend --limit=50
```

### Scaling

The service is configured with:
- **Memory**: 1Gi
- **CPU**: 1 vCPU
- **Max instances**: 10
- **Timeout**: 300 seconds

Adjust these settings based on your needs:
```bash
gcloud run services update dns-email-security-backend \
  --region asia-southeast1 \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 20
```

## Security Considerations

1. **Non-root user**: The container runs as a non-root user (appuser)
2. **Security headers**: Helmet.js provides security headers when enabled
3. **CORS**: Configure CORS origin to restrict access to your frontend
4. **Authentication**: Consider adding authentication for production use

## Monitoring

1. **Cloud Run Console**: Monitor requests, errors, and performance
2. **Cloud Logging**: View application logs and errors
3. **Cloud Monitoring**: Set up alerts for errors and performance metrics

## Cost Optimization

1. **Min instances**: Set to 0 for cost savings (cold starts)
2. **Max instances**: Limit based on expected load
3. **Memory/CPU**: Right-size based on actual usage
4. **Region**: Choose closest to your users for better performance 