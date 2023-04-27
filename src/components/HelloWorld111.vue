<template>
  <div class="containers" ref="content" v-loading="loading">
    <div>
      <el-button @click="downloadBpmn">
        <el-icon type="download" />
        保存BPMN
      </el-button>
      <el-button @click="downloadSvg">
        <el-icon type="download" />
        保存SVG
      </el-button>
      <el-button @click="deploy">
        <el-icon type="upload" />
        部署
      </el-button>
      <el-upload
        action=""
        :file-list="uploadBpmnFileList"
        :before-upload="beforeUpload"
      >
        <el-button>
          <el-icon type="upload" />
          导入BPMN
        </el-button>
      </el-upload>
      <el-button @click="goback"> 返回 </el-button>
      <el-button-group>
        <el-button @click="handlerUndo">撤销</el-button>
        <el-button @click="handlerRedo">恢复</el-button>
      </el-button-group>

      <el-button-group>
        <el-button @click="handlerZoom(0.1)">放大</el-button>
        <el-button @click="handlerZoom(-0.1)">缩小</el-button>
        <el-button @click="handlerZoom(0)">还原</el-button>
      </el-button-group>

      <a hidden ref="downloadLink"></a>
    </div>
    <div class="canvas" ref="canvas"></div>
    <div id="js-properties-panel" class="panel"></div>
  </div>
</template>
 
<script>
import BpmnModeler from "bpmn-js/lib/Modeler";
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css"; // 右边工具栏样式
// import { addDeploymentByString, getDefinitionXML } from "../api";
// BPMN国际化
import customTranslate from "./translationsGerman";
// 自定义汉化模块
var customTranslateModule = {
  translate: ["value", customTranslate],
};

import xmlStr from "./xmls";

