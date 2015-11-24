import _ from "lodash"
import bluebird from "bluebird"
import read from "read"
import yn from "yn"

import {filterDeployableActions} from "./actions/actionCreator"

const readAsync = bluebird.promisify(read)

export function informUser(actions) {
  return filterDeployableActions(actions)
    .then((deployableActions) => {
      if (_.isEmpty(deployableActions)) {
        console.log("All Apps up-to-date")
        process.exit()
      } else {
        return confirmActions(actions)
      }
    })
}

function confirmActions(actions) {
  return readAsync({ prompt: "apply changes (y/N)?" })
    .then((response) => {
      if (yn(response)) {
        return actions
      }
    })
}
