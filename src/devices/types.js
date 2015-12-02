/* @flow */

export type AdbDeviceInfo = {
  id: string,
  type: "offline" | "device" | "emulator"
}

export type Device = AdbDeviceInfo & {
  description?: string
}
