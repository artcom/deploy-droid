/* @flow */

import _ from "lodash"
import colors from "colors/safe"
import App, {apkInstallState, apkDownloadState} from "./apps/app"

export function createPrintableRow(app: App): Array<string> {
  return [
    apkTitle(app),
    deployedVersion(app),
    newVersion(app),
    apkDownload(app)
  ]
}

function apkTitle(app: App): string {
  switch (app.apkInstallState) {
    case apkInstallState.INSTALLED:
      return colors.green(app.appConfig.title)
    default:
      return colors.red(app.appConfig.title)
  }
}

function deployedVersion(app: App): string {
  switch (app.apkInstallState) {
    case apkInstallState.NOT_INSTALLED:
      return colors.red("not deployed")

    case apkInstallState.NEEDS_UPDATE:
      const versionName = _.get(app.installedVersion, ["versionName"])
      return versionName ? colors.red(versionName) : "error"

    case apkInstallState.INSTALLING:
      return colors.grey(`installing: ${app.appConfig.shortVersion}`)

    case apkInstallState.INSTALLED:
      return colors.green(app.appConfig.shortVersion)

    default:
      return ""
  }
}

function newVersion(app: App): string {
  return colors.grey(app.appConfig.shortVersion)
}

function apkDownload(app: App): string {
  switch (app.apkDownloadState) {
    case apkDownloadState.INITIAL:
      return ""
    case apkDownloadState.DOWNLOADING:
      return colors.grey(`downloading ${getApkDownloadStateProgress(app)}`)
    case apkDownloadState.DOWNLOADED:
      return colors.green(`apk location: "${app.apkFilepath}"`)
    default:
      return ""
  }
}

function getApkDownloadStateProgress(app: App): string {
  if (app.apkDownloadStateProgress.includes("...")) {
    app.apkDownloadStateProgress = ""
  }

  return app.apkDownloadStateProgress += "."
}
