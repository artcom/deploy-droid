import _ from "lodash"
import adbkit from "adbkit"

import {verifyOptions, log} from "./setup"
import HockeyApp from "./hockeyApp/HockeyApp"
import Device from "./Device"

verifyOptions()

const adb = adbkit.createClient()
const hockeyApp = new HockeyApp()

log.info("Starting Deploy Droid")

function getDevices() {
  return adb.listDevices().then((devices) => {
    return _.map(devices, (device) => new Device(device.id, device.type))
  })
}

Promise.all([hockeyApp.getApps(), getDevices()])
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
