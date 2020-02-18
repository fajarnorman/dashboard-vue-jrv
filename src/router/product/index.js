import ProductList from '@/pages/product/index.vue'
import ProductItem from '@/pages/product/item.vue'
import ProductBrand from '@/pages/product/brand.vue'
import ProductColour from '@/pages/product/colour.vue'
import ProductType from '@/pages/product/type.vue'
import ProductVariant from '@/pages/product/variant.vue'
import ProductCombineBikeSparePart from '@/pages/product/combine-bike-sparepart.vue'
import SwicthProduct from '@/pages/product/switch-product.vue'

export default [
    { path: '/product/item', name: 'product-item', component: ProductItem },
	{ path: '/product/list', name: 'product-list', component: ProductList },
	{ path: '/product/brand', name: 'product-brand', component: ProductBrand },
	{ path: '/product/colour', name: 'product-colour', component: ProductColour },
	{ path: '/product/type', name: 'product-type', component: ProductType },
	{ path: '/product/variant', name: 'product-variant', component: ProductVariant },
	{ path: '/product/combine-bike-sparepart', name: 'product-combine-bike-sparepart', component: ProductCombineBikeSparePart },
	{ path: '/product/switch-product', name: 'product-switch-product', component: SwicthProduct },
]
