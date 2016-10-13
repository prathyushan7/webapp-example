def sendSlackMessage(message, color) {
  def red = "#FF0000"
  def green = "#00FF00"
  def blue = "#0000FF"
  def c = color

  if ("${c}" == "red") {
    c = red
  } else if ("${c}" == "green") {
    c = green
  } else if ("${c}" == "blue") {
    c = blue
  }

  slackSend message: "${message}",
          channel: '#builds',
          color: "${color}"
}

timestamps {
  slackSendMessage("Build ${BUILD_NUMBER} has started", 'blue')

  figlet "Awesome..."
  
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

  figlet "Done!"

  slackSendMessage("Build ${BUILD_NUMBER} has finished with result: " + manager.build.result, 'blue')
}
