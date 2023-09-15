# Use an appropriate Python base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Copy the application code
COPY . .

# Expose the port on which the Flask application will run
EXPOSE 5000

# Command to run the Flask application
CMD ["python", "server.py"]
