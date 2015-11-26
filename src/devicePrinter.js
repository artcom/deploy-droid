/* @flow */

import colors from "colors/safe"

import type {Device} from "./device"

export function createPrintableRow(device: Device): Array<string> {
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
