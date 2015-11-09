import bunyan from "bunyan"

const log = bunyan.createLogger({ name: "deploy-droid" })

log.info("Hello Droid")
