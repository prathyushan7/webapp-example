node('build') {
  stage('Build Webapp Docker Image') {
    shell("docker build -t thetaiter/webapp-example:0.1-b${BUILD_NUMBER}")
    shell("docker tag thetaiter/webapp-example:0.1-b${BUILD_NUMBER} thetaiter/webapp-example:latest")
  }

  stage('Push to DockerHub') {
    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'docker', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
      shell("docker login -u '${USERNAME}' -p '${PASSWORD}'")
      shell('docker push thetaiter/webapp-example')
      shell('docker logout')
    }
  }

  stage('Cleanup Docker Images') {
    shell("docker rmi thetaiter/webapp-example:latest thetaiter/webapp-example:0.1-b${BUILD_NUMBER}")
  }
}
