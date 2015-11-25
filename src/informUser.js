import _ from "lodash"
import bluebird from "bluebird"
import logUpdate from "log-update"
import read from "read"
import yn from "yn"

import {filterDeployableApps} from "./apps/appCreator"
import {describeApps} from "./printer"

const readAsync = bluebird.promisify(read)

export function informUser(apps) {
  return Promise.resolve(describeApps(apps))
    .then((description) => {
      logUpdate(description)

      const deployableApps = filterDeployableApps(apps)
      if (_.isEmpty(deployableApps)) {
        console.log("All Apps up-to-date")
        process.exit()
      } else {
        return confirmApps(apps)
      }
    })
}

function confirmApps(apps) {
  return readAsync({ prompt: "apply changes (y/N)?" })
    .then((response) => {
      if (yn(response)) {
        return apps
      }
    })
}
