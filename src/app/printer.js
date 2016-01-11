/* @flow */

import _ from "lodash"
import colors from "colors/safe"
import table from "text-table"

import App, {apkInstallState, apkDownloadState} from "./index"
import {simpleDeviceDescription} from "./../device/printer"

export function describeApps(apps: Array<App>): string {
  const appsByDeviceId = _.groupBy(apps, "device.id")
  const groupedApps =  _.map(appsByDeviceId, (apps) => {
    return formatApps(apps)
  })
  return makeOneOutput(groupedApps)
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
  let deployedVersion = ""

  switch (app.apkInstallState) {
    case apkInstallState.NOT_INSTALLED:
      deployedVersion = colors.red("not deployed")
      break

    case apkInstallState.NEEDS_NEW_INSTALLATION:
      const versionName = _.get(app.installedVersion, ["versionName"])
      deployedVersion = versionName ? colors.red(versionName) : "error"
      break

    case apkInstallState.INSTALLING:
      deployedVersion = colors.grey("installing")
      break

    case apkInstallState.INSTALLED:
      deployedVersion = colors.green(app.appConfig.shortVersion)
      break

    default:
      break
  }

  return _.padRight(deployedVersion, 22)
}

function newVersion(app: App): string {
  return colors.grey(app.appConfig.shortVersion)
}

function apkDownload(app: App): string {
  switch (app.apkDownloadState) {
    case apkDownloadState.DOWNLOADING:
      return colors.grey(`downloading ${getApkDownloadStateProgress(app)}`)
    default:
      return ""
  }
}

const dowloadProgressMap = {}
function getApkDownloadStateProgress(app: App): string {
  let progress = dowloadProgressMap[app.appConfig.bundleIdentifier]
  if (!progress) {
    progress = "."
  } else {
    progress += "."
  }

  if (progress.includes("....")) {
    progress = ""
  }

  dowloadProgressMap[app.appConfig.bundleIdentifier] = progress
  return progress
}
