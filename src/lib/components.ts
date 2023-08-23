import { resolveFiles } from '@nuxt/kit'
import { hash } from 'ohash'
import { genArrayFromRaw, genDynamicImport, genImport, genSafeVariableName } from 'knitwork'
import { filename } from 'pathe/utils'

type ResolvedComponent = {
  path: string
  dataImportName: string
}

export const generateComponentsTemplate = async (componentsPath: string) => {
  const componentPaths = await resolveFiles(componentsPath, '**/**/*.vue')
  const components: ResolvedComponent[] = componentPaths.map(path => ({
    path,
    dataImportName: genSafeVariableName(filename(path) + hash(path)) + 'Data'
  }))

  const imports = components.map(component => genImport(
    `${component.path}?builder=true`,
    [{ name: 'default', as: component.dataImportName }]
  )).join('\n')

  const exportString = genArrayFromRaw(components.map(component => ({
    name: `"${filename(component.path)}"`,
    data: component.dataImportName,
    component: genDynamicImport(component.path)
  })))

  return `${imports}\n\nexport default ${exportString}`
}
