/* @flow */

import _ from "lodash"
import colors from "colors/safe"
import logUpdate from "log-update"
import table from "text-table"

import {deviceDescription} from "./setup"
import {createPrintableRow} from "./appPrinter"

import App from "./apps/App"

type AppsByDeviceId = {[key: string]: Array<App>}

export function showDescription(describe: Function, promise: Promise): Promise {
  const interval = setInterval(function() {
    describe().then(logUpdate)
  }, 500)

  function stop() {
    clearInterval(interval)
    describe().then(logUpdate)
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

export function describeApps(apps: Array<App>): Promise<string> {
  return formatAllDevices(apps)
    .then(makeOneOutput)
}

function formatAllDevices(apps: Array<App>): Promise<Array<string>> {
  return groupAppsByDeviceId(apps)
    .then((appsByDevice) => {
      const formatAllDevices = _.map(appsByDevice, (apps, deviceId) => {
        return formatDevice(apps, deviceId)
      })
      return Promise.all(formatAllDevices)
    })
}

function groupAppsByDeviceId(apps: Array<App>): Promise<AppsByDeviceId> {
  const appsByDevice = _.reduce(apps, (appsByDeviceIds, app) => {
    const deviceId = app.device.id
    if (!appsByDeviceIds[deviceId]) {
      appsByDeviceIds[deviceId] = []
    }

    appsByDeviceIds[deviceId].push(app)
    return appsByDeviceIds
  }, {})
  return Promise.resolve(appsByDevice)
}

function formatDevice(apps: Array<App>, deviceId: string): Promise<string> {
  return deviceDescription(deviceId)
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
