import adbkit from "adbkit"
import bunyan from "bunyan"
import {docopt} from "docopt"

export const log = bunyan.createLogger({ name: "deploy-droid" })
export const adb = adbkit.createClient()

const doc = `
  Usage:
    deploydroid --hockeyAppToken=<token> --customReleaseType=<type> [--deviceDescriptorFile=<filepath>] --color
`

const options = docopt(doc, {
  help: true,
  version: "0.0.1"
})

export const hockeyAppToken = options["--hockeyAppToken"]
export const customReleaseType = options["--customReleaseType"]

export function deviceDescription(deviceId) {
  if (options["--deviceDescriptorFile"]) {
    return adb.shell(deviceId, `cat ${options["--deviceDescriptorFile"]}`)
      .then(adbkit.util.readAll)
      .then(function(output) {
        return deviceId + ", " + output.toString()
      })
  } else {
    return Promise.resolve(deviceId)
  }
}
