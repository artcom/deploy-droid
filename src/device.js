/* @flow */

import _ from "lodash"
import adbkit from "adbkit"
import util from "util"
import table from "text-table"

import {createPrintableRow} from "./devicePrinter"
import {adb, deviceDescriptorFile} from "./setup"

export type AdbDeviceInfo = {
  id: string,
  type: string
}

export type Device = {
  id: string,
  type: string,
  description: string
}

export function getDevices(): Promise<Array<Device>> {
  return createDevices()
    .then((devices) => {
      printDevices(devices)
      if (devicesOffline(devices)) {
        console.log("Devices offline")
      }

      return devices
    })
}

function printDevices(devices: Array<Device>): Array<Device> {
  console.log("Devices found:")
  const printableRows = devices.map((device) => {
    return createPrintableRow(device)
  })
  console.log(table(printableRows))
  return devices
}

export function createDevices(): Promise<Array<Device>> {
  return adb.listDevices()
    .then((devices) => {
      console.log(util.inspect(devices))
      const createDevices = devices.map(createDevice)
      return Promise.all(createDevices)
    })
}

function devicesOffline(devices: Array<Device>): boolean {
  const offlineDevices = _.filter(devices, (device) => {
    return device.type === "offline"
  })
  return !_.isEmpty(offlineDevices)
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
