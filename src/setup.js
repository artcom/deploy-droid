/* @flow */

import adbkit from "adbkit"
import bunyan from "bunyan"
import {docopt} from "docopt"

import packageJson from "./../package.json"

export const log = bunyan.createLogger({ name: "deploy-droid" })
export const adb = adbkit.createClient()

const doc = `
  Usage:
    deploydroid
      --hockeyAppToken=<token>
      [--releaseType=<type>]
      [--deviceDescriptorFile=<filepath>]
`

const options = docopt(doc, {
  help: true,
  version: packageJson.version
})

export const hockeyAppToken = options["--hockeyAppToken"]
export const releaseType = options["--releaseType"] || "beta"
export const deviceDescriptorFile = options["--deviceDescriptorFile"]
