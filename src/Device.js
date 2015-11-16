import _ from "lodash"
import bunyan from "bunyan"
import adbkit from "adbkit"
import AppConfig from "./hockeyApp/AppConfig"

const log = bunyan.createLogger({ name: "deploy-droid" })
const adb = adbkit.createClient()

export default class Device {

  constructor(id, type) {
    this.id = id
    this.type = type
  }

  checkDeployments(appConfigs) {
    return _.map(appConfigs, (appConfig) => {
      return this.isInstalled(this.id, appConfig.bundleIdentifier)
    })
  }

  isInstalled(deviceId, androidPackage) {
    return adb.isInstalled(deviceId, androidPackage)
  }

  getInstalledVersion(deviceId, androidPackage) {
    const regex = new RegExp("versionCode=\\d+")
    return adb.shell(deviceId, `dumpsys package ${androidPackage}`)
      .then(adbkit.util.readAll)
      .then(function(output) {
        const version = regex.exec(output.toString())[0].replace("versionCode=", "")
        log.info({deviceId, androidPackage, version}, "ADB out")
        return version
      })
      .catch((error) => {
        log.info({error}, "ADB error")
      })
  }

}
