/* @flow */

import _ from "lodash"
import adbkit from "adbkit"

import {verifyOptions, log} from "./setup"
import * as hockeyApp from "./hockeyApp/hockeyApp"
import * as actionCreator from "./android/actionCreator"

verifyOptions()

const adb = adbkit.createClient()

Promise.all([adb.listDevices(), hockeyApp.getAppConfigs()])
  .then(([devices, appConfigs]) => {
    const deployActions = devices.map(
      (device) => actionCreator.createDeployActions(device, appConfigs)
    )
    return Promise.all(deployActions)
  })
  .then((results) => {
    const flattendResults = _.flatten(results)
    log.info({flattendResults}, "Deploy Actions")
    flattendResults.map((action) => action.execute())
  })
  .catch((error) => {
    log.error({error}, "Error")
  })
