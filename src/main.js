/* @flow */

import {adb, log} from "./setup"
import * as hockeyApp from "./hockeyApp/hockeyApp"
import {createAllActionsForDevices, filterDeployableActions} from "./actions/actionCreator"
import {printActions, startPrintingActions} from "./printer"
import {informUser} from "./informUser"

Promise.all([adb.listDevices(), hockeyApp.getAppConfigs()])
  .then(createAllActionsForDevices)
  .then(printActions)
  .then(informUser)
  .then(startPrintingActions)
  .then(filterDeployableActions)
  .then((deployableActions) => {
    const deploy = deployableActions.map((action) => {
      return action.deploy()
    })
    return Promise.all(deploy)
  })
  .catch((error) => {
    log.error({error}, "Error")
  })
