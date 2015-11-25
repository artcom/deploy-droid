/* @flow */

import _ from "lodash"
import adbkit from "adbkit"

import {adb} from "./../setup"
import App, {apkInstallState} from "./app"

import type {AppConfig} from "./../hockeyApp/types"
import type {Device} from "./types"

export function filterDeployableActions(apps: Array<App>): Array<App> {
  return _.reject(apps, (app) => {
    return app.apkInstallState === apkInstallState.INSTALLED
  })
}

export function createAllActionsForDevices(
  [devices, appConfigs]: [Array<Device>, Array<AppConfig>]
): Promise<Array<App>> {
  const createAllActions = devices.map(
    (device) => createActionsForDevice(device, appConfigs)
  )
  return Promise.all(createAllActions).then((results) => {
    return _.flatten(results)
  })
}

function createActionsForDevice(
  device: Device,
  appConfigs: Array<AppConfig>
): Promise<Array<App>> {

  const createActions = appConfigs.map((appConfig) => createAction(device, appConfig))
  return Promise.all(createActions)
}

function createAction(device, appConfig) {
  return adb.isInstalled(device.id, appConfig.bundleIdentifier)
    .then((isInstalled) => {
      if (isInstalled) {
        return createActionForInstalledApp(device, appConfig)
      } else {
        return new App(device.id, appConfig)
      }
    })
}

function createActionForInstalledApp(device: Device, appConfig: AppConfig): Promise<App> {
  return getInstalledVersion(device.id, appConfig.bundleIdentifier)
    .then((installedVersion) => {
      return new App(device.id, appConfig, installedVersion)
    }
)}

function getInstalledVersion(deviceId, androidPackage) {
  const versionCodeRegex = /versionCode=(\d+)/
  const versionNameRegex = /versionName=([\d.]*)/
  return adb.shell(deviceId, `dumpsys package ${androidPackage}`)
    .then(adbkit.util.readAll)
    .then(function(output) {
      return {
        versionCode: output.toString().match(versionCodeRegex)[1],
        versionName: output.toString().match(versionNameRegex)[1]
      }
    })
    .catch((error) => {
      console.log(
        `Error ${error} while getting version info of ${androidPackage} from device: ${deviceId}`
      )
    })
}
