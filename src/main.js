#! /usr/bin/env node
/* @flow */

import util from "util"

import * as hockeyApp from "./hockeyApp"
import {createAllAppsForDevices, filterDeployableApps} from "./apps/appCreator"
import {showDescription} from "./printer"
import {describeApps} from "./apps/appPrinter"
import {informUser} from "./informUser"
import {getDevices} from "./device"

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
