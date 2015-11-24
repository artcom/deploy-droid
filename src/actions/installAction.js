/* @flow */

import _ from "lodash"
import colors from "colors/safe"

import type {AppConfig} from "./../hockeyApp/types"
import {downloadApk} from "./apkDownloader"

export default class InstallAction {
/* jscs:disable disallowSemicolons */
device: string;
appConfig: AppConfig;
installedVersion: ?{versionCode:string, versionName:string};
/* jscs:enable disallowSemicolons */

constructor(
  device: string,
  appConfig: AppConfig,
  installedVersion: ?{versionCode:string, versionName:string}
) {
  this.device = device
  this.appConfig = appConfig
  this.installedVersion = installedVersion
}

  createPrintableRow(): Array<string> {
    const versionName = _.get(this.installedVersion, ["versionName"])
    const installationStatus = versionName ? colors.red(versionName) : colors.grey("not deployed")

    return [
      colors.red(this.appConfig.title),
      installationStatus,
      colors.green(this.appConfig.shortVersion)
    ]
  }

  deploy() {
    return downloadApk(this.appConfig)
      .then((filepath) => {
        console.log(colors.grey(`Will install apk ${filepath} to device ${this.device}`))
      })
  }

}
