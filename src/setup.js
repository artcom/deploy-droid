import adbkit from "adbkit"
import {docopt} from "docopt"
import {version} from "../package.json"

export const adb = adbkit.createClient()

const doc = `
Usage:
  deploy-droid --hockeyAppToken=<token> [--releaseType=<type>] [--deviceDescriptorFile=<filepath>]
  deploy-droid --version
  deploy-droid --help

Options:
  --releaseType=<type>                HockeyApp release type [default: beta],
                                      (alpha|beta|store|enterprise|<custom type>).
  --deviceDescriptorFile=<filepath>   Filepath to a human readable file
                                      on connected android devices, which describes that device.
`

const options = docopt(doc, {
  help: true,
  version
})

export const hockeyAppToken = options["--hockeyAppToken"]
export const releaseType = options["--releaseType"]
export const deviceDescriptorFile = options["--deviceDescriptorFile"]
