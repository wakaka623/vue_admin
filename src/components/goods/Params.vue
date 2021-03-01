<template>
    <div>
        <h3>分类参数</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
         <!-- 卡片视图区域 -->
        <el-card>
            <!-- 警告区域 :closable="false"(是否展示“X”号) show-icon(显示图标) -->
            <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon>
            </el-alert>

            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader expandTrigger='hover' v-model="selectedCateKeys" :options="cateList" :props="cateProps" @change="handleChange" clearable></el-cascader>
                </el-col>
                <el-col></el-col>
            </el-row>
            <!-- tab页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数的面板 将标签页改为many -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button size="mini" type="primary" :disabled="isButtonDisabled" @click="addDialogVisible=true">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染Tag标签 -->
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                                <!-- 输入的文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性的面板 将标签页改为only -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button size="mini" type="primary" :disabled="isButtonDisabled">添加属性</el-button>
                    <!-- 静态属性表格 -->
                        <el-table :data="onlyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染Tag标签 -->
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                                <!-- 输入的文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                        </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数或属性对话框 -->
        <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <!-- 添加表单 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改参数或属性对话框 -->
        <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <!-- 添加表单 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            //分类列表
            cateList:[],
            //用户在级联下拉菜单中选中的分类id
            selectedCateKeys:[],
            //配置级联菜单中数据如何展示
            cateProps:{
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            //tag页签激活显示的页签项
            activeName:'many',
            //保存动态参数数据
            manyTableData:[],
            //保存静态参数数据
            onlyTableData:[],
            //控制添加参数.属性对话框的显示或隐藏
            addDialogVisible:false,
            //添加参数的表单数据对象
            addForm: {
                attr_name: ''
            },
            //添加表单验证规则
            addFormRules: {
                attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
            },
            //控制修改参数.属性对话框的显示或隐藏
            editDialogVisible:false,
            //编辑参数的表单数据对象
            editForm:{
                attr_name:''
            },
            //修改表单的验证规则
            editFormRules:{
                attr_name:[
                { required: true, message: '请输入名称', trigger: 'blur' }
                ]
            }
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        async getCateList(){
            const{data:res}=await this.$http.get('categories')
            if(res.meta.status!==200){
                return this.$message.error('获取分类数据失败！')
            }
            //将数据列表赋值给cateList
            this.cateList=res.data
            // //保存总数据条数
            // this.total = res.data.total
            //   console.log(res.data);
        },
        //获取参数列表
        handleChange(){
            this.getParamsData()
        },
        // tab 页签点击事件的处理函数
        handleTabClick() {
            console.log(this.activeName)
            this.getParamsData()
        },
        async getParamsData(){
             //如果用户选择的不是三级分类
            if(this.selectedCateKeys.length !== 3){
                this.selectedCateKeys = []
                this.manyTableData = []
                this.onlyTableData = []
                return
            }
            console.log(this.selectedCateKeys);
            console.log(this.cateId);
            //发送请求，根据用户选择的三级分类和面板获取参数数据
            const{data:res}=await this.$http.get(
                `categories/${this.cateId}/attributes`,
                {params:{sel:this.activeName}}
            )
            if(res.meta.status!==200){
                return this.$message.error('获取参数列表数据失败！')
            }
            console.log(res.data);
            //将获取到的数据中的attr_vals字符串转换为数组
            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                //添加一个bool值控制文本框的显示或者隐藏
                item.inputVisible = false
                //添加一个inputValue保存文本框值
                item.inputValue = ''
            })
            //获取的是动态参数
            if(this.activeName=='many'){
                this.manyTableData=res.data
                //获取的是静态属性
            }else if(this.activeName=='only'){
                this.onlyTableData=res.data
            }
        },
        // 监听添加对话框的关闭事件
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
        addParams(){
            //当用户点击对话框中的确定时，校验表单
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return
                const{data:res}=await this.$http.post(
                    `categories/${this.cateId}/attributes`,
                    {attr_name:this.addForm.attr_name,attr_sel:this.activeName,attr_vals:"a,b,c"})
                console.log(res);
                if (res.meta.status !== 201) {
                return this.$message.error('添加' + this.titleText + '数据失败')
                }
                this.$message.success('添加' + this.titleText + '数据成功')
                this.addDialogVisible = false
                this.getCateList()
            })
        },
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        async showEditDialog(attr_id){
            // console.log(id);
            // console.log(this.cateId);
            const{data:res}=await this.$http.get(
                `categories/${this.cateId}/attributes/${attr_id}`,
                {params:{ attr_sel:this.activeName }}
            )
            console.log(res);
            if(res.meta.status!==200) return this.$message.error('获取参数数据失败')
            this.editForm=res.data
            this.editDialogVisible=true
        },
        editParams(){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return
                console.log(this.editForm.attr_id);
                const{data:res}=await this.$http.put(
                    `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                    {attr_name:this.editForm.attr_name,attr_sel:this.activeName}
                )
                console.log(res);
                if(res.meta.status!==200) return this.$message.error('更新失败')
                this.$message.success('修改'+this.titleText+'数据成功')
                this.editDialogVisible=false
                this.getParamsData()
            })
        },
        async removeParams(attr_id){
            //根据id删除对应的参数或属性
            //弹窗提示用户是否要删除
             const confirmResult = await this.$confirm(
                '请问是否要删除该'+this.titleText,
                '删除提示',
            {
                confirmButtonText: '确认删除',
                cancelButtonText: '取消',
                type: 'warning'
            }
            ).catch(err => err)
            //如果用户点击确认，则confirmResult 为'confirm'
            //如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
            if (confirmResult != 'confirm') {
                return this.$message.info('取消删除!')
            }
            //没有取消就是要删除，发送请求完成删除
            const{data:res}=await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
            console.log(res);
            if(res.meta.status!==200) return this.$message.error('删除失败，请重新试试吧！')
            this.$message.success(res.meta.msg)
            this.getParamsData()
        },
        //最后对应文本框的事件和按钮的事件添加处理函数
        handleInputConfirm(row){
        //当用户在文本框中按下enter键或者焦点离开时都会触发执行
        //判断用户在文本框中输入的内容是否合法
        if(row.inputValue.trim().length===0){
            row.inputValue = ''
            row.inputVisible = false
            return
        }

        // row.inputVisible = false
        //如果用户输入了真实合法的数据，需要保存起来
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false

        this.saveAttrVals(row)
        },
        showInput(row){
            //用户点击添加按钮时触发
            row.inputVisible = true
            //$nextTick:在页面上元素被重新渲染之后，调用回调函数的代码
            this.$nextTick(_=>{
                //让文本框自动获得焦点
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        handleClose(index,row){
            //删除对应索引的参数可选项
            row.attr_vals.splice(index,1)
            //调用函数，完成保存可选项的操作
            this.saveAttrVals(row)
        },
        async saveAttrVals(row){
            //封装函数，完成保存可选项的操作
            //发起请求，保存参数细项
            const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
            {attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(' ')})

            if (res.meta.status !== 200) {
                return this.$message.error('修改参数项失败')
            }
            this.$message.success('修改参数项成功')
        }

    },
    computed:{
        //添加计算属性用来获取按钮禁用与否
        isButtonDisabled(){
            return this.selectedCateKeys.length!==3
        },
        //获取选中的三级分类id
        cateId(){
            if(this.selectedCateKeys.length===3){
                return this.selectedCateKeys[this.selectedCateKeys.length-1]
            }
            return null
        },
        titleText(){
            if (this.activeName === 'many') {
                return '动态参数'
            }
        return '静态属性'
        }
    }
    
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}

.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 120px;
}

</style>