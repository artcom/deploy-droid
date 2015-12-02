/* @flow */

import _ from "lodash"
import colors from "colors/safe"
import table from "text-table"
import App, {apkInstallState, apkDownloadState} from "./app"
import {simpleDeviceDescription} from "./../devices/devicePrinter"

type AppsByDeviceId = {[key: string]: Array<App>}

export function describeApps(apps: Array<App>): string {
  const appsByDeviceId = groupAppsByDeviceId(apps)
  const groupedApps =  _.map(appsByDeviceId, (apps) => {
    return formatApps(apps)
  })
  return makeOneOutput(groupedApps)
}

function groupAppsByDeviceId(apps: Array<App>): AppsByDeviceId {
  const appsByDevice = _.reduce(apps, (appsByDeviceIds, app) => {
    const deviceId = app.device.id
    if (!appsByDeviceIds[deviceId]) {
      appsByDeviceIds[deviceId] = []
    }

    appsByDeviceIds[deviceId].push(app)
    return appsByDeviceIds
  }, {})
  return appsByDevice
}

function formatApps(apps: Array<App>): string {
  const deviceDescription = simpleDeviceDescription(apps[0].device)

  const deviceHeader = colors.underline(
    `Deploy status for device: ${deviceDescription}`
  )
  const printableRows = apps.map((app) => {
    return createPrintableRow(app)
  })
  return deviceHeader + "\n" + table(printableRows) + "\n"
}

function makeOneOutput(stringArray: Array<string>): string {
  const combinedLines: string = _.reduce(stringArray, (combinedLines, line) => {
    return combinedLines + line + "\n"
  }, "")
  return combinedLines
}

function createPrintableRow(app: App): Array<string> {
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
      return colors.green("downloaded")
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
