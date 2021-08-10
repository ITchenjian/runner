import TestComp from './src/main';

/* istanbul ignore next */
TestComp.install = function(Vue) {
    Vue.component(TestComp.name, TestComp);
};

export default TestComp;
