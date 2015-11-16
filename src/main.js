import _ from "lodash"
import adbkit from "adbkit"
import bunyan from "bunyan"
import {verifyOptions} from "./setup"
import HockeyApp from "./hockeyApp/HockeyApp"
import Device from "./Device"

verifyOptions()

const adb = adbkit.createClient()

const log = bunyan.createLogger({ name: "deploy-droid" })
log.info("Starting Deploy Droid")

const hockeyApp = new HockeyApp()

function getDevices() {
  return adb.listDevices().then((devices) => {
    return _.map(devices, (device) => new Device(device.id, device.type))
  })
}

const preconditions = [hockeyApp.getApps(), getDevices()]
Promise.all(preconditions).then((results) => {
  const appConfigs = results[0]
  const devices = results[1]

  //go over every device, collect promises that find out if AppConfigs are deployed
  const deviceActions = _.map(devices, (device) => {
    return device.createInstallActions(appConfigs)
  })
  Promise.all(deviceActions).then((results) => {
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
