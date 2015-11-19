/* @flow */

import type {AppConfig} from "./../hockeyApp/types"
import {log} from "./../setup"

export default class UpdateAction {
  /* jscs:disable disallowSemicolons */
  device: string;
  appConfig: AppConfig;
  currentVersion: string;
  /* jscs:enable disallowSemicolons */

  constructor(device: string, appConfig: AppConfig, currentVersion:string) {
    this.device = device
    this.appConfig = appConfig
    this.currentVersion = currentVersion
  }

  print() {
    log.info({
      currentVersion: this.currentVersion,
      newVersion: this.appConfig.version,
      app: this.appConfig.title,
      device: this.device
    }, "Updating version of device")
  }
}
