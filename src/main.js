/* @flow */

import _ from "lodash"
import util from "util"

import {verifyOptions, log} from "./setup"
import * as hockeyApp from "./hockeyApp/hockeyApp"
import * as actionCreator from "./android/actionCreator"

verifyOptions()

hockeyApp.getAppConfigs()
  .then((appConfigs) => {
    log.info({appConfigs}, "AppConfigs")
    return actionCreator.createDeployActions(appConfigs)
  }).then((actions) => {
    log.info({actions}, "Actions")
  }).catch((error) => {
    log.error({error}, "Error")
  })
