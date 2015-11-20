/* @flow */

import colors from "colors/safe"

import type {AppConfig} from "./../hockeyApp/types"
import {log} from "./../setup"

export default class UpdateAction {
  /* jscs:disable disallowSemicolons */
  device: string;
  appConfig: AppConfig;
  installedVersionCode: string;
  installedVersionName: string;
  /* jscs:enable disallowSemicolons */

  constructor(
    device: string,
    appConfig: AppConfig,
    installedVersion: {versionCode:string, versionName:string}
  ) {
    this.device = device
    this.appConfig = appConfig
    this.installedVersionCode = installedVersion.versionCode
    this.installedVersionName = installedVersion.versionName
  }

  createPrintableRow(): Array<string> {
    return [
      colors.red(this.appConfig.title),
      colors.red(this.installedVersionName),
      colors.green(this.appConfig.shortVersion)
    ]
  }

}
