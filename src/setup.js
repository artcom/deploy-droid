/* @flow */

import adbkit from "adbkit"
import bunyan from "bunyan"
import {docopt} from "docopt"

export const log = bunyan.createLogger({ name: "deploy-droid" })
export const adb = adbkit.createClient()

const doc = `
  Usage:
    deploydroid
      --color
      --hockeyAppToken=<token>
      --customReleaseType=<type>
      [--deviceDescriptorFile=<filepath>]
`

const options = docopt(doc, {
  help: true,
  version: "0.0.1"
})

export const hockeyAppToken = options["--hockeyAppToken"]
export const customReleaseType = options["--customReleaseType"]
const deviceDescriptorFile = options["--deviceDescriptorFile"]

export function deviceDescription(deviceId: string): Promise<string> {
  if (deviceDescriptorFile) {
    return adbShell(deviceId, `cat ${deviceDescriptorFile}`)
      .then((output) => {
        return deviceId + ", " + output
      })
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
