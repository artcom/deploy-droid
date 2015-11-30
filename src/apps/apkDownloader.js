/* @flow */

import bluebird from "bluebird"
import fs from "fs"
import path from "path"
import wget from "wgetjs"

import type {AppConfig} from "./../hockeyApp/types"

const wgetAsync = bluebird.promisify(wget)
const statAsync = bluebird.promisify(fs.stat)

const cacheDir = path.resolve("apk-cache")
try {
  fs.mkdirSync(cacheDir)
} catch (ex) {
  //ignore that dir already exists
}

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
  const filepath = cacheDir + "/" +
    appConfig.bundleIdentifier + "-" + appConfig.shortVersion + ".apk"
  return filepath
}
