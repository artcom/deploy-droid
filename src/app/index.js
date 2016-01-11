/* @flow */

import _ from "lodash"

import {adb} from "./../setup"
import {getApk} from "./apkDownloader"

import type {AppConfig} from "./../hockeyApp/types"
import type {Device} from "./../device/types"

export const apkDownloadState = {
  INITIAL: "initial",
  DOWNLOADING: "downloading",
  DOWNLOADED: "downloaded"
}

export const apkInstallState = {
  NOT_INSTALLED: "notInstalled",
  NEEDS_NEW_INSTALLATION: "needsNewInstallation",
  INSTALLING: "installing",
  INSTALLED: "installed"
}

export default class App {
/* jscs:disable disallowSemicolons */
device: Device;
appConfig: AppConfig;
installedVersion: ?{versionCode:string, versionName:string};
apkDownloadState: string;
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
}

  determineApkInstallState(): string {
    if (this.isAppInstalled()) {
      if (this.needsNewInstallation()) {
        return apkInstallState.NEEDS_NEW_INSTALLATION
      }

      return apkInstallState.INSTALLED
    } else {
      return apkInstallState.NOT_INSTALLED
    }
  }

  isAppInstalled(): boolean {
    return !_.isEmpty(this.installedVersion)
  }

  needsNewInstallation(): boolean {
    const versionCode = _.get(this.installedVersion, "versionCode", "-1")
    return parseInt(this.appConfig.version) !== parseInt(versionCode)
  }

  deploy() {
    return this.startApkDownload()
      .then((filepath) => {
        return this.installApk(filepath)
      })
  }

  startApkDownload() {
    this.apkDownloadState = apkDownloadState.DOWNLOADING
    return getApk(this.appConfig)
      .then((filepath) => {
        this.apkDownloadState = apkDownloadState.DOWNLOADED
        return filepath
      })
  }

  installApk(filepath: string) {
    this.apkInstallState = apkInstallState.INSTALLING
    return adb.uninstall(this.device.id, this.appConfig.bundleIdentifier)
      .then(() => adb.install(this.device.id, filepath))
      .then(() => {
        this.apkInstallState = apkInstallState.INSTALLED
      })
  }
}
