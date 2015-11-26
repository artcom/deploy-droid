/* @flow */

import _ from "lodash"
import ansiEscapes from "ansi-escapes"
import bluebird from "bluebird"
import logUpdate from "log-update"
import read from "read"
import yn from "yn"

import App from "./apps/app"
import {filterDeployableApps} from "./apps/appCreator"
import {describeApps} from "./apps/appPrinter"

const readAsync = bluebird.promisify(read)

export function informUser(apps: Array<App>): Array<App> {
  logUpdate(describeApps(apps))

  if (_.isEmpty(filterDeployableApps(apps))) {
    console.log("All Apps up-to-date")
    process.exit()
  }

  return confirmApps(apps)
}

function confirmApps(apps: Array<App>): Array<App> {
  return readAsync({ prompt: "apply changes (y/N)?" })
    .then((response) => {
      process.stdout.write(ansiEscapes.eraseLines(2))
      if (yn(response)) {
        return apps
      }
    })
}
