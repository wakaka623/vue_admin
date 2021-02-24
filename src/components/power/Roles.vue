<template>
    <div>
         <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- row-key="id" 是2019年3月提供的新特性，
                if there's nested data, rowKey is required.
                如果这是一个嵌套的数据，rowkey 是必须添加的属性 -->
            <el-table  :data="rolelist" border>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- 渲染一级权限 -->
                        <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和渲染三级权限 -->
                            <el-col :span="19">
                                <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag  type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                    </el-col>
                                    
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)" >编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 对话框组件  :visible.sync(设置是否显示对话框) width(设置对话框的宽度)
        :before-close(在对话框关闭前触发的事件) -->
        <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <!-- 对话框主体区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <!-- 对话框主体区域 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data(){
        return{
            rolelist:[],
            addDialogVisible:false,//是否显示添加角色弹出窗
            editDialogVisible:false,//是否显示编辑角色弹出窗
            addForm:{
                roleName:'',
                roleDesc:''
            },
            editForm:{
                roleName:'',
                roleDesc:''
            },
            //添加表单的验证规则
            addFormRules:{
                roleName:[
                    {required: true, message: '请输入用户名称', trigger: 'blur' },
                    {min:3,max:10,message:'角色名称在3~10个字符之间',trigger:'blur'}
                ],
                roleDesc:[
                    {min:3,max:30,message:'角色描述在3~10个字符之间',trigger:'blur'}
                ]
            },
            editFormRules:{
                roleName:[
                    {required: true, message: '请输入用户名称', trigger: 'blur' },
                    {min:3,max:10,message:'角色名称在3~10个字符之间',trigger:'blur'}
                ],
                roleDesc:[
                    {min:3,max:30,message:'角色描述在3~10个字符之间',trigger:'blur'}
                ]
            }
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
        async getRolesList(){
            const{data:res}=await this.$http.get('roles')
            console.log(res);
            if(res.meta.status!==200) return this.$message.error('获取失败！请刷新！')
            this.rolelist=res.data
        },
        addDialogClosed(){
            //对话框关闭之后，重置表达
            this.$refs.addFormRef.resetFields();
        },
        editDialogClosed(){
              //对话框关闭之后，重置表达
            this.$refs.editFormRef.resetFields();
        },
        addUser(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return
                const{data:res}=await this.$http.post('roles',this.addForm)
                console.log(res);
                if(res.meta.status!==201) return this.$message.error(res.meta.msg)
                this.$message.success(res.meta.msg)
                this.addDialogVisible=false
                this.getRolesList()
            })

        },
        async showEditDialog(id){
            console.log(id);
            const{data:res}=await this.$http.get('roles'+id)
            console.log(res);
        },
        editUser(){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return
                const{data:res}=await this.$http.put(
                    'roles/'+this.editForm.id,
                    this.editForm
                )
                console.log(res);
            })

        },
        async removeRightById(role,reghtId){
            //弹窗提示用户是否要删除
            const confirmResult=await this.$confirm(
                '此操作将永久删除该文件, 是否继续?',
                '提示',
                {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }
            ).catch(err=>err)
             //如果用户点击确认，则confirmResult 为'confirm'
            //如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
            if(confirmResult!=='confirm'){
                return this.$message.info('取消删除')
            }
            //用户点击了确定表示真的要删除
            //当发送delete请求之后，返回的数据就是最新的角色权限信息
            const {data:res}=await this.$http.delete(
                `roles/${role.id}/rights/${reghtId}`
            )
            console.log(res);
            if(res.meta.status!==200) return this.$message.error('删除失败')
            this.$message.success(res.meta.msg)
            //无需再重新加载所有权限
            //只需要对现有的角色权限进行更新即可
            role.children=res.data
        }
    }
}
</script>

<style lang="less" scoped>
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>