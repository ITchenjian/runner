<template>
    <div class="run-tree-select" :class="{'readonly':readonly===''||readonly===true}">
        <div @click="handleClick($event)" class="input-wrap" :class="{'delete-icon':clearIconFlag,active:visible}">
            <el-input ref="inputSelect" :placeholder="placeholderText" class="run-tree-select-input" v-model="input">
            </el-input>
            <i class="run-icon-arrow-down run-tree-select-icon" :class="{'active':visible}"></i>
            <i class="run-icon-circle-close run-tree-select-icon" :class="{'active':visible}"></i>
        </div>

        <div ref="selectList" :id="selectId" class="run-tree-select-box-wrap" :style="{left:sLeft,top:sTop,width:sWidth}" :class="{active:visible}">
            <i class="up-arrow set-position"></i>
            <div class="run-tree-select-box-list" @mousedown.stop="emptyFn" :class="listClass">
                <run-scrollbar ref="scrollbar" :style="{maxHeight:maxHeight,height:height}">
                    <el-tree ref="tree" class="filter-tree"
                        :data="datas"
                        :props="props"
                        :node-key="nodeKey"
                        :current-node-key="nodeId"
                        :highlight-current="true"
                        :expand-on-click-node="expandOnClickNode"
                        :show-checkbox="false"
                        :default-expanded-keys="defaultExpanded"
                        :default-expand-all="defaultExpandAll"
                        :filter-node-method="filterNode"
                        @node-click="nodeClick">
                        <span class="tree-slot" :class="{disabled: scope.node.disabled}" slot-scope="scope">{{scope.node.label}}</span>
                    </el-tree>
                </run-scrollbar>
            </div>
        </div>

    </div>
