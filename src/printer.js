/* @flow */

import _ from "lodash"
import table from "text-table"

import {log} from "./setup"
import {deviceDescription} from "./setup"

import type {Action} from "./actions/types"

type Device = string
type ActionsByDevice = {[key: Device]: Array<Action>}

export function printActionsByDevice(actions: Array<Action>): Promise<Array<Action>> {
  return groupAndFormat(actions)
    .then((results) => {
      results.map(printDevice)
      return actions
    })
}

function printDevice(formattedDevice: string) {
  console.log(formattedDevice)
}

function groupAndFormat(actions: Array<Action>): Promise<Array<string>> {
  return groupActionsByDevice(actions)
    .then((actionsByDevice) => {
      const deviceFormats = _.map(actionsByDevice, (actions, device) => {
        return formatDevice(actions, device)
      })
      return Promise.all(deviceFormats)
    })
}

function formatDevice(actions: Array<Action>, device: Device): Promise<string> {
  return deviceDescription(device)
    .then((description) => {
      const deviceHeader = "Deploy status for device: " + description
      const printableRows = actions.map((action) => {
        return action.createPrintableRow()
      })
      return deviceHeader + "\n" + table(printableRows) + "\n"
    })
}

function groupActionsByDevice(actions: Array<Action>): Promise<ActionsByDevice> {
  const actionsByDevice = _.reduce(actions, (actionsByDevices, action) => {
    const deviceKey = action.device
    if (!actionsByDevices[deviceKey]) {
      actionsByDevices[deviceKey] = []
    }

    actionsByDevices[deviceKey].push(action)
    return actionsByDevices
  }, {})
  return Promise.resolve(actionsByDevice)
}

/*

*/
