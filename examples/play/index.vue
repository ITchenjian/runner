<template>
  <div style="padding: 20px;">
        <run-test-comp></run-test-comp>
        <run-tree-select v-model="selectVal" :data="selectData" :props="propsData" :nodeKey="nodeKey" :defaultExpanded="defaultExpanded" @callback="handleNodeClick" clearable></run-tree-select>
  </div>
</template>

<script>
    import { resTreeSelect } from '../assets/js/mockData.js'
    export default {
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
            };
        },
        methods: {
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
