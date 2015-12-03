/* @flow */

import _ from "lodash"
import adbkit from "adbkit"

import {adb} from "./../setup"
import App, {apkInstallState} from "./app"

import type {AppConfig} from "./../hockeyApp/types"
import type {Device} from "./../device/types"

export function filterDeployableApps(apps: Array<App>): Array<App> {
  return _.reject(apps, (app) => {
    return app.apkInstallState === apkInstallState.INSTALLED
  })
}

export function createAllAppsForDevices(
  [devices, appConfigs]: [Array<Device>, Array<AppConfig>]
): Promise<Array<App>> {
  const createAllApps = devices.map(
    (device) => createAppsForDevice(device, appConfigs)
  )
  return Promise.all(createAllApps).then(_.flatten)
}

function createAppsForDevice(
  device: Device,
  appConfigs: Array<AppConfig>
): Promise<Array<App>> {

  const createApps = appConfigs.map((appConfig) => createApp(device, appConfig))
  return Promise.all(createApps)
}

function createApp(device, appConfig) {
  return adb.isInstalled(device.id, appConfig.bundleIdentifier)
    .then((isInstalled) => {
      if (isInstalled) {
        return createAppForInstalledApp(device, appConfig)
      } else {
        return new App(device, appConfig)
      }
    })
}

function createAppForInstalledApp(device: Device, appConfig: AppConfig): Promise<App> {
  return getInstalledVersion(device.id, appConfig.bundleIdentifier)
    .then((installedVersion) => {
      return new App(device, appConfig, installedVersion)
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
