<template>
  <div class="managementtool-page">
    <div>
      <div>
        项目名称：SGZL0000SHCW2100001-00015+项目名称项目名称项目名称项目名称
      </div>
      <div>
        <div>项目编号：SGZL0000SHCW2100001-00015</div>
        <div>运营经办：张三</div>
        <div>业务经理：李四</div>
        <div>创建时间：2022-12-23 12:23:23</div>
      </div>
    </div>
    <div>
      <div class="lalala tree-container">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          class="search"
        >
        </el-input>
        <el-tree
          :data="treeData"
          node-key="id"
          default-expand-all
          @node-click="handleLeftclick"
          @node-drag-start="handleDragStart"
          @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave"
          @node-drag-over="handleDragOver"
          @node-drag-end="handleDragEnd"
          @node-drop="handleDrop"
          @node-contextmenu="rightClick"
          :filter-node-method="filterNode"
          draggable
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          ref="tree"
        >
          <span
            class="slot-t-node"
            slot-scope="{ node, data }"
            @dblclick="editNode(data)"
          >
            <span v-show="!data.isEdit">
              <span :class="[data.id >= 99 ? 'slot-t-node--label' : '']">{{
                node.label
              }}</span>
            </span>
            <span v-show="data.isEdit">
              <el-input
                class="slot-t-input"
                size="mini"
                autofocus
                v-model="data.label"
                :ref="'slotTreeInput' + data.id"
                @blur.stop="NodeBlur(node, data)"
                @keydown.native.enter="NodeBlur(node, data)"
              ></el-input>
            </span>
          </span>
        </el-tree>
        <el-card class="box-card" ref="card" v-show="menuVisible">
          <div @click="addSameLevelNode()" v-show="firstLevel">
            <i class="el-icon-circle-plus-outline"></i>&nbsp;&nbsp;同级增加
          </div>
          <div class="add" @click="addChildNode()">
            <i class="el-icon-circle-plus-outline"></i>&nbsp;&nbsp;子级增加
          </div>
          <div class="delete" @click="deleteNode()">
            <i class="el-icon-remove-outline"></i>&nbsp;&nbsp;删除节点
          </div>
          <div class="edit" @click="editNode()">
            <i class="el-icon-edit"></i>&nbsp;&nbsp;修改节点
          </div>
        </el-card>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script>
