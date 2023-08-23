<template>
  <div>
    <h1>
      Hello, {{ text }}!
    </h1>
  </div>
</template>

<script setup lang="ts">
import { defineBuilderComponent } from '#imports'

defineProps<{
  text: string
}>()

defineBuilderComponent({
  friendlyName: 'Hero',
  description: 'Test description',
  inputs: [{
    name: 'text',
    type: 'string',
    defaultValue: 'world'
  }]
})
</script>
