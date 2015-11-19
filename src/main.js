/* @flow */

import _ from "lodash"
import adbkit from "adbkit"

import {verifyOptions, log} from "./setup"
import * as hockeyApp from "./hockeyApp/hockeyApp"
import * as actionCreator from "./actions/actionCreator"
import type {Device} from "./actions/types"
import type {AppConfig} from "./hockeyApp/types"

verifyOptions()

const adb = adbkit.createClient()

function getDevices(): Promise<Array<Device>> {
  return adb.listDevices()
}

function getAppConfigs(): Promise<Array<AppConfig>> {
  return hockeyApp.getAppConfigs()
}

Promise.all([getDevices(), getAppConfigs()])
  .then(([devices, appConfigs]: [Array<Device>, Array<AppConfig>]) => {

    log.info({appConfigs}, "AppConfigs")

    const deployActions = devices.map((device) => actionCreator.getActions(device, appConfigs))
    log.info({deployActions}, "deployActions Promises")
    return Promise.all(deployActions)
  })
  .then((results) => {
    const flattendResults = _.flatten(results)
    log.info({flattendResults}, "Deploy Actions")
    flattendResults.map((action) => action.print())
  })
  .catch((error) => {
    log.error({error}, "Error")
  })

  /*
  Promise.all([getDevices(), getAppConfigs()])
    .then(([devices, appConfigs]) => {
      log.info({devices, appConfigs}, "Device, AppConfigs")
      const deployActions = devices.map(
        (device) => actionCreator.getActions(device, appConfigs)
      )
      return Promise.all(deployActions)
    })
    .then((results) => {
      const flattendResults = _.flatten(results)
      log.info({flattendResults}, "Deploy Actions")
      flattendResults.map((action) => action.print())
    })
    .catch((error) => {
      log.error({error}, "Error")
    })
  */
