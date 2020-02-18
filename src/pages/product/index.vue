<template>
    <div class="content-wrapper">
        <div id="product-list">
            <page-header titleName="Daftar Produk" :isCreate="true"></page-header>
            <div class="content">
                <div class="filterSearching clearfix">
                    <div class="input-with-icons clearfix">
                        <el-input v-model="searchQuery" class="float-left"></el-input>
                        <img :src="require('@/assets/images/icons/search1.png')">
                    </div>
                </div>
                <el-alert
                    v-if="messagesuccess"
                    title=""
                    type="success"
                    :description="messagesuccess"
                    show-icon></el-alert>
                <el-table
                    :data="itemsData"
                    max-height="530"
                    empty-text="No data available in table"
                    ref="singleTable"
                    @current-change="handleCurrentChange"
                    v-loading="loading"
                    class="mobayar-table">
                    <el-table-column label="Nama Produk" prop="name"></el-table-column>
                    <!-- <el-table-column label="Deskripsi" prop="description"></el-table-column> -->
                    <el-table-column label="Harga">
                        <template slot-scope="scope">
                            Rp. {{formatPrice(scope.row.price)}}
                        </template>
                    </el-table-column>
					<el-table-column label="Harga Kredit">
                        <template slot-scope="scope">
                            Rp. {{formatPrice(scope.row.credit_price)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Nama Brand">
                        <template slot-scope="scope">
                            <div v-if="scope.row.brand">
                                {{scope.row.brand.name}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Tipe Produk">
                        <template slot-scope="scope">
                            <div v-if="scope.row.type">
                                {{scope.row.type.name}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Variant">
                        <template slot-scope="scope">
                            <div v-if="scope.row.variants">
                                <span
                                    v-for="(dataVariant, indexVariant) in scope.row.variants"
                                    :key="indexVariant">
                                    {{dataVariant.value}},
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="mobayar-actions-bottom clearfix">
                    <div class="showing-page float-left">
                        <span>View</span>
                        <ul>
                            <li class="active"><a href="#" @click.prevent="limitChange('10', $event)">10</a></li>
                            <li><a href="#" @click.prevent="limitChange('25', $event)">25</a></li>
                            <li><a href="#" @click.prevent="limitChange('50', $event)">50</a></li>
                            <li><a href="#" @click.prevent="limitChange('100', $event)">100</a></li>
                        </ul>
                    </div>
                    <div class="pagination-result float-right">
                        <span>Showing results 1 - {{itemsData.length}} of {{parseInt(totalPage)}}</span>
                        <el-pagination
                            layout="prev, pager, next"
                            :total="parseInt(totalPage)"
                            @current-change="pageChange"
                            :page-size="parseInt(limit)">
                        </el-pagination>
                    </div>
                </div>
                <div class="base-template-sidebar">
                    <loading-svg :isLoading="loadingForm"></loading-svg>
                    <div class="content" v-if="itemDataDetail">
                        <header class="clearfix">
                            <h4>{{titleForms}}</h4>
                            <el-button id="cancel" @click="closeModal()"><img :src="require('@/assets/images/icons/big-close.png')"></el-button>
                        </header>
                        <section>
                            <el-form :model="forms" status-icon :rules="rules" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                <div class="item-forms-details">
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Nama" prop="name">
                                                    <el-input v-model="forms.name"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Harga" prop="price">
                                                    <div class="el-form-item__content custom-price-format">
                                                        <div class="el-input">
                                                            <money v-model="forms.price" v-bind="money" class="el-input__inner"></money>
                                                        </div>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Harga Kredit" prop="credit_price">
                                                    <div class="el-form-item__content custom-price-format">
                                                        <div class="el-input">
                                                            <money v-model="forms.credit_price" v-bind="money" class="el-input__inner"></money>
                                                        </div>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Brand" prop="brand">
                                                    <el-select v-model="forms.brand" :loading="loadingBrand" placeholder="Pilih Brand">
                                                        <el-option
                                                            v-for="itemBrand in itemsDataBrand"
                                                            :key="itemBrand.id"
                                                            :label="itemBrand.name"
                                                            :value="itemBrand.id"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Tipe" prop="type">
                                                    <el-select v-model="forms.type" :loading="loadingType" placeholder="Pilih Tipe">
                                                        <el-option
                                                            v-for="itemType in itemsDataType"
                                                            :key="itemType.id"
                                                            :label="itemType.name"
                                                            :value="itemType.id"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Weight" prop="weight">
													<el-input type="number" v-model="forms.weight">
														<template slot="append">gram</template>
													</el-input>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="24">
												<el-form-item label="Popular" prop="popular">
													<el-radio-group v-model="forms.popular">
														<el-radio :label="1">Ya</el-radio>
														<el-radio :label="0">Tidak</el-radio>
													</el-radio-group>
                                                </el-form-item>
											</el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Deskripsi">
                                                    <el-input
                                                        type="textarea"
                                                        :rows="5"
                                                        v-model="forms.description"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Spesifikasi" style="position: relative;">
                                                    <a href="#"
                                                        @click.prevent="specCount++"
                                                        style="
                                                            position: absolute;
                                                            top: -35px;
                                                            z-index: 10;
                                                            left: 101px;"
                                                        class="add-details">
                                                            <font-awesome-icon class="fontIcons" :icon="fontsIcons.plus" />
                                                        </a>
                                                    <el-row :gutter="10" v-for="(data, index) in specCount" :key="index">
                                                        <el-col :span="10">
                                                            <el-input v-model="keysSpec[index]" placeholder="Key (ie: dynamo)"></el-input>
                                                        </el-col>
                                                        <el-col :span="10">
                                                            <el-input v-model="valuesSpec[index]" placeholder="Value (ie: 5KWH)"></el-input>
                                                        </el-col>
                                                        <el-col :span="2">
                                                            <a href="#" @click.prevent="removeDetails(index, 'spec')" style="margin-left: 10px;" class="close-details"><font-awesome-icon class="fontIcons" :icon="fontsIcons.close" /></a>
                                                        </el-col>
                                                    </el-row>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Varian" style="position: relative;">
                                                    <a href="#"
                                                        @click.prevent="variantCount++"
                                                        style="
                                                            position: absolute;
                                                            top: -35px;
                                                            z-index: 10;
                                                            left: 55px;"
                                                        class="add-details">
                                                            <font-awesome-icon class="fontIcons" :icon="fontsIcons.plus" />
                                                        </a>
                                                    <el-row :gutter="10" v-for="(data, index) in variantCount" :key="index">
                                                        <el-col :span="10">
                                                            <el-select v-model="keysVariant[index]" :loading="loadingVariant" placeholder="Pilih Variant">
                                                                <el-option
                                                                    v-for="itemVariant in itemsDataVariant"
                                                                    :key="itemVariant.id"
                                                                    :label="itemVariant.name"
                                                                    :value="itemVariant.id"></el-option>
                                                            </el-select>
                                                        </el-col>
                                                        <el-col :span="10">
                                                            <el-input v-model="valuesVariant[index]"></el-input>
                                                        </el-col>
                                                        <el-col :span="2">
                                                            <a href="#" @click.prevent="removeDetails(index, 'variant')" style="margin-left: 10px;" class="close-details"><font-awesome-icon class="fontIcons" :icon="fontsIcons.close" /></a>
                                                        </el-col>
                                                    </el-row>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item v-if="formsType == 'edit'" label="Images" class="offline-hub">
                                                    <form ref="fileform" class="fileForm ">
                                                        <div class="custom-upload-images">
                                                            <div class="img-first-step" v-show="(progressFirst == false)">
                                                                <span class="img-upload-tittle"><img :src="require('@/assets/images/icons/image.png')"></span>
                                                                <div class="text" style="margin-top: 5px;"><a href="#" @click.prevent="uploadTrigger">Browse Image</a></div>
                                                                <input id="product-images-change" type="file" accept="image/x-png,image/gif,image/jpeg" @change="handleUpload" class="custom-upload-tag">
                                                            </div>
                                                            <div class="result-upload-img" v-if="formsType == 'create'">
                                                                <div class="file-listing">
                                                                    <div
                                                                        class="images-many"
                                                                        v-for="(dataImages, indexImages) in forms.filesfake"
                                                                        :id="'images-preview-result'+indexImages"
                                                                        :key="indexImages">
                                                                        <img class="preview" :id="'previews'+indexImages" v-bind:ref="'preview'+indexImages"/>
                                                                        <div class="progressbar-content" v-show="(progressShow == true)">
                                                                            <div class="progressbar">
                                                                                <div class="myBar" :id="'myBar'+indexImages"></div>
                                                                            </div>
                                                                        </div>
                                                                        <a href="#" @click.prevent="removeImages(indexImages, '')" class="remove-images"><img :src="require('@/assets/images/icons/big-close.png')"></a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="result-upload-img" v-else>
                                                                <div class="file-listing">
                                                                    <div
                                                                        class="images-many"
                                                                        v-for="(dataImages, indexImages) in forms.filesEdit"
                                                                        :id="'images-preview-result'+indexImages"
                                                                        :key="'edit-'+indexImages">
                                                                        <img class="preview" :id="'edit-previews'+indexImages" :src="dataImages.url"/>
                                                                        <div class="progressbar-content" v-show="(progressShow == true)">
                                                                            <div class="progressbar">
                                                                                <div class="myBar" :id="'myBar'+indexImages"></div>
                                                                            </div>
                                                                        </div>
                                                                        <a href="#" @click.prevent="removeImages(indexImages, dataImages)" class="remove-images removedata"><img :src="require('@/assets/images/icons/big-close.png')"></a>
                                                                    </div>
                                                                    <div
                                                                        class="images-many"
                                                                        v-for="(dataImages, indexImages) in forms.filesfake"
                                                                        :id="'images-preview-result'+indexImages"
                                                                        :key="indexImages">
                                                                        <img class="preview" :id="'previews'+indexImages" :src="dataImages.image" v-bind:ref="'preview'+indexImages"/>
                                                                        <div class="progressbar-content" v-show="(progressShow == true)">
                                                                            <div class="progressbar">
                                                                                <div class="myBar" :id="'myBar'+indexImages"></div>
                                                                            </div>
                                                                        </div>
                                                                        <a href="#" @click.prevent="removeImages(indexImages, '')" class="remove-images"><img :src="require('@/assets/images/icons/big-close.png')"></a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </el-form-item>
												<el-form-item v-else label="Images" class="offline-hub" prop="files">
                                                    <form ref="fileform" class="fileForm ">
                                                        <div class="custom-upload-images">
                                                            <div class="img-first-step" v-show="(progressFirst == false)">
                                                                <span class="img-upload-tittle"><img :src="require('@/assets/images/icons/image.png')"></span>
                                                                <div class="text" style="margin-top: 5px;"><a href="#" @click.prevent="uploadTrigger">Browse Image</a></div>
                                                                <input id="product-images-change" type="file" accept="image/x-png,image/gif,image/jpeg" @change="handleUpload" class="custom-upload-tag">
                                                            </div>
                                                            <div class="result-upload-img" v-if="formsType == 'create'">
                                                                <div class="file-listing">
                                                                    <div
                                                                        class="images-many"
                                                                        v-for="(dataImages, indexImages) in forms.filesfake"
                                                                        :id="'images-preview-result'+indexImages"
                                                                        :key="indexImages">
                                                                        <img class="preview" :id="'previews'+indexImages" v-bind:ref="'preview'+indexImages"/>
                                                                        <div class="progressbar-content" v-show="(progressShow == true)">
                                                                            <div class="progressbar">
                                                                                <div class="myBar" :id="'myBar'+indexImages"></div>
                                                                            </div>
                                                                        </div>
                                                                        <a href="#" @click.prevent="removeImages(indexImages, '')" class="remove-images"><img :src="require('@/assets/images/icons/big-close.png')"></a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="result-upload-img" v-else>
                                                                <div class="file-listing">
                                                                    <div
                                                                        class="images-many"
                                                                        v-for="(dataImages, indexImages) in forms.filesEdit"
                                                                        :id="'images-preview-result'+indexImages"
                                                                        :key="'edit-'+indexImages">
                                                                        <img class="preview" :id="'edit-previews'+indexImages" :src="dataImages.url"/>
                                                                        <div class="progressbar-content" v-show="(progressShow == true)">
                                                                            <div class="progressbar">
                                                                                <div class="myBar" :id="'myBar'+indexImages"></div>
                                                                            </div>
                                                                        </div>
                                                                        <a href="#" @click.prevent="removeImages(indexImages, dataImages)" class="remove-images removedata"><img :src="require('@/assets/images/icons/big-close.png')"></a>
                                                                    </div>
                                                                    <div
                                                                        class="images-many"
                                                                        v-for="(dataImages, indexImages) in forms.filesfake"
                                                                        :id="'images-preview-result'+indexImages"
                                                                        :key="indexImages">
                                                                        <img class="preview" :id="'previews'+indexImages" :src="dataImages.image" v-bind:ref="'preview'+indexImages"/>
                                                                        <div class="progressbar-content" v-show="(progressShow == true)">
                                                                            <div class="progressbar">
                                                                                <div class="myBar" :id="'myBar'+indexImages"></div>
                                                                            </div>
                                                                        </div>
                                                                        <a href="#" @click.prevent="removeImages(indexImages, '')" class="remove-images"><img :src="require('@/assets/images/icons/big-close.png')"></a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost(itemDataDetail.id)">
                            <img :src="require('@/assets/images/icons/trash.png')" alt="img-trash">
                        </el-button>
                        <el-button class="button-outline-black" @click="closeModal()">Batal</el-button>
                        <el-button v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
                        <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import JQuery from 'jquery'
import {Money} from 'v-money'
import pageHeader from '@/components/pageHeader'
import loadingSvg from '@/components/loadingSvg'
import { faTimes, faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons'

export default {
    name: 'product-list',
    components: { pageHeader, loadingSvg, Money },
    data(){
        return{
            sectionApi: "product",
            sectionApiBrand: "brand",
            sectionApiType: "type",
			sectionApiVariant: "variant",
            limit: 10,
            page: 1,
            loading: false,
            loadingForm: false,
            loadingBrand: false,
            loadingType: false,
            loadingVariant: false,
            itemsData: [],
            itemsDataBrand: [],
            itemsDataType: [],
			itemsDataVariant: [],
            itemDataDetail: [],
            totalPage: 0,
			searchQuery: "",
			wareseHouseFilter: "",
            titleForms: "",
            formsType: "",
            messagesuccess: "",
            messageerror: "",
            specCount: 1,
            keysSpec: [],
            valuesSpec: [],
            variantCount: 1,
            keysVariant: [],
            valuesVariant: [],
            warningEditImages: false,
            forms: {
                name: "",
                brand: "",
                type: "",
				price: 0,
				popular: 0,
				weight: 0,
				credit_price: 0,
                description: "",
				files: [],
				filesfake: [],
            	filesEdit: [],
            },
            rules: {
                name: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
                price: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
				brand: [ { required: true, message: "Inputan Harus diisi", trigger: "change" } ],
				popular: [ { required: true, message: "Inputan Harus diisi", trigger: "change" } ],
				weight: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
				type: [ { required: true, message: "Inputan Harus diisi", trigger: "change" } ],
				files: [ { required: true, message: "Inputan Harus diisi", trigger: "change" } ],
                filesEdit: [ { required: true, message: "Inputan Harus diisi", trigger: "change" } ],
            },
            money: {
                decimal: ',',
                thousands: '.',
                prefix: '',
                suffix: '',
                precision: 0,
                masked: false
            },
            fontsIcons: {
                close: faTimes,
                plus: faPlus,
                edit: faPencilAlt
            },
            dataTextCreate: "Buat Produk",
            dataTextUpdate: "Edit Produk",
            confirmDescDelete: "Anda yakin akan menghapus data Produk dari daftar?",
            confirmTitleDelete: "Hapus Produk",
            textDataCreateSuccess: "Data Produk Berhasil ditambahkan.",
            textDataUpdateSuccess: "Data Produk Berhasil diupdate.",
            textDataDeleteSuccess: "1 Items Berhasil dihapus.",
            // images
            progressShow: false,
            doneProgress: false,
            progressFirst: false,
            dragAndDropCapable: false,
            uploadPercentage: 0,
            imageValue: '',
            imageOpen: false,
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.product.get'])
    },
    mounted(){
        this.getPost()
        this.getPostCategories('brand')
        this.getPostCategories('type')
		this.getPostCategories('variant')
        this.initCreateFunction()
    },
    watch: {
        searchQuery: function(){
            this.getResult()
            this.$FUNCTIONS.checkPaginations()
        }
    },
    methods:{
        buildUrl(value){
            if(value == true){
                return this.$baseUrl + this.sectionApi + "?limit=" + this.limit + "&page=" + this.page + "&search=" + this.searchQuery + "&warehouse_id=" + this.wareseHouseFilter
            }else{
                return this.$baseUrl + this.sectionApi
            }
        },
        buildCategoriesUrl(value){
            if(value == 'brand'){
                return this.$baseUrl + this.sectionApiBrand + "?limit=100&page=1"
            }else if(value == 'type'){
                return this.$baseUrl + this.sectionApiType + "?limit=100&page=1"
            }else{
                return this.$baseUrl + this.sectionApiVariant + "?limit=100&page=1"
            }
        },
        async getPostCategories(value){
            if(value == 'brand'){
                try{
                    this.loadingBrand = true
                    const response = await this.$services.getList(this.buildCategoriesUrl(value))
                    this.loadingBrand = false
                    if(response.status == 200){
                        this.itemsDataBrand = response.data.data
                    }else{
                        this.$FUNCTIONS.checkErrorResponse(response.status)
                    }
                }catch(err){
                    this.loadingBrand = false
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }else if(value == 'type'){
                try{
                    this.loadingType = true
                    const response = await this.$services.getList(this.buildCategoriesUrl(value))
                    this.loadingType = false
                    if(response.status == 200){
                        this.itemsDataType = response.data.data
                    }else{
                        this.$FUNCTIONS.checkErrorResponse(response.status)
                    }
                }catch(err){
                    this.loadingType = false
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }else{
                try{
                    this.loadingVariant = true
                    const response = await this.$services.getList(this.buildCategoriesUrl(value))
                    this.loadingVariant = false
                    if(response.status == 200){
                        this.itemsDataVariant = response.data.data
                    }else{
                        this.$FUNCTIONS.checkErrorResponse(response.status)
                    }
                }catch(err){
                    this.loadingVariant = false
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }
        },
        async getPost(){
            try{
                this.loading = true
                const response = await this.$services.getList(this.buildUrl(true))
                this.loading = false
                if(response.status == 200){
                    this.itemsData = response.data.data
                    this.totalPage = response.data.pagination.rowCount
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
        async postFunction(type, credentials, url) {
            if(type == "post"){
                try{
                    const response = await this.$services.postList(url, credentials)
                    document.getElementById("save").children[0].innerHTML = "Simpan"
                    if(response.status == 201) {
                        this.messagesuccess = this.textDataCreateSuccess
                        this.getPost()
                        this.closeModal()
                    }else{
                        this.$FUNCTIONS.notify('error', 'Error', this.$textErrorPost)
                    }
                }catch(err){
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }else if(type == "put"){
                try{
                    const response = await this.$services.putList(url, credentials)
                    document.getElementById("save-edit").children[0].innerHTML = "Simpan"
                    if(response.status == 200) {
                        this.messagesuccess = this.textDataUpdateSuccess
                        this.getPost()
                        this.closeModal()
                    }else{
                        this.$FUNCTIONS.notify('error', 'Error', this.$textErrorPut)
                    }
                }catch(err){
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }else if (type == "delete"){
                try{
                    const response = await this.$services.deleteList(url)
                    if(response.status == 200) {
                        this.messagesuccess = this.textDataDeleteSuccess
                        this.getPost()
                        this.closeModal()
                    }else{
                        this.$FUNCTIONS.notify('error', 'Error', this.$textErrorDelete)
                    }
                }catch(err){
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }else if(type == "detail"){
                try{
                    this.forms.filesEdit = []
                    this.loadingForm = true
                    const response = await this.$services.getList(url)
                    this.loadingForm = false
                    if(response.status == 200){
                        let that = this
                        this.itemDataDetail = response.data
                        this.forms.name = this.itemDataDetail.name
                        this.forms.brand = this.itemDataDetail.brand_id
                        this.forms.type = this.itemDataDetail.type_id
						this.forms.price = this.itemDataDetail.price
						this.forms.credit_price = this.itemDataDetail.credit_price
						this.forms.description = this.itemDataDetail.description
						this.forms.popular = this.itemDataDetail.popular
						this.forms.weight = this.itemDataDetail.weight

                        this.specCount = (this.itemDataDetail.specifications).length
                        this.itemDataDetail.specifications.forEach(function(e, i){
                            this.keysSpec[i] = e.key
                            this.valuesSpec[i] = e.value
                        }, this)

                        this.variantCount = (this.itemDataDetail.variants).length
                        this.itemDataDetail.variants.forEach(function(e, i){
                            this.keysVariant[i] = e.variant_id
                            this.valuesVariant[i] = e.value
                        }, this)

                        if(this.itemDataDetail.images !== null){
                            this.itemDataDetail.images.forEach(function(e){
                                that.forms.filesEdit.push(e)
                            }, this)
                        }
                    }else if(response.status == 400){
                        this.$FUNCTIONS.logout("expired-token", this.$textTokenExpired)
                    }else{
                        this.$FUNCTIONS.notify("error", "Error", this.$textNodata)
                    }
                }catch(err){
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }
        },
        getResult: _.debounce(function(){
            this.getPost()
        }, 500),
        deletePost(id) {
            this.$confirm(this.confirmDescDelete, this.confirmTitleDelete, {
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                type: "warning"
            }).then(() => {
                let url = this.buildUrl(false) + "/" + id
                this.postFunction("delete", "", url)
            });
        },
        handleCurrentChange(val) {
            if (val) {
                // if(this.$dataRole['.cms.product.*.get']){
                    this.titleForms = this.dataTextUpdate
                    this.formsType = "edit"
                    let url = this.buildUrl(false) + "/" + val.id
                    this.postFunction("detail", "", url)
                    this.$FUNCTIONS.sidebarToggle(true)
                // }else{
                //     this.$FUNCTIONS.notify('Error', 'error', 'Akses ditolak')
                // }
            }
        },
        submitSave(formName, formtype) {
            let loadingform = this.$FUNCTIONS.svgSpinner
            this.messagesuccess = ""
            this.messageerror = ""

            let dataSpec = []
            let dataSpecValue
            let dataVariant = []
            let dataVariantValue
            for(var i = 0; i < this.specCount; i++){
                dataSpecValue = { key: this.keysSpec[i], value: this.valuesSpec[i] }
                dataSpec.push(dataSpecValue)
            }
            for(var j = 0; j < this.variantCount; j++){
                dataVariantValue = { variant_id: this.keysVariant[j], value: this.valuesVariant[j] }
                dataVariant.push(dataVariantValue)
            }

            const formData = new FormData()
            formData.append('brand_id', this.forms.brand)
            formData.append('type_id', this.forms.type)
            formData.append('name', this.forms.name)
            formData.append('description', this.forms.description)
			formData.append('price', this.forms.price)
			formData.append('credit_price', this.forms.credit_price)
            formData.append('specifications', JSON.stringify(dataSpec))
			formData.append('variants', JSON.stringify(dataVariant))
			formData.append('popular', this.forms.popular)
			formData.append('weight', this.forms.weight)


            this.forms.files.forEach(function(e, i){
                formData.append('images', e)
            })

            this.$refs[formName].validate(valid => {
                if (valid) {
                    if(formtype == "save") {
                        document.getElementById("save").children[0].innerHTML = loadingform
                        this.postFunction("post", formData, this.buildUrl(false))
                    }else{
                        document.getElementById("save-edit").children[0].innerHTML = loadingform
                        let urlv = this.buildUrl(false) + "/" + this.itemDataDetail.id
                        this.postFunction("put", formData, urlv)
                    }
                }
            })
        },
        initCreateFunction() {
            let that = this
            setTimeout(function() {
                document.querySelector(".add-click-forms").addEventListener("click", function() {
                    if(that.loading == false){
                        that.titleForms = that.dataTextCreate
                        that.formsType = "create"
                        that.$FUNCTIONS.sidebarToggle(true)
                    }else{
                        that.$FUNCTIONS.notify('warning', 'Maaf', that.$textMemuatData)
                    }
                })
            }, 500)
        },
        closeModal(row) {
            this.$FUNCTIONS.sidebarToggle(false)
            this.$refs.singleTable.setCurrentRow(row)
            // this.$refs.formsvalid.resetFields()
            this.itemDataDetail = []
            this.forms.name = ""
            this.forms.brand = ""
            this.forms.type = ""
            this.forms.price = 0
			this.forms.description = ""
			this.forms.credit_price = 0
			this.forms.popular = 0
			this.forms.weight = 0
            this.forms.files = []
            this.specCount = 1
            this.keysSpec = []
            this.valuesSpec = []
            this.variantCount = 1
            this.keysVariant = []
            this.valuesVariant = []
            this.forms.filesfake = []
            this.forms.filesEdit = []
			this.warningEditImages = false
        },
        formatPrice(val){
            return this.$FUNCTIONS.formatPrice(val)
        },
        limitChange(limit){
            this.limit = limit
            this.$FUNCTIONS.checkPaginations()
            this.getPost()
            this.$FUNCTIONS.viewActive()
        },
        pageChange(page){
            this.page = page
            this.getPost()
        },
        removeDetails(index, type){
            if(type == 'spec'){
                this.keysSpec.splice(index, 1)
                this.valuesSpec.splice(index, 1)
                this.specCount--
            }else{
                this.keysVariant.splice(index, 1)
                this.valuesVariant.splice(index, 1)
                this.variantCount--
            }
        },

        // images functions
        uploadTrigger(){
            if(document.querySelector('.custom-upload-tag').length != 0){
                document.querySelector('.custom-upload-tag').click('click')
            }
        },
        handleUpload(event){
            if((event.target.files).length !== 0){
                // if(this.formsType !== "create"){
                //     this.forms.filesEdit = []
                // }
                this.forms.files.push(event.target.files[0])
                this.forms.filesfake.push(event.target.files[0])
                this.move()
            }
        },
        getImagePreviews(){
            let that = this
            this.forms.filesfake.forEach(function(value, index){
                let reader = new FileReader()
                reader.addEventListener("load", function(){
                    setTimeout(function(){
                        JQuery('#previews'+index).attr('src', reader.result)
                    }, 300)
                });
                reader.readAsDataURL( value )
            })
        },
        formatBytes(bytes,decimals) {
            if(bytes == 0) return '0 Bytes';
            var k = 1024,
                dm = decimals || 2,
                sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        },
        move() {
            let that = this
            this.progressShow = true
            this.doneProgress = false
            this.forms.files.forEach(function(value, index){
                setTimeout(function(){
                    let elem = JQuery(".myBar");
                    let width = 1;
                    let id = setInterval(frame, 10);
                    function frame() {
                        if (width >= 100) {
                            clearInterval(id);
                            that.getImagePreviews()
                            that.progressShow = false
                            that.doneProgress = true
                        } else {
                            width++;
                            elem.css('width', width + '%')
                        }
                    }
                }, 200)
            })
        },
        dragInit(){
            this.dragAndDropCapable = this.determineDragAndDropCapable();
            if( this.dragAndDropCapable ){
                ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach( function( evt ) {
                    this.$refs.fileform.addEventListener(evt, function(e){
                        if(evt == 'dragenter'){
                            document.querySelector('.fileForm').classList.add("dragging");
                        }
                        if(evt == 'drop'){
                            document.querySelector('.fileForm').classList.remove("dragging");
                        }
                        e.preventDefault();
                        e.stopPropagation();
                    }.bind(this), false);
                }.bind(this));

                this.$refs.fileform.addEventListener('drop', function(e){
                    let dataImagesDrop = e.dataTransfer.files
                    for(var i = 0; i<dataImagesDrop.length;i++){
                        this.forms.files.push(e.dataTransfer.files[i])
                        this.forms.filesfake.push(e.dataTransfer.files[i])
                        if((i+1) === dataImagesDrop.length){
                            this.move()
                        }
                    }
                }.bind(this));
            }
        },
        determineDragAndDropCapable(){
            var div = document.createElement('div');
            return ( ( 'draggable' in div )
                    || ( 'ondragstart' in div && 'ondrop' in div ) )
                    && 'FormData' in window
                    && 'FileReader' in window;
        },
        removeImages(index, value){
            let that = this
            document.getElementById("product-images-change").value = "";
            if(value == ''){
                this.forms.filesfake.splice(index, 1)
                this.forms.files.splice(index, 1)
                this.getImagePreviews()
            }else{
                this.$confirm('Apakah anda yakin ingin menghapus images?', 'Hapus Images', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    let url = this.buildUrl(false) + "/" + value.id + "/image"
                    this.axios.delete(url).then(response => {
                        this.forms.filesEdit.splice(index, 1)
                        this.getImagePreviews()
                    })
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.images-select{
    display:inline-block;
    vertical-align: middle;
    max-height: 30px;
    margin-right:5px;
    max-width: 30px;
    width: 100%;
    height: auto;
}
.offline-hub{
    .result-upload-img{
        border-top: 1px solid #eee;
        margin-top: 3em;
    }
    .file-listing{
        text-align: left;
        padding: 15px;
    }
    .progressbar-content{
        margin-top: 0 !important;
        display: inline-block;
        width: 100%;
        height: 100%;
        margin-right: 10px;
        margin-bottom: 10px;
        vertical-align: top;
        position: absolute;
        top: 0;
        left: 0;
        border: 1px solid #eee;
        border-radius: 4px;
        background:#fafafa;
        .progressbar{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
    .images-many{
        display: inline-block;
        width: 15%;
        vertical-align: top;
        margin-right: 10px;
        margin-bottom: 10px;
        position: relative;
        .remove-images{
            position: absolute;
            top: -5px;
            right: -5px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        &:last-child{
            margin-right: 0;
        }
        img{
            max-width: 100% !important;
            max-height: 100% !important;
            margin-top: 0 !important;
            width: 91px;
            height: 91px;
            object-fit: cover;
        }
        span{
            margin-top: 5px;
            font-size: 12px !important;
        }
    }
}
</style>
