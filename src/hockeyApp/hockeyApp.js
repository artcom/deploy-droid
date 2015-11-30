/* @flow */

import _ from "lodash"
import axios from "axios"
import colors from "colors/safe"

import {printAppConfigs} from "./appConfigPrinter"
import {hockeyAppToken, releaseType} from "./../setup"
import type {
  HockeyAppInfos,
  HockeyAppInfo,
  HockeyAppVersionInfo,
  AppConfig
} from "./types"

const APP_AVAILABLE: number = 2
const STANDARD_RELEASE_TYPE = {
  alpha: 2,
  beta: 0,
  store: 1,
  enterprise: 3
}

export function getAppConfigs(): Promise<Array<AppConfig>> {
  return retrieveAllApps()
    .then(selectDeployableApps)
    .then(createAppConfigs)
    .then(exitOnNoAppConfigs)
    .then(printAppConfigs)
}

function retrieveAllApps(): Promise<HockeyAppInfos> {
  return axios.get("https://rink.hockeyapp.net/api/2/apps", {
    headers: {
      "X-HockeyAppToken": hockeyAppToken
    }
  }).then((response) => {
    return response.data.apps
  })
}

function selectDeployableApps(apps: HockeyAppInfos): Array<HockeyAppInfo> {
  let filter = { platform: "Android", custom_release_type: releaseType, status: APP_AVAILABLE }

  if (_.has(STANDARD_RELEASE_TYPE, releaseType)) {
    delete filter.custom_release_type
    _.set(filter, "release_type", _.get(STANDARD_RELEASE_TYPE, releaseType))
  }

  const filtered =  _.select(apps, filter)
  return filtered
}

function createAppConfigs(deployableApps: HockeyAppInfos): Promise<Array<AppConfig>> {
  const createAppConfigs = deployableApps.map((deployableApp) => createAppConfig(deployableApp))
  return Promise.all(createAppConfigs)
}

function createAppConfig(appInfo: HockeyAppInfo): Promise<AppConfig> {
  return retrieveVersion(appInfo).then((latestAvailableVersion) => {
    return {
      title: appInfo.title,
      bundleIdentifier: appInfo.bundle_identifier,
      publicIdentifier: appInfo.public_identifier,
      shortVersion: latestAvailableVersion.shortversion,
      version: latestAvailableVersion.version,
      buildUrl: latestAvailableVersion.build_url,
      appSize: latestAvailableVersion.appsize
    }
  })
}

function retrieveVersion(appInfo: HockeyAppInfo): Promise<HockeyAppVersionInfo> {
  const url = `https://rink.hockeyapp.net/api/2/apps/${appInfo.public_identifier}/app_versions`
  return axios.get(url, {
    headers: {
      "X-HockeyAppToken": hockeyAppToken
    },
    params: {
      include_build_urls: true
    }
  }).then((result) => {
    return getLatestAvailableVersion(result.data.app_versions)
  })
}

function getLatestAvailableVersion(appVersions: Array<HockeyAppVersionInfo>): HockeyAppVersionInfo {
  const deployableVersions = _.select(appVersions, {status: APP_AVAILABLE})
  return deployableVersions[0]
}

function exitOnNoAppConfigs(appConfigs: Array<AppConfig>): Array<AppConfig> {
  if (_.isEmpty(appConfigs)) {
    console.log(colors.red(
      `No AppConfigs found for release type: "${releaseType}", Deploy Droid stops.`))
    process.exit()
  }

  return appConfigs
}
