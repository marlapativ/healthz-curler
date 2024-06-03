pipeline {
    stages {
        stage('Checkout') {
            when {
                branch 'main'
            }
            steps{
                cleanWs()
                checkout scm
            }
        }
    }
}
