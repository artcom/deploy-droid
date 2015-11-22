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

const apkDownloadCache = {}

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
    this.downloadApk(appConfig)
      .then((filepath) => {
        log.info({filepath}, "FILEPATH")
      })
  }

  downloadApk(appConfig: AppConfig): Promise<string> {
    //create download promise key -> promise
    const buildUrl = appConfig.buildUrl
    if (apkDownloadCache[buildUrl]) {
      return apkDownloadCache[buildUrl]
    } else {
      apkDownloadCache[buildUrl] = this.createDownloadPromise(appConfig)
      return apkDownloadCache[buildUrl]
    }
  }

  createDownloadPromise(appConfig: AppConfig): Promise<string> {
    const file = this.getFilepath(appConfig)

    return statAsync(file)
      .then((stats) => {
        log.info({stats, file}, "File exists, not downloading again")
        return file
      })
      .catch((error) => {
        log.info({error, file}, "File does not exist, downloading ...")
        return wgetAsync({url: appConfig.buildUrl, dest: file})
         .then((response) => {
           return response.filepath
         })
      })
  }

  getFilepath(appConfig: AppConfig): string {
    //const localPath = path.resolve(this.cacheDir, name)

    return "/tmp/" + appConfig.bundleIdentifier + "_" + appConfig.shortVersion + ".apk"
  }

}
