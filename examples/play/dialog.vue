<template>
    <run-dialog v-model="visible" @on-open="open" @on-close="close" width="800px">
        <span slot="title">Dialog</span>
        <div class="dialog-body">
            Dialog-Body
        </div>
        <template slot="footer">
			<el-button size="small" @click="close">关闭</el-button>
		</template>
    </run-dialog>
</template>
<script>
import { Button } from 'element-ui';

export default {
    components: {
        'el-button': Button
    },
    props: ['value', 'option'],
    data () {
        return {
            visible: false,
        }
    },
    watch: {
        value (val) {
            this.visible = val;
        },
    },
    methods: {
        open() {
            
        },
        close() {
            this.$emit("input", false);
        },
    },
    mounted() {
        this.visible = this.value;
    },
        
}
</script>
<style lang="scss" scoped>
    .dialog-body {
        width: 100%;
        height: auto;
        padding: 10px 36px 60px;
        box-sizing: border-box;
        overflow: auto;
    }
</style>