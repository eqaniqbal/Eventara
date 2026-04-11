pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.ci.yml'
    }

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
                echo 'Checking Docker and Docker Compose...'
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

        // ── Stage 3: Stop any previous containers ────────────────
        stage('Cleanup Old Containers') {
            steps {
                echo 'Stopping and removing old containers...'
                sh 'docker stop ci_eventara_frontend ci_eventara_backend ci_eventara_db || true'
                sh 'docker rm ci_eventara_frontend ci_eventara_backend ci_eventara_db || true'
            }
        }

        // ── Stage 4: Build the application ───────────────────────
        stage('Build') {
            steps {
                echo 'Building containerized application...'
                sh 'docker compose -f docker-compose.ci.yml pull'
            }
        }

        // ── Stage 5: Deploy containers ────────────────────────────
        stage('Deploy') {
            steps {
                echo 'Launching containers with Docker Compose...'
                sh 'docker compose -f docker-compose.ci.yml up -d'
            }
        }

        // ── Stage 6: Verify containers are running ────────────────
        stage('Verify') {
            steps {
                echo 'Verifying all containers are running...'
                sh 'docker compose -f docker-compose.ci.yml ps'
                sh 'sleep 15'
                sh 'docker ps | grep ci_eventara'
            }
        }
    }

    // ── Post actions ──────────────────────────────────────────────
    post {
        success {
            echo 'Build successful! Eventara is running on ports 8080 (frontend) and 9000 (backend).'
        }
        failure {
            echo 'Build failed! Check logs above for details.'
            sh 'docker compose -f docker-compose.ci.yml logs || true'
        }
    }
}
