/* @flow */

import _ from "lodash"
import {adb} from "./../setup"
import {downloadApk} from "./apkDownloader"

import type {AppConfig} from "./../hockeyApp/types"
import type {Device} from "./types"

export const apkDownloadState = {
  INITIAL: "initial",
  DOWNLOADING: "downloading",
  DOWNLOADED: "downloaded"
}

export const apkInstallState = {
  NOT_INSTALLED: "notInstalled",
  NEEDS_UPDATE: "needsUpdate",
  INSTALLING: "installing",
  INSTALLED: "installed"
}

export default class App {
/* jscs:disable disallowSemicolons */
device: Device;
appConfig: AppConfig;
installedVersion: ?{versionCode:string, versionName:string};
apkDownloadState: string;
apkDownloadStateProgress: string;
apkFilepath: string;
apkInstallState: string;
/* jscs:enable disallowSemicolons */

constructor(
  device: Device,
  appConfig: AppConfig,
  installedVersion: ?{versionCode:string, versionName:string}
) {
  this.device = device
  this.appConfig = appConfig

  this.installedVersion = installedVersion
  this.apkInstallState = this.determineApkInstallState()

  this.apkDownloadState = apkDownloadState.INITIAL
  this.apkDownloadStateProgress = ""
  this.apkFilepath = "unknown"
}

  determineApkInstallState(): string {
    if (this.installedVersion) {
      if (this.needsUpdate()) {
        return apkInstallState.NEEDS_UPDATE
      }

      return apkInstallState.INSTALLED
    } else {
      return apkInstallState.NOT_INSTALLED
    }
  }

  needsUpdate(): boolean {
    const str = _.get(this.installedVersion, "versionCode", -1)
    return parseInt(this.appConfig.version) > parseInt(str)
  }

  deploy() {
    return this.startApkDownload()
      .then((filepath) => {
        return this.installApk(filepath)
      })
  }

  startApkDownload() {
    this.apkDownloadState = apkDownloadState.DOWNLOADING
    return downloadApk(this.appConfig)
      .then((filepath) => {
        this.apkFilepath = filepath
        this.apkDownloadState = apkDownloadState.DOWNLOADED
        return filepath
      })
  }

  installApk(filepath: string) {
    this.apkInstallState = apkInstallState.INSTALLING
    return adb.install(this.device.id, filepath)
      .then(() => {
        this.apkInstallState = apkInstallState.INSTALLED
      })
  }
}
