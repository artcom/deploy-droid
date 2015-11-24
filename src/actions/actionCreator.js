/* @flow */

import _ from "lodash"
import adbkit from "adbkit"

import {adb, log} from "./../setup"
import InformAction from "./informAction"
import InstallAction from "./installAction"

import type {AppConfig} from "./../hockeyApp/types"
import type {Action, Device} from "./types"

export function filterDeployableActions(actions: Array<Action>): Promise<Array<InstallAction>> {
  const installActions = _.filter(actions, (action) => {
    return action.constructor.name.includes("InstallAction")
  })
  return Promise.resolve(installActions)
}

export function createAllActionsForDevices(
  [devices, appConfigs]: [Array<Device>, Array<AppConfig>]
): Promise<Array<Action>> {

  appConfigs.map((appConfig) => {log.info({appConfig}, "AppConfig")})

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
): Promise<Array<Action>> {

  const createActions = appConfigs.map((appConfig) => createAction(device, appConfig))
  return Promise.all(createActions)
}

function createAction(device, appConfig) {
  return adb.isInstalled(device.id, appConfig.bundleIdentifier)
    .then((isInstalled) => {
      if (isInstalled) {
        return createActionForInstalledApp(device, appConfig)
      } else {
        return new InstallAction(device.id, appConfig)
      }
    })
}

function createActionForInstalledApp(device: Device, appConfig: AppConfig): Promise<Action> {
  return getInstalledVersion(device.id, appConfig.bundleIdentifier)
    .then((installedVersion) => {
      if (parseInt(installedVersion.versionCode) < parseInt(appConfig.version)) {
        return new InstallAction(device.id, appConfig, installedVersion)
      }

      return new InformAction(device.id, appConfig)
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
      log.info(
        {error},
        `Error while getting version info of ${androidPackage} from device: ${deviceId}`
      )
    })
}
