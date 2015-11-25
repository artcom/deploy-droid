/* @flow */

import _ from "lodash"
import colors from "colors/safe"
import InstallAction from "./actions/installAction"

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

export function createPrintableRow(action: InstallAction): Array<string> {
  return [
    apkTitle(action),
    deployedVersion(action),
    newVersion(action),
    apkDownload(action)
  ]
}

function apkTitle(action: InstallAction): string {
  switch (action.apkInstallState) {
    case apkInstallState.INSTALLED:
      return colors.green(action.appConfig.title)
    default:
      return colors.red(action.appConfig.title)
  }
}

function deployedVersion(action: InstallAction): string {
  switch (action.apkInstallState) {
    case apkInstallState.NOT_INSTALLED:
      return colors.red("not deployed")

    case apkInstallState.NEEDS_UPDATE:
      const versionName = _.get(action.installedVersion, ["versionName"])
      return versionName ? colors.red(versionName) : "error"

    case apkInstallState.INSTALLING:
      return colors.grey(`installing: ${action.appConfig.shortVersion}`)

    case apkInstallState.INSTALLED:
      return colors.green(action.appConfig.shortVersion)

    default:
      return ""
  }
}

function newVersion(action: InstallAction): string {
  return colors.grey(action.appConfig.shortVersion)
}

function apkDownload(action: InstallAction): string {
  switch (action.apkDownloadState) {
    case apkDownloadState.INITIAL:
      return ""
    case apkDownloadState.DOWNLOADING:
      return colors.grey(`downloading ${getApkDownloadStateProgress(action)}`)
    case apkDownloadState.DOWNLOADED:
      return colors.green(`apk location: "${action.apkFilepath}"`)
    default:
      return ""
  }
}

function getApkDownloadStateProgress(action: InstallAction): string {
  if (action.apkDownloadStateProgress.includes("...")) {
    action.apkDownloadStateProgress = ""
  }

  return action.apkDownloadStateProgress += "."
}
