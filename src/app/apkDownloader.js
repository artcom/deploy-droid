/* @flow */

import bluebird from "bluebird"
import fs from "fs"
import path from "path"
import wget from "wgetjs"

import type {AppConfig} from "./../hockeyApp/types"

const wgetAsync = bluebird.promisify(wget)
const statAsync = bluebird.promisify(fs.stat)

const cacheDir = createCacheDir("apk-cache")
const apkDownloadCache = {}

export function getApk(appConfig: AppConfig): Promise<string> {
  const buildUrl = appConfig.buildUrl

  if (!apkDownloadCache[buildUrl]) {
    apkDownloadCache[buildUrl] = createDownloadPromise(appConfig)
  }

  return apkDownloadCache[buildUrl]
}

function createDownloadPromise(appConfig: AppConfig): Promise<string> {
  const apk = getFilepath(appConfig)

  return statAsync(apk).then((apkStat) => {
    if (isApkSizeCorrect(apkStat, appConfig)) {
      return apk
    } else {
      fs.unlinkSync(apk)
      throw new Error(`Apk file "${apk}" is invalid, deleted invalid apk file.`)
    }
  }).catch(() => {
    return downloadApk(appConfig.buildUrl, apk)
  })
}

function getFilepath(appConfig: AppConfig): string {
  return `${cacheDir}/${appConfig.bundleIdentifier}-${appConfig.shortVersion}.apk`
}

function isApkSizeCorrect(apkStat: any, appConfig: AppConfig): boolean {
  return apkStat.size === appConfig.appSize
}

function downloadApk(url:string, dest:string): Promise<string> {
  return wgetAsync({ url, dest })
   .then((response) => {
     return response.filepath
   })
}

function createCacheDir(dirName: string): string {
  const cacheDir = path.resolve(dirName)
  try {
    fs.mkdirSync(cacheDir)
  } catch (ex) {
    //ignore: dir already exists
  }

  return cacheDir
}
