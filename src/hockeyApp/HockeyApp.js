/* @flow */

import _ from "lodash"
import axios from "axios"

import {options} from "./../setup"
import type {
  HockeyAppInfos,
  HockeyAppInfo,
  HockeyAppVersionInfo,
  AppConfig
} from "./types"

const AVAILABLE: number = 2

export function getAppConfigs(): Promise<Array<AppConfig>> {
  return retrieveAllApps()
    .then(selectDeployableApps)
    .then(createAppConfigs)
}

function retrieveAllApps(): Promise<HockeyAppInfos> {
  return axios.get("https://rink.hockeyapp.net/api/2/apps", {
    headers: {
      "X-HockeyAppToken": options.hockeyAppToken
    }
  }).then((response) => {
    return response.data.apps
  })
}

function selectDeployableApps(apps: HockeyAppInfos): Array<HockeyAppInfo> {
  return _.select(apps, {
    custom_release_type: "deploydroid",
    status: AVAILABLE
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
      "X-HockeyAppToken": options.hockeyAppToken
    },
    params: {
      include_build_urls: true
    }
  }).then((result) => {
    return getLatestAvailableVersion(result.data.app_versions)
  })
}

function getLatestAvailableVersion(appVersions: Array<HockeyAppVersionInfo>): HockeyAppVersionInfo {
  const deployableVersions = _.select(appVersions, {status: AVAILABLE})
  return deployableVersions[0]
}

/*
"title": "Kaufland Employee",
"bundle_identifier": "com.tgallery.kauflandemployee",
"public_identifier": "cc2c8d8290568736edd6ce7cc122fa71",
"platform": "Android",
"release_type": 0,
"custom_release_type": null,
"created_at": "2015-03-24T10:57:01Z",
"updated_at": "2015-03-24T10:57:06Z",
"featured": false,
"role": 0,
"id": 162702,
"minimum_os_version": "4.3",
"device_family": null,
"status": 2,
"visibility": "private",
"owner": "T-Gallery",
"owner_token": "122ca4a286ecdee867968952de7c0f717f5a1062",
"company": "DTAG"
*/

/*
"app_versions": [
   {
     "version": "1",
     "shortversion": "0.0.1",
     "title": "Media Control",
     "timestamp": 1446204001,
     "appsize": 31111,
     "notes": "<p>Launches cm3 uri that is provided by broker</p>",
     "mandatory": false,
     "external": false,
     "device_family": null,
     "id": 1,
     "app_id": 245915,
     "minimum_os_version": "5.0",
     "download_url":
     "https://rink.hockeyapp.net/apps/83d7d46c073b46aeb0d7c8d7ff7fff19/app_versions/1",
     "config_url": "https://rink.hockeyapp.net/manage/apps/245915/app_versions/1",
     "restricted_to_tags": false,
     "status": 2,
     "tags": [],
     "expired_at": null,
     "created_at": "2015-10-30T11:19:31Z",
     "updated_at": "2015-10-30T12:15:35Z"
   }
 ],
 "status": "success"
*/
