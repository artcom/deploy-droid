/* @flow */

import _ from "lodash"
import axios from "axios"
import colors from "colors/safe"

import {printAppConfigs} from "./appConfigPrinter"
import {hockeyAppToken, customReleaseType} from "./../setup"
import type {
  HockeyAppInfos,
  HockeyAppInfo,
  HockeyAppVersionInfo,
  AppConfig
} from "./types"

const APP_AVAILABLE: number = 2

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
  return _.select(apps, {
    custom_release_type: customReleaseType,
    status: APP_AVAILABLE
  })
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
      buildUrl: latestAvailableVersion.build_url
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
      `No AppConfigs found for release type: "${customReleaseType}", Deploy Droid stops.`))
    process.exit()
  }

  return appConfigs
}
