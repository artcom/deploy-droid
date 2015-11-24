import logUpdate from "log-update"
import _ from "lodash"
import table from "text-table"

import {deviceDescription} from "./setup"

import type {Action} from "./actions/types"

type Device = string
type ActionsByDevice = {[key: Device]: Array<Action>}

export function startPrintingActions(actions: Array<Action>): Promise<Array<Action>> {
  logUpdate.clear()
  setInterval(function() {
    formatActionsByDevice(actions).then((output) => {
      logUpdate(output)
    })
  }, 1000)

  return actions
}

export function printActions(actions: Array<Action>): Promise<Array<Action>> {
  return formatActionsByDevice(actions).then((output) => {
    logUpdate(output)
    return actions
  })
}

function formatActionsByDevice(actions: Array<Action>): string {
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
      const deviceHeader = "Deploy status for device: " + description
      const printableRows = actions.map((action) => {
        return action.createPrintableRow()
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
