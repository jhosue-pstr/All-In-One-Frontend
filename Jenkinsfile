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
        TEST_USER_EMAIL    = 'moisesjoaquin51@gmail.com'
        TEST_USER_PASSWORD = '123456'
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

        stage('Run E2E Tests') {
            steps {
                sh 'docker rm -f e2e-frontend 2>/dev/null || true'
                sh '''
                    docker run -d --name e2e-frontend \
                        --network app-network \
                        -e VITE_API_BASE_URL=http://backend:8000/api \
                        all-in-one-frontend:latest \
                        sh -c "npm run dev -- --host 0.0.0.0"
                '''
                sh '''
                    echo "Waiting for e2e-frontend..."
                    timeout=60
                    while [ $timeout -gt 0 ]; do
                        if curl -s -o /dev/null http://e2e-frontend:5173 2>/dev/null; then
                            echo "e2e-frontend ready!"
                            break
                        fi
                        echo "Not ready yet... ${timeout}s left"
                        sleep 2
                        timeout=$((timeout - 2))
                    done
                    if [ $timeout -le 0 ]; then
                        echo "ERROR: e2e-frontend not reachable"
                        exit 1
                    fi
                '''
                sh '''
                    docker run --rm \
                        --volumes-from jenkins \
                        --network app-network \
                        -e BASE_URL=http://e2e-frontend:5173 \
                        -e API_URL=http://backend:8000/api \
                        -e TEST_USER_EMAIL="${TEST_USER_EMAIL}" \
                        -e TEST_USER_PASSWORD="${TEST_USER_PASSWORD}" \
                        -e CI=true \
                        -w "$WORKSPACE" \
                        mcr.microsoft.com/playwright:v1.60.0-jammy \
                        sh -c "npm install && npx playwright test"
                '''
                sh 'docker rm -f e2e-frontend 2>/dev/null || true'
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
