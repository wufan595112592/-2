<template>
  <div>
    <uploader
      :options="options"
      :file-status-text="statusText"
      class="uploader-example"
      ref="uploader"
      @file-success="fileSuccess"
      @file-added="onFileAdded"
      @file-error="onFileError"
      @file-removed="fileRemoved"
      style="width: 100%"
    >
      <uploader-unsupport></uploader-unsupport>
      <uploader-drop>
        <uploader-btn>选择文件</uploader-btn>
      </uploader-drop>
      <uploader-list></uploader-list>
    </uploader>
    <div slot="tip" class="el-upload__tip">上传文件只支持bpmn.js类型文件。</div>
    <div class="btn-box">
      <el-button @click="goback" class="nobtn">取消</el-button>
      <el-button class="submit" :loading="btnloading" @click="submit"
        >提交</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    templateId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      fileList: [],
      projectid: "",
      btnloading: false,
      batchNo: "",
      options: {
        target:
          `${process.env.VUE_APP_API_MODE}` == "dev"
            ? `${process.env.VUE_APP_API_GWL}gwzl/processDefinition/uploadStreamAndDeployment`
            : `${window.location.origin}/api/gwzl/processDefinition/uploadStreamAndDeployment`, // 上传地址
        testChunks: false, //是否开启服务器分片校验
        maxChunkRetries: 1, //最大自动失败重试上传次数
        chunkSize: 1 * 1024 * 1024 * 1024, //分片大小 这里设置10M
        singleFile: true, //单文件上传
        query: (file, chunk) => {
          console.log(file, 44444444);
          return {
            // 可以针对于每个file对象设置自定义的params
            deploymentName: file.name,
            multipartFile: file.file,
          };
        },
        // categoryMap: {
        //   accept: [".png", ".jpg", ".jpeg", ".gif", ".pdf", ".mp4"], //接受文件类型
        // },
        headers: {
          // 在header中添加的验证，请根据实际业务来
          Authorization: sessionStorage.getItem("authToken"),
          RefreshToken: sessionStorage.getItem("refreshToken"),
        },
        uploadMethod: "POST",
        testMethod: "POST",
      },
      statusText: {
        success: "上传成功",
        error: "上传失败",
        uploading: "上传中",
        paused: "暂停中",
        waiting: "等待中",
      },
    };
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.$refs.uploader.file = {};
        this.$refs.uploader.fileList = [];
      });
    },
    onFileAdded: function (file) {
      this.uploaderPanelShow = true;
      let fileName = file.name;
      let pos = fileName.lastIndexOf(".");
      let lastName = fileName.substring(pos, fileName.length);
      console.log(lastName, lastName.toLowerCase());
      if (lastName.toLowerCase() !== ".bpmn") {
        this.$message.error("文件必须为 .bpmn 类型");
        console.log(this.$refs.uploader);
        this.$refs.uploader.file = {};
        // this.$refs.uploader.fileList = [];
        return false;
      }
    },
    //上传成功返回的信息
    fileSuccess(rootFile, file, message) {
      let res = JSON.parse(message);
      if (res.code === 200) {
        // this.$message({
        //   message: "上传成功",
        //   type: "success",
        // });
      } else {
        this.$message({
          type: "error",
          message: res.statusText || res.msg,
          customClass: "el-message--error",
          iconClass: "iconfont icon-error",
        });
      }
    },
    // 上传错误触发，文件还未传输到后端
    onFileError(rootFile, file, response, chunk) {
      console.log(rootFile, file, response, chunk);
    },
    // 移除文件
    fileRemoved(file) {
      console.log(file);
    },
    goback() {
      this.$emit("reseter");
    },
    async submit() {
      this.btnloading = true;
      setTimeout(() => {
        this.btnloading = false;
        this.$message({
          message: "提交成功",
          type: "success",
        });
        this.$emit("reseter");
      }, 4000);
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    getFile(item) {
      this.file = item.file;
      console.log(this.file, 5566666);
    },
    beforeRemove(file, fileList) {
      console.log(fileList);
      return this.$confirm(`确定移除 ${file.name}？`);
    },
  },
};
</script>

<style lang="less" scoped>
.btn-box {
  display: flex;
  margin-top: 48px;
  margin-bottom: 30px;
  justify-content: center;
}
.btn {
  color: #fff;
  background-color: #00635f;
}
.submit {
  color: #fff;
  margin-left: 20px;
  background-color: #00635f;
}
/deep/.el-upload__tip {
  color: red;
}
/deep/.upload-demo {
  height: 150px;
}
/deep/.nobtn:hover {
  color: #00635f !important;
  background: #ffff;
  border: 1px solid #00635f !important;
}
</style>
<style>
.el-button--primary:focus,
.el-button--primary:hover,
.el-button--primary {
  background-color: #00635f;
  border-color: #00635f;
}
</style>