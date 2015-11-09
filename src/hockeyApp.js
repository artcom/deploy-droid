import _ from "lodash"
import axios from "axios"
import bunyan from "bunyan"

import AppConfig from "./AppConfig"
import {getHockeyAppToken} from "./setup"
const log = bunyan.createLogger({ name: "deploy-droid" })

export function getApps() {
  return retrieveAll()
    .then(selectDeployableApps)
    .then(createAppConfigs)
}

function retrieveAll() {
  return axios.get("https://rink.hockeyapp.net/api/2/apps", {
    headers: {
      "X-HockeyAppToken": getHockeyAppToken()
    }
  })
}

function selectDeployableApps(response) {
  const deployableApps = _.select(response.data.apps, {
    custom_release_type: "deploydroid",
    status: 2
  })
  log.info({deployableApps}, "Deployable apps")
  return deployableApps
}

function createAppConfigs(hockeyData) {
  const appConfigs = _.map(hockeyData, (hockeyApp) => new AppConfig(hockeyApp))

  const completeAppConfigs = _.map(appConfigs, (appConfig) => appConfig.retrieveVersion())
  return Promise.all(completeAppConfigs)
}
