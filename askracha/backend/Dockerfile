# Use official Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . ./

# Expose port (adjust if your app uses a different port)
EXPOSE 8000

# Set environment variables (override in Koyeb dashboard)
ENV PYTHONUNBUFFERED=1

# Start the app (adjust if your entry point is different)
CMD ["python", "app.py"]
