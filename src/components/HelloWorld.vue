<template>
  <div>
    <div class="filelocation">
      <span class="content">当前所在文件夹：</span>全部 / 我的部门 / 筹资部 /
      我的部门
    </div>
    <el-upload class="upload-demo" ref="upload" action="" multiple :auto-upload="false" :on-change="beforeUpload"
      :file-list="updatefile" :show-file-list="false" :http-request="uploadFile">
      <el-button slot="trigger" size="small" style="margin-bottom: 10px; float: left">选取文件</el-button>
    </el-upload>
    <el-table :data="updatefile" border height="250" style="width: 100%" :key="itemkey">
      <el-table-column label="序号" width="150">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" :show-overflow-tooltip="false" label="名称">
      </el-table-column>
      <el-table-column prop="type" label="类型"> </el-table-column>
      <el-table-column prop="zhuangtai" label="状态">
        <template scope="scope">
          <span v-if="scope.row.isSuccess == '0'" style="color: orange">上传中</span>
          <span v-else-if="scope.row.isSuccess == '1'" style="color: green">
            上传成功</span>
          <span v-else-if="scope.row.isSuccess == '2'" style="color: red">上传失败</span>
          <span v-else-if="scope.row.isSuccess == '3'" style="color: #909399">未上传</span>

          <span v-else style="color: gray"><del>已结束</del></span>
        </template>
      </el-table-column>
      <el-table-column prop="progress" label="进度">
        <template slot-scope="scope">
          <span v-if="false">{{ scope.$index + 1 }}</span>
          <!-- <el-progress :percentage="percentage"></el-progress> -->
          <el-progress :status="scope.row.isSuccess == 1
            ? 'success'
            : scope.row.isSuccess == 2
              ? 'exception'
              : null
            " :percentage="scope.row.percent"></el-progress>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.percent == 0 || scope.row.isSuccess == 2"
            @click="delectfile(scope.row, scope.$index)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button style="margin-top: 20px; float: right" size="small" @click="submitUpload">确定上传</el-button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      fileData: "",
      upload_url: `/api/App/CDN/UploadImg`,
      updatefile: [],
      percentage: 0,
      tableData: [],
      itemkey: "",
    };
  },
  created() { },
  methods: {
    uploadFile(file) {
      this.fileData.append("file", file.file);
    },
    submitUpload() {
      this.$confirm("确认要上传吗？", "提示", {
        type: "info",
      })
        .then(() => {
          if (this.updatefile.length == 0) {
            this.$message.error("请选择文件！");
            return;
          }

          console.log(this.updatefile, "files");
          for (let i = 0; i < this.updatefile.length; i++) {
            let formData = new FormData();
            formData.append("parentFileDirectoryId", "1111");
            formData.append("file", this.updatefile[i].raw);
            formData.append("parentFileDirectoryName", "111111");
            formData.append("projectId", '123123123123');
            formData.append("userCode", "11123123123123");
            // this.itemkey = Math.random();
            let config = {
              timeout: 1200000,
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: function (progress) {
                this.updatefile[i].percent = Math.round(
                  (progress.loaded * 100) / progress.total
                );
                this.itemkey = Math.random();
              }.bind(this),
            };
            console.log(this.updatefile[i].percent, 33333);
            if (this.updatefile[i].percent == 0) {
              this.uploadFiles(formData, config, this.updatefile[i]);
            }
          }
        })
        .catch(() => { });
    },
    async uploadFiles(formData, conf, loadItem) {
      axios
        .post(this.upload_url, formData, conf)
        .then((res) => {
          if (res.data.ret == 200) {
            loadItem.isSuccess = 1;
            this.itemkey = Math.random();
            // this.$message.success({
            //   message: "上传成功",
            // });
          } else {
            loadItem.isSuccess = 2;
            this.itemkey = Math.random();
            // this.$message.warning({
            //   message: "上传失败",
            // });
          }
        })
        .catch(() => {
          loadItem.isSuccess = 2;
          this.$message.error("上传失败，网络请求错误");
        });
    },
    //删除文件
    delectfile(data, index) {
      console.log(data, 444444);
      this.$confirm(`确认要删除${data.name}吗？`, "提示", {
        type: "info",
      })
        .then(() => {
          for (let i = 0; i < this.updatefile.length; i++) {
            if (this.updatefile[i].name === data.name && i == index) {
              this.updatefile.splice(i, 1);
              i--;
            }
          }
        })
        .catch(() => { });
    },
    beforeUpload(file, fileList) {
      let arr = file.name.split(".");
      let bin = arr[arr.length - 1];
      console.log(this.updatefile, 3333);
      this.updatefile = fileList.map((item) => {
        item.type = item.name.split(".").pop(); //文杰类型
        item.isSuccess = item.isSuccess ? item.isSuccess : 3; //是否上传成功,0上传中，1成功，2失败，3未上传
        item.percent = item.percent ? item.percent : 0; //上传进度
        return item;
      });
      return bin;
    },
  },
};
</script>
<style lang="scss" scoped>
.msgbox {
  width: auto;
}

.filelocation {
  margin: 30px 0;

  .content {
    color: #01635e;
  }
}

// /deep/.el-progress-bar__inner {
//   background-color: #67c23a;
// }
</style>