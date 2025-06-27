# Use Python base image for multi-language support
FROM python:3.11-slim

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies first
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Node.js dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create a non-root user for security
RUN useradd -r -u 1001 -g root appuser
RUN chown -R appuser:root /app
USER appuser

# Expose port
EXPOSE 8080


# Start the application
CMD ["node", "src/app.js"] 