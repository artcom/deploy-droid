/* @flow */

import colors from "colors/safe"
import _ from "lodash"
import table from "text-table"

import {deviceDescription} from "./setup"
import {createPrintableRow} from "./actionPrinter"

import type {Action} from "./actions/types"

type Device = string
type ActionsByDevice = {[key: Device]: Array<Action>}

export function printActions(actions: Array<Action>): Promise<string> {
  return formatAllDevices(actions)
    .then(makeOneOutput)
}

function formatAllDevices(actions: Array<Action>): Promise<Array<string>> {
  return groupActionsByDevice(actions)
    .then((actionsByDevice) => {
      const formatAllDevices = _.map(actionsByDevice, (actions, device) => {
        return formatDevice(actions, device)
      })
      return Promise.all(formatAllDevices)
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

function formatDevice(actions: Array<Action>, device: Device): Promise<string> {
  return deviceDescription(device)
    .then((description) => {
      const deviceHeader = colors.underline(`Deploy status for device: ${description}`)
      const printableRows = actions.map((action) => {
        return createPrintableRow(action)
      })
      return deviceHeader + "\n" + table(printableRows) + "\n"
    })
}

function makeOneOutput(formattedDevices: Array<string>): string {
  const combinedOuput: string = _.reduce(formattedDevices, (combinedOuput, formattedDevice) => {
    return combinedOuput + formattedDevice + "\n"
  }, "")
  return combinedOuput
}
