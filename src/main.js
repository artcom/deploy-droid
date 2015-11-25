/* @flow */

import {adb, log, deviceDescription} from "./setup"
import * as hockeyApp from "./hockeyApp/hockeyApp"
import {createAllAppsForDevices, filterDeployableApps} from "./apps/appCreator"
import {showDescription, describeApps} from "./printer"
import {informUser} from "./informUser"
import util from "util"

import type {Device} from "./apps/types"

export type AdbDeviceInfo = {
  id: string,
  type: string
}

function createDevices(): Promise<Array<Device>> {
  return adb.listDevices()
    .then((devices) => {
      console.log(util.inspect(devices))
      const createDevices = devices.map(createDevice)
      return Promise.all(createDevices)
    })
}

function createDevice({id, type}: AdbDeviceInfo): Promise<Device> {
  if (type !== "offline") {
    return deviceDescription(id).then((deviceDescription) => {
      return {id, type, description: deviceDescription}
    })
  } else {
    return {id, type, description: "unknown"}
  }
}

Promise.all([createDevices(), hockeyApp.getAppConfigs()])
  .then(createAllAppsForDevices)
  .then(informUser)
  .then((apps) => {
    const deployableApps = filterDeployableApps(apps)
    showDescription(() => describeApps(apps), deployApps(deployableApps))
  })
  .catch((error) => {
    log.error({error}, "Error")
  })

function deployApps(deployableApps) {
  const deploy = deployableApps.map((deployableApp) => {
    return deployableApp.deploy()
  })
  return Promise.all(deploy)
}
