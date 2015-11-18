import {log} from "./../setup"

export class InformAction {
  constructor(device, appConfig) {
    this.device = device.id
    this.appConfig = appConfig
  }

  execute() {
    log.info({
      version: this.appConfig.version,
      app: this.appConfig.title,
      device: this.device
    }, "Version already installed on device")
  }
}

export class InstallAction{
  constructor(device, appConfig) {
    this.device = device.id
    this.appConfig = appConfig
  }

  execute() {
    log.info({
      version: this.appConfig.version,
      app: this.appConfig.title,
      device: this.device
    }, "Installing version to device")
  }
}

export class UpdateAction {
  constructor(device, appConfig, currentVersion) {
    this.device = device.id
    this.appConfig = appConfig
    this.currentVersion = currentVersion
  }

  execute() {
    log.info({
      currentVersion: this.currentVersion,
      newVersion: this.appConfig.version,
      app: this.appConfig.title,
      device: this.device
    }, "Updating version of device")
  }
}
