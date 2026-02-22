pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '-p 3000:3000'
            reuseNode true
        }
    }
    environment {
        NETLIFY_SITE_ID = '45646fda-ca4b-4eda-8403-8f3936a123ac'
        NETLIFY_AUTH_TOKEN = credentials('Netlify-Token')
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                npm install netlify-cli
                netlify status
                '''
            }
        }
    }

     post {
        always {

             junit 'test-results/junit.xml'
            cleanWs()
        }
    }
}
