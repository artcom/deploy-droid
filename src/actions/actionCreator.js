/* @flow */

import _ from "lodash"
import adbkit from "adbkit"

import InformAction from "./informAction"
import InstallAction from "./installAction"
import UpdateAction from "./updateAction"

import type {AppConfig} from "./../hockeyApp/types"
import type {Action, Device} from "./types"

const adb = adbkit.createClient()

export function filterDeployableActions(actions: Array<Action>): Array<Action> {
  return _.reject(actions, (action) => {
    return action.constructor.name.includes("InformAction")
  })
}

export function createAllActionsForDevices(
  [devices, appConfigs]: [Array<Device>, Array<AppConfig>]
): Promise<Array<Action>> {

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

function createActionForInstalledApp(device, appConfig) {
  return getInstalledVersion(device.id, appConfig.bundleIdentifier)
    .then((installedVersion) => {
      if (parseInt(installedVersion) < parseInt(appConfig.version)) {
        return new UpdateAction(device.id, appConfig, installedVersion)
      }

      return new InformAction(device.id, appConfig)
    }
)}

function getInstalledVersion(deviceId, androidPackage) {
  const versionRegex = /versionCode=(\d+)/
  return adb.shell(deviceId, `dumpsys package ${androidPackage}`)
    .then(adbkit.util.readAll)
    .then(function(output) {
      const version = output.toString().match(versionRegex)[1]
      return version
    })
}
