import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import type { Component } from 'vue'
import type { ComponentInfo } from '@builder.io/sdk-vue'

type InternalBuilderComponent = {
  name: string
  data: ComponentInfo & { ignored?: boolean }
  component: () => Promise<{ default: Component }>
}

export default defineNuxtPlugin({
  setup: async () => {
    // This can't be a static import because they force a type check (this file isn't guaranteed to exist)
    // @ts-expect-error virtual file
    const _components = (await import('#build/builder/components.mjs')).default

    const { prefix } = useRuntimeConfig().public.builderIO.components
    const components = await Promise.all((_components as InternalBuilderComponent[])
      .filter(component => !component.data.ignored)
      .map(async (component) => {
        const vueComponent = (await component.component()).default
        return {
          ...component.data,
          component: vueComponent,
          name: prefix + component.name,
          ignored: undefined
        }
      })
    )

    return {
      provide: {
        builderComponents: components
      }
    }
  }
})
