export default defineAppConfig({
  docus: {
    title: 'Nuxt Builder.io Module',
    description: 'An unofficial Nuxt module for Builder.io, a visual headless CMS.',
    image: '',
    socials: {
      github: 'Joepocalyptic/nuxt-builderio',
      nuxt: {
        label: 'Nuxt',
        icon: 'simple-icons:nuxtdotjs',
        href: 'https://nuxt.com'
      }
    },
    github: {
      dir: 'docs/content',
      branch: 'main',
      repo: 'nuxt-builderio',
      owner: 'Joepocalyptic',
      edit: false
    },
    aside: {
      level: 0,
      collapsed: false,
      exclude: []
    },
    main: {
      padded: true,
      fluid: false
    },
    header: {
      logo: true,
      showLinkIcon: true,
      exclude: [],
      fluid: false
    }
  }
})
