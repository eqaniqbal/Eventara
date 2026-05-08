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

                sh 'sleep 10'
            }
        }

        stage('Verify') {
            steps {
                sh 'docker ps | grep ci_eventara'
            }
        }

        stage('Test') {
            steps {
                echo 'Running Selenium tests...'
                sh 'pip3 install selenium==4.18.1 webdriver-manager==4.0.1 pytest==8.1.1 --break-system-packages -q'
                sh 'APP_URL=http://47.128.219.68:8081 python3 ${WORKSPACE}/tests/test_eventara.py'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Build and tests successful!'
        }
        failure {
            echo 'Build or tests failed!'
        }
    }
}
