/* @flow */

import colors from "colors/safe"
import _ from "lodash"
import table from "text-table"

import {deviceDescription} from "./setup"
import {createPrintableRow} from "./appPrinter"

import App from "./apps/App"

type Device = string
type ActionsByDevice = {[key: Device]: Array<App>}

export function describeActions(apps: Array<App>): Promise<string> {
  return formatAllDevices(apps)
    .then(makeOneOutput)
}

function formatAllDevices(apps: Array<App>): Promise<Array<string>> {
  return groupActionsByDevice(apps)
    .then((appsByDevice) => {
      const formatAllDevices = _.map(appsByDevice, (apps, device) => {
        return formatDevice(apps, device)
      })
      return Promise.all(formatAllDevices)
    })
}

function groupActionsByDevice(apps: Array<App>): Promise<ActionsByDevice> {
  const appsByDevice = _.reduce(apps, (appsByDevices, app) => {
    const deviceKey = app.device
    if (!appsByDevices[deviceKey]) {
      appsByDevices[deviceKey] = []
    }

    appsByDevices[deviceKey].push(app)
    return appsByDevices
  }, {})
  return Promise.resolve(appsByDevice)
}

function formatDevice(apps: Array<App>, device: Device): Promise<string> {
  return deviceDescription(device)
    .then((description) => {
      const deviceHeader = colors.underline(`Deploy status for device: ${description}`)
      const printableRows = apps.map((app) => {
        return createPrintableRow(app)
      })
      return deviceHeader + "\n" + table(printableRows) + "\n"
    })
}

function makeOneOutput(formattedDevices: Array<string>): string {
  const combinedOuput: string = _.reduce(formattedDevices, (combinedOuput, formattedDevice) => {
    return combinedOuput + formattedDevice + "\n"
  }, "")
  return combinedOuput
}
