/* @flow */

import colors from "colors/safe"
import fs from "fs"
import wget from "wgetjs"
import bluebird from "bluebird"
import type {AppConfig} from "./../hockeyApp/types"
import {log} from "./../setup"

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
      console.log(colors.green(`Apk ${file} already downloaded`))
      return file
    })
    .catch(() => {
      console.log(colors.grey(`Downloading apk ${appConfig.title}`))
      return wgetAsync({url: appConfig.buildUrl, dest: file})
       .then((response) => {
         console.log(colors.green(`Downloaded apk to ${response.filepath}`))
         return response.filepath
       })
    })
}

function getFilepath(appConfig: AppConfig): string {
  //const localPath = path.resolve(cacheDir, name)

  return "/tmp/" + appConfig.bundleIdentifier + "_" + appConfig.shortVersion + ".apk"
}
