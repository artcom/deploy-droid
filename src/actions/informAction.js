/* @flow */

import colors from "colors/safe"

import type {AppConfig} from "./../hockeyApp/types"
import {log} from "./../setup"

export default class InformAction {
/* jscs:disable disallowSemicolons */
device: string;
appConfig: AppConfig;
/* jscs:enable disallowSemicolons */

  constructor(device: string, appConfig: AppConfig) {
    this.device = device
    this.appConfig = appConfig
  }

  createPrintableRow(): Array<string> {
    return [
      colors.green(this.appConfig.title),
      colors.green(this.appConfig.shortVersion),
      colors.green(this.appConfig.shortVersion)
    ]
  }

}