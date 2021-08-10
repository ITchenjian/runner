<template>
    <div class="run-test-comp">
        <el-button type="primary">测试</el-button>
        <el-input v-model="text"></el-input>
        <span>{{text}}</span>
    </div>
</template>

<script>
import { Input, Button } from 'element-ui';

export default {
    name: 'RunTestComp',
    components: {
        'el-input': Input,
        'el-button': Button
    },
    data () {
        return {
            text: 'test-comp-success'
        }
    }
};
</script>
