/* @flow */

import _ from "lodash"
import adbkit from "adbkit"

import {log} from "./setup"
import * as hockeyApp from "./hockeyApp/hockeyApp"
import * as actionCreator from "./actions/actionCreator"

import type {Device} from "./actions/types"
import type {AppConfig} from "./hockeyApp/types"

const adb = adbkit.createClient()

Promise.all([adb.listDevices(), hockeyApp.getAppConfigs()])
  .then(([devices, appConfigs]: [Array<Device>, Array<AppConfig>]) => {
    const createDeployActions = devices.map(
      (device) => actionCreator.getActions(device, appConfigs)
    )
    return Promise.all(createDeployActions)
  })
  .then((results) => {
    const flattendResults = _.flatten(results)
    log.info({flattendResults}, "Deploy Actions")
    flattendResults.map((action) => action.print())
  })
  .catch((error) => {
    log.error({error}, "Error")
  })