export default {
  components: {},
  data() {
    return {
      bpmnModeler: null,
      container: null,
      loading: false,
      canvas: null,
      uploadBpmnFileList: [],
      scale: 1,
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    /**
     * 初始化流程设计器对象
     * @returns {Promise<void>}
     */
    async init(val) {
      // 获取到属性ref为“content”的dom节点
      this.container = this.$refs.content;
      // 获取到属性ref为“canvas”的dom节点
      const canvas = this.$refs.canvas;
      // 创建BpmnModeler
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
        // 加入工具栏支持
        propertiesPanel: {
          parent: "#js-properties-panel",
        },
        additionalModules: [
          // // 左边工具栏以及节点
          propertiesProviderModule,
          // // 右边的工具栏
          propertiesPanelModule,
          // camundaModdleDescriptor,
          // 国际化
          customTranslateModule,
        ],
        moddleExtensions: {
          camunda: camundaModdleDescriptor,
        },
      });
      // 创建新流程
      await this.createNewDiagram(val ? val : xmlStr);
    },
    async create(val) {
      this.loading = true;
      let params = {
        deploymentId: val.id,
        resourceName: val.name,
      };
      const res = await getDefinitionXML(params);
      this.loading = false;
      this.init(res);
    },
    /**
     * 创建新流程
     * @param bpmn BPMN流程XML报文
     * @returns {Promise<void>}
     */
    async createNewDiagram(bpmn) {
      // 将字符串转换成图显示出来;
      this.bpmnModeler.importXML(bpmn, (err) => {
        if (err) {
          this.$message.error("打开模型出错,请确认该模型符合Bpmn2.0规范");
        } else {
          console.log("成功导入模型");
        }
      });
    },

    handlerRedo() {
      this.bpmnModeler.get("commandStack").redo();
    },
    handlerUndo() {
      this.bpmnModeler.get("commandStack").undo();
    },
    handlerZoom(radio) {
      const newScale = !radio ? 1.0 : this.scale + radio;
      this.bpmnModeler.get("canvas").zoom(newScale);
      this.scale = newScale;
    },

    beforeUpload(file) {
      // this.uploadBpmnFileList = [];
      this.openBpmn(file);
      return false;
    },

    openBpmn(file) {
      const reader = new FileReader();
      // 读取File对象中的文本信息，编码格式为UTF-8
      reader.readAsText(file, "utf-8");
      reader.onload = () => {
        // 读取完毕后将文本信息导入到Bpmn建模器
        this.createNewDiagram(reader.result);
      };
      return false;
    },
    async deploy() {
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        if (!err) {
          this.addDeploymentByString(xml);
        }
      });
    },
    goback() {
      this.$emit("drawonline");
    },
    async addDeploymentByString(xml) {
      let parmas = {
        deploymentName: this.getFilename(xml),
        stringBPMN: xml,
      };
      const res = await addDeploymentByString(parmas);
      if (res.code === 200) {
        console.log(res, 3333333);
        this.$message({
          message: "部署成功",
          type: "success",
        });
        this.$emit("drawonline");
      } else {
        this.$message({
          type: "error",
          message: res.msg,
          customClass: "el-message--error",
          iconClass: "iconfont icon-error",
        });
      }
    },
    downloadBpmn() {
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        if (!err) {
          // 获取文件名
          const name = `${this.getFilename(xml)}.bpmn`;
          // 将文件名以及数据交给下载方法
          this.download({ name: name, data: xml });
        }
      });
    },

    downloadSvg() {
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        if (!err) {
          // 获取文件名
          const name = `${this.getFilename(xml)}.svg`;

          // 从建模器画布中提取svg图形标签
          let context = "";
          const djsGroupAll = this.$refs.canvas.querySelectorAll(".djs-group");
          for (let item of djsGroupAll) {
            context += item.innerHTML;
          }
          // 获取svg的基本数据，长宽高
          const viewport = this.$refs.canvas
            .querySelector(".viewport")
            .getBBox();

          // 将标签和数据拼接成一个完整正常的svg图形
          const svg = `
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          width="${viewport.width}"
                          height="${viewport.height}"
                          viewBox="${viewport.x} ${viewport.y} ${viewport.width} ${viewport.height}"
                          version="1.1"
                          >
                          ${context}
                        </svg>
                      `;
          // 将文件名以及数据交给下载方法
          this.download({ name: name, data: svg });
        }
      });
    },

    download({ name = "diagram.bpmn", data }) {
      // 这里就获取到了之前设置的隐藏链接
      const downloadLink = this.$refs.downloadLink;
      // 把输就转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data);

      if (data) {
        // 将数据给到链接
        downloadLink.href =
          "data:application/bpmn20-xml;charset=UTF-8," + encodedData;
        // 设置文件名
        downloadLink.download = name;
        // 触发点击事件开始下载
        downloadLink.click();
      }
    },

    getFilename(xml) {
      let start = xml.indexOf("process");
      let filename = xml.substr(start, xml.indexOf(">"));
      filename = filename.substr(filename.indexOf("id") + 4);
      filename = filename.substr(0, filename.indexOf('"'));
      return filename;
    },
  },
  computed: {},
};
</script>
 
<style lang="less" scoped>
// 左边工具栏以及编辑节点的样式
@import "~bpmn-js/dist/assets/diagram-js.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
.containers {
  position: absolute;
  background-color: #ffffff;
  width: 100%;
  height: 100vh;
  padding: 5px;
}

.canvas {
  width: 100%;
  height: 100%;
}

.panel {
  position: absolute;
  right: 240px;
  top: 0;
  height: 600px;
  overflow-y: scroll;
  width: 300px;
}
/*css主要部分的样式*/
/*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 6px; /*对垂直流动条有效*/
  height: 6px; /*对水平流动条有效*/
}

/*定义滚动条的轨道颜色、内阴影及圆角*/
::-webkit-scrollbar-track {
  border-radius: 4px;
  /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3); */
  /* background-color: rosybrown; */
}

/*定义滑块颜色、内阴影及圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: #ccc;
  /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3); */
}

/*定义滑块悬停变化颜色、内阴影及圆角*/
::-webkit-scrollbar-thumb:hover {
  background-color: #c7c9cc;
}

/*定义两端按钮的样式*/
::-webkit-scrollbar-button {
  /* background-color: cyan; */
}

/*定义右下角汇合处的样式*/
::-webkit-scrollbar-corner {
  /* background: khaki; */
}

/* 隐藏滚动条 */
/* ::-webkit-scrollbar {
    display: none;
} */
</style>
 