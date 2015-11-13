import bunyan from "bunyan"
import adbkit from "adbkit"
import {verifyOptions} from "./setup"
import HockeyApp from "./hockeyApp/HockeyApp"

verifyOptions()

const adb = adbkit.createClient()

const log = bunyan.createLogger({ name: "deploy-droid" })
log.info("Starting Deploy Droid")

const hockeyApp = new HockeyApp()
hockeyApp.getApps().then((appConfigs) => {
  //log.info({appConfigs}, "App configs")
  return appConfigs
}).catch((error) => {
  log.error({error}, "Error retrieving app configs")
})

const preconditions = [hockeyApp.getApps(), adb.listDevices()]
Promise.all(preconditions).then((results) => {
  const appConfigs = results[0]
  const devices = results[1]
  log.info({results}, "List adb devices")
})
