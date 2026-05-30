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
        TEST_USER_EMAIL    = 'test@test.com'
        TEST_USER_PASSWORD = 'test123'
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

        stage('Setup Docker Compose') {
            steps {
                sh '''mkdir -p bin
curl -sL "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o bin/docker-compose
chmod +x bin/docker-compose'''
            }
        }

        stage('Run E2E Tests') {
            steps {
                sh '${WORKSPACE}/bin/docker-compose -f docker-compose.e2e.yml up -d db backend frontend'
                sh '''
                    echo "Waiting for frontend to be ready..."
                    timeout=60
                    while [ $timeout -gt 0 ]; do
                        if curl -s http://frontend:5173 > /dev/null 2>&1; then
                            echo "Frontend is ready!"
                            break
                        fi
                        sleep 2
                        timeout=$((timeout - 2))
                    done
                '''
                sh '''
                    docker run --rm \
                        --network app-network \
                        -e BASE_URL=http://frontend:5173 \
                        -e API_URL=http://backend:8000/api \
                        -e TEST_USER_EMAIL=test@test.com \
                        -e TEST_USER_PASSWORD=test123 \
                        -e CI=true \
                        -v "$WORKSPACE:/app" \
                        -w /app \
                        mcr.microsoft.com/playwright:v1.52.0-jammy \
                        sh -c "npm ci && npx playwright test"
                '''
                junit 'test-results/results.xml'
                publishHTML(target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'E2E Test Report'
                ])
            }
        }
    }

    post {
        always {
            sh 'docker run --rm --volumes-from jenkins -w "$WORKSPACE" ${NODE_IMAGE} sh -c "rm -rf node_modules dist .tsbuildinfo 2>/dev/null; rm -rf ./* ./.??* 2>/dev/null" || true'
        }
    }
}
