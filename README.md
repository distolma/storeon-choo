# Storeon Choo

[![npm version](https://badge.fury.io/js/storeon-choo.svg)](https://www.npmjs.com/package/storeon-choo)
[![Build Status](https://travis-ci.org/distolma/storeon-choo.svg?branch=master)](https://travis-ci.org/distolma/storeon-choo)

<img src="https://storeon.github.io/storeon/logo.svg" align="right" alt="Storeon logo by Anton Lovchikov" width="160" height="142">

A tiny connector for [Storeon] and [Choo].

Size is only 81 bytes (minified and gzipped). It uses [Size Limit] to control size.

Read more about Storeon [article].

[storeon]: https://github.com/storeon/storeon
[tools]: https://github.com/storeon/storeon#tools
[Choo]: https://github.com/choojs/choo
[size limit]: https://github.com/ai/size-limit
[demo]: https://codesandbox.io/s/admiring-beaver-edi8m
[article]: https://evilmartians.com/chronicles/storeon-redux-in-173-bytes

## Install

```sh
npm install -S storeon-choo
```
or
```sh
yarn add storeon-choo
```

## How to use ([Demo])

Create store using `storeon` module:

#### `store.js`

```javascript
import { createStoreon } from 'storeon'

let counter = store => {
  store.on('@init', () => ({ count: 0 }))
  store.on('inc', ({ count }) => ({ count: count + 1 }))
}

export const store = createStoreon([counter])
```

#### `index.js`

Use `storeonMiddleware` from `storeon-choo`.

```js
import choo from 'choo'
import storeonMiddleware from 'storeon-choo'
import { store } from './store'

const app = choo()
app.use(storeonMiddleware(store))
app.route('/', require('./views/main'))

module.exports = app.mount('body')
```

Emitting `@dispatch` event with payload (like `[event, data]`) you will dispatch `storeon` event. All states are located in `state.storeon` property.

#### `main.js`

```js
import html from 'choo/html'

export default function view(state, emit) {
  const increment = () => emit('@dispatch', ['inc'])

  return html`
    <body>
      <h1>Count: ${state.storeon.count}</h1>
      <button onclick=${increment}></button>
    </body>
  `
}
```
