/* @flow */

import InformAction from "./informAction"
import InstallAction from "./installAction"

export type Device = {
  id: string,
  type: string
}

export type Action = InformAction | InstallAction
