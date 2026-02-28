pipeline {
    agent any

    environment {
        REGISTRY = 'your-docker-registry' // Change to your Docker registry
        FRONTEND_IMAGE = "${REGISTRY}/flakes-frontend:${BUILD_NUMBER}"
        BACKEND_IMAGE = "${REGISTRY}/flakes-backend:${BUILD_NUMBER}"
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                echo '=== Checking out code ==='
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                echo '=== Building Backend ==='
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo '=== Building Frontend ==='
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Test Backend') {
            steps {
                echo '=== Testing Backend ==='
                dir('backend') {
                    sh 'mvn test'
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                echo '=== Testing Frontend ==='
                dir('frontend') {
                    sh 'npm test -- --coverage --watchAll=false'
                    publishHTML([
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Frontend Coverage Report'
                    ])
                }
            }
        }

        stage('Code Quality (SonarQube)') {
            when {
                branch 'main'
            }
            steps {
                echo '=== Running SonarQube Analysis ==='
                sh '''
                    sonar-scanner \
                        -Dsonar.projectKey=flakes \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=${SONAR_HOST_URL} \
                        -Dsonar.login=${SONAR_AUTH_TOKEN}
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '=== Building Docker Images ==='
                sh '''
                    docker build -t ${FRONTEND_IMAGE} ./frontend
                    docker build -t ${BACKEND_IMAGE} ./backend
                '''
            }
        }

        stage('Push Docker Images') {
            when {
                branch 'main'
            }
            steps {
                echo '=== Pushing Docker Images ==='
                sh '''
                    echo ${DOCKER_CREDENTIALS_PSW} | docker login -u ${DOCKER_CREDENTIALS_USR} --password-stdin
                    docker push ${FRONTEND_IMAGE}
                    docker push ${BACKEND_IMAGE}
                '''
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'main'
            }
            steps {
                echo '=== Deploying to Staging ==='
                sh '''
                    docker-compose -f docker-compose.yml up -d
                    sleep 10
                    curl http://localhost/health || exit 1
                '''
            }
        }

        stage('Integration Tests') {
            when {
                branch 'main'
            }
            steps {
                echo '=== Running Integration Tests ==='
                sh '''
                    # Test frontend is accessible
                    curl -f http://localhost/ || exit 1

                    # Test backend health
                    curl -f http://localhost:8080/transactions || exit 1

                    # Test through nginx proxy
                    curl -f http://localhost/api/transactions || exit 1
                '''
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
                tag 'release-*'
            }
            steps {
                echo '=== Deploying to Production (AWS) ==='
                input 'Deploy to Production?'
                sh '''
                    aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com

                    # Tag and push to ECR
                    docker tag ${FRONTEND_IMAGE} ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/flakes-frontend:latest
                    docker tag ${BACKEND_IMAGE} ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/flakes-backend:latest

                    docker push ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/flakes-frontend:latest
                    docker push ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/flakes-backend:latest

                    # Update ECS services
                    aws ecs update-service --cluster flakes-prod --service frontend --force-new-deployment
                    aws ecs update-service --cluster flakes-prod --service backend --force-new-deployment
                '''
            }
        }
    }

    post {
        always {
            echo '=== Cleanup ==='
            sh 'docker-compose down --remove-orphans || true'
            cleanWs()
        }
        success {
            echo '=== Pipeline Successful ==='
        }
        failure {
            echo '=== Pipeline Failed ==='
        }
    }
}

