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
  _.map(devices, (device) => {
    const isInstalledPromises = device.checkDeployments(appConfigs)
    Promise.all(isInstalledPromises).then((results) => {
      log.info({results}, "results of is installed")
    })
  })

  log.info({devices}, "List adb devices")
}).catch((error) => {
  log.error({error}, "Error retrieving app configs")
})

/*
goal:

device:
welche app config soll installiert werden

appconfig:
welche app soll heruntergeladen werden

*/
