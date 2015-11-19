/* @flow */

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

  print() {
    log.info({
      version: this.appConfig.version,
      app: this.appConfig.title,
      device: this.device
    }, "Version already installed on device")
  }
}
