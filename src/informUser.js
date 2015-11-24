import _ from "lodash"
import bluebird from "bluebird"
import read from "read"
import yn from "yn"

const readAsync = bluebird.promisify(read)

export function informUser(deployableActions) {
  if (_.isEmpty(deployableActions)) {
    console.log("All Apps up-to-date")
    process.exit()
  } else {
    return promptUser(deployableActions)
  }
}

function promptUser(deployableActions) {
  return readAsync({ prompt: "apply changes (y/N)?" })
    .then((response) => {
      if (yn(response)) {
        return deployableActions
      }
    })
}
