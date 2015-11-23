/* @flow */

import _ from "lodash"
import bluebird from "bluebird"
import read from "read"
import yn from "yn"

import {adb, log} from "./setup"
import * as hockeyApp from "./hockeyApp/hockeyApp"
import {createAllActionsForDevices, filterDeployableActions} from "./actions/actionCreator"
import {printActionsByDevice} from "./printer"

const readAsync = bluebird.promisify(read)

Promise.all([adb.listDevices(), hockeyApp.getAppConfigs()])
  .then(createAllActionsForDevices)
  .then(printActionsByDevice)
  .then(filterDeployableActions)
  .then(informUser)
  .then((deployableActions) => {
    const deploy = deployableActions.map((action) => {
      return action.deploy()
    })
    return Promise.all(deploy)
  })
  .catch((error) => {
    log.error({error}, "Error")
  })

function informUser(deployableActions) {
  if (_.isEmpty(deployableActions)) {
    console.log("All Apps up-to-date")
    process.exit()
  } else {
    return promptUser(deployableActions)
  }
}

function promptUser(deployableActions) {
  return readAsync({ prompt: "apply changes (y/N)?" })
    .then((response) => {
      if (yn(response)) {
        return deployableActions
      }
    })
}
