import _ from "lodash"

import {verifyOptions, log} from "./setup"
import HockeyApp from "./hockeyApp/HockeyApp"
import Device from "./android/Device"

verifyOptions()
const hockeyApp = new HockeyApp()

Promise.all([hockeyApp.getApps(), Device.createDevices()])
  .then((results) => {
    const appConfigs = results[0]
    const devices = results[1]

    const deployActions = _.map(devices, (device) => {
      return device.createDeployActions(appConfigs)
    })
    Promise.all(deployActions).then((results) => {
      log.info({results}, "Devices with actions")

      results.forEach((result) => {
        result.executeActions()
      })
    })

  }).catch((error) => {
    log.error({error}, "Error")
  })

/*
goal:

device:
welche app config soll installiert werden

appconfig:
welche app soll heruntergeladen werden

*/
