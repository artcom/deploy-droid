/* @flow */

import _ from "lodash"
import adbkit from "adbkit"

import {log} from "./setup"
import * as hockeyApp from "./hockeyApp/hockeyApp"
import * as actionCreator from "./actions/actionCreator"

const adb = adbkit.createClient()

Promise.all([adb.listDevices(), hockeyApp.getAppConfigs()])
  .then(actionCreator.createAllActionsForDevices)
  .then(actionCreator.filterDeployableActions)
  .then((deployableActions) => {
    deployableActions.map((action) => action.print())
    return deployableActions
  })
  .then((deployableActions) => {
    const deploy = deployableActions.map(deployableAction => deployableAction.execute())

  })
  .catch((error) => {
    log.error({error}, "Error")
  })
