import bunyan from "bunyan"
import {docopt} from "docopt"

export const log = bunyan.createLogger({ name: "deploy-droid" })

const doc = `
  Usage:
    deploydroid --hockeyAppToken=<token> --customReleaseType=<type>
`

const options = docopt(doc, {
  help: true,
  version: "0.0.1"
})

export const hockeyAppToken = options["--hockeyAppToken"]
export const customReleaseType = options["--customReleaseType"]
