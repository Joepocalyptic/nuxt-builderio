import type { ComponentInfo } from '@builder.io/sdk-vue'

export const defineBuilderComponent = (component: (Omit<ComponentInfo, 'name'> & { ignored?: boolean })) => component
