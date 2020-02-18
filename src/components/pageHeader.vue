<template>
    <div class="page-header-content">
        <div class="page-title clearfix">
            <h4 class="float-left">{{titleName}}</h4>
            <div class="add-actions float-right" v-if="isCreate == true">
                <a class="float-right">
                    <el-button class="button-white-green add-click-forms" round>
                        <i class="icon-plus3"></i> Create
                    </el-button>
                </a>
            </div>
        </div>
    </div>    
</template>

<script>
export default {
    props: ['titleName', 'isCreate'],
}
</script>

<style>

</style>
