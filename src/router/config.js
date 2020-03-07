import { AuthLayout, DefaultLayout } from '@/components/layouts'

export const publicRoute = [
  {
    path: '*',
    component: () =>
      import(/* webpackChunkName: "errors-404" */ '@/views/error/NotFound.vue'),
  },
  {
    path: '/auth',
    component: AuthLayout,
    meta: {
      title: 'Login',
    },
    redirect: '/auth/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        meta: {
          title: 'Login',
        },
        component: () =>
          import(/* webpackChunkName: "login" */ '@/views/auth/Login.vue'),
      },
    ],
  },

  {
    path: '/404',
    name: '404',
    meta: {
      title: 'Not Found',
    },
    component: () =>
      import(/* webpackChunkName: "errors-404" */ '@/views/error/NotFound.vue'),
  },

  {
    path: '/500',
    name: '500',
    meta: {
      title: 'Server Error',
    },
    component: () =>
      import(/* webpackChunkName: "errors-500" */ '@/views/error/Error.vue'),
  },
]

export const protectedRoute = [
  {
    path: '/',
    component: DefaultLayout,
    meta: {
      title: 'Home',
      group: 'apps',
      icon: '',
    },
    redirect: '/editor/5e5e46cc294cb2043c845ee5',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        meta: {
          title: 'Home',
          group: 'apps',
          icon: 'dashboard',
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
      },
      // {
      //   path: '/media',
      //   meta: {
      //     title: 'Media',
      //     group: 'apps',
      //     icon: 'media',
      //   },
      //   name: 'Media',
      //   props: route => ({
      //     type: route.query.type,
      //   }),
      //   component: () =>
      //     import(/* webpackChunkName: "media" */ '@/views/Media.vue'),
      // },

      // {
      //   path: '/task',
      //   meta: {
      //     title: 'Task',
      //     group: 'apps',
      //     icon: 'media',
      //   },
      //   name: 'Task',
      //   props: route => ({
      //     type: route.query.type,
      //   }),
      //   component: () =>
      //     import(/* webpackChunkName: "task" */ '@/views/Calendar.vue'),
      // },
      {
        path: '/403',
        name: 'Forbidden',
        meta: {
          title: 'Access Denied',
          hiddenInMenu: true,
        },
        component: () =>
          import(/* webpackChunkName: "error-403" */ '@/views/error/Deny.vue'),
      },
      {
        path: '/editor/:pageId',
        meta: {
          title: 'Editor',
          group: 'apps',
          icon: 'edit',
        },
        name: 'Editor',
        props: route => ({
          id: route.query.id,
        }),
        component: () =>
          import(/* webpackChunkName: "editor" */ '@/views/editor/Editor.vue'),
      },
    ],
  },

  //list
  // {
  //   path: '/cms',
  //   component: DefaultLayout,
  //   redirect: '/cms/table',
  //   meta: {
  //     title: 'CMS',
  //     icon: 'view_compact',
  //     group: 'cms',
  //   },
  //   children: [
  //     {
  //       path: '/cms/table',
  //       name: 'ListTable',
  //       meta: {
  //         title: 'CMS Table',
  //       },
  //       component: () =>
  //         import(/* webpackChunkName: "table" */ '@/views/list/Table.vue'),
  //     },
  //   ],
  // },
]
