import { createRouter, createWebHistory } from 'vue-router'

import defaultLayout from '@/layouts/Default.vue'


const routes = [
    {
		path: '/',
		name: 'MainPage',
		component: () => import('../views/MainPage.vue'),
		meta: {
			layout: defaultLayout
		}
	},
    {
		path: '/multisend/:network',
		name: 'Multisend',
		component: () => import('../views/Multisend.vue'),
		meta: {
			layout: defaultLayout
		}
	},
	{
		path: '/ibc_recovery',
		name: 'IBCRecovery',
		component: () => import('../views/IBCRecovery.vue'),
		meta: {
			layout: defaultLayout
		}
	},
	{
		path: '/ibc_route/:network',
		name: 'IBCRoute',
		component: () => import('../views/IBCRoute.vue'),
		meta: {
			layout: defaultLayout
		}
	},
]


const router = createRouter({
	history: createWebHistory(),
	routes
})


export default router
