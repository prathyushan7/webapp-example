env.buildCauseDescription="${currentBuild.rawBuild.getCauses()[0].getShortDescription()}"

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
          slackSend message: "There was an error in stage 'Pull Source' in Jenkins job '${env.JOB_NAME}'.\n\nPlease check the console output to find out more:\n${env.BUILD_URL}console",
                    color: 'danger'

          throw any
        }
      }
  
      stage('Build Docker Image') {
        try {
          sh("sudo docker build -t thetaiter/webapp-example:0.1-b${BUILD_NUMBER} .")
          sh("sudo docker tag thetaiter/webapp-example:0.1-b${BUILD_NUMBER} thetaiter/webapp-example:latest")
        } catch(any) {
          slackSend message: "There was an error in stage 'Build Docker Image' in Jenkins job '${env.JOB_NAME}'.\n\nPlease check the console output to find out more:\n${env.BUILD_URL}console",
                    color: 'danger'

          throw any
        }
      }
    
      stage('Push to DockerHub') {
        try {
          withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'docker', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
            sh("sudo docker login -u '${USERNAME}' -p '${PASSWORD}'")
            sh("sudo docker push ${USERNAME}/webapp-example:0.1-b${BUILD_NUMBER}")
            sh("sudo docker push ${USERNAME}/webapp-example:latest")
            sh('sudo docker logout')
          }
        } catch(any) {
          slackSend message: "There was an error in stage 'Push to DockerHub' in Jenkins job '${env.JOB_NAME}'.\n\nPlease check the console output to find out more:\n${env.BUILD_URL}console",
                    color: 'danger'
        
          throw any
        } 
      }
    
      stage('Cleanup Docker Images') {
        try {
          sh("sudo docker rmi thetaiter/webapp-example:latest thetaiter/webapp-example:0.1-b${BUILD_NUMBER}")
          sh('exit 1')
        } catch(any) {
          slackSend message: "There was an error in stage 'Cleanup Docker Images' in Jenkins job '${env.JOB_NAME}'.\n\nPlease check the console output to find out more:\n${env.BUILD_URL}console",
                    color: 'danger'
        
          throw any
        } 
      }
    }
  }

  slackSend message: "Jenkins job '${env.JOB_NAME}' has completed successfully.",
            color: 'good'
}
