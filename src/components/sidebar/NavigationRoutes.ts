export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'seo-nav',
      displayName: 'menu.seo-nav',
      meta: {
        icon: 'travel_explore',
      },
    },
    {
      name: 'geo-nav',
      displayName: 'menu.geo-nav',
      meta: {
        icon: 'auto_awesome',
      },
    },
    {
      name: 'aeo-nav',
      displayName: 'menu.aeo-nav',
      meta: {
        icon: 'question_answer',
      },
    },
    {
      name: 'llms-txt',
      displayName: 'menu.llms-txt',
      meta: {
        icon: 'description',
      },
    },
    {
      name: 'ai-checker',
      displayName: 'menu.ai-checker',
      meta: {
        icon: 'health_and_safety',
      },
    },
    {
      name: 'glossary',
      displayName: 'menu.glossary',
      meta: {
        icon: 'menu_book',
      },
    },
    {
      name: 'schema-generator',
      displayName: 'menu.schema-generator',
      meta: {
        icon: 'data_object',
      },
    },
    {
      name: 'articles',
      displayName: 'menu.articles',
      meta: {
        icon: 'article',
      },
    },
    {
      name: 'tutorials',
      displayName: 'menu.tutorials',
      meta: {
        icon: 'school',
      },
    },
    {
      name: 'news',
      displayName: 'menu.news',
      meta: {
        icon: 'newspaper',
      },
    },
  ] as INavigationRoute[],
}
