# SoundSphere

> ⚠ The library is W.I.P. and most methods are not yet implemented

A modern [SoundCloud](https://soundcloud.com) API client for Node.js and Deno.

## Features

- ✨ Typed methods (generated via [quicktype](https://app.quicktype.io/?l=ts))
- ⚡ Targets ES2019 (Node 12+ LTS)

## Example

```ts
import { SoundCloud } from 'soundsphere'

const sc = new SoundCloud({
  id: 'CLIENT_ID',
  secret: 'CLIENT_SECRET'
})
const { id } = await sc.user('uvulauvula')

const json = (await sc.tracks({ user: id }))[1]

console.log(json)
```
