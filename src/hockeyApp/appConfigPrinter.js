/* @flow */

import colors from "colors/safe"
import table from "text-table"

import {releaseType} from "./../setup"

import type {AppConfig} from "./types"

export function printAppConfigs(appConfigs: Array<AppConfig>): Array<AppConfig> {
  const header  =
    colors.underline(`Android AppConfigs found for release type: ${releaseType}`)

  const printableRows = appConfigs.map((appConfig) => {
    return createPrintableRow(appConfig)
  })

  console.log(header + "\n" + table(printableRows) + "\n")
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
