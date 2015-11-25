/* @flow */

import {adb, log} from "./setup"
import * as hockeyApp from "./hockeyApp/hockeyApp"
import {createAllAppsForDevices, filterDeployableApps} from "./apps/appCreator"
import {showDescription, describeActions} from "./printer"
import {informUser} from "./informUser"

Promise.all([adb.listDevices(), hockeyApp.getAppConfigs()])
  .then(createAllAppsForDevices)
  .then(informUser)
  .then((apps) => {
    const deployableApps = filterDeployableApps(apps)
    showDescription(() => describeActions(apps), deployApps(deployableApps))
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
