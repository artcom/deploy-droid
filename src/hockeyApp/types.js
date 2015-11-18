export type HockeyAppInfos = Array<HockeyAppInfo>

export type HockeyAppInfo = {
  custom_release_type: string,
  status: status.NEW | status.SUBMITTED | status.AVAILABLE | status.UNKNOWN,
  title: string,
  bundle_identifier: string,
  public_identifier: string
}

export const status = {
  NEW: 0,
  SUBMITTED: 1,
  AVAILABLE: 2,
  UNKNOWN: 3
}

export type HockeyAppVersionInfo = {
  shortversion: string,
  version: string,
  build_url: string
}

export type AppConfig = {
  title: string,
  bundleIdentifier: string,
  publicIdentifier: string,
  shortVersion: string,
  version: string,
  buildUrl: string
}
