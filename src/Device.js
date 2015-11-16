import _ from "lodash"
import bunyan from "bunyan"
import adbkit from "adbkit"

const log = bunyan.createLogger({ name: "deploy-droid" })
const adb = adbkit.createClient()

export default class Device {

  constructor(id, type) {
    this.id = id
    this.type = type
    this.actions = {install: []}
  }

  createInstallActions(appConfigs) {
    const actionPromises = _.map(appConfigs, (appConfig) => {
      return this.isInstalled(appConfig)
    })

    Promise.all(actionPromises).then((results) => {
      log.info({results}, "results of is installed")
      log.info({actions: this.actions.install}, "install actions")
    }).catch((error) => {
      log.info({error}, "Error")
    })
  }

  createAction(appConfig, isInstalled) {
    if (!isInstalled) {
      this.actions.install.push(appConfig)
      return this
    } else {
      return this.getInstalledVersion(this.id, appConfig.bundleIdentifier).then((installedVersion) => {
        if (parseInt(installedVersion) < parseInt(appConfig.latestVersion)) {
          this.actions.install.push(appConfig)
          return this
        }
      })
    }
  }

  isInstalled(appConfig) {
    return adb.isInstalled(this.id, appConfig.bundleIdentifier).then((isInstalled) => {
      return this.createAction(appConfig, isInstalled)
    })
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
