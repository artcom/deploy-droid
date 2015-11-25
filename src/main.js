/* @flow */

import logUpdate from "log-update"

import {adb, log} from "./setup"
import * as hockeyApp from "./hockeyApp/hockeyApp"
import {createAllActionsForDevices, filterDeployableActions} from "./actions/actionCreator"
import {describeActions} from "./printer"
import {informUser} from "./informUser"

Promise.all([adb.listDevices(), hockeyApp.getAppConfigs()])
  .then(createAllActionsForDevices)
  .then(informUser)
  .then((actions) => {
    const deployableActions = filterDeployableActions(actions)
    showProgress(() => describeActions(actions), deployApps(deployableActions))
  })
  .catch((error) => {
    log.error({error}, "Error")
  })

function deployApps(deployableActions) {
  const deploy = deployableActions.map((deployableAction) => {
    return deployableAction.deploy()
  })
  return Promise.all(deploy)
}

function showProgress(print, promise) {
  const interval = setInterval(function() {
    print().then(logUpdate)
  }, 500)

  function stop() {
    clearInterval(interval)
    print().then(logUpdate)
  }

  return promise.then(
    (result) => {
      stop()
      return result
    },
    (error) => {
      stop()
      throw error
    }
  )
}
