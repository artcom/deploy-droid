/* @flow */

import logUpdate from "log-update"

import {adb, log} from "./setup"
import * as hockeyApp from "./hockeyApp/hockeyApp"
import {createAllAppsForDevices, filterDeployableApps} from "./apps/appCreator"
import {describeActions} from "./printer"
import {informUser} from "./informUser"

Promise.all([adb.listDevices(), hockeyApp.getAppConfigs()])
  .then(createAllAppsForDevices)
  .then(informUser)
  .then((apps) => {
    const deployableApps = filterDeployableApps(apps)
    showProgress(() => describeActions(apps), deployApps(deployableApps))
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
