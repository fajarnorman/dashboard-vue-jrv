<template>
    <div class="content-wrapper">
        <div id="claim-detail">
            <div class="page-header">
                <div class="page-header-content clearfix">
                    <router-link v-bind:to="'/claim'" class="back-button">
                        <i class="icon icon-caret-left"></i> Back to List
                    </router-link>
                    <div class="page-title clearfix">
                        <h4 class="float-left">Detail Register Garansi</h4>
                        <div class="float-right status-claim-waranty">
                            <span class="badge inline success" v-if="itemsData.status == 'accept'">{{itemsData.status}}</span>
                            <span class="badge inline failed" v-else-if="itemsData.status == 'reject'">{{itemsData.status}}</span>
                            <span class="badge inline pending" v-else-if="itemsData.status == 'pending'">{{itemsData.status}}</span>
                            <span v-else>-</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content">
                <el-row :gutter="20" style="position:relative;">
                    <loading-svg :isLoading="loading"></loading-svg>
                    <el-col :span="9">
                        <div class="mutasi-point general-info box-info-detail">
                            <h4>Info Pelanggan</h4>
                            <el-row :gutter="20">
                                <el-col :span="12" :xs="24" class="item-general-info">
                                    <h5>Nama</h5>
                                    {{itemsData.fullname}}
                                </el-col>
                                <el-col :span="12" :xs="24" class="item-general-info">
                                    <h5>Phone</h5>
                                    {{itemsData.phone}}
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                    <el-col :span="15">
                        <div class="mutasi-point general-info box-info-detail">
                            <h4>Info Item</h4>
                            <el-row :gutter="20">
                                <el-col :span="5" :xs="24" class="item-general-info">
                                    <h5>Nama Item</h5>
                                    <div v-if="itemsData.item">
                                        {{itemsData.item.name}}
                                    </div>
                                    <div v-else>-</div>
                                </el-col>
                                <el-col :span="5" :xs="24" class="item-general-info">
                                    <h5>No. Rangka</h5>
                                    <div v-if="itemsData.item">
                                        {{itemsData.item.chassis_number}}
                                    </div>
                                    <div v-else>-</div>
                                </el-col>
                                <el-col :span="5" :xs="24" class="item-general-info">
                                    <h5>No. Mesin</h5>
                                    <div v-if="itemsData.item">
                                        {{itemsData.item.machine_number}}
                                    </div>
                                    <div v-else>-</div>
                                </el-col>
                                <el-col v-if="itemsData.item" :span="5" :xs="24" class="item-general-info">
                                    <h5>Nama Produk</h5>
                                    <div v-if="itemsData.item.product">{{itemsData.item.product.name}}</div>
                                </el-col>
                                <!-- <el-col v-if="itemsData.item" :span="5" :xs="24" class="item-general-info">
                                    <h5>Harga</h5>
                                    <div v-if="itemsData.item.product">Rp. {{formatPrice(itemsData.item.product.price)}}</div>
                                </el-col> -->
                            </el-row>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20" style="position: relative;">
                    <loading-svg :isLoading="loading"></loading-svg>
                    <el-col :span="9" :xs="24" v-if="itemsData.status == 'reject' || itemsData.status == 'pending' || itemsData.status == null">
                        <div class="bg-white file-infos">
                            <h4>File Info</h4>
                            <el-form ref="forms-upgradeGambar" class="forms-upgradeGambar" label-width="120px">
                                <el-row :gutter="20">
                                    <el-col :span="24" :xs="24">
                                        <div>
                                            <a @click.prevent="openImage(itemsData.invoice_pic_url, 'Foto Invoice/Struk Pembelian')" :href="itemsData.invoice_pic_url" class="photo-thumb">
                                                <img :src="itemsData.invoice_pic_url">
                                                <div class="bottom-field">Foto Invoice/Struk Pembelian</div>
                                            </a>
                                        </div>
                                    </el-col>
									<el-col :span="24" :xs="24">
                                        <div>
                                            <a @click.prevent="openImage(itemsData.warranty_card_pic_url, 'Foto Kartu Garansi')" :href="itemsData.warranty_card_pic_url" class="photo-thumb">
                                                <img :src="itemsData.warranty_card_pic_url">
                                                <div class="bottom-field">Foto Kartu Garansi</div>
                                            </a>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                    </el-col>
                    <el-col :span="24" :xs="24" v-else>
                        <div class="bg-white file-infos">
                            <h4>File Info</h4>
                            <el-form ref="forms-upgradeGambar" class="forms-upgradeGambar" label-width="120px">
                                <el-row :gutter="20">
									<el-col :span="12" :xs="24">
                                        <div>
                                            <a @click.prevent="openImage(itemsData.invoice_pic_url)" :href="itemsData.invoice_pic_url" class="photo-thumb">
                                                <img :src="itemsData.invoice_pic_url">
                                                <div class="bottom-field">Foto Invoice/Struk Pembelian</div>
                                            </a>
                                        </div>
                                    </el-col>
                                    <el-col :span="12" :xs="24">
                                        <div>
                                            <a @click.prevent="openImage(itemsData.warranty_card_pic_url)" :href="itemsData.warranty_card_pic_url" class="photo-thumb">
                                                <img :src="itemsData.warranty_card_pic_url">
                                                <div class="bottom-field">Foto Kartu Garansi</div>
                                            </a>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                    </el-col>
                    <el-col :span="15" :xs="24" class="items-head-forms" v-if="itemsData.status == 'reject' || itemsData.status == 'pending'">
                        <div class="items-head-agent">
                            <div class="items-head clearfix">
                                <div class="cards">
                                    <h4 class="title">Verification Info</h4>
                                    <el-alert
                                        v-if="messagaerror"
                                        title="Error"
                                        type="error"
                                        :description="messagaerror"
                                        @close="messagaerror = ''"
                                        show-icon></el-alert>
                                    <div v-if="itemsData.status == 'reject'">
                                        <el-form
                                            ref="forms-upgradeInfoReject"
                                            class="forms-upgradeInfo forms-details"
                                            label-width="120px"
                                            :model="forms"
                                            status-icon>
                                            <el-form-item label="Alasan di Tolak">
                                                <div class="lineHeightNormal">{{itemsData.reason}}</div>
                                            </el-form-item>
                                        </el-form>
                                    </div>
                                    <div v-else-if="itemsData.status == 'accept'">
                                        <el-form
                                            ref="forms-upgradeInfoAccept"
                                            class="forms-upgradeInfo forms-details"
                                            label-width="120px"
                                            :model="forms"
                                            status-icon>
                                            <el-row :gutter="20" class="info-upgrade-akun">
                                                <el-col :span="12">
                                                    <el-form-item label="Name">
                                                        <div class="lineHeightNormal">{{itemsData.fullname}}</div>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="Phone">
                                                        <div class="lineHeightNormal">{{itemsData.phone}}</div>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form>
                                    </div>
                                    <div v-if="itemsData.status == 'pending'" class="status-change clearfix">
                                        <div class="forms-upgradeInfo" v-if="forms.status == ''">
                                            <div class="actions-buttons">
                                                <el-button @click.prevent="claim('reject')" id="reject" class="button-outline-red" round>Reject</el-button>
                                                <el-button @click.prevent="claim('accept')" id="accept" class="button-white-green" round>Accept</el-button>
                                            </div>
                                        </div>
                                        <el-form
                                            ref="forms-upgradeInfoReject"
                                            class="forms-upgradeInfo forms-details"
                                            label-width="120px"
                                            :model="forms"
                                            status-icon
                                            :rules="rules"
                                            v-if="forms.status == 'reject'">
                                            <el-form-item label="Reason" prop="reason">
                                                <el-input type="textarea" rows="5" v-model="forms.reason"></el-input>
                                            </el-form-item>
                                            <div class="actions-buttons float-right">
                                                <el-button @click.prevent="claim('')" class="button-outline-green" round>Cancel</el-button>
                                                <el-button @click.prevent="submitClaimWarranty('forms-upgradeInfoReject')" id="submit-reject" class="button-white-green" round>
                                                    <font-awesome-icon class="fontIcons" :icon="fontsIcons.check" v-if="loadingButtonReject == false" />
                                                    <div v-html="loadingButtonHTML" v-if="loadingButtonReject == true" class="loading"></div> <span>Submit</span>
                                                </el-button>
                                            </div>
                                        </el-form>
                                        <el-form
                                            ref="forms-upgradeInfo"
                                            class="forms-upgradeInfo forms-details"
                                            label-width="120px"
                                            :model="forms"
                                            status-icon
                                            :rules="rules"
                                            v-else-if="forms.status == 'accept'">
                                            <div class="actions-buttons">
                                                <el-button @click.prevent="claim('')" class="button-outline-green" round>Cancel</el-button>
                                                <el-button @click.prevent="submitClaimWarranty('forms-upgradeInfo')" id="submit" class="button-white-green" round>
                                                    <font-awesome-icon class="fontIcons" :icon="fontsIcons.check" v-if="loadingButtonAccept == false" />
                                                    <div v-html="loadingButtonHTML" v-if="loadingButtonAccept == true" class="loading"></div> <span>Submit</span>
                                                </el-button>
                                            </div>
                                            <el-row :gutter="20" class="info-upgrade-akun">
                                                <el-col :span="12">
                                                    <el-form-item label="Name">
                                                        <el-input v-model="forms.fullname"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="Phone">
                                                        <el-input v-model="forms.phone"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="24">
                                                    <el-form-item label="Address">
                                                        <el-input v-model="forms.address" type="textarea" :rows="5"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <!-- <el-col :span="24">
                                                    <el-form-item label="Identity Type">
                                                        <el-select v-model="forms.identityType">
                                                            <el-option value="ktp">KTP</el-option>
                                                            <el-option value="sim">SIM</el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="Identity Number">
                                                        <el-input v-model="forms.identityNumber"></el-input>
                                                    </el-form-item>
                                                </el-col> -->
                                                <el-col :span="24">
                                                    <el-form-item label="Type">
                                                        <el-input v-model="forms.type"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="Tanggal Beli">
                                                        <el-date-picker @change="changePurchaseDate" type="date" :format="format" :value-format="format" v-model="forms.purchase_date"></el-date-picker>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="Garansi Expired">
                                                        <el-date-picker type="date" :format="format" :value-format="format" v-model="forms.warranty_expired_date"></el-date-picker>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <el-dialog title=""
                class="imageOpenModal"
                top="5vh"
                :visible.sync="imageOpen"
				width="90%">
                <div class="img-container" style="height: 700px;">
                    <img :src="imageValue" class="img-center images-must-rotate">
                </div>
                <div class="bottom-actions-modal">
                    <el-button class="button-white-green button-rotate" @click.prevent="rotateImages" round>
                        Rotate
                        <font-awesome-icon class="fontIcons" :icon="fontsIcons.rotate"/>
                    </el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import JQuery from 'jquery'
