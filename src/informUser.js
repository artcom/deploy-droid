import _ from "lodash"
import bluebird from "bluebird"
import logUpdate from "log-update"
import read from "read"
import yn from "yn"

import {filterDeployableApps} from "./apps/actionCreator"
import {describeActions} from "./printer"

const readAsync = bluebird.promisify(read)

export function informUser(apps) {
  return describeActions(apps)
    .then((description) => {
      logUpdate(description)

      const deployableActions = filterDeployableApps(apps)
      if (_.isEmpty(deployableActions)) {
        console.log("All Apps up-to-date")
        process.exit()
      } else {
        return confirmActions(apps)
      }
    })
}

function confirmActions(apps) {
  return readAsync({ prompt: "apply changes (y/N)?" })
    .then((response) => {
      if (yn(response)) {
        return apps
      }
    })
}
