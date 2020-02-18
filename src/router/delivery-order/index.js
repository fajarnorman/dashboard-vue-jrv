import DeliveryIncomingItem from '@/pages/delivery-order/index.vue'
import DeliveryWareHouse from '@/pages/delivery-order/warehouse.vue'
import DeliveryPurchaseOrder from '@/pages/delivery-order/purchaseOrder.vue'
import DeliverySale from '@/pages/delivery-order/stockSale.vue'
import DeliveryReturn from '@/pages/delivery-order/stockReturn.vue'

export default [
	{ path: '/delivery-incoming-item', name: 'delivery-incoming-item', component: DeliveryIncomingItem },
	{ path: '/delivery-warehouse', name: 'delivery-warehouse', component: DeliveryWareHouse },
	{ path: '/delivery-purchase-order', name: 'delivery-purchase-order', component: DeliveryPurchaseOrder },
	{ path: '/delivery-sale', name: 'delivery-sale', component: DeliverySale },
	{ path: '/delivery-return', name: 'delivery-return', component: DeliveryReturn }
]
