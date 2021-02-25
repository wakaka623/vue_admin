<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-table :data="rightsList.slice((currentPage-1)*pagesize,currentPage*pagesize)" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="authName" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="路径"></el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.level==='0'">一级</el-tag>
                        <el-tag type="info" v-else-if="scope.row.level==='1'">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 40]" 
            :page-size="pagesize"         
            layout="total, sizes, prev, pager, next, jumper"
            :total="rightsList.length">   
            </el-pagination>    
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            //权限列表
            rightsList:[],
            currentPage:1, //初始页
            pagesize:10,    //每页的数据
        }
    },
    created(){
        //页面创建时获取用户权限列表
        this.getRightsList()
    },
    methods:{
        // 初始页currentPage、初始每页数据数pagesize和数据data
        handleSizeChange: function (size) {
              this.pagesize = size;
              console.log(this.pagesize)//每页下拉显示数据
        },
        handleCurrentChange: function(currentPage){
              this.currentPage = currentPage;
              console.log(this.currentPage)  //点击第几页
        },
        //获取用户权限列表
       async getRightsList(){
           const{data:res}=await this.$http.get('rights/list')
           console.log(res);
           if(res.meta.status!==200) return this.$message.error('列表获取失败了，刷新一下呗')
           this.rightsList=res.data
        }
    }
    
}
</script>

<style lang="less" scoped>

</style>