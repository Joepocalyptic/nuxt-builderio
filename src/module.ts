// noinspection JSIgnoredPromiseFromCall,ES6MissingAwait

import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  logger,
  addImports,
  isNuxt2,
  addComponent,
  addComponentsDir, addVitePlugin, addWebpackPlugin, addTemplate
} from '@nuxt/kit'
import defu from 'defu'
import { BuilderComponentPlugin, BuilderComponentPluginOptions } from './lib/components-unplugin'
import { generateComponentsTemplate } from './lib/components'

// Module options TypeScript interface definition
export interface ModuleOptions {
  autoImports: string[] | false
  apiKey?: string
  defaultModel: string
  components: {
    enabled: boolean
    dir: string
    prefix: string
  }
}

const getBuilderApiKey = (options: ModuleOptions) => {
  if(options.apiKey) {
    return options.apiKey
  }
  if(process.env.BUILDER_API_KEY) {
    return process.env.BUILDER_API_KEY
  }
  logger.warn('Builder API key not found. Add `builder.apiKey` to your `nuxt.config` or set the BUILDER_API_KEY environment variable.')
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-builderio',
    // The `builder` key is already used by Nuxt
    configKey: 'builderIO',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    autoImports: [
      'fetchEntries',
      'fetchOneEntry',
      'fetchBuilderProps',
      'isEditing',
      'isPreviewing',
      'setEditorSettings',
      'getBuilderSearchParams',
      'createRegisterComponentMessage'
    ],
    defaultModel: 'page',
    components: {
      enabled: true,
      dir: 'builder/components',
      prefix: 'BuilderCustom',
    }
  },
  async setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const baseLayer = nuxt.options._layers[0]
    const { resolve: resolveBaseLayer } = createResolver(baseLayer.config.srcDir)

    const apiKey = getBuilderApiKey(options)

    nuxt.options.runtimeConfig.public = defu(nuxt.options.runtimeConfig.public || {}, {
      builderIO: {
        apiKey,
        defaultModel: options.defaultModel,
        components: {
          enabled: options.components.enabled,
          prefix: options.components.prefix
        }
      }
    })

    addPlugin({
      mode: 'client',
      src: resolve('./runtime/plugins/components')
    })

    addComponent({
      name: 'BuilderContent',
      filePath: resolve('./runtime/components/BuilderContent.vue')
    })

    // Only inject the components tooling if the feature is enabled
    if(options.components.enabled) {
      const componentPluginOptions: BuilderComponentPluginOptions = {
        dev: nuxt.options.dev,
        sourcemap: nuxt.options.sourcemap.server || nuxt.options.sourcemap.client
      }

      // Handles `defineBuilderComponent` extraction; adapted from Nuxt's built-in `definePageMeta`
      nuxt.hook('modules:done', () => {
        addVitePlugin(() => BuilderComponentPlugin.vite(componentPluginOptions))
        addWebpackPlugin(() => BuilderComponentPlugin.webpack(componentPluginOptions))
      })

      const builderComponentsPath = resolveBaseLayer(`./${options.components.dir}`)

      // Provide the list of Builder components to the runtime through a virtual file; this is easier and
      // more performant than sifting through the entire components array at runtime
      addTemplate({
        filename: 'builder/components.mjs',
        getContents: async () => await generateComponentsTemplate(builderComponentsPath)
      })

      // Registering the components in Nuxt globally allows them to be rendered during SSR
      addComponentsDir({
        path: builderComponentsPath,
        prefix: options.components.prefix,
        global: true
      })

      addImports({
        name: 'defineBuilderComponent',
        as: 'defineBuilderComponent',
        from: resolve('./runtime/composables/define-builder-component'
        )
      })
    }

    // TODO: Possible Nuxt 2 support?
    const builderLibraryPath = isNuxt2(nuxt)
      ? '@builder.io/sdk-vue/vue2'
      : '@builder.io/sdk-vue/vue3'

    if(options.autoImports) {
      addImports(options.autoImports.map(item => ({
        name: item,
        as: item,
        from: builderLibraryPath
      })))
    }

    // Unconditional imports
    addImports([{
      name: 'Content',
      as: 'InternalBuilderRenderContent',
      from: builderLibraryPath
    }, {
      name: 'useBuilderComponents',
      as: 'useBuilderComponents',
      from: resolve('./runtime/composables/builder-components')
    }])
  }
})
