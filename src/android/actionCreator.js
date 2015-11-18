/* @flow */

import {log} from "./../setup"
import adbkit from "adbkit"

import {InformAction, InstallAction, UpdateAction} from "./Action"
import {AppConfig} from "./../hockeyApp/types"

const adb = adbkit.createClient()

export function createDeployActions(appConfigs: Array<AppConfig>): any {

  adb.listDevices().then((devices) => {
    const device = devices[0]
    const deployActions = appConfigs.map((appConfig) => createAction(device, appConfig))
    return Promise.all(deployActions)
      .then((results) => {
        log.info({results, device}, "action for device")
      })
  })
}

function createAction(device, appConfig) {
  return adb.isInstalled(device.id, appConfig.bundleIdentifier)
    .then((isInstalled) => {
      if (isInstalled) {
        return createActionForInstalledApp(device, appConfig)
      } else {
        return new InstallAction(appConfig)
      }
    })
}

function createActionForInstalledApp(device, appConfig) {
  return getInstalledVersion(device.id, appConfig.bundleIdentifier)
    .then((installedVersion) => {
      if (parseInt(installedVersion) < parseInt(appConfig.version)) {
        return new UpdateAction(appConfig, installedVersion)
      }

      return new InformAction(appConfig)
    }
)}

function getInstalledVersion(deviceId, androidPackage) {
  const regex = new RegExp("versionCode=\\d+")
  return adb.shell(deviceId, `dumpsys package ${androidPackage}`)
    .then(adbkit.util.readAll)
    .then(function(output) {
      const version = regex.exec(output.toString())[0].replace("versionCode=", "")
      return version
    })
}
