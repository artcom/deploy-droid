import bunyan from "bunyan"
import {verifyOptions} from "./setup"
import {getApps} from "./hockeyApp"

verifyOptions()

const log = bunyan.createLogger({ name: "deploy-droid" })
log.info("Starting Deploy Droid")

getApps().then((appConfigs) => {
  log.info({appConfigs}, "App configs")
  return appConfigs
}).catch((error) => {
  log.error({error}, "Error retrieving app configs")
})
