pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        ACCOUNT_ID = "855806899620"
        BACKEND_REPO = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/flakes-backend"
        FRONTEND_REPO = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/flakes-frontend"
    }

    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Get Commit SHA') {
            steps {
                script {
                    COMMIT_SHA = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage('Login to ECR') {
            steps {
                sh """
                aws ecr get-login-password --region ${AWS_REGION} | \
                docker login --username AWS --password-stdin \
                ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                """
            }
        }

        stage('Build Backend Image') {
            steps {
                sh """
                docker build -t flakes-backend ./backend
                docker tag flakes-backend:latest ${BACKEND_REPO}:latest
                docker tag flakes-backend:latest ${BACKEND_REPO}:${COMMIT_SHA}
                """
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh """
                docker build -t flakes-frontend ./frontend
                docker tag flakes-frontend:latest ${FRONTEND_REPO}:latest
                docker tag flakes-frontend:latest ${FRONTEND_REPO}:${COMMIT_SHA}
                """
            }
        }

        stage('Push Images to ECR') {
            steps {
                sh """
                docker push ${BACKEND_REPO}:latest
                docker push ${BACKEND_REPO}:${COMMIT_SHA}
                docker push ${FRONTEND_REPO}:latest
                docker push ${FRONTEND_REPO}:${COMMIT_SHA}
                """
            }
        }

        stage('Deploy to k3s') {
            steps {
                sh """
                kubectl set image deployment/backend backend=${BACKEND_REPO}:${COMMIT_SHA}
                kubectl set image deployment/frontend frontend=${FRONTEND_REPO}:${COMMIT_SHA}
                kubectl rollout status deployment/backend
                kubectl rollout status deployment/frontend
                """
            }
        }
    }

    post {
        always {
            sh 'docker system prune -f'
            cleanWs()
        }
    }
}