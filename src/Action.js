import bunyan from "bunyan"

const log = bunyan.createLogger({ name: "deploy-droid" })

export class InstallAction {

  constructor(appConfig) {
    this.appConfig = appConfig
  }

  execute(device) {
    log.info({version: this.appConfig.version, device}, "Installing version to device")
  }
}

export class UpdateAction extends InstallAction {
  constructor(appConfig, currentVersion) {
    super(appConfig)
    this.currentVersion = currentVersion
  }

  execute(device) {
    log.info({
      currentVersion: this.currentVersion,
      newVersion: this.appConfig.version,
      device
    }, "Updating version of device")
  }
}

export class AlreadyInstalledAction extends InstallAction {
  execute(device) {
    log.info({version: this.appConfig.version, device}, "Version already installed on device")
  }
}
