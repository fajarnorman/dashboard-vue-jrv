import Claim from '@/pages/claim/index.vue'
import ClaimDetail from '@/pages/claim/detail.vue'

export default [
    { path: '/claim', name: 'claim', component: Claim },
	{ path: '/claim/:id', name: 'claim-detail', component: ClaimDetail },
]