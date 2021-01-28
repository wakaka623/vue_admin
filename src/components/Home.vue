<template>
    <div>
        <el-button @click="exit">退出</el-button>
    </div>
</template>

<script>
export default {
    methods:{
        exit(){
            window.sessionStorage.clear
            this.$router.push('/login')
        }
    }
    
}
</script>

<style lang="less" scoped>

</style>