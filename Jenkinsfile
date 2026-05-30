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

        stage('Run E2E Tests') {
            steps {
                sh '''
                    echo "Waiting for frontend to be ready..."
                    timeout=60
                    while [ $timeout -gt 0 ]; do
                        http_code=$(curl -s -o /dev/null -w "%{http_code}" http://frontend:5173 || echo "000")
                        if [ "$http_code" != "000" ]; then
                            echo "Frontend is ready! (HTTP $http_code)"
                            break
                        fi
                        echo "Not ready yet... ${timeout}s left"
                        sleep 2
                        timeout=$((timeout - 2))
                    done
                    if [ $timeout -le 0 ]; then
                        echo "ERROR: Frontend not reachable after 60s"
                        curl -v http://frontend:5173 2>&1 || true
                        exit 1
                    fi
                '''
                sh '''
                    echo "=== Debug: Frontend response ==="
                    docker run --rm --network app-network \
                        mcr.microsoft.com/playwright:v1.60.0-jammy \
                        sh -c "curl -s http://frontend:5173 | head -100"
                    echo "=== End debug ==="
                '''
                sh '''
                    docker run --rm \
                        --volumes-from jenkins \
                        --network app-network \
                        -e BASE_URL=http://frontend:5173 \
                        -e API_URL=http://backend:8000/api \
                        -e TEST_USER_EMAIL=test@test.com \
                        -e TEST_USER_PASSWORD=test123 \
                        -e CI=true \
                        -w "$WORKSPACE" \
                        mcr.microsoft.com/playwright:v1.60.0-jammy \
                        sh -c "npm install && npx playwright test"
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
