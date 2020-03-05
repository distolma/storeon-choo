module.exports = store => {
  return (state, emitter) => {
    state.storeon = store.get()

    emitter.on('@dispatch', ([event, data]) => {
      store.dispatch(event, data)
    })

    store.on('@changed', (_, changed) => {
      Object.assign(state.storeon, changed)
      emitter.emit('render')
    })
  }
}
