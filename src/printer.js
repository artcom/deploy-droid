/* @flow */

import _ from "lodash"
import colors from "colors/safe"
import logUpdate from "log-update"
import table from "text-table"

import {createPrintableRow} from "./appPrinter"

import App from "./apps/App"

type AppsByDeviceId = {[key: string]: Array<App>}

export function showDescription(describe: Function, promise: Promise): Promise {
  const interval = setInterval(function() {
    logUpdate(describe())
  }, 500)

  function stop() {
    clearInterval(interval)
    logUpdate(describe())
  }

  return promise.then(
    (result) => {
      stop()
      return result
    },
    (error) => {
      stop()
      throw error
    }
  )
}

export function describeApps(apps: Array<App>): string {
  const appsByDeviceId = groupAppsByDeviceId(apps)
  const formattedDevices =  _.map(appsByDeviceId, (apps) => {
    return formatDevice(apps)
  })
  return makeOneOutput(formattedDevices)
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

function formatDevice(apps: Array<App>): string {
  const deviceHeader = colors.underline(
    `Deploy status for device: ${apps[0].device.description}`
  )
  const printableRows = apps.map((app) => {
    return createPrintableRow(app)
  })
  return deviceHeader + "\n" + table(printableRows) + "\n"
}

function makeOneOutput(formattedDevices: Array<string>): string {
  const combinedOuput: string = _.reduce(formattedDevices, (combinedOuput, formattedDevice) => {
    return combinedOuput + formattedDevice + "\n"
  }, "")
  return combinedOuput
}
