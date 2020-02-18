import CreditProvider from '@/pages/credit-provider/index.vue'
import CreditSubmission from '@/pages/credit-submission/index.vue'
import CreditSubmissionDetail from '@/pages/credit-submission/detail.vue'

export default [
	{ path: '/credit-provider', name: 'credit-provider', component: CreditProvider },
	{ path: '/credit-submission', name: 'credit-submission', component: CreditSubmission },
	{ path: '/credit-submission/:id', name: 'credit-submission-detail', component: CreditSubmissionDetail }
]
