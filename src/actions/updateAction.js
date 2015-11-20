/* @flow */

//import path from "path"

import fs from "fs"
import colors from "colors/safe"
import wget from "wgetjs"
import bluebird from "bluebird"
import type {AppConfig} from "./../hockeyApp/types"
import {log} from "./../setup"

const wgetAsync = bluebird.promisify(wget)
const statAsync = bluebird.promisify(fs.stat)

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
    Promise.resolve(this.createDownloadPromise(this.appConfig))
  }

  createPrintableRow(): Array<string> {
    return [
      colors.red(this.appConfig.title),
      colors.red(this.installedVersionName),
      colors.green(this.appConfig.shortVersion)
    ]
  }

  deploy() {

  }

  downloadApk() {
    //create download promise key -> promise

  }

  createDownloadPromise(appConfig: AppConfig): Promise<string> {
    const file = this.getFilepath(appConfig)
    return statAsync(file).then((stats) => {
      if (stats.isFile()) {
        log.info({file}, "File exists, not downloading again")
        return file
      } else {
        return wgetAsync({url: appConfig.buildUrl, dest: file})
         .then((response) => {
           return response.filepath
         })
      }
    })
  }

  getFilepath(appConfig: AppConfig): string {
    //const localPath = path.resolve(this.cacheDir, name)

    return "/tmp/" + appConfig.bundleIdentifier + "_" + appConfig.shortVersion + ".apk"
  }

}
