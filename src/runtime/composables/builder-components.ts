import { useNuxtApp, createError } from '#app'

export const useBuilderComponents = () => {
  const nuxtApp = useNuxtApp()

  if(process.server) {
    throw createError('useBuilderComponents() is only available on the client.')
  }

  if(nuxtApp.$builderComponents) {
    return nuxtApp.$builderComponents
  }

  console.warn('Builder components not loaded; either the feature isn\'t enabled (set `builder.components.enabled` to `true` in your `nuxt.config`) or this is an internal bug.')
}
