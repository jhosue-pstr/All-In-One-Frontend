pipeline {
    agent {
        docker {
            image 'node:20-alpine'
            args '--network host -v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        SONAR_HOST_URL = 'http://sonarqube:9000'
        SONAR_TOKEN    = credentials('Sonar-qube')
        PROJECT_KEY    = 'All-In-One-Frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node & Docker') {
            steps {
                sh 'apk add --no-cache docker-cli'
                sh 'npm install'
            }
        }

        stage('Lint & Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm run test || true'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                sh '''docker run --rm \
                    -v "${WORKSPACE}:/usr/src" \
                    --network host \
                    -e SONAR_TOKEN="${SONAR_TOKEN}" \
                    sonarsource/sonar-scanner-cli:latest \
                    -Dsonar.projectKey=${PROJECT_KEY} \
                    -Dsonar.sources=/usr/src/src \
                    -Dsonar.exclusions=/usr/src/node_modules/**,/usr/src/dist/**,/usr/src/public/** \
                    -Dsonar.host.url=${SONAR_HOST_URL}'''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t all-in-one-frontend:latest .'
            }
        }
    }

    post {
        always {
            deleteDir()
        }
    }
}
