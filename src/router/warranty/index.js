import Warranty from '@/pages/warranty'
import HistoryWarranty from '@/pages/warranty/history'

export default [
    { path: '/warranty', name: 'warranty', component: Warranty },
    { path: '/history-warranty/:id', name: 'history-warranty', component: HistoryWarranty },
]