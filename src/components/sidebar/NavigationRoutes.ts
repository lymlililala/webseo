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
  ] as INavigationRoute[],
}
