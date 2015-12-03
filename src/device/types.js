/* @flow */

export type AdbDeviceInfo = {
  id: string,
  type: "device" | "emulator" | "unauthorized" | "offline"
}

export type Device = AdbDeviceInfo & {
  description?: string
}
