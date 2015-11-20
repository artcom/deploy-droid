/* @flow */

import InformAction from "./informAction"
import InstallAction from "./installAction"
import UpdateAction from "./updateAction"

export type Device = {
  id: string,
  type: string
}

export type Action = InformAction | InstallAction | UpdateAction

export type ActionsByDevice = {[key: string]: Array<Action>}