import sm from "./SM";
export default {
  data() {
    return {
      eleId: "",
      isShow: false,
      currentData: "",
      currentNode: "",
      menuVisible: false,
      firstLevel: false,
      filterText: "",
      maxexpandId: 4,
      treeData: [
        {
          id: 1,
          label: "一级 1",
          isEdit: false,
          children: [
            {
              id: 4,
              label: "二级 1-1",
              isEdit: false,
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1",
                  isEdit: false,
                },
                {
                  id: 10,
                  label: "三级 1-1-2",
                  isEdit: false,
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: "一级 2",
          isEdit: false,
          children: [
            {
              id: 5,
              label: "二级 2-1",
              isEdit: false,
            },
            {
              id: 6,
              label: "二级 2-2",
              isEdit: false,
            },
          ],
        },
        {
          id: 3,
          label: "一级 3",
          isEdit: false,
          children: [
            {
              id: 7,
              label: "二级 3-1",
              isEdit: false,
            },
            {
              id: 8,
              label: "二级 3-2",
              isEdit: false,
              children: [
                {
                  id: 11,
                  label: "三级 3-2-1",
                  isEdit: false,
                },
                {
                  id: 12,
                  label: "三级 3-2-2",
                  isEdit: false,
                },
                {
                  id: 13,
                  label: "三级 3-2-3",
                  isEdit: false,
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  mounted() {
    const pubKey =
      "04e9b7ea964839e5fbcfc13387ee903b35874a440e544a960cfaf3b3f4c9f9041fd3fb20208c712cf5f48d02ea650a6b9a11e72bdfc322bcae7739caaec818bb64";

    console.log(
      sm.SG_sm2Encrypt(
        JSON.stringify({ name: "1111", say: "2222", ben: "333333" }),
        pubKey
      )
    );
  },
  methods: {
    SG_sm2Encrypt(D, C) {
      var CryptoJS =
        CryptoJS ||
        (function (J, A) {
          var E = {};
          var K = (E.lib = {});
          var N = (K.Base = (function () {
            function C() {}
            return {
              extend: function (P) {
                C.prototype = this;
                var O = new C();
                if (P) {
                  O.mixIn(P);
                }
                if (!O.hasOwnProperty("init")) {
                  O.init = function () {
                    O.$super.init.apply(this, arguments);
                  };
                }
                O.init.prototype = O;
                O.$super = this;
                return O;
              },
              create: function () {
                var O = this.extend();
                O.init.apply(O, arguments);
                return O;
              },
              init: function () {},
              mixIn: function (P) {
                for (var O in P) {
                  if (P.hasOwnProperty(O)) {
                    this[O] = P[O];
                  }
                }
                if (P.hasOwnProperty("toString")) {
                  this.toString = P.toString;
                }
              },
              clone: function () {
                return this.init.prototype.extend(this);
              },
            };
          })());
          var B = (K.WordArray = N.extend({
            init: function (C, O) {
              C = this.words = C || [];
              if (O != A) {
                this.sigBytes = O;
              } else {
                this.sigBytes = C.length * 4;
              }
            },
            toString: function (C) {
              return (C || D).stringify(this);
            },
            concat: function (R) {
              var P = this.words;
              var T = R.words;
              var C = this.sigBytes;
              var S = R.sigBytes;
              this.clamp();
              if (C % 4) {
                for (var O = 0; O < S; O += 1) {
                  var Q = (T[O >>> 2] >>> (24 - (O % 4) * 8)) & 255;
                  P[(C + O) >>> 2] |= Q << (24 - ((C + O) % 4) * 8);
                }
              } else {
                if (T.length > 65535) {
                  for (var O = 0; O < S; O += 4) {
                    P[(C + O) >>> 2] = T[O >>> 2];
                  }
                } else {
                  P.push.apply(P, T);
                }
              }
              this.sigBytes += S;
              return this;
            },
            clamp: function () {
              var C = this.words;
              var O = this.sigBytes;
              C[O >>> 2] &= 4294967295 << (32 - (O % 4) * 8);
              C.length = J.ceil(O / 4);
            },
            clone: function () {
              var C = N.clone.call(this);
              C.words = this.words.slice(0);
              return C;
            },
            random: function (P) {
              var C = [];
              for (var O = 0; O < P; O += 4) {
                C.push((J.random() * 4294967296) | 0);
              }
              return new B.init(C, P);
            },
          }));
          var I = (E.enc = {});
          var D = (I.Hex = {
            stringify: function (P) {
              var C = P.words;
              var S = P.sigBytes;
              var Q = [];
              for (var O = 0; O < S; O += 1) {
                var R = (C[O >>> 2] >>> (24 - (O % 4) * 8)) & 255;
                Q.push((R >>> 4).toString(16));
                Q.push((R & 15).toString(16));
              }
              return Q.join("");
            },
            parse: function (P) {
              var Q = P.length;
              var C = [];
              for (var O = 0; O < Q; O += 2) {
                C[O >>> 3] |=
                  parseInt(P.substr(O, 2), 16) << (24 - (O % 8) * 4);
              }
              return new B.init(C, Q / 2);
            },
          });
          var M = (I.Latin1 = {
            stringify: function (P) {
              var C = P.words;
              var S = P.sigBytes;
              var Q = [];
              for (var O = 0; O < S; O += 1) {
                var R = (C[O >>> 2] >>> (24 - (O % 4) * 8)) & 255;
                Q.push(String.fromCharCode(R));
              }
              return Q.join("");
            },
            parse: function (O) {
              var Q = O.length;
              var C = [];
              for (var P = 0; P < Q; P += 1) {
                C[P >>> 2] |= (O.charCodeAt(P) & 255) << (24 - (P % 4) * 8);
              }
              return new B.init(C, Q);
            },
          });
          var G = (I.Utf8 = {
            stringify: function (O) {
              try {
                return decodeURIComponent(escape(M.stringify(O)));
              } catch (C) {
                throw new Error("Malformed UTF-8 data");
              }
            },
            parse: function (C) {
              return M.parse(unescape(encodeURIComponent(C)));
            },
          });
          var L = (K.BufferedBlockAlgorithm = N.extend({
            reset: function () {
              this._data = new B.init();
              this._nDataBytes = 0;
            },
            _append: function (C) {
              if (typeof C == "string") {
                C = G.parse(C);
              }
              this._data.concat(C);
              this._nDataBytes += C.sigBytes;
            },
            _process: function (O) {
              var Q = this._data;
              var C = Q.words;
              var S = Q.sigBytes;
              var R = this.blockSize;
              var V = R * 4;
              var W = S / V;
              if (O) {
                W = J.ceil(W);
              } else {
                W = J.max((W | 0) - this._minBufferSize, 0);
              }
              var U = W * R;
              var T = J.min(U * 4, S);
              if (U) {
                for (var P = 0; P < U; P += R) {
                  this._doProcessBlock(C, P);
                }
                var X = C.splice(0, U);
                Q.sigBytes -= T;
              }
              return new B.init(X, T);
            },
            clone: function () {
              var C = N.clone.call(this);
              C._data = this._data.clone();
              return C;
            },
            _minBufferSize: 0,
          }));
          var F = (K.Hasher = L.extend({
            cfg: N.extend(),
            init: function (C) {
              this.cfg = this.cfg.extend(C);
              this.reset();
            },
            reset: function () {
              L.reset.call(this);
              this._doReset();
            },
            update: function (C) {
              this._append(C);
              this._process();
              return this;
            },
            finalize: function (C) {
              if (C) {
                this._append(C);
              }
              var O = this._doFinalize();
              return O;
            },
            blockSize: 512 / 32,
            _createHelper: function (C) {
              return function (P, O) {
                return new C.init(O).finalize(P);
              };
            },
            _createHmacHelper: function (C) {
              return function (P, O) {
                return new H.HMAC.init(C, O).finalize(P);
              };
            },
          }));
          var H = (E.algo = {});
          return E;
        })(Math);
      if (D == undefined || C == undefined) {
        return undefined;
      }
      if (D == "" || C == "") {
        return undefined;
      }
      if (C.length != 130) {
        return undefined;
      }
      var E = CryptoJS.enc.Utf8.parse(D);
      var J = C;
      var I = J.substr(0, 2);
      if (I != "04") {
        return undefined;
      }
      if (J.length > 64 * 2) {
        J = J.substr(J.length - 64 * 2);
      }
      var B = J.substr(0, 64);
      var F = J.substr(64);
      var A = new SM2Cipher(1);
      var H = A.CreatePoint(B, F);
      if (H == undefined) {
        return undefined;
      }
      E = A.GetWords(E.toString());
      var G = A.Encrypt(H, E);
      return "04" + G;
    },
    NodeBlur(Node, data) {
      console.log(Node, data);
      if (data.label.length === 0) {
        this.$message.error("菜单名不可为空！");
        return false;
      } else {
        if (data.isEdit) {
          this.$set(data, "isEdit", false);
          console.log(data.isEdit);
        }
        this.$nextTick(() => {
          this.$refs["slotTreeInput" + data.id].$refs.input.focus();
        });
      }
    },
    // 查询
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === "二级 3-1") {
        return type !== "inner";
      } else {
        return true;
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf("三级 3-2-2") === -1;
    },
    // 鼠标右击事件
    rightClick(event, object, Node, element) {
      console.log(event, object, element);
      this.currentData = object;
      this.currentNode = Node;
      if (Node.level === 1) {
        this.firstLevel = true;
      } else {
        this.firstLevel = false;
      }
      this.menuVisible = true;
      // let menu = document.querySelector('#card')
      // /* 菜单定位基于鼠标点击位置 */
      // menu.style.left = event.clientX + 'px'
      // menu.style.top = event.clientY + 'px'
      document.addEventListener("click", this.foo);
      this.$refs.card.$el.style.left = event.clientX + 10 + "px";
      this.$refs.card.$el.style.top = event.clientY - 60 + "px";
    },
    // 鼠标左击事件
    handleLeftclick(data, node) {
      console.log(data, node);
      this.foo();
    },
    //  取消鼠标监听事件 菜单栏
    foo() {
      this.menuVisible = false;
      //  要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
      document.removeEventListener("click", this.foo);
    },
    // 增加同级节点事件
    addSameLevelNode() {
      let id = Math.ceil(Math.random() * 100);
      var data = { id: id, label: "新增节点" };
      this.$refs.tree.append(data, this.currentNode.parent);
    },
    // 增加子级节点事件
    addChildNode() {
      console.log(this.currentData);
      console.log(this.currentNode);
      //   if (this.currentNode.level >= 3) {
      //     this.$message.error("最多只支持三级！");
      //     return false;
      //   }
      let id = Math.ceil(Math.random() * 100);
      var data = { id: id, label: "新增节点" };
      this.$refs.tree.append(data, this.currentNode);
    },
    // 删除节点
    deleteNode() {
      this.$refs.tree.remove(this.currentNode);
    },
    // 编辑节点
    editNode(data) {
      console.log(data);
      this.currentData = data ? data : this.currentData;
      if (!this.currentData.isEdit) {
        this.$set(this.currentData, "isEdit", true);
      }
      // 获取焦点
      this.$nextTick(() => {
        this.$refs["slotTreeInput" + this.currentData.id].focus();
      });
    },
    handleDragStart(node, ev) {
      console.log("drag start", node, ev);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log("tree drag enter: ", dropNode.label, ev);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log("tree drag leave: ", dropNode.label, ev);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log("tree drag over: ", dropNode.label, ev);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log("tree drag end: ", dropNode && dropNode.label, dropType, ev);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log("tree drop: ", dropNode.label, dropType, ev);
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
};
</script>
<style scoped lang="less">
/* 点击节点时的选中颜色 */
.tree-container /deep/.el-tree-node.is-current > .el-tree-node__content {
  color: blue !important;
}

.tree-container /deep/ .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}

.tree-container /deep/ .el-icon-caret-right:before {
  content: "\e791";
  font-size: 18px;
}

.tree-container /deep/ .el-tree-node__expand-icon {
  margin-left: 15px;
  padding: 0px;
}

.tree-container /deep/ .el-tree-node__expand-icon.is-leaf {
  margin-left: 0px;
}

.tree-container /deep/ .el-tree-node {
  position: relative;
  padding-left: 16px;
  // text-indent: 16px;
}

.tree-container /deep/ .el-tree-node__children {
  padding-left: 16px;
}

.tree-container /deep/ .el-tree > .el-tree-node:before {
  border-left: none;
}

.tree-container /deep/ .el-tree > .el-tree-node:after {
  border-top: none;
}
.tree-container /deep/ .el-tree > .el-tree-node:before {
  border-left: none;
}

.tree-container /deep/ .el-tree > .el-tree-node:after {
  border-top: none;
}

.tree-container /deep/ .el-tree-node:before {
  content: "";
  left: 10px;
  position: absolute;
  right: auto;
  border-width: 1px;
}

.tree-container /deep/ .el-tree-node:after {
  content: "";
  left: 10px;
  position: absolute;
  right: auto;
  border-width: 1px;
}

.tree-container /deep/ .el-tree-node:before {
  border-left: 1px dashed #ccc;
  bottom: 0px;
  height: 100%;
  top: -19px;
  width: 1px;
}

.tree-container /deep/ .el-tree-node:after {
  border-top: 1px dashed #ccc;
  height: 25px;
  top: 20px;
  width: 20px;
}

.el-tree-node :last-child:before {
  height: 40px;
}

.tree-container {
  margin: 10px;
}
.tree-container /deep/ .el-tree .el-tree-node {
  position: relative;
}
.tree-container /deep/ .el-tree-node .el-tree-node__content {
  height: 34px;
  padding-left: 0px !important;
  border: none;
}
.tree-container /deep/ .el-tree-node .el-tree-node__content::before {
  border-left: 1px dashed #ccc;
  height: 100%;
  top: 0;
  width: 1px;
  margin-left: 1px;
  margin-top: 0px;
  z-index: 8;
}
.tree-container
  /deep/
  .el-tree-node
  .el-tree-node__children
  .el-tree-node__content::before {
  border-left: 0px dashed #ccc;
  height: 100%;
  top: 0;
  width: 1px;
  margin-left: 1px;
  margin-top: 0px;
  z-index: 8;
}

.tree-container /deep/ .el-tree-node .el-tree-node__content::after {
  border-top: 1px dashed #ccc;
  height: 1px;
  top: 18px;
  width: 13px;
  margin-left: 1px;
  z-index: 8;
}

.tree-container
  /deep/
  .el-tree-node
  .el-tree-node__children
  .el-tree-node__content::after {
  border-top: 0px dashed #ccc;
}

.tree-container .el-tree-node .el-tree-node__content::before,
.tree-container .el-tree-node .el-tree-node__content::after {
  content: "";
  position: absolute;
  right: auto;
}
/deep/.el-table__placeholder {
  padding-left: 8px;
}
/deep/.el-card__body {
  padding: 10px !important;
  > div {
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
    &:hover {
      color: blue;
    }
  }
}
/*.lalala {*/
/*position: relative;*/
/*}*/
.text {
  font-size: 14px;
}
.el-tree {
  width: 20%;
  margin-top: 10px;
}
.search {
  width: 20%;
}

.item {
  padding: 18px 0;
}

.add {
  cursor: pointer;
  margin-top: 10px;
}

.delete {
  margin: 10px 0;
  cursor: pointer;
}

.edit {
  margin-bottom: 10px;
  cursor: pointer;
}

.search {
  cursor: pointer;
}

.box-card {
  width: 150px;
  position: absolute;
  z-index: 1000;
}
</style>