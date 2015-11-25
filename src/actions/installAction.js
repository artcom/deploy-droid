/* @flow */

import {adb} from "./../setup"
import {downloadApk} from "./apkDownloader"

import type {AppConfig} from "./../hockeyApp/types"

const apkDownloadState = {
  INITIAL: "initial",
  DOWNLOADING: "downloading",
  DOWNLOADED: "downloaded"
}

const apkInstallState = {
  NOT_INSTALLED: "notInstalled",
  NEEDS_UPDATE: "needsUpdate",
  INSTALLING: "installing",
  INSTALLED: "installed"
}

export default class InstallAction {
/* jscs:disable disallowSemicolons */
device: string;
appConfig: AppConfig;
installedVersion: ?{versionCode:string, versionName:string};
apkDownloadState: string;
apkDownloadStateProgress: string;
apkFilepath: string;
apkInstallState: string;
/* jscs:enable disallowSemicolons */

constructor(
  device: string,
  appConfig: AppConfig,
  installedVersion: ?{versionCode:string, versionName:string}
) {
  this.device = device
  this.appConfig = appConfig

  this.installedVersion = installedVersion
  if (installedVersion) {
    this.apkInstallState = apkInstallState.NEEDS_UPDATE
  } else {
    this.apkInstallState = apkInstallState.NOT_INSTALLED
  }

  this.apkDownloadState = apkDownloadState.INITIAL
  this.apkDownloadStateProgress = ""
  this.apkFilepath = "unknown"
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
    return adb.install(this.device, filepath)
      .then(() => {
        this.apkInstallState = apkInstallState.INSTALLED
      })
  }
}
