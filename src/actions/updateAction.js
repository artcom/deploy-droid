/* @flow */

//import path from "path"

import colors from "colors/safe"

import {log} from "./../setup"
import {downloadApk} from "./apkDownloader"

import type {AppConfig} from "./../hockeyApp/types"

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

    Promise.resolve(this.deploy(this.appConfig))
  }

  createPrintableRow(): Array<string> {
    return [
      colors.red(this.appConfig.title),
      colors.red(this.installedVersionName),
      colors.green(this.appConfig.shortVersion)
    ]
  }

  deploy(appConfig: AppConfig) {
    downloadApk(appConfig)
      .then((filepath) => {
        log.info({filepath}, "FILEPATH")
      })
  }

}
