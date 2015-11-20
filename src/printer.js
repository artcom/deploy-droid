/* @flow */

import _ from "lodash"
import table from "text-table"

import {deviceDescription} from "./setup"
import * as actionCreator from "./actions/actionCreator"

import type {Action} from "./actions/types"

export function printActionsByDevice(actions: Array<Action>) : Array<Action> {
  actionCreator.groupActionsByDevice(actions)
  .then((actionsByDevice) => {
    _.forEach(actionsByDevice, (actions, device) => {
      deviceDescription(device).then((description) => {
        console.log("Deploy status for device: " + description)
        const printableRows = actions.map((action) => {
          return action.createPrintableRow()
        })
        console.log(table(printableRows) + "\n")
      })
    })
  })

  return actions
}
