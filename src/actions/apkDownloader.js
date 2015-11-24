/* @flow */

import fs from "fs"
import wget from "wgetjs"
import bluebird from "bluebird"
import type {AppConfig} from "./../hockeyApp/types"

const wgetAsync = bluebird.promisify(wget)
const statAsync = bluebird.promisify(fs.stat)

const apkDownloadCache = {}

export function downloadApk(appConfig: AppConfig): Promise<string> {
  const buildUrl = appConfig.buildUrl
  if (apkDownloadCache[buildUrl]) {
    return apkDownloadCache[buildUrl]
  } else {
    apkDownloadCache[buildUrl] = createDownloadPromise(appConfig)
    return apkDownloadCache[buildUrl]
  }
}

function createDownloadPromise(appConfig: AppConfig): Promise<string> {
  const file = getFilepath(appConfig)

  return statAsync(file)
    .then(() => {
      return file
    })
    .catch(() => {
      return wgetAsync({url: appConfig.buildUrl, dest: file})
       .then((response) => {
         return response.filepath
       })
    })
}

function getFilepath(appConfig: AppConfig): string {
  //const localPath = path.resolve(cacheDir, name)

  return "/tmp/" + appConfig.bundleIdentifier + "_" + appConfig.shortVersion + ".apk"
}
