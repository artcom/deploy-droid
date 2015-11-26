/* @flow */

import _ from "lodash"
import colors from "colors/safe"
import table from "text-table"

import type {Device} from "./device"

export function printDevices(devices: Array<Device>) {
  console.log("Devices found:")
  const printableRows = devices.map((device) => {
    return createPrintableRow(device)
  })
  console.log(table(printableRows))
  if (devicesOffline(devices)) {
    console.log(colors.red("Warning! Some devices offline!"))
  }
}

function createPrintableRow(device: Device): Array<string> {
  return [
    deviceId(device),
    deviceDescription(device),
    deviceType(device)
  ]
}

function deviceId(device: Device): string {
  if (device.type === "offline") {
    return colors.red(device.id)
  } else {
    return colors.green(device.id)
  }
}

function deviceDescription(device: Device): string {
  return device.description
}

function deviceType(device: Device): string {
  if (device.type === "offline") {
    return colors.red("OFFLINE")
  } else {
    return ""
  }
}

function devicesOffline(devices: Array<Device>): boolean {
  const offlineDevices = _.filter(devices, (device) => {
    return device.type === "offline"
  })
  return !_.isEmpty(offlineDevices)
}
