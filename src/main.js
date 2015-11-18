/* @flow */

import _ from "lodash"
import util from "util"

import {verifyOptions, log} from "./setup"
import * as hockeyApp from "./hockeyApp/hockeyApp"
import Device from "./android/Device"

verifyOptions()

Promise.all([hockeyApp.getAppConfigs(), Device.createDevices()])
  .then(([appConfigs, devices]) => {

    log.info({appConfigs}, "AppConfigs")

    const deployActions = _.map(devices, (device) => {
      return device.createDeployActions(appConfigs)
    })

    return Promise.all(deployActions).then((results) => {
      console.log(util.inspect(results, {depth: -1}))

      results.forEach((result) => {
        result.executeActions()
      })
    })

  }).catch((error) => {
    log.error({error}, "Error")
  })
