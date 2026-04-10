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
                sh 'docker compose -f ${COMPOSE_FILE} down --remove-orphans || true'
            }
        }

        // ── Stage 4: Build the application ───────────────────────
        stage('Build') {
            steps {
                echo 'Building containerized application...'
                sh 'docker compose -f ${COMPOSE_FILE} pull'
            }
        }

        // ── Stage 5: Deploy containers ────────────────────────────
        stage('Deploy') {
            steps {
                echo 'Launching containers with Docker Compose...'
                sh 'docker compose -f ${COMPOSE_FILE} up -d'
            }
        }

        // ── Stage 6: Verify containers are running ────────────────
        stage('Verify') {
            steps {
                echo 'Verifying all containers are running...'
                sh 'docker compose -f ${COMPOSE_FILE} ps'
                sh 'sleep 15'
                sh 'docker ps | grep ci_eventara'
            }
        }
    }

    // ── Post actions ──────────────────────────────────────────────
    post {
        success {
            echo '✅ Build successful! Eventara is running on ports 8080 (frontend) and 9000 (backend).'
        }
        failure {
            echo '❌ Build failed! Check logs above for details.'
            sh 'docker compose -f ${COMPOSE_FILE} logs || true'
        }
    }
}
