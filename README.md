# Nuxt Builder.io Module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

This is an unofficial Nuxt module for [Builder.io](https://builder.io/). It allows you to quickly and easily integrate
Builder.io as a visual CMS for your Nuxt application.

**This module is currently in development.** It is not yet intended for production use and there will be bugs. Feel
free to help out by reporting bugs and submitting pull requests!

- [📖 &nbsp;Documentation](https://nuxt-builderio.joeypereira.dev)
- [✨ &nbsp;Release Notes](/CHANGELOG.md)
- [🏀 Online playground](https://stackblitz.com/github/Joepocalyptic/nuxt-builderio?file=playground%2Fapp.vue)

## Features

- Built for **Nuxt 3**
- Automatically register [custom components](https://www.builder.io/c/docs/custom-components-intro)
- Opinionated defaults to get started with no configuration

## Quick Setup

1. Add the `nuxt-builderio` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-builderio

# Using yarn
yarn add --dev nuxt-builderio

# Using npm
npm install --save-dev nuxt-builderio
```

2. Add `nuxt-builderio` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    'nuxt-builderio'
  ]
})
```

That's it! Read the [documentation](https://nuxt-builderio.joeypereira.dev) for more information, including
configuration and optimization options.

You can get started extremely quickly by using the provided `BuilderContent` component in a page:

```vue
<template>
  <BuilderContent
    throw-error
    @load="onContentLoaded"
  />
</template>

<script setup lang="ts">
// You can directly access the content returned by Builder with the `@load` event
const onContentLoaded = (content) => {
  console.log(content)
}
</script>
```

This will automatically render Builder content with full support for SSR. If no `path` is provided, it
will default to the current page's path. If no `model` is provided, it will use the `defaultModel` provided
in the module options (this defaults to `page`).

The `throwError` prop will cause the component to throw a 404 error if the content is not found.

## Development

```bash
# Install dependencies
pnpm install

# Generate type stubs
pnpm run dev:prepare

# Develop with the playground
pnpm run dev

# Build the playground
pnpm run dev:build

# Run ESLint
pnpm run lint

# Release new version
pnpm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-builderio/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-builderio

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-builderio.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-builderio

[license-src]: https://img.shields.io/npm/l/nuxt-builderio.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-builderio

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
