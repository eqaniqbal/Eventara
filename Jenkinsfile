pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Fetching code from GitHub...'
                checkout scm
            }
        }

        stage('Verify Docker') {
            steps {
                sh 'docker --version'
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                    docker stop ci_eventara_frontend || true
                    docker stop ci_eventara_backend || true
                    docker stop ci_eventara_db || true
                    docker rm ci_eventara_frontend || true
                    docker rm ci_eventara_backend || true
                    docker rm ci_eventara_db || true
                    docker network rm ci_network || true
                    docker system prune -f || true
                '''
            }
        }

        stage('Deploy') {
            steps {
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
                        --network-alias backend \
                        -e DATABASE_URL=postgresql://eik:eik100305@ci_eventara_db:5432/EventaraDatabase \
                        -p 9000:8000 \
                        eqaniqbal/eventara-backend:latest
                '''

                sh '''
                    docker run -d \
                        --name ci_eventara_frontend \
                        --network ci_network \
                        -p 8081:80 \
                        eqaniqbal/eventara-frontend:latest
                '''
            }
        }

        stage('Verify') {
            steps {
                sh 'sleep 5'
                sh 'docker ps | grep ci_eventara'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Build successful! App running on port 8081 (frontend) and 9000 (backend).'
        }
        failure {
            echo 'Build failed!'
            sh 'docker logs ci_eventara_backend || true'
        }
    }
}
