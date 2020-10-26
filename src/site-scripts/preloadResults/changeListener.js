// calls a function when changes in the redux state are detected
export class ChangeListener {
  constructor(store, changedFunction) {
    this.previousState = {};
    this.store = store;
    this.changedFunction = changedFunction;
  }

  listen(changeHandler) {
    this.store.subscribe(() => {
      const state = this.store.getState();
      if (this.changedFunction(this.previousState, state)) {
        changeHandler(this.previousState, state, this.store);
      }
      this.previousState = state;
    });
  }
}
