// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
/* @flow */

export type HockeyAppInfos = Array<HockeyAppInfo>

export type HockeyAppInfo = {
  custom_release_type: string,
  status: number,
  title: string,
  bundle_identifier: string,
  public_identifier: string
}

export type HockeyAppVersionInfo = {
  shortversion: string,
  version: string,
  build_url: string,
  appsize: number
}

export type AppConfig = {
  title: string,
  bundleIdentifier: string,
  publicIdentifier: string,
  shortVersion: string,
  version: string,
  buildUrl: string,
  appSize: number
}
