interface ViewTransition {
  finished: Promise<void>
  ready: Promise<void>
  updateCallbackDone: Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Document {
  startViewTransition(updateCallback: () => Promise<void> | void): ViewTransition
}
