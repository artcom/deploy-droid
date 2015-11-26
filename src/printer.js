/* @flow */

import logUpdate from "log-update"

export function showDescription(describe: Function, promise: Promise): Promise {
  const interval = setInterval(function() {
    logUpdate(describe())
  }, 500)

  function stop() {
    clearInterval(interval)
    logUpdate(describe())
  }

  return promise.then(
    (result) => {
      stop()
      return result
    },
    (error) => {
      stop()
      throw error
    }
  )
}
