pipeline {
    agent any

    triggers {
        githubPush()
    }

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

                // BACKENDModule
                sh '''
                    docker run -d \
                        --name ci_eventara_backend \
                        --network ci_network \
                        --network-alias backend \
                        -e DATABASE_URL=postgresql://eik:eik100305@ci_eventara_db:5432/EventaraDatabase \
                        -p 9000:8000 \
                        eqaniqbal/eventara-backend:latest
                '''

                // FRONTEND WORKING
                sh '''
                    docker run -d \
                        --name ci_eventara_frontend \
                        --network ci_network \
                        -p 8081:80 \
                        eqaniqbal/eventara-frontend:latest
                '''

                // WAIT FOR FRONTEND
                sh '''
                    echo "Waiting for frontend..."

                    for i in {1..30}; do
                        if curl -s http://127.0.0.1:8081 > /dev/null; then
                            echo "Frontend is UP!"
                            exit 0
                        fi
                        echo "Waiting... ($i)"
                        sleep 5
                    done

                    echo "Frontend failed"
                    exit 1
                '''
            }
        }

        stage('Verify') {
            steps {
                sh 'docker ps | grep ci_eventara'
            }
        }

        stage('Build Test Image') {
            steps {
                echo 'Building Selenium test image...'
                sh 'docker build -f Dockerfile.test -t eventara-selenium-test .'
            }
        }

        stage('Test') {
            steps {
                echo 'Running Selenium tests...'

                sh '''
                    docker run --rm \
                        --network ci_network \
                        -e APP_URL=http://ci_eventara_frontend:80 \
                        -v ${WORKSPACE}/tests:/tests \
                        eventara-selenium-test \
                        python3 /tests/test_eventara.py | tee test_results.txt
                '''
            }
        }
    }

    post {

        success {
            echo 'Build and tests successful!'
        }

        failure {
            echo 'Build or tests failed!'
        }

        always {
            archiveArtifacts artifacts: 'test_results.txt', fingerprint: true

            script {
                def recipient = "eqaniqbal@gmail.com"

                emailext (
                    to: recipient,
                    subject: "Jenkins Build ${currentBuild.currentResult}: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
Build: ${env.JOB_NAME} #${env.BUILD_NUMBER}
Status: ${currentBuild.currentResult}

Pipeline executed successfully.

Check logs:
${env.BUILD_URL}console
"""
                )
            }

            cleanWs()
        }
    }
}