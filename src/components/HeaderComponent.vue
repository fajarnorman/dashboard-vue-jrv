<template>
    <div id="Header">
        <header>
            <nav class="navbar navbar-dark bg-navbar-header navbar-expand-md">
                <el-menu class="el-menu-demo" default-active="2" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1" class="img-navbar"></el-menu-item>
                    <el-submenu index="6" class="float-right" popper-class="menu-top-dropdown">
                        <template slot="title">
                            <img v-if="dataUser.picture == null" src="@/assets/images/placeholder.jpg" class="user-img">
							<img v-else :src="dataUser.picture" class="user-img">
                            <span>{{dataUser.fullname}}</span>
                            <div class="caret-custom"></div>
                        </template>
						<el-menu-item index="6-1">
                            <a href="#" @click.prevent="profilePage">
                                <font-awesome-icon style="margin-right: 5px;" class="fontIcons" :icon="fontsIcons.key" /> Profile
                            </a>
                        </el-menu-item>
						<el-menu-item index="6-4">
                            <router-link v-bind:to="'/user'">
                                <div class="icon-header-pop new-icons" v-html="require('@/assets/images/icons/sidebar/icon-user.svg')"></div> User
                            </router-link>
                        </el-menu-item>
						<el-menu-item index="6-3">
                            <router-link v-bind:to="'/permission'">
                                <div class="icon-header-pop" v-html="require('@/assets/images/icons/sidebar/icon-permission.svg')"></div> Permission Setting
                            </router-link>
                        </el-menu-item>
                        <el-menu-item index="6-2">
                            <a href="#" @click.prevent="logout" class="logout">
                                <div class="icons" v-html="require('@/assets/images/icons/logout.svg')"></div> Logout
                            </a>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </nav>
        </header>
        <div class="menu-responsive clearfix">
            <div class="logo">
				<img class="img-logo" src="@/assets/images/logo.png">
			</div>
            <a href="#" @click.prevent="sidebarOpen()"><font-awesome-icon class="fontIcons" :icon="fontsIcons.menu" /></a>
        </div>
    </div>
</template>

<script>
import { faBars, faKey } from '@fortawesome/free-solid-svg-icons'

export default {
	name: 'Header',
	props: ['dataUser'],
    data(){
        return {
            // Fonts
            fontsIcons: {
                menu: faBars,
                key: faKey,
            },
        }
    },
    methods: {
		profilePage(){
			this.$router.push({ name: 'profile-page' })
		},
        logout() {
            this.$FUNCTIONS.logout('expired-token', 'Berhasil Logout')
        },
        sidebarOpen(){
            document.getElementsByClassName('sidebar')[0].classList.add('showing')
        },
        handleSelect(key, keyPath) {
			let element = key
			let checkKeyLogout = (key == '6-2') ? this.logout() : ""
			let checkKeyProfilePage = (key == '6-1') ? this.profilePage() : ""
        },
    }
}
</script>
