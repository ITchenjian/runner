<template>
  <div style="padding: 20px;">
        <run-test-comp></run-test-comp>
        <el-button type="primary" size="mini" @click="openDialog">dialog</el-button>
        <run-tree-select v-model="selectVal" :data="selectData" :props="propsData" :nodeKey="nodeKey" :defaultExpanded="defaultExpanded" @callback="handleNodeClick" clearable></run-tree-select>
        <component v-model="visible" :is="currentView"></component>
  </div>
</template>

<script>
    import { Button } from 'element-ui';
    import { resTreeSelect } from '../assets/js/mockData.js'
    export default {
        components: {
            'el-button': Button,
            'demo-dialog': resolve => {
                require(['./dialog.vue'], resolve)
            },
        },
        data() {
            return {
                input: 'Hello Runner UI!',
                selectVal: '',
                selectData: [],
                propsData: {
                    label: 'prName',
                    value: 'prId',
                    disabled:  function(data, node) {
                        return data.isRight!==1
                    },
                    children: 'children',
                },
                nodeKey: 'prId',
                defaultExpanded: [],
                visible: false,
                currentView: '',
            };
        },
        methods: {
            openDialog () {
                this.currentView = 'demo-dialog';
                this.visible = true;
            },
            handleNodeClick (data, node) {
                console.log(data, node)
            },
        },
        created () {
            setTimeout(()=>{
                this.selectData = resTreeSelect.data;
                this.defaultExpanded = [this.selectData[0][this.nodeKey]]
                this.selectVal = 'TotalCompany'
            }, 500)
        }
    };
</script>
