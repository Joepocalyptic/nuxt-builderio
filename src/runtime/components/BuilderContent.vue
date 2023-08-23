<template>
  <InternalBuilderRenderContent
    v-if="canShowContent"
    :custom-components="customComponents"
    v-bind="data"
  />
</template>
<script setup lang="ts">
import { computed, watch } from 'vue'
import {
  fetchBuilderProps,
  isPreviewing
} from '@builder.io/sdk-vue'
import {
  InternalBuilderRenderContent,
  useBuilderComponents
} from '#imports'
import { useAsyncData, useRoute, useRuntimeConfig, createError } from '#app'
import type { ComponentInfo } from '@builder.io/sdk-vue'
import type { Component } from 'vue'

type Props = {
  model?: string
  path?: string
  extra?: Parameters<typeof fetchBuilderProps>[0],
  throwError?: boolean,
  components?: (ComponentInfo & { component: Component})[]
}

type BuilderResponse = NonNullable<Awaited<ReturnType<typeof fetchBuilderProps>>>

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'load', response: BuilderResponse): void
}>()

const {
  apiKey,
  defaultModel,
  components: {
    enabled: componentsEnabled
  }
} = useRuntimeConfig().public.builderIO

const { data } = await useAsyncData(async () => await fetchBuilderProps({
  model: props.model || defaultModel,
  apiKey,
  userAttributes: {
    urlPath: props.path || useRoute().path
  },
  ...props.extra,
}))

const content = computed(() => data.value?.content)

watch(data, (data) => {
  if (data && data.content) {
    emit('load', data)
  } else if(props.throwError) {
    throw createError({
      statusCode: 404
    })
  }
}, { immediate: true })

const canShowContent = computed(() => content.value || isPreviewing())

const customComponents = computed(() => {
  if(props.components) { return props.components }
  if(componentsEnabled && process.client) {
    return useBuilderComponents()
  }
  return null
})
</script>
