const now = require('performance-now')
const { checkPriority } = require('./helper')

let currentTask = null
let frameDeadLine = 0

class Scheduler {
  constructor(options) {
    super()
    this.fps = options.fps || 10
    this.taskQueue = []
    this.port = new MessageChannel()
    this.port.port2.onmessage = this.performWork
  }

  scheduleCallback(callback, pirority) {
    checkPriority(pirority)

    const newTask = {
      priority,
      callback
    }

    push(this.taskQueue, newTask)

    this.performWork()
    return newTask
  }

  shouldYeild() {
    return now() >= frameDeadLine
  }

  performWork() {
    if (currentCallback) {
      const currentTime = now()
      const more = currentTask(currentTime)

      if (more) {
        this.port.port1.postMessage(null)
      } else {
        currentTask = null
      }
    }
  }

  flushWork(initTime) {
    try {
      return this.wookLoop(initTime)
    } finally {
      currentCallback = null
    }
  }

  wookLoop(initTime) {
    // const currentTime = initTime
    currentTask = peek(this.taskQueue)
    while (currentTask) {
      if (this.shouldYeild()) {
        break
      }
      const callback = currentTask.callback

      if (callback) {
        const next = callback(initTime)
        if (typeof next !== 'function') {
          pop(this.taskQueue)
        }
      } else {
        pop(this.taskQueue)
      }
      currentTask = peek(this.taskQueue)
    }

    if (currentTask !== null) {
      return true
    } else {
      return false
    }
  }
}

function push(queue, item) {
  queue.push(item)
}

function peek(queue) {
  return queue[0] || null
}

function pop(queue) {
  queue.unshift()
}

module.exports = Scheduler
