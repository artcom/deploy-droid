/* @flow */

import adbkit from "adbkit"
import {docopt} from "docopt"

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
  version: process.env.npm_package_version // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
})

export const hockeyAppToken = options["--hockeyAppToken"]
export const releaseType = options["--releaseType"] || "beta"
export const deviceDescriptorFile = options["--deviceDescriptorFile"]
