/* @flow */

import _ from "lodash"
import util from "util"

import {verifyOptions, log} from "./setup"
import * as hockeyApp from "./hockeyApp/HockeyApp"
import Device from "./android/Device"

verifyOptions()

Promise.all([hockeyApp.getApps(), Device.createDevices()])
  .then(([appConfigs, devices]) => {
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

/*
goal:

device:
welche app config soll installiert werden

appconfig:
welche app soll heruntergeladen werden

*/
