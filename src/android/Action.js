import {log} from "./../setup"

export class InformAction {
  constructor(appConfig) {
    this.appConfig = appConfig
  }

  execute(device) {
    log.info({
      version: this.appConfig.version,
      app: this.appConfig.title,
      device
    }, "Version already installed on device")
  }
}

export class InstallAction{
  constructor(appConfig) {
    this.appConfig = appConfig
  }

  execute(device) {
    log.info({
      version: this.appConfig.version,
      app: this.appConfig.title,
      device
    }, "Installing version to device")
  }
}

export class UpdateAction {
  constructor(appConfig, currentVersion) {
    this.appConfig = appConfig
    this.currentVersion = currentVersion
  }

  execute(device) {
    log.info({
      currentVersion: this.currentVersion,
      newVersion: this.appConfig.version,
      app: this.appConfig.title,
      device
    }, "Updating version of device")
  }
}
