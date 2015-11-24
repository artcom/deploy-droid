/* @flow */

import {adb, log} from "./setup"
import * as hockeyApp from "./hockeyApp/hockeyApp"
import {createAllActionsForDevices, filterDeployableActions} from "./actions/actionCreator"
import {printActions, startPrintingStatus} from "./printer"
import {informUser} from "./informUser"

Promise.all([adb.listDevices(), hockeyApp.getAppConfigs()])
  .then(createAllActionsForDevices)
  .then(printActions)
  .then(informUser)
  .then(startPrintingStatus)
  .then(filterDeployableActions)
  .then(deployApps)
  .catch((error) => {
    log.error({error}, "Error")
  })

function deployApps(deployableActions) {
  const deploy = deployableActions.map((deployableAction) => {
    return deployableAction.deploy()
  })
  return Promise.all(deploy)
}
