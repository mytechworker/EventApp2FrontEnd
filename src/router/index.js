import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Main',
        redirect: '/groups',
        meta: {
            requiresAuth: true
        },
        component: () => import('@/views'),
        children: [
            {
                path: 'groups',
                name: 'Groups',
                meta: {
                    requiresAuth: true
                },
                component: () => import('@/views/groups'),
            },
            {
                path: 'groups/:id',
                name: 'GroupSingle',
                props: true,
                meta: {
                    requiresAuth: true
                },
                component: () => import('@/views/groups/_id')
            },
            {
                path: 'profile',
                name: 'Profile',
                component: () => import('@/views/profile')
            },
        ]
    },
    {
        path: '/signin',
        name: 'SignIn',
        component: () => import('@/views/entry')
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: () => import('@/views/entry')
    },
    {
        path: '/recovery',
        name: 'recovery',
        component: () => import('@/views/recovery')
    },
    {
        path: '/recovery/error',
        name: 'recoveryError',
        component: () => import('@/views/recovery/error')
    },
    {
        path: '/welcome',
        name: 'welcome',
        requiresAuth: true,
        component: () => import('@/views/welcome')
    },
    {
        path: '/welcome/step2',
        name: 'step2',
        component: () => import('../views/welcome/welcomeStep2.vue')
    },
    {
        path: '/welcome/step3',
        name: 'step3',
        component: () => import('../views/welcome/welcomeStep3.vue')
    },
    {
        path: '/welcome/step4',
        name: 'step4',
        component: () => import('../views/welcome/welcomeStep4.vue')
    },
    {
        path: '/welcome/step5',
        name: 'step5',
        component: () => import('../views/welcome/welcomeStep5.vue')
    },
    {

        path: '/welcome/step6',
        name: 'step6',
        component: () => import('../views/welcome/welcomeStep6.vue')

    },
    {
        path: '/events',
        name: 'Events',
        meta: {
            requiresAuth: true
        },
        component: () => import('@/views')
    },
    {
        path: '/calendar',
        name: 'Calendar',
        meta: {
            requiresAuth: true
        },
        component: () => import('@/views')
    },
    {
        path: '/members',
        name: 'Members',
        meta: {
            requiresAuth: true
        },
        component: () => import('@/views')
    },
    {
        path: '/join/:id/:code',
        name: 'PublicGroup',
        component: () => import('@/views/public-group')
    },
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
