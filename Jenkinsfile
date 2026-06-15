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

        // Usuario técnico para pruebas E2E
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
                sh 'docker run --rm --volumes-from jenkins -w "$WORKSPACE" ${NODE_IMAGE} npm run test'
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
                sh '''
                    echo "Limpiando cache corrupta de Docker BuildKit..."
                    docker builder prune -af || true
                    docker system prune -af || true

                    echo "Construyendo imagen frontend sin cache..."
                    DOCKER_BUILDKIT=0 docker build --no-cache -t all-in-one-frontend:latest .
                '''
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
                    E2E_EMAIL="test-${BUILD_NUMBER}@test.com"

                    echo "Ensuring E2E test user exists: ${E2E_EMAIL}"

                    docker run --rm \
                        --network app-network \
                        curlimages/curl:latest \
                        sh -c "curl -s -i -X POST http://backend:8000/api/auth/registro \
                        -H 'Content-Type: application/json' \
                        -d '{\\"correo\\":\\"${E2E_EMAIL}\\",\\"contrasena\\":\\"${TEST_USER_PASSWORD}\\",\\"nombre\\":\\"Test\\",\\"apellido\\":\\"User\\"}' \
                        || true"

                    echo ""
                    echo "Promoting E2E user to super_admin..."

                    docker exec backend python - <<PY
from app.db.database import SessionLocal
from app.models.usuario import User

email = "${E2E_EMAIL}"

db = SessionLocal()
try:
    user = db.query(User).filter(User.correo == email).first()

    if not user:
        raise SystemExit(f"ERROR: E2E user not found: {email}")

    user.role = "super_admin"
    user.activo = True

    db.commit()

    print(f"E2E user promoted to super_admin: {email}")
finally:
    db.close()
PY

                    echo ""
                    echo "Checking E2E test user login..."

                    LOGIN_RESPONSE=$(docker run --rm \
                        --network app-network \
                        curlimages/curl:latest \
                        sh -c "curl -s -X POST http://backend:8000/api/auth/inicio \
                        -H 'Content-Type: application/x-www-form-urlencoded' \
                        -d 'username=${E2E_EMAIL}&password=${TEST_USER_PASSWORD}'")

                    echo "Login response: ${LOGIN_RESPONSE}"

                    echo "${LOGIN_RESPONSE}" | grep -q "access_token"

                    if [ $? -ne 0 ]; then
                        echo "ERROR: E2E user login failed"
                        exit 1
                    fi

                    echo "E2E user login OK"
                '''

                sh '''
                    E2E_EMAIL="test-${BUILD_NUMBER}@test.com"

                    docker run --rm \
                        --volumes-from jenkins \
                        --network app-network \
                        -e BASE_URL=http://e2e-frontend:5173 \
                        -e API_URL=http://backend:8000/api \
                        -e TEST_USER_EMAIL="${E2E_EMAIL}" \
                        -e TEST_USER_PASSWORD="${TEST_USER_PASSWORD}" \
                        -e CI=true \
                        -w "$WORKSPACE" \
                        mcr.microsoft.com/playwright:v1.60.0-jammy \
                        sh -c "npm install && npx playwright test"
                '''

                sh '''
                    echo "======================================"
                    echo "Checking Playwright report files..."
                    echo "WORKSPACE: $WORKSPACE"
                    echo "======================================"

                    docker run --rm \
                        --volumes-from jenkins \
                        -w "$WORKSPACE" \
                        ${NODE_IMAGE} \
                        sh -c "
                            echo 'PWD:' && pwd
                            echo ''
                            echo 'ROOT FILES:' && ls -la
                            echo ''
                            echo 'PLAYWRIGHT CONFIG:' && sed -n '1,120p' playwright.config.ts || true
                            echo ''
                            echo 'TEST RESULTS FOLDER:' && ls -la test-results || true
                            echo ''
                            echo 'PLAYWRIGHT REPORT FOLDER:' && ls -la playwright-report || true
                            echo ''
                            echo 'SEARCH XML/JSON/HTML:' && find . -maxdepth 4 -type f \\( -name '*.xml' -o -name '*.json' -o -name 'index.html' \\) | sort
                            echo ''
                            echo 'CHECK EXACT JUNIT FILE:' && test -f test-results/results.xml && echo 'JUNIT XML EXISTS' || echo 'JUNIT XML DOES NOT EXIST'
                        "
                '''

                sh 'docker rm -f e2e-frontend 2>/dev/null || true'

                junit testResults: 'test-results/*.xml', allowEmptyResults: false

                archiveArtifacts artifacts: 'playwright-report/**,test-results/**', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            sh 'docker rm -f e2e-frontend 2>/dev/null || true'
            sh 'docker run --rm --volumes-from jenkins -w "$WORKSPACE" ${NODE_IMAGE} sh -c "rm -rf node_modules dist .tsbuildinfo 2>/dev/null; rm -rf ./* ./.??* 2>/dev/null" || true'
        }
    }
}