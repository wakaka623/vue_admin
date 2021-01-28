<template>
    <div class="background-color">
        <div class="square">
            <!-- 头像区域 -->
            <div class="logo">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单 -->
            <el-form  label-width="0px" class="login_form">
                <el-form-item >
                    <el-input prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-input prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <el-form-item class="login_btn">
                     <el-button type="primary">登录</el-button>
                     <el-button type="info">退出</el-button>
                </el-form-item>
            </el-form>    
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="less" scoped>
    .background-color{
        background-color: #eee;
        height: 100%;
    }
    .square{
            width: 450px;
            height: 300px;
            border-radius: 5px;
            background-color: #fff;
            position: absolute;
            // 设置盒子阴影
            box-shadow: 0 0 10px #ddd;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            .logo{
                width: 100px;  
                height: 100px;
                border: 1px solid #eee;
                background-color: #fff;
                border-radius: 50%;
                position: absolute;
                left: 50%;
                transform: translate(-50%,-50%);
                img{
                    height: 100%;
                    width: 100%;
                    border-radius: 50%;
                    background-color: #fff;
                }
            }
    }
    .login_form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
        .login_btn{
            display: flex;
            justify-content: flex-end;
        }

    }
</style>