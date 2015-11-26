/* @flow */

import {adb, deviceDescription} from "./setup"
import util from "util"

export type AdbDeviceInfo = {
  id: string,
  type: string
}

export type Device = {
  id: string,
  type: string,
  description: string
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
    return {id, type, description: "unknown"}
  }
}
