import { Logger } from '../../../../kibana/src/core/server';

interface StartParams {
  logger: Logger,
  interval: number,
  threshold: number, 
}

let CurrentInterval  = null

export function startDetective({ logger, interval, threshold }: StartParams) {
  if (CurrentInterval != null) {
    stopDetective()
  }

  CurrentInterval = setInterval(() => onInterval(logger, threshold), interval)
}

export function stopDetective() {
  if (CurrentInterval == null) {
    return
  }

  clearInterval(CurrentInterval)
  CurrentInterval = null
}

let PreviousTime: number | null = null

function onInterval(logger: Logger, threshold: number) {
  const thisTime = Date.now()

  if (PreviousTime == null) {
    PreviousTime = thisTime
    return
  }

  const sincePrevious = thisTime - PreviousTime
  if (sincePrevious > threshold) {
    logger.warn(`event loop blocked for ${sincePrevious} ms`)
  }

  PreviousTime = thisTime
}