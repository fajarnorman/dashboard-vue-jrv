import Vue from 'vue'
import Router from 'vue-router'

// import router page
import ProductRouter from './product'
import LocationsRouter from './locations'
import SliderRouter from './slideshow'
import StoreRouter from './store'
import ClaimRouter from './claim'
import WarrantyRouter from './warranty'
import UserRouter from './user'
import PermissionRouter from './permissions'
import DeliveryOrderRouter from './delivery-order'
import BacklinkRouter from './backlink'
import ProfileRouter from './profile'
import LanguageRouter from './language'
import DashboardChartsRouter from './dashboard'
import CustomerServicesRouter from './customer-services'
import CreditProviderRouter from './credit'
import SupplierWarehouseRouter from './supplier-warehouse'
import QRCodeBatchRouter from './qrcode-batch'
import PaymentMethodRouter from './payment-method'
import ShippingRouter from './shipping'

Vue.use(Router)

const baseRoutes = [];
const routes = baseRoutes.concat(ProductRouter)
                         .concat(LocationsRouter)
                         .concat(SliderRouter)
                         .concat(StoreRouter)
                         .concat(ClaimRouter)
                         .concat(WarrantyRouter)
                         .concat(UserRouter)
                         .concat(PermissionRouter)
                         .concat(DeliveryOrderRouter)
						 .concat(BacklinkRouter)
						 .concat(ProfileRouter)
						 .concat(LanguageRouter)
						 .concat(DashboardChartsRouter)
						 .concat(CustomerServicesRouter)
						 .concat(CreditProviderRouter)
						 .concat(SupplierWarehouseRouter)
						 .concat(QRCodeBatchRouter)
						 .concat(PaymentMethodRouter)
						 .concat(ShippingRouter)

const VueRouters = new Router({
	// use this in server if you place this project inside a folder
	base: '/',
	routes,
	mode: 'history',
	scrollBehavior (to, from, savedPosition) {
		return { x: 0, y: 0 }
	}
})

VueRouters.beforeEach((to, from, next) => {
    next()
    if(window.innerWidth <= 768){
        setTimeout(function(){
            document.getElementsByClassName('sidebar')[0].classList.remove('showing')
        }, 200)
    }
})

export default VueRouters;
