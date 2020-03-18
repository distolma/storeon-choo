const { createStoreon } = require('storeon')
const Nanobus = require('nanobus')

const storeonMiddleware = require('../index')

function storeFactory () {
  let counter = store => {
    store.on('@init', () => ({ count: 0 }))
    store.on('inc', ({ count }) => ({ count: count + 1 }))
  }

  let store = createStoreon([counter])
  let state = {}
  let emitter = new Nanobus()

  jest.spyOn(store, 'dispatch')
  jest.spyOn(emitter, 'emit')

  storeonMiddleware(store)(state, emitter)

  return { store, state, emitter }
}

it('should take initial value', () => {
  let { state, store } = storeFactory()
  expect(state.storeon).toEqual(store.get())
})

it('should dispath on @dispatch event from emitter', () => {
  let { state, store, emitter } = storeFactory()
  expect(state.storeon.count).toBe(0)
  emitter.emit('@dispatch', ['inc'])
  expect(state.storeon.count).toBe(1)
  expect(store.dispatch.mock.calls[0][0]).toBe('inc')
})

it('should rerender on store changed', () => {
  let { store, emitter } = storeFactory()
  store.dispatch('inc')
  expect(emitter.emit).toHaveBeenCalledWith('render')
  expect(emitter.emit).toHaveBeenCalledTimes(1)
})
