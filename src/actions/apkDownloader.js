/* @flow */

import fs from "fs"
import wget from "wgetjs"
import bluebird from "bluebird"
import type {AppConfig} from "./../hockeyApp/types"
import {log} from "./../setup"

const wgetAsync = bluebird.promisify(wget)
const statAsync = bluebird.promisify(fs.stat)

const apkDownloadCache = {}

export function downloadApk(appConfig: AppConfig): Promise<string> {
  //create download promise key -> promise
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
    .then((stats) => {
      log.info({stats, file}, "File exists, not downloading again")
      return file
    })
    .catch((error) => {
      log.info({error, file}, "File does not exist, downloading ...")
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
