import _ from "lodash"
import axios from "axios"
import bunyan from "bunyan"

import AppConfig from "./AppConfig"
import {options} from "./../setup"
const log = bunyan.createLogger({ name: "deploy-droid" })

const hockeyAppToken = options.hockeyAppToken

export default class HockeyApp {

  getApps() {
    return this.retrieveAll()
      .then(this.selectDeployableApps)
      .then(this.createAppConfigs)
  }

  retrieveAll() {
    return axios.get("https://rink.hockeyapp.net/api/2/apps", {
      headers: {
        "X-HockeyAppToken": hockeyAppToken
      }
    })
  }

  selectDeployableApps(response) {
    const deployableApps = _.select(response.data.apps, {
      custom_release_type: "deploydroid",
      status: 2
    })
    log.info({deployableApps}, "Deployable apps")
    return deployableApps
  }

  createAppConfigs(hockeyData) {
    const appConfigs = _.map(hockeyData, (hockeyApp) => new AppConfig(hockeyApp))

    const completeAppConfigs = _.map(appConfigs,
      (appConfig) => appConfig.retrieveVersion(hockeyAppToken)
    )
    return Promise.all(completeAppConfigs)
  }

}
