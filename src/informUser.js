import _ from "lodash"
import bluebird from "bluebird"
import logUpdate from "log-update"
import read from "read"
import yn from "yn"

import {filterDeployableActions} from "./actions/actionCreator"
import {printActions} from "./printer"

const readAsync = bluebird.promisify(read)

export function informUser(actions) {
  const deployableActions = filterDeployableActions(actions)

  if (_.isEmpty(deployableActions)) {
    console.log("All Apps up-to-date")
    process.exit()
  } else {
    return printActions(actions).then((description) => {
      logUpdate(description)
      return confirmActions(actions)
    })
  }
}

function confirmActions(actions) {
  return readAsync({ prompt: "apply changes (y/N)?" })
    .then((response) => {
      if (yn(response)) {
        return actions
      }
    })
}
