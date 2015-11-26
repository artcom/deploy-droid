/* @flow */

import colors from "colors/safe"
import table from "text-table"
import type {AppConfig} from "./types"
import {customReleaseType} from "./../setup"

export function printAppConfigs(appConfigs: Array<AppConfig>): Array<AppConfig> {
  const header  =
    colors.underline(`AppConfigs retrieved from HockeyApp for release type: ${customReleaseType}`)

  const printableRows = appConfigs.map((appConfig) => {
    return createPrintableRow(appConfig)
  })
  const formattedAppConfigs = table(printableRows)

  console.log(header + "\n" + formattedAppConfigs + "\n")
  return appConfigs
}

function createPrintableRow(appConfig: AppConfig): Array<string> {
  return [
    colors.green(appConfig.title),
    appConfig.bundleIdentifier,
    appConfig.shortVersion,
    appConfig.version
  ]
}
