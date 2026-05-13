pipeline {
    agent any

    environment {
        SONAR_HOST_URL = 'https://sonarcloud.io'
        SONAR_TOKEN    = credentials('sonar-token')
        PROJECT_KEY    = 'jhosue-pstr_All-In-One-Frontend'
        ORG            = 'jhosue-pstr'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node') {
            steps {
                nodejs('NodeJS') {
                    sh 'npm install'
                }
            }
        }

        stage('Lint & Build') {
            steps {
                nodejs('NodeJS') {
                    sh 'npm run build'
                }
            }
        }

        stage('Run Tests') {
            steps {
                nodejs('NodeJS') {
                    sh 'npm run test || true'
                }
            }
        }

        stage('SonarCloud Analysis') {
            steps {
                withSonarQubeEnv('SonarCloud') {
                    nodejs('NodeJS') {
                        sh '''sonar-scanner \
                            -Dsonar.projectKey=${PROJECT_KEY} \
                            -Dsonar.organization=${ORG} \
                            -Dsonar.sources=src \
                            -Dsonar.exclusions=node_modules/**,dist/**,public/**'''
                    }
                }
            }
        }

        // CNES REPORT - Deshabilitado por incompatibilidad con SonarCloud API v8
        // Revisar: https://github.com/cnescatlab/sonar-cnes-report/releases
        // stage('Generate CNES Report') {
        //     steps {
        //         sh 'curl -sL -o sonar-cnes-report.jar "https://github.com/cnescatlab/sonar-cnes-report/releases/download/5.0.4/sonar-cnes-report-5.0.4.jar"'
        //         sh 'java -jar sonar-cnes-report.jar -t ${SONAR_TOKEN} -s ${SONAR_HOST_URL} -p ${PROJECT_KEY} -o ./cnes-report'
        //     }
        // }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t all-in-one-frontend:latest .'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
