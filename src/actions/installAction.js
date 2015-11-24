/* @flow */

import _ from "lodash"
import colors from "colors/safe"

import type {AppConfig} from "./../hockeyApp/types"
import {downloadApk} from "./apkDownloader"

const apkDownloadState = {
  INITIAL: "initial",
  DOWNLOADING: "downloading",
  DOWNLOADED: "downloaded"
}

export default class InstallAction {
/* jscs:disable disallowSemicolons */
device: string;
appConfig: AppConfig;
installedVersion: ?{versionCode:string, versionName:string};
apkDownloadState: string;
apkDownloadStateProgress: string;
apkFilepath: string;
/* jscs:enable disallowSemicolons */

constructor(
  device: string,
  appConfig: AppConfig,
  installedVersion: ?{versionCode:string, versionName:string}
) {
  this.device = device
  this.appConfig = appConfig
  this.installedVersion = installedVersion
  this.apkDownloadState = apkDownloadState.INITIAL
  this.apkDownloadStateProgress = ""
  this.apkFilepath = "unknown"
}

  deploy() {
    this.apkDownloadState = apkDownloadState.DOWNLOADING
    return downloadApk(this.appConfig)
      .then((filepath) => {
        this.apkFilepath = filepath
        this.apkDownloadState = apkDownloadState.DOWNLOADED
      })
  }

  createPrintableRow(): Array<string> {
    return [
      this.apkTitle(),
      this.deployedVersion(),
      this.newVersion(),
      this.apkDownload()
    ]
  }

  apkTitle(): string {
    return colors.red(this.appConfig.title)
  }

  deployedVersion(): string {
    const versionName = _.get(this.installedVersion, ["versionName"])
    return versionName ? colors.red(versionName) : colors.grey("not deployed")
  }

  newVersion(): string {
    return colors.green(this.appConfig.shortVersion)
  }

  apkDownload(): string {
    switch (this.apkDownloadState) {
      case apkDownloadState.INITIAL:
        return ""
      case apkDownloadState.DOWNLOADING:
        return colors.grey("downloading" + this.getApkDownloadStateProgress())
      case apkDownloadState.DOWNLOADED:
        return colors.green("apk downloaded")
      default:
        return ""
    }
  }

  getApkDownloadStateProgress(): string {
    if (this.apkDownloadStateProgress.includes("...")) {
      this.apkDownloadStateProgress = ""
    }

    return this.apkDownloadStateProgress += "."
  }

}
