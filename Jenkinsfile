pipeline {
    agent any

    stages {

        // ── Stage 1: Fetch code from GitHub ──────────────────────
        stage('Checkout') {
            steps {
                echo 'Fetching code from GitHub...'
                checkout scm
            }
        }

        // ── Stage 2: Verify Docker is available ──────────────────
        stage('Verify Docker') {
            steps {
                echo 'Checking Docker...'
                sh 'docker --version'
            }
        }

        // ── Stage 3: Cleanup old containers ──────────────────────
        stage('Cleanup') {
            steps {
                echo 'Cleaning up old containers...'
                sh '''
                    docker stop ci_eventara_frontend || true
                    docker stop ci_eventara_backend || true
                    docker stop ci_eventara_db || true
                    docker rm ci_eventara_frontend || true
                    docker rm ci_eventara_backend || true
                    docker rm ci_eventara_db || true
                    docker network rm ci_network || true
                '''
            }
        }

        // ── Stage 4: Build ────────────────────────────────────────
        stage('Build') {
            steps {
                echo 'Pulling required Docker images...'
                sh 'docker pull postgres:16-alpine'
                sh 'docker pull python:3.11-slim'
                sh 'docker pull node:20-alpine'
            }
        }

        // ── Stage 5: Deploy ───────────────────────────────────────
        stage('Deploy') {
            steps {
                echo 'Creating network and deploying containers...'
                sh 'docker network create ci_network || true'

                sh '''
                    docker run -d \
                        --name ci_eventara_db \
                        --network ci_network \
                        -e POSTGRES_USER=eik \
                        -e POSTGRES_PASSWORD=eik100305 \
                        -e POSTGRES_DB=EventaraDatabase \
                        -p 5433:5432 \
                        -v ci_postgres_data:/var/lib/postgresql/data \
                        postgres:16-alpine
                '''

                sh 'sleep 10'

                sh '''
                    docker run -d \
                        --name ci_eventara_backend \
                        --network ci_network \
                        -e DATABASE_URL=postgresql://eik:eik100305@ci_eventara_db:5432/EventaraDatabase \
                        -p 9000:9000 \
                        -v ${WORKSPACE}/backend:/app \
                        -w /app \
                        python:3.11-slim \
                        bash -c "pip install -r requirements.txt -q && uvicorn main:app --host 0.0.0.0 --port 9000"
                '''

                sh '''
                    docker run -d \
                        --name ci_eventara_frontend \
                        --network ci_network \
                        -p 8081:8080 \
                        -v ${WORKSPACE}/frontend:/app \
                        -w /app \
                        node:20-alpine \
                        sh -c "npm install --silent && npm run build && npx serve -s dist -l 8080"
                '''
            }
        }

        // ── Stage 6: Verify ───────────────────────────────────────
        stage('Verify') {
            steps {
                echo 'Verifying containers are running...'
                sh 'sleep 10'
                sh 'docker ps | grep ci_eventara'
            }
        }
    }

    post {
        success {
            echo 'Build successful! App running on port 9000 (backend) and 8081 (frontend).'
        }
        failure {
            echo 'Build failed!'
            sh 'docker logs ci_eventara_backend || true'
            sh 'docker logs ci_eventara_frontend || true'
        }
    }
}
