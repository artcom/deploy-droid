/* @flow */

import util from "util"

import * as hockeyApp from "./hockeyApp/hockeyApp"
import {createAllAppsForDevices, filterDeployableApps} from "./apps/appCreator"
import {showDescription} from "./printer"
import {describeApps} from "./appPrinter"
import {informUser} from "./informUser"
import {getDevices} from "./devices/device"

Promise.all([getDevices(), hockeyApp.getAppConfigs()])
  .then(createAllAppsForDevices)
  .then(informUser)
  .then((apps) => {
    const deployableApps = filterDeployableApps(apps)
    showDescription(() => describeApps(apps), deployApps(deployableApps))
  })
  .catch((error) => {
    console.log(`Error: ${util.inspect(error)}`)
  })

function deployApps(deployableApps) {
  const deploy = deployableApps.map((deployableApp) => {
    return deployableApp.deploy()
  })
  return Promise.all(deploy)
}
