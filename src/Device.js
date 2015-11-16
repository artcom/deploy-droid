import _ from "lodash"
import bunyan from "bunyan"
import adbkit from "adbkit"

import {InstallAction, UpdateAction, AlreadyInstalledAction} from "./Action"

const log = bunyan.createLogger({ name: "deploy-droid" })
const adb = adbkit.createClient()

export default class Device {

  constructor(id, type) {
    this.id = id
    this.type = type
    this.actions = null
  }

  executeActions() {
    this.actions.forEach((action) => action.execute(this.id))
  }

  createInstallActions(appConfigs) {
    const actionPromises = _.map(appConfigs, (appConfig) => {
      return this.createAction(appConfig)
    })

    return Promise.all(actionPromises).then((results) => {
      this.actions = results
      return this
    }).catch((error) => {
      log.info({error}, "Error")
    })
  }

  createAction(appConfig) {
    return adb.isInstalled(this.id, appConfig.bundleIdentifier).then((isInstalled) => {
      return this.onIsInstalled(appConfig, isInstalled)
    })
  }

  onIsInstalled(appConfig, isInstalled) {
    if (isInstalled) {
      return this.checkForUpdateAction(appConfig)
    } else {
      return new InstallAction(appConfig)
    }
  }

  checkForUpdateAction(appConfig) {
    return this.getInstalledVersion(this.id, appConfig.bundleIdentifier)
      .then((installedVersion) => {
        if (parseInt(installedVersion) < parseInt(appConfig.version)) {
          return new UpdateAction(appConfig, installedVersion)
        }

        return new AlreadyInstalledAction(appConfig)
      }
  )}

  getInstalledVersion(deviceId, androidPackage) {
    const regex = new RegExp("versionCode=\\d+")
    return adb.shell(deviceId, `dumpsys package ${androidPackage}`)
      .then(adbkit.util.readAll)
      .then(function(output) {
        const version = regex.exec(output.toString())[0].replace("versionCode=", "")
        return version
      })
      .catch((error) => {
        log.info({error}, "ADB error")
      })
  }

}
