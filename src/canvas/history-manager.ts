class HistoryManager<T extends any> {
  private states: T[] = []
  private position: number = -1
  private hasInitialState = false

  constructor(initialState?: T) {
    if (initialState) {
      this.states.push(initialState)
      this.hasInitialState = true
    }
  }
  push(state: T) {
    this.position++
    this.states = this.states.slice(0, Math.max(0, this.position))
    this.states.push(state)
  }
  undo() {
    this.position = Math.max(this.hasInitialState ? 0 : -1, this.position - 1)
  }
  redo() {
    this.position = Math.min(this.states.length - 1, this.position + 1)
  }
  get state() {
    if (this.position < 0) return
    return this.states[this.position]
  }
}

export { HistoryManager }
