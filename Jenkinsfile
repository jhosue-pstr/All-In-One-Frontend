pipeline {
    agent any

    options {
        skipDefaultCheckout true
    }

    environment {
        SONAR_HOST_URL = 'http://sonarqube:9000'
        SONAR_TOKEN    = credentials('Sonar-qube')
        PROJECT_KEY    = 'All-In-One-Frontend'
        NODE_IMAGE     = 'node:20-alpine'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                sh 'docker run --rm --volumes-from jenkins -w "$WORKSPACE" ${NODE_IMAGE} sh -c "rm -rf node_modules dist .tsbuildinfo 2>/dev/null; rm -rf ./* ./.??* 2>/dev/null" || true'
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node') {
            steps {
                sh 'docker run --rm --volumes-from jenkins -w "$WORKSPACE" ${NODE_IMAGE} npm install'
            }
        }

        stage('Lint & Build') {
            steps {
                sh 'docker run --rm --volumes-from jenkins -w "$WORKSPACE" ${NODE_IMAGE} npm run build'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'docker run --rm --volumes-from jenkins -w "$WORKSPACE" ${NODE_IMAGE} npm run test || true'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                sh '''docker run --rm \
                    --volumes-from jenkins \
                    --network app-network \
                    -e SONAR_TOKEN="${SONAR_TOKEN}" \
                    sonarsource/sonar-scanner-cli:latest \
                    -Dsonar.projectKey=${PROJECT_KEY} \
                    -Dsonar.projectBaseDir=${WORKSPACE} \
                    -Dsonar.sources=src \
                    -Dsonar.exclusions=node_modules/**,dist/**,public/**,src/**/*.test.*,src/**/*.spec.*,src/vite-env.d.ts,src/models/**,src/assets/**,src/types/**,src/constants/** \
                    -Dsonar.coverage.exclusions=src/**/*.test.*,src/**/*.spec.*,src/demo.test.ts,src/vite-env.d.ts,src/components/GrapesJS/Bloques/**,src/components/GrapesJS/Paneles/*.ts,src/models/**,src/assets/**,src/types/**,src/constants/** \
                    -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
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
            sh 'docker run --rm --volumes-from jenkins -w "$WORKSPACE" ${NODE_IMAGE} sh -c "rm -rf node_modules dist .tsbuildinfo 2>/dev/null; rm -rf ./* ./.??* 2>/dev/null" || true'
        }
    }
}
