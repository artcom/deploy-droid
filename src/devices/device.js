/* @flow */

import adbkit from "adbkit"
import util from "util"

import {printDevices} from "./devicePrinter"
import {adb, deviceDescriptorFile} from "./../setup"

import type {Device, AdbDeviceInfo} from "./types"

export function getDevices(): Promise<Array<Device>> {
  return createDevices()
    .then((devices) => {
      printDevices(devices)
      return devices
    })
}

export function createDevices(): Promise<Array<Device>> {
  return adb.listDevices()
    .then((devices) => {
      console.log(util.inspect(devices))
      const createDevices = devices.map(createDevice)
      return Promise.all(createDevices)
    })
}

function createDevice({id, type}: AdbDeviceInfo): Promise<Device> {
  if (type !== "offline") {
    return deviceDescription(id).then((deviceDescription) => {
      return {id, type, description: deviceDescription}
    })
  } else {
    return Promise.resolve({id, type, description: "unknown"})
  }
}

export function deviceDescription(deviceId: string): Promise<string> {
  if (deviceDescriptorFile) {
    return adbShell(deviceId, `cat ${deviceDescriptorFile}`)
      .then(trimAll)
  } else {
    return Promise.resolve(deviceId)
  }
}

function adbShell(deviceId: string, command: string): Promise<string> {
  return adb.shell(deviceId, command)
    .then(adbkit.util.readAll)
    .then(function(output) {
      return output.toString()
    })
}

function trimAll(string: string): string {
  return string.replace(/(?:\r\n|\r|\n)/g, "<br />")
}
