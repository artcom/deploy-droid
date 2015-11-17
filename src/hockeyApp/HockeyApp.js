/* @flow */

import _ from "lodash"
import axios from "axios"

import AppConfig from "./AppConfig"
import {options} from "./../setup"

type HockeyAppInfos = Array<HockeyAppInfo>

export type HockeyAppInfo = {
  custom_release_type: string,
  status: number,
  title: string,
  bundle_identifier: string,
  public_identifier: string
}

const DEPLOYABLE = 2

export function getApps(): Promise<Array<AppConfig>> {
  return retrieveAll()
    .then(selectDeployableApps)
    .then(createAppConfigs)
}

function retrieveAll(): Promise<HockeyAppInfos> {
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
    status: DEPLOYABLE
  })
}

function createAppConfigs(deployableApps: HockeyAppInfos): Promise<Array<AppConfig>> {
  const appConfigs = deployableApps.map((hockeyApp) => new AppConfig(hockeyApp))
  const completeAppConfigs = appConfigs.map((appConfig) => appConfig.retrieveVersion())
  return Promise.all(completeAppConfigs)
}
