node('build') {
  ws('/home/thetaiter/git/webapp-example/data/jenkins/ws/master') {
    stage('Pull Source') {
      checkout scm
    }

    stage('Build Webapp Docker Image') {
      sh("sudo docker build -t thetaiter/webapp-example:0.1-b${BUILD_NUMBER} .")
      sh("sudo docker tag thetaiter/webapp-example:0.1-b${BUILD_NUMBER} thetaiter/webapp-example:latest")
    }
  
    stage('Push to DockerHub') {
      withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'docker', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
        sh("sudo docker login -u '${USERNAME}' -p '${PASSWORD}'")
        sh("sudo docker push ${USERNAME}/webapp-example:0.1-b${BUILD_NUMBER}")
        sh("sudo docker push ${USERNAME}/webapp-example:latest")
        sh('sudo docker logout')
      }
    }
  
    stage('Cleanup Docker Images') {
      sh("sudo docker rmi thetaiter/webapp-example:latest thetaiter/webapp-example:0.1-b${BUILD_NUMBER}")
    }
  }
}