</template>
<script>
import { Input, Tree } from 'element-ui';
import RunScrollbar from 'runner-ui/packages/scrollbar';
export default {
    name: 'RunTreeSelect',
    components: {
        'el-input': Input,
        'el-tree': Tree,
        RunScrollbar
    },
    data() {
        return {
            selectId: "run-tree-select-" + Math.ceil(Math.random() * 100000),
            visible: false,
            sLeft: null,
            sTop: null,
            sWidth: null,
            maxHeight: 0,
            windowClickFn: null,

            changeFlag: false,
            input: '',     //显示值
            nodeId: null,   //绑定值

            filterText: '', // 搜索值
            datas: [], // tree数据
        };
    },
    props: {
        value: { type: [String, Boolean, Number], default: null },
        data: {type: Array,default:function(){ return []}}, //数据源
        defaultExpanded: {type: Array,default:function(){ return []}}, //默认展开
        props: {
            //数据源匹配的键值集合 label，value，disabled，children，hasChild，前两个为一般下拉列表必须，后两个为树型特有
            type: Object,
            default: function() {
                return {
                    label: 'name',
                    value: 'id',
                    disabled: "disabled",
                    children: 'children',
                };
            }
        },
        nodeKey: {
            type: String,
            default: 'id',
        },
        placeholder: {
            type: String,
            default: '请选择'
        }, //空值时提示的文字
        width: String, //宽度，带单位
        height: String, //下拉列表的高度，不能超过最高值，超过取最大值
        readonly: { type: [Boolean, String], default: false }, //是否只读，默认为可选择,
        clearable: { type: [Boolean, String], default: false }, //可否清除已选中值，默认不显示,
        isTree: { type: Boolean, default: false }, 
        expandOnClickNode: { type: Boolean, default: false }, //是否展开所有的子节点
        defaultExpandAll: { type: Boolean, default: false }, //是否展开所有的子节点
        listClass: String //列表自定义class
    },
    computed: {
        clearIconFlag() {
            if (!this.input) {
                return false;
            }

            if ((this.clearable === "" || this.clearable === true) && this.visible === false) {
                return true;
            }
            return false;
        },
        placeholderText() {
            if (this.readonly === "" || this.readonly === true) {
                return "";
            }

            return this.placeholder;
        }
    },
    watch: {
        data(val) {
            this.datas = val;
            if (this.value) {
                this.init();
            }
        },
        value(val) {
            this.nodeId = val;
            this.$nextTick(()=>{
                this.$refs["tree"].setCurrentKey(val);
                this.input = this.$refs["tree"].getNode(val).label;
            })
            //$emit() 会触发这里更新，但是这里不想执行init
            if (this.changeFlag === false && this.data && this.data.length > 0) {
                this.init();
            } else {
                this.changeFlag = false;
            }

            if (val === undefined || val === null) {
                this.input = "";
            }
        },
        input(val) {
            if(this.visible){
                this.$refs.tree.filter(val);
            }else {
                this.init();
            }
            
        },
    },
    methods: {
        emptyFn() {},
        clear(e) {
            let target = e.target;
            let className = target.className;
            if (className.indexOf("run-icon-circle-close") > -1) {
                this.input = '';
                this.$nextTick(function () {
                    this.$refs.inputSelect.$el.querySelector('input').focus();
                });
                // this.$emit("input", null);
                this.$emit("clear");
                // this.close();
            }
        },
        handleClick(e) {
            this.clear(e);
            if (this.readonly === "" || this.readonly === true || this.visible === true) {
                return;
            }

            document.body.appendChild(this.$refs.selectList);

            //无数据时进行无数据初始化
            if (!this.data || this.data.length === 0) {
                if (this.datas.length === 0) {
                    var data = {};
                    data[this.props.label] = '暂无数据';
                    data[this.props.value] = null;
                    data[this.props.disabled] = true;
                    this.datas.push(data);
                    // this.isDefault = false;
                }
            }

            //初始化展开第一级树
            /* if (this.isTree === true && (this.nodeId === null || this.nodeId === undefined) && this.isDefault === false) {
                this.$refs.treeRef.defaultExpandNode();
                this.isDefault = true;
            } */

            this.visible = true;

            let x = e.clientX - e.offsetX; //input节点的左边界线
            let y = e.clientY - e.offsetY; //input节点的上边界线

            let target = e.target;
            let parentNode;

            let className = target.className;
            if (className.indexOf("run-tree-select-input") > -1) {
                parentNode = target;
            } else {
                parentNode = target.parentNode;
                //假如当前节点不是input节点，是图标节点
                if (className.indexOf("run-tree-select-icon") > -1) {
                    x -= target.offsetLeft;
                    y -= target.offsetTop;
                }
            }

            let sTop = y + parentNode.clientHeight;
            let maxHeight;
            this.upArrow = true;
            let top = 0;
            let subHeight = 40; //10(padding)+10(箭头)+20（预留空间）

            let clientHeight = document.body.clientHeight;
            maxHeight = clientHeight - y - parentNode.clientHeight - subHeight;

            this.maxHeight = maxHeight + "px";

            this.sTop = sTop + (this.top || 0) + "px";
            this.sLeft = x + (this.left || 0) + "px";
            this.sWidth = this.width || parentNode.clientWidth + "px";
            /* if (this.isTree !== true && this.isDefault === false) {
                this.scrollToY();
                this.isDefault = true;
            } */
            setTimeout(() => {
                this.addWindowClick();
            });
        },
        scrollToY() {
            this.$refs.scrollbar.scrollToY(0);
            setTimeout(() => {
                let dom = this.$el.querySelector(
                    ".run-tree-select-box-list .label.active"
                );
                if (!dom) {
                    return;
                }
                if (dom.offsetTop < 51) {
                    return;
                }
                this.$refs.scrollbar.scrollToY(dom.offsetTop);
            });
        },
        close() {
            this.visible = false;
        },
        //注册隐藏下拉列表事件
        addWindowClick() {
            let _this = this;
            if (!this.windowClickFn) {
                this.windowClickFn = function() {
                    document.body.removeEventListener(
                        "mousedown",
                        this.windowClickFn
                    );
                    _this.close();
                };
            }

            document.body.addEventListener(
                "mousedown",
                this.windowClickFn,
                false
            );
        },
        //节点点击
        nodeClick (data, node) {
            if (data[this.props.disabled] === true) {
                return false;
            }
            this.$emit('callback', data, node);
            this.update(data);
        },
        update(data) {
            this.input = data[this.props.label];
            this.changeFlag = true;
            this.$emit("input", data[this.props.value]);
            this.$emit("change", data);
            //this.close();
            this.removeWindowClick();
            this.$nextTick(function() {
                this.changeFlag = false;
            });
        },
        //移除当前注册的隐藏下拉列表事件
        removeWindowClick() {
            if (typeof this.windowClickFn === "function") {
                this.windowClickFn();
            }
        },
        // 项目筛选
        filterNode(value, data) {
            if (!value) return true;
            return data[this.props.label].indexOf(value) !== -1;
        },
        init() {
            this.datas = this.data.length ? this.data : JSON.parse(window.localStorage.getItem('orgData'));
        }
    },
    created () {
        this.init();
    },
    beforeDestroy() {
        if (window[this.selectId]) {
            window[this.selectId].outerHTML = "";
        }
    }
}
</script>