/* @flow */

import {adb, log} from "./setup"
import * as hockeyApp from "./hockeyApp/hockeyApp"
import * as actionCreator from "./actions/actionCreator"
import {printActionsByDevice} from "./printer"

Promise.all([adb.listDevices(), hockeyApp.getAppConfigs()])
  .then(actionCreator.createAllActionsForDevices)
  .then(printActionsByDevice)
  .then((deployableActions) => {
    //deployableActions.map((action) => action.print())
    return deployableActions
  })
  .catch((error) => {
    log.error({error}, "Error")
  })
