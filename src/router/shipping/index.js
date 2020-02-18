import ShippingCourier from '@/pages/shipping/courier.vue'
import ShippingCourierRate from '@/pages/shipping/courier-rate.vue'
import ShippingCourierService from '@/pages/shipping/courier-service.vue'
import ShippingOrderList from '@/pages/shipping/order.vue'

export default [
	{ path: '/kurir', name: 'shipping-courier', component: ShippingCourier },
	{ path: '/kurir-rate', name: 'shipping-rate', component: ShippingCourierRate },
	{ path: '/kurir-service', name: 'shipping-service', component: ShippingCourierService },
	{ path: '/order-list', name: 'shipping-order', component: ShippingOrderList }
]
