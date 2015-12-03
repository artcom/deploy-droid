/* @flow */

import _ from "lodash"
import adbkit from "adbkit"
import colors from "colors/safe"

import {printDevices} from "./printer"
import {adb, deviceDescriptorFile} from "./../setup"

import type {Device, AdbDeviceInfo} from "./types"

export function isDeviceAvailable (deviceType: string): boolean {
  return deviceType === "device" || deviceType === "emulator"
}

export function getDevices(): Promise<Array<Device>> {
  return createDevices()
    .then(exitOnNoDevices)
    .then(printDevices)
    .then(selectAvailableDevices)
}

function createDevices(): Promise<Array<Device>> {
  return adb.listDevices()
    .then((devices) => {
      const createDevices = devices.map(createDevice)
      return Promise.all(createDevices)
    })
}

function createDevice({id, type}: AdbDeviceInfo): Promise<Device> {
  if (deviceDescriptorFile && isDeviceAvailable(type)) {
    return deviceDescription(id)
      .then((deviceDescription) => {
        return {id, type, description: deviceDescription}
      })
  } else {
    return Promise.resolve({id, type})
  }
}

export function deviceDescription(deviceId: string): Promise<string> {
  return adbShell(deviceId, `cat ${deviceDescriptorFile}`)
    .then(trimAll)
    .catch(() => "description not found")
}

function adbShell(deviceId: string, command: string): Promise<string> {
  return adb.shell(deviceId, command)
    .then(adbkit.util.readAll)
    .then(function(output) {
      return output.toString()
    })
}

function exitOnNoDevices(devices: Array<Device>): Array<Device> {
  if (_.isEmpty(devices)) {
    console.log(colors.red("No devices found, Deploy Droid stops."))
    process.exit()
  }

  return devices
}

function selectAvailableDevices(devices: Array<Device>): Array<Device> {
  return _.select(devices, (device) => isDeviceAvailable(device.type))
}

function trimAll(string: string): string {
  return _.trim(string, " \t\r\n")
}
