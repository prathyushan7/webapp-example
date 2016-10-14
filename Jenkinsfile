env.buildCauseDescription="${currentBuild.rawBuild.getCauses()[0].getShortDescription()}"

def sendErrorMessage(stage) {
  slackSend message: "There was an error in stage '${stage}' in Jenkins job '${env.JOB_NAME}'.\n\nPlease check the console output to find out more:\n${env.BUILD_URL}console",
            color: 'danger'
}

if ("${env.buildCauseDescription}" == "Branch indexing") {
  env.buildCauseDescription = "started by ${env.buildCauseDescription.replace('B','b')}"
} else {
  env.buildCauseDescription = "${env.buildCauseDescription.replace('S','s')}"
}

timestamps {
  slackSend message: "Jenkins job '${env.JOB_NAME}' has been ${env.buildCauseDescription}.\n\nPlease check the console output to monitor the job:\n${env.BUILD_URL}console",
            color: 'good'

  node('build') {
    ws('/home/thetaiter/git/webapp-example/data/jenkins/ws/master') {
      stage('Pull Source') {
        try {
          checkout scm
        } catch(any) {
          sendErrorMessage('Pull Source')
          throw any
        }
      }
  
      def myImage = ""
      stage('Build Docker Image') {
        try {
          myImage = docker.build("thetaiter/webapp-example:0.1-b${BUILD_NUMBER}")
          myImage.tag('latest')
        } catch(any) {
          sendErrorMessage('Build Docker Image')
          throw any
        }
      }
    
      stage('Push to DockerHub') {
        try {
          withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'docker', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
            sh("sudo docker login -u ${USERNAME} -p ${PASSWORD}")
            sh("sudo docker push thetaiter/webapp-example:0.1-b${BUILD_NUMBER}")
            sh("sudo docker push thetaiter/webapp-example:latest")
            sh("sudo docker logout")
          }
        } catch(any) {
          sendErrorMessage('Push to DockerHub')
          throw any
        } 
      }
    
      stage('Cleanup Docker Images') {
        try {
          sh("sudo docker rmi thetaiter/webapp-example:latest thetaiter/webapp-example:0.1-b${BUILD_NUMBER}")
        } catch(any) {
          sendErrorMessage('Cleanup Docker Images')
          throw any
        } 
      }
    }
  }

  slackSend message: "Jenkins job '${env.JOB_NAME}' has completed successfully.",
            color: 'good'
}
