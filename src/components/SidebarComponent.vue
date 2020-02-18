<template>
    <div class="sidebar sidebar-main">
        <div class="sidebar-content">
            <!-- main navigation -->
            <div class="sidebar-category sidebar-category-visible">
                <div class="category-content no-padding">
                    <div class="logo">
						<img class="img-logo" src="@/assets/images/logo-jarvis.png">
						<div class="versions">{{versions}}</div>
					</div>
                    <a href="#" class="closesidebar" @click.prevent="sidebarClose()"><font-awesome-icon class="fontIcons" :icon="fontsIcons.close" /></a>
                    <ul class="navigation navigation-main navigation-accordion">
                        <div class="sidebar-nav active" id="produk">
                            <el-menu class="el-menu-vertical-demo" :unique-opened="true">
								<el-menu-item index="0">
                                    <router-link v-bind:to="'/'" class="new-icons">
                                        <div class="icon-sidebar" v-html="require('@/assets/images/icons/sidebar/icon-dashboard.svg')"></div>
                                        <span>Dashboard Statistik</span>
                                    </router-link>
                                </el-menu-item>
                                <el-submenu index="2">
                                    <template slot="title">
                                        <div class="icon-sidebar" v-html="require('@/assets/images/icons/sidebar/icon-master-barang.svg')"></div>
                                        <span>Master Produk</span>
                                        <div class="caret-custom"></div>
                                    </template>
									<el-menu-item index="2-6">
                                        <router-link v-bind:to="'/product/combine-bike-sparepart'">Kombinasi Sparepart</router-link>
                                    </el-menu-item>
									<el-menu-item index="2-6">
                                        <router-link v-bind:to="'/product/switch-product'">Penggabungan Produk</router-link>
                                    </el-menu-item>
                                    <el-menu-item index="2-1">
                                        <router-link v-bind:to="'/product/list'">Daftar Produk</router-link>
                                    </el-menu-item>
                                    <el-menu-item index="2-2">
                                        <router-link v-bind:to="'/product/brand'">Brand</router-link>
                                    </el-menu-item>
                                    <el-menu-item index="2-3">
                                        <router-link v-bind:to="'/product/colour'">Warna</router-link>
                                    </el-menu-item>
                                    <el-menu-item index="2-4">
                                        <router-link v-bind:to="'/product/type'">Tipe</router-link>
                                    </el-menu-item>
                                    <el-menu-item index="2-5">
                                        <router-link v-bind:to="'/product/variant'">Variant</router-link>
                                    </el-menu-item>
                                </el-submenu>
                                <el-submenu index="3">
                                    <template slot="title">
                                        <div class="icon-sidebar" v-html="require('@/assets/images/icons/sidebar/icon-location.svg')"></div>
                                        <span>Toko</span>
                                        <div class="caret-custom"></div>
                                    </template>
                                    <el-menu-item index="3-1">
                                        <router-link v-bind:to="'/store'">Lokasi</router-link>
                                    </el-menu-item>
                                    <el-menu-item index="3-2">
                                        <router-link v-bind:to="'/locations/province'">Provinsi</router-link>
                                    </el-menu-item>
									<el-menu-item index="3-3">
                                        <router-link v-bind:to="'/locations/city'">Kota</router-link>
                                    </el-menu-item>
									<el-menu-item index="3-4">
                                        <router-link v-bind:to="'/locations/subdistrict'">Kecamatan</router-link>
                                    </el-menu-item>
                                </el-submenu>
								<el-submenu index="4">
                                    <template slot="title">
                                        <div class="icon-sidebar" v-html="require('@/assets/images/icons/sidebar/icon-balance.svg')"></div>
                                        <span>Garansi</span>
                                        <div class="caret-custom"></div>
                                    </template>
                                    <el-menu-item index="4-2">
                                        <router-link v-bind:to="'/claim'">Register Garansi</router-link>
                                    </el-menu-item>
                                    <el-menu-item index="4-1">
                                        <router-link v-bind:to="'/warranty'">List Garansi</router-link>
                                    </el-menu-item>
                                </el-submenu>
								<el-submenu index="12">
									 <template slot="title">
                                        <div class="icon-sidebar" v-html="require('@/assets/images/icons/sidebar/icon-balance.svg')"></div>
                                        <span>Credit</span>
                                        <div class="caret-custom"></div>
                                    </template>
									<el-menu-item index="2-6">
                                        <router-link v-bind:to="'/credit-provider'">Provider</router-link>
                                    </el-menu-item>
									<el-menu-item index="2-6">
                                        <router-link v-bind:to="'/credit-submission'">Submission</router-link>
                                    </el-menu-item>
								</el-submenu>
								<el-menu-item index="9">
                                    <router-link v-bind:to="'/supplier'">
                                        <div class="icon-sidebar" v-html="require('@/assets/images/icons/sidebar/icon-produsen.svg')"></div>
                                        <span>Supplier</span>
                                    </router-link>
                                </el-menu-item>
								<el-menu-item index="10">
                                    <router-link v-bind:to="'/warehouse'">
                                        <div class="icon-sidebar" v-html="require('@/assets/images/icons/sidebar/icon-kios.svg')"></div>
                                        <span>Warehouse</span>
                                    </router-link>
                                </el-menu-item>
								<el-menu-item index="14">
                                    <router-link v-bind:to="'/payment-method'">
                                        <div class="icon-sidebar" v-html="require('@/assets/images/icons/sidebar/icon-kirim-balance.svg')"></div>
                                        <span>Payment Method</span>
                                    </router-link>
                                </el-menu-item>
								<el-menu-item index="11">
                                    <router-link v-bind:to="'/qrcode-batch'">
                                        <div class="icon-sidebar" v-html="require('@/assets/images/icons/sidebar/icon-promo-code.svg')"></div>
                                        <span>QRCode Batch</span>
                                    </router-link>
                                </el-menu-item>
								<el-submenu index="6">
                                    <template slot="title" class="new-icons-2">
                                        <div class="icon-sidebar" v-html="require('@/assets/images/icons/sidebar/icon-list-transaksi.svg')"></div>
                                        <span>Stock</span>
                                        <div class="caret-custom"></div>
                                    </template>
									<el-menu-item index="6-6">
										<router-link v-bind:to="'/product/item'" class="new-icons">
											<!-- <div class="icon-sidebar" v-html="require('@/assets/images/icons/sidebar/icon-produsen-2.svg')"></div> -->
											<span>Daftar Item</span>
										</router-link>
									</el-menu-item>
                                    <el-menu-item index="6-1">
                                        <router-link v-bind:to="'/delivery-incoming-item'">Barang masuk</router-link>
                                    </el-menu-item>
									<el-menu-item index="6-2">
                                        <router-link v-bind:to="'/delivery-warehouse'">Pindah Warehouse</router-link>
                                    </el-menu-item>
									<el-menu-item index="6-3">
                                        <router-link v-bind:to="'/delivery-purchase-order'">Purchase Order</router-link>
                                    </el-menu-item>
									<el-menu-item index="6-4">
                                        <router-link v-bind:to="'/delivery-sale'">Surat Jalan</router-link>
                                    </el-menu-item>
									<el-menu-item index="6-5">
                                        <router-link v-bind:to="'/delivery-return'">Pengembalian Barang</router-link>
                                    </el-menu-item>
								</el-submenu>
								<el-submenu index="15">
                                    <template slot="title" class="new-icons-2">
                                        <div class="icon-sidebar" v-html="require('@/assets/images/icons/sidebar/icon-list-transaksi.svg')"></div>
                                        <span>Shipping</span>
                                        <div class="caret-custom"></div>
                                    </template>
									<el-menu-item index="15-1">
										<router-link v-bind:to="'/kurir'" class="slide-show">Kurir</router-link>
									</el-menu-item>
									<el-menu-item index="15-3">
										<router-link v-bind:to="'/kurir-service'" class="slide-show">Kurir Service</router-link>
									</el-menu-item>
									<!-- <el-menu-item index="15-2">
										<router-link v-bind:to="'/kurir-rate'" class="slide-show">Kurir Rate</router-link>
									</el-menu-item> -->
									<el-menu-item index="15-4">
										<router-link v-bind:to="'/order-list'" class="slide-show">Order List</router-link>
									</el-menu-item>
								</el-submenu>
								<el-submenu index="5">
									<template slot="title">
                                        <div class="icon-sidebar" v-html="require('@/assets/images/icons/sidebar/icon-appversion.svg')"></div>
                                        <span>Apps Setting</span>
                                        <div class="caret-custom"></div>
                                    </template>
									<el-menu-item index="5-1">
										<router-link v-bind:to="'/slideshow'" class="slide-show">Slide Show</router-link>
									</el-menu-item>
									<el-menu-item index="5-6">
										<router-link v-bind:to="'/banner-store'" class="slide-show">Banner Store</router-link>
									</el-menu-item>
									<el-menu-item index="5-2">
										<router-link v-bind:to="'/backlink'" class="new-icons">Backlink</router-link>
									</el-menu-item>
									<el-menu-item index="5-3">
										<router-link v-bind:to="'/language'" class="new-icons">Bahasa</router-link>
									</el-menu-item>
									<el-menu-item index="5-4">
										<router-link v-bind:to="'/cs-setting'" class="new-icons">Customer Services</router-link>
									</el-menu-item>
									<el-menu-item index="5-5">
										<router-link v-bind:to="'/tutorial-setting'" class="new-icons">Tutorial</router-link>
									</el-menu-item>
								</el-submenu>
                            </el-menu>
                        </div>
                    </ul>
                </div>
            </div>
            <!-- /main navigation -->
        </div>
    </div>
</template>

<script>
import { faTimes } from '@fortawesome/free-solid-svg-icons'

export default {
    name: 'sidebar-component',
    props: ['roles', 'valuePermissions'],
    data() {
        return {
            versions: process.env.VERSION_DASHBOARD,
            errored: false,
            fontsIcons: {
                close: faTimes
            }
        }
    },
    methods: {
        sidebarClose(){ document.getElementsByClassName('sidebar')[0].classList.remove('showing') }
    }
}
</script>
