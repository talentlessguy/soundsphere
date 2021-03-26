# SoundSphere

[![GitHub release (latest by date)][releases]][releases-page] [![][docs-badge]][docs] [![Version][npm-v-image]][npm-url]
[![Node Version][node-version-image]][node-version-url]

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

[releases]: https://img.shields.io/github/v/release/talentlessguy/soundsphere?style=flat-square
[docs-badge]: https://img.shields.io/github/v/release/talentlessguy/soundsphere?color=yellow&label=Documentation&logo=deno&style=flat-square
[docs]: https://doc.deno.land/https/deno.land/x/soundsphere/mod.ts
[releases-page]: https://github.com/talentlessguy/soundsphere/releases
[npm-v-image]: https://img.shields.io/npm/v/soundsphere.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/soundsphere
[node-version-image]: https://img.shields.io/node/v/soundsphere.svg?style=flat-square
[node-version-url]: https://nodejs.org