import {
    faCheck,
    faTimes,
    faSync,
    faInfoCircle
} from '@fortawesome/free-solid-svg-icons'
import loadingSvg from '@/components/loadingSvg'

export default {
    name: 'claim-detail',
    components: { loadingSvg },
    data() {
        return{
            sectionApi: 'claim',
            loading: false,
            itemsData: [],
            getId: this.$route.params.id,
            imageValue: '',
            imageOpen: false,
            loadingButtonHTML: this.$FUNCTIONS.svgSpinner,
            loadingButtonAccept: false,
            loadingButtonReject: false,
            messagaerror: "",
            format: "yyyy-MM-dd",
            forms:{
                status: "",
                reason: "",
                fullname: "",
                address: "",
                phone: "",
                type: "",
                purchase_date: "",
                warranty_expired_date: "",
            },
            rules:{},
            fontsIcons:{
                check: faCheck,
                close: faTimes,
                rotate: faSync,
                info: faInfoCircle
			},
			rotateNumber: 0,
			titleModelImages: "",
        }
    },
    mounted(){
        this.getPost()
	},
	watch: {
		imageOpen(newValue) {
			if(newValue == false){
				let that = this
				setTimeout(function(){
					that.rotateNumber = 0
					JQuery('.images-must-rotate').css('transform', 'rotate(0deg)')
				}, 500)
			}
		},
	},
    methods:{
        buildUrl(){
            return this.$baseUrl + this.sectionApi + '/' + this.getId
        },
        async getPost(){
            try{
                this.loading = true
                const response = await this.$services.getList(this.buildUrl())
                this.loading = false
                if(response.status == 200){
                    this.itemsData = response.data
                    this.forms.fullname = this.itemsData.fullname
                    this.forms.address = this.itemsData.address
                    this.forms.phone = this.itemsData.phone
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
        },
        async postFunction(credentials, url) {
            try{
                const response = await this.$services.putList(url, credentials)
                if(response.status == 200) {
                    this.$router.push({ name: 'claim' })
                }else{
                    this.loadingButtonAccept = false
                    this.loadingButtonReject = false
                    this.$FUNCTIONS.notify('error', 'Error', this.$textErrorPut)
                }
            }catch(err){
                this.loadingButtonAccept = false
                this.loadingButtonReject = false
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
        },
        claim(value){
            this.messagaerror = ""
            this.forms.status = value
        },
        openImage(value, title){
            this.imageValue = value
			this.imageOpen = true
			this.titleModelImages = title

			// setTimeout(function(){
			// 	var someImg = JQuery(".images-must-rotate")
			// 	if (someImg.width() > someImg.height()){
			// 		//it's a landscape
			// 		console.log('landscape')
			// 	} else if (someImg.width() < someImg.height()){
			// 		//it's a portrait
			// 		console.log('portrait')
			// 	} else {
			// 		//image width and height are equal, therefore it is square.
			// 		console.log('square')
			// 	}
			// }, 500)
        },
        formatPrice(val){
            return this.$FUNCTIONS.formatPrice(val)
        },
        acceptWarranty(){
            this.messagaerror = ""
            let messageCount = []
            let validationFullname = (this.forms.fullname == '') ? messageCount.push('Fullname tidak boleh kosong') : ""
            let validationPhone = (this.forms.phone == '') ? messageCount.push('Phone tidak boleh kosong') : ""
            let validationAddress = (this.forms.address == '') ? messageCount.push('Alamat tidak boleh kosong') : ""
            let validationPurchaseDate = (this.forms.purchase_date == '') ? messageCount.push('Tanggal beli tidak boleh kosong') : ""
            let validationWarrantyExpired = (this.forms.warranty_expired_date == '') ? messageCount.push('Tanggal garansi expired tidak boleh kosong') : ""

            let datePurchage = new Date(this.forms.purchase_date)
            datePurchage.setHours(0,0,0,0)
            let dateWarranty = new Date(this.forms.warranty_expired_date)
            dateWarranty.setHours(0,0,0,0)
            let validationDate = (datePurchage > dateWarranty) ? messageCount.push('Tanggal beli tidak boleh lebih dari tanggal garansi') : ""

            if(messageCount.length == 0){
                this.$confirm('Saat anda klik OK, maka klaim garansi ini akan disetujui.', 'Apakah anda yakin?', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.loadingButtonAccept = true
                    let url = this.buildUrl() + "/accept"
                    let dataValue = {
                        fullname: this.forms.fullname,
                        address: this.forms.address,
                        phone: this.forms.phone,
                        type: this.forms.type,
                        purchase_date: this.forms.purchase_date,
                        warranty_expired_date: this.forms.warranty_expired_date,
                    }
                    this.postFunction(dataValue, url)
                })
            }else{
                this.messagaerror = messageCount.join('\r\n')
            }
        },
        rejectWarranty(){
            this.messagaerror = ""
            let messageCount = []
            let validationReject = (this.forms.reason == '') ? messageCount.push('Reason tidak boleh kosong') : ""

            if(messageCount.length == 0){
                this.$confirm('Saat anda klik OK, maka klaim garansi ini akan ditolak.', 'Apakah anda yakin?', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.loadingButtonReject = true
                    let url = this.buildUrl() + "/reject"
                    let dataValue = { reason: this.forms.reason }
                    this.postFunction(dataValue, url)
                })
            }else{
                this.messagaerror = messageCount.join('\r\n')
            }
        },
        submitClaimWarranty(formName){
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if(this.forms.status == "accept") {
                        this.acceptWarranty()
                    }else{
                        this.rejectWarranty()
                    }
                }
            })
		},
		changePurchaseDate(val){
			let date = new Date(val)
			date.setMonth(date.getMonth()+12)
			date.setDate(date.getDate()-1)
			let newDate = this.$FUNCTIONS.formatDate(date)
			this.forms.warranty_expired_date = newDate
		},
		rotateImages(){
			this.rotateNumber += 90
			JQuery('.images-must-rotate').css('transform', 'rotate('+this.rotateNumber+'deg)')
		}
    }
}
</script>
<style lang="scss">
.status-claim-waranty{
    margin-top: 11px;
}
.box-info-detail{
    background: #fff;
    position: relative;
    border: none;
    box-shadow: 0px 1px 3px #DFE4E8;
    h4{
        color: #39434e;
        margin:20px 10px 5px;
    }
}
.bg-white{
    background: #fff;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0px 1px 3px #DFE4E8;
}
.forms-upgradeGambar{
    margin-top: 20px;
    .photo-thumb{
        display: block;
        box-shadow: 0px 1px 3px #DFE4E8;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 20px;
        img{
            width: 100%;
            max-width: 100%;
            height: 270px;
            max-height: 270px;
            object-fit: cover;
        }
        .bottom-field{
            background: #fff;
            text-align: center;
            padding: 5px;
            font-size: 13px;
            color: #697586;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
        }
    }
    .el-form-item{
        margin-bottom: 20px;
        &:last-child{
            margin-bottom: 0;
        }
        .el-form-item__label{
            font-weight: 700;
            display: block;
            width: 100% !important;
        }
        .el-form-item__content{
            line-height: normal;
            display: block;
            width: auto !important;
            img{
                max-width: 100%;
            }
        }
    }
}
.items-head-forms{
    &.left-actions{
        .cards{
            min-height: 120vh;
        }
    }
}
.items-head-agent{
    box-shadow: 0px 1px 3px #DFE4E8;
    border-radius: 5px;
    .items-head{
        margin-bottom: 0;
        .title{
            margin-top: 0;
            padding-bottom: 15px !important;
            margin-bottom: 15px !important;
        }
    }
    .cards{
        padding: 20px;
        border: none;
    }
}
.forms-upgradeInfo{
    .actions-buttons{
        position: absolute;
        top: 15px;
        right: 30px;
    }
    .border-bottom{
        border-top: 1px solid #ddd;
        padding-top: 10px;
        margin-top: 10px;
    }
    button{
        span{
            position: relative;
            top: -1px;
            .loading{
                display: inline-block;
                vertical-align: middle;
                position: relative;
                left: -5px;
                & ~ span{
                    display: inline-block;
                    vertical-align: middle;
                    top: 0;
                }
            }
        }
        &#accept, &#submit, &#submit-reject, &#submit-edit{
            .fontIcons{
                color: #fff;
                & ~ span{
                    display: inline-block;
                    vertical-align: middle;
                    top: 0;
                }
            }
        }
        &#reject{
            .fontIcons{
                color: #DC1818;
            }
            .loading{
                .lds-ring{
                    div{
                        border-color: #DC1818 transparent transparent transparent;
                    }
                }
            }
        }
    }
}
</style>
