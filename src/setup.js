import commandLineArgs from "command-line-args"
import bunyan from "bunyan"

export const log = bunyan.createLogger({ name: "deploy-droid" })

const cli = commandLineArgs([
  {
    name: "hockeyAppToken",
    description: "HockeyApp  token",
    alias: "t",
    type: String
  }
])

export const options = cli.parse()

export function verifyOptions() {
  if (!options.hockeyAppToken) {
    console.log("Missing option hockeyAppToken, see README for instructions")
    console.log(cli.getUsage())
    process.exit(0)
  }
}
