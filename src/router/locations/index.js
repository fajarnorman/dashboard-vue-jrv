import LocationsProvince from '@/pages/locations/province.vue'
import LocationsCity from '@/pages/locations/city.vue'
import LocationsSubdistrict from '@/pages/locations/subdistrict.vue'

export default [
	{ path: '/locations/province', name: 'locations-province', component: LocationsProvince },
	{ path: '/locations/city', name: 'locations-city', component: LocationsCity },
	{ path: '/locations/subdistrict', name: 'locations-subdistrict', component: LocationsSubdistrict },
]
