/* @flow */

import colors from "colors/safe"
import table from "text-table"

import {isDeviceAvailable} from "./index"

import type {Device} from "./types"

export function simpleDeviceDescription(device: Device): string {
  return deviceId(device) + " " + deviceDescription(device)
}

export function printDevices(devices: Array<Device>): Array<Device> {
  let header = colors.underline("Devices found:")
  if (devicesNotAvailable(devices)) {
    header += (colors.underline.red(" ( Warning! Some devices not available )"))
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
    deviceDescription(device)
  ]
}

function deviceId(device: Device): string {
  if (isDeviceAvailable(device.type)) {
    return colors.green(device.id)
  } else {
    return colors.red(device.id)
  }
}

function deviceDescription(device: Device): string {
  switch (device.type) {
    case "offline":
      return colors.red("OFFLINE - ignoring")
    case "unauthorized":
      return colors.red("UNAUTHORIZED - ignoring")
    default:
      return device.description || ""
  }
}

function devicesNotAvailable(devices: Array<Device>): boolean {
  return devices.some((device) => !isDeviceAvailable(device.type))
}
