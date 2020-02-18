<template>
    <div class="content-wrapper">
        <div id="backlink">
            <div class="page-header">
                <page-header titleName="Backlink" :isCreate="true"></page-header>
            </div>
            <div class="content">
                <section>
                    <el-alert v-if="messagesuccess" title="" type="success" :description="messagesuccess" show-icon></el-alert>

                    <el-table
                        :data="itemsData"
                        max-height="530"
                        empty-text="No data available in table"
                        ref="singleTable"
                        v-loading="loading"
                        class="mobayar-table">
                        <el-table-column type="index" label="No" width="50"></el-table-column>
                        <el-table-column prop="title" label="Title" width="170"></el-table-column>
                        <el-table-column label="Link" width="500">
                            <template slot-scope="scope">
                                <a target="_blank" class="id-green" :href="scope.row.url">{{scope.row.url}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="Actions">
                            <template slot-scope="scope">
                                <a style="margin-right: 15px;" @click.prevent="handleCurrentChange(scope.row)"><font-awesome-icon class="fontIcons" :icon="fontsIcons.edit" /></a>
                                <a @click.prevent="deletePost(scope.row.id)"><font-awesome-icon class="fontIcons" :icon="fontsIcons.delete" /></a>
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

                    <!-- Detail, Edit, Create Forms -->
                    <div class="base-template-sidebar">
                        <!-- loading bar -->
                        <div class="el-loading-mask" style="z-index:1000!important;" v-show="(loadingForm == true)">
                            <div class="el-loading-spinner">
                                <svg viewBox="25 25 50 50" class="circular">
                                    <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                                </svg>
                            </div>
                        </div>

                        <div class="content">
                            <header class="clearfix">
                                <h4>{{titleForms}}</h4>
                                <el-button @click="closeModal()"><img :src="require('@/assets/images/icons/big-close.png')"></el-button>
                            </header>
                            <section>
                                <div v-if="(messageerror != '')">
                                    <el-alert title="Error" type="error" :description="messageerror" show-icon></el-alert>
                                </div>
                                <el-form :model="forms" status-icon :rules="rules2" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                    <div class="item-forms-details">
                                        <div class="forms-details">
                                            <el-row :gutter="20">
                                                <el-col :span="24">
                                                    <el-form-item label="Title (Url Name)" prop="urlName">
                                                        <el-input v-model="forms.urlName"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="24">
                                                    <el-form-item label="Content"></el-form-item>
                                                    <summernote class="form-control" name="editor" :model="forms.content" v-on:change="value => { forms.content = value }"></summernote>
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
                            <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                            <el-button v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
                            <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import pageHeader from '@/components/pageHeader'
import loadingSvg from '@/components/loadingSvg'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

export default {
    name: 'backlink',
    data () {
        return {
            url: this.$baseUrl,
            sectionApi: 'backlink',
            itemsData: [],
            itemDataDetail: [],
            searchQuery: '',
            loading: false,
            loadingForm: false,
            page: 1,
            limit: 10,
            totalPage: '',
            dismissSecs: 5,
            dismissCountDown: 0,
            dataModalName: '',
            dataModalSupplier: '',
            afterChecked: true,
            totalChecked: '',
            titleForms: '',
            formsType: '',
            changeStatus: '',
            filterQuery: '',
            messageerror: '',
            messagesuccess: '',
            dataTextCreate: 'Buat Backlink',
            dataTextUpdate: 'Edit Backlink',
            confirmDescDelete: 'Anda yakin akan menghapus data Backlink dari daftar?',
            confirmTitleDelete: 'Hapus Backlink',
            textDataCreateSuccess: 'Data Backlink Berhasil ditambahkan.',
            textDataUpdateSuccess: 'Data Backlink Berhasil diupdate.',
            textDataDeleteSuccess: '1 Items Berhasil dihapus.',
            forms:{
                urlName: '',
                content: '',
            },
            rules2:{
                urlName: [ { required: true, message: 'Inputan harus di isi', trigger: 'blur' } ],
            },
            fontsIcons:{
                edit: faEdit,
                delete: faTrashAlt,
            }
        }
    },
    created () {
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.backlink.get'])
    },
    mounted () {
        this.getPost()
        this.initCreateFunction()
    },
    watch: {
        // always watch this function for change
        searchQuery: function (newQuestion) {
            this.getResult()
        },
    },
    methods: {
        buildUrl() {
            return this.$baseUrl + this.sectionApi + "?limit=" + this.limit + "&page=" + this.page
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
                    this.loadingForm = true
                    const response = await this.$services.getList(url)
                    this.loadingForm = false
                    if(response.status == 200){
                        let dataDetail = response.data
                        this.forms.urlName = dataDetail.title
                        this.forms.content = dataDetail.description
                        $('.testingnotesummer').summernote('code', dataDetail.description)
                        this.loadingForm = false
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
        deletePost(id) {
            this.$confirm(this.confirmDescDelete, this.confirmTitleDelete, {
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                type: "warning"
            }).then(() => {
                let url = this.$baseUrl + this.sectionApi + "/" + id
                this.postFunction("delete", "", url)
            });
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
        handleCurrentChange(val){
            // if(this.$dataRole['.cms.backlink.*.put']){
                if(val){
                    $('.testingnotesummer').summernote('code', '')
                    this.$FUNCTIONS.sidebarToggle(true)
                    this.formsType = 'edit'
                    this.titleForms = "Edit Backlink"
                    this.itemDataDetail = val
                    this.messagesuccess = ''
                    this.messageerror = ''
                    this.loadingForm = true
                    let url = this.$baseUrl + this.sectionApi + '/' + this.itemDataDetail.id
                    this.postFunction('detail', '', url)
                }
            // }else{
            //     this.$notify.error({
            //         title: 'Error',
            //         message: 'Anda tidak punya akses'
            //     });
            // }
        },
        closeModal(row){
            this.$FUNCTIONS.sidebarToggle(false)
            this.$refs.singleTable.setCurrentRow(row)
            this.$refs.formsvalid.resetFields()
            this.messagesuccess = ''
            this.messageerror = ''
            this.forms.urlName = ''
            this.forms.content = ''
            $('.testingnotesummer').summernote('code', '')
        },
        initCreateFunction(){
            let that = this
            setTimeout(function(){
                document.querySelector('.add-click-forms').addEventListener('click', function(){
                    if(that.loading == false){
                        that.titleForms = that.dataTextCreate
                        that.formsType = 'create'
                        that.$FUNCTIONS.sidebarToggle(true)
                        $('.testingnotesummer').summernote('code', '')
                    }else{
                        that.$notify({
                            type: 'warning',
                            title: 'Maaf',
                            message: that.textMemuatData
                        });
                    }
                })
            }, 500)
        },
        submitSave(formName, formtype){
            let loadingform = this.$FUNCTIONS.svgSpinner;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(formtype == 'save'){
                        document.getElementById('save').children[0].innerHTML = loadingform
                        let url = this.$baseUrl + this.sectionApi
                        let dataValue = {
                            title : this.forms.urlName,
                            description : this.forms.content,
                        }
                        this.postFunction('post', dataValue, url)
                    }else{
                        document.getElementById('save-edit').children[0].innerHTML = loadingform
                        let url = this.$baseUrl + this.sectionApi + '/' + this.itemDataDetail.id
                        let dataValue = {
                            title : this.forms.urlName,
                            description : this.forms.content,
                        }
                        this.postFunction('put', dataValue, url)
                    }
                } else {
                    document.getElementById('save').children[0].innerHTML = 'Simpan'
                    document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
                    return false;
                }
            });
        },
    },
    computed: {
        parseInt: function(value){
            return parseInt(value)
        }
    },
    components: {
        'summernote' : require('@/functions/Summernote'),
        pageHeader,
        loadingSvg
    }
}
</script>

<style lang="scss" scoped>
.fontIcons{
    font-size: 16px;
}
</style>
