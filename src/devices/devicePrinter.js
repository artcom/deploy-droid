/* @flow */

import _ from "lodash"
import colors from "colors/safe"
import table from "text-table"

import type {Device} from "./types"

export function simpleDeviceDescription(device: Device): string {
  return deviceId(device) + " " + deviceDescription(device)
}

export function printDevices(devices: Array<Device>): Array<Device> {
  let header = colors.underline("Devices found:")
  if (devicesOffline(devices)) {
    header += (colors.underline.red(" ( Warning! Some devices offline )"))
  }

  const printableRows = devices.map((device) => {
    return createPrintableRow(device)
  })
  console.log(header + "\n" + table(printableRows) + "\n")
  return devices
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
