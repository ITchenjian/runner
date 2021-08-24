<template>
    <div class="run-dialog__wrapper" :class="{active:value}">
        <div ref="dialogBox" class="run-dialog">
			<div class="run-dialog-header">
				<div class="run-dialog-header-btns">
					<slot name="todo"></slot>
				</div>
				<div ref="dialogBoxHeaderTitle" class="run-dialog-header-title" :class="{nomove:(moveable===false||isMax===true)}">
					<slot name="title"></slot>
				</div>
				<div class="run-dialog-header-close">
					<span class="run-dialog__reset" v-show="isMax" @click.stop="resetClick"></span>
					<span class="run-dialog__max" v-show="!isMax&&hasMax!==false" @click.stop="maxClick"></span>
					<span class="run-dialog__close" @click.stop="closeClick()"></span>
				</div>
			</div>
			<div ref="dialogBoxBody" class="run-dialog-body" :class="{'max-class':isMax===true}">
                <div class="form-error-tips"></div>
				<slot></slot>
                <div v-if="$scopedSlots['footer']" class="run-dialog-footer">
                    <slot name="footer">
                    </slot>
                </div>
			</div>
			<slot name="dialogBox"></slot>
		</div>
		<slot name="moreDialog"></slot>
        <slot name="other"></slot>
    </div>
</template>

<script>
export default {
    name: 'RunDialog',
    data() {
        return {
            id: null,
            isClose: false,
            isMax: false,
            _left: null,
            _top: null,
            _width: null,
            _height: null
        }
    },
    props: ["width", "height", "left", "top", "moveable", "value", "zIndex", "hasMax", "maxHeight"],
    methods: {
        resetClick() {
            this.isMax = false;
            this.open(this._width, this._height, this._left, this._top);
            setTimeout(() => {
                var dom = this.$refs['dialogBoxBody'] // this.$el.querySelector(".run-dialog-body");
                if(dom) {
                    dom.scrollTop = 0;
                }
            }, 10);
        },
        maxClick() {
            this.isMax = true;
            this.open("100%", "100%", "0", "0");
        },
        closeClick() {
            this.isClose = true;
            this.$emit("input", false);
            this.$emit("on-close");
            this.close();
        },
        setCurrentDialog() {
            setTimeout(() => {
                var doms = document.querySelectorAll(".dialog.current-dialog");
                if(doms.length > 0) {
                    for(var i = 0, ii = doms.length; i < ii; i++) {
                        doms[i].className = doms[i].className.replace(/\s+current-dialog/g, "");
                    }
                }

                var dom = this.$el;
                dom.className = dom.className + " current-dialog";
                dom = null;
            }, 50);
        },
        open(width, height, left, top) {
            this.$emit("on-resize", this.isMax);
            var box = this.$refs.dialogBox // this.$el.querySelector(".run-dialog");
            box.style.width = width;
            box.style.height = height;
            box.style.left = left;
            box.style.top = top;
            this.setCurrentDialog();
        },
        close() {
            setTimeout(() => {
                var dom = this.$el;
                dom.className = dom.className.replace(/\s+current-dialog/g, "");
                var doms = document.querySelectorAll(".dialog.active");
                if(doms.length > 0) {
                    var ele = doms[doms.length - 1];
                    ele.className = ele.className + " current-dialog";
                }

                dom = null;
            }, 100);
        },
        init() {
            //初始化height、width、left、top、zindex;
            var body = document.body;
            var _width = this.width;
            if(_width && _width.indexOf("%") > -1) {
                _width = body.clientWidth * parseFloat(_width) / 100 + "px";
            }

            var _height = this.height;
            if(_height && _height.indexOf("%") > -1) {
                _height = body.clientHeight * parseFloat(_height) / 100 + "px";
            }

            var _top = this.top;
            if(_top && _top.indexOf("%") > -1) {
                _top = body.clientHeight * parseFloat(_top) / 100 + "px";
            }

            var _left = this.left;
            if(_left && _left.indexOf("%") > -1) {
                _left = body.clientWidth * parseFloat(_left) / 100 + "px";
            }

            var width = this._width = _width || (body.clientWidth / 2 + "px");
            var height = this._height = _height || "auto";
            var left = this._left = _left || (parseInt(body.clientWidth - parseInt(width)) / 2) + "px";
            var top = this._top = _top || "50px";
            var zindex = this.zIndex;

            var box = this.$refs.dialogBox // this.$el.querySelector(".run-dialog");
            box.style.width = width;
            box.style.height = height;
            box.style.left = left;
            box.style.top = top;

            if(zindex !== undefined) {
                box.parentNode.style.zIndex = zindex;
            }

            //初始化最大高度

            var clientHeight = body.clientHeight;
            setTimeout(() => {
                var _maxHeight = this.maxHeight;
                if(_maxHeight) {
                    this.$refs.dialogBoxBody
                    this.$refs.dialogBoxBody.style.maxHeight = _maxHeight;
                } else {
                    this.$refs.dialogBoxBody.style.maxHeight = (document.body.clientHeight - parseFloat(top) - this.$refs.dialogBoxHeaderTitle.clientHeight) + "px";
                }

                this.setCurrentDialog();
                box = null;
                delete this.init;
            }, 100);

            this.$emit("on-open");

            if(this.moveable === false) {
                return;
            }

            var moveBtn = this.$refs.dialogBoxHeaderTitle // box.querySelector(".run-dialog-header-title");
            var clientx, clienty, moveStart = false,
                moveBox = document.querySelector("body>.dialog-move-box");

            //初始化拖动虚拟框
            if(!moveBox) {
                var divEle = document.createElement("div");
                divEle.className = "dialog-move-box";
                document.body.appendChild(divEle);
                moveBox = document.querySelector("body>.dialog-move-box");
            }

            //虚拟框根据鼠标的移动进行移动
            function moveFunc(e) {
                if(!moveStart) {
                    return;
                }

                var left = (parseInt(moveBox.style.left) + e.clientX - clientx);
                var top = (parseInt(moveBox.style.top) + e.clientY - clienty);

                moveBox.style.left = left + "px";
                moveBox.style.top = top + "px";
                clientx = e.clientX;
                clienty = e.clientY;
            }

            moveBtn.addEventListener("mousedown", function(e) {
                e.preventDefault();
                if(this.className.indexOf("nomove") > -1) {
                    return;
                }

                clientx = e.clientX;
                clienty = e.clientY;
                box = this.parentNode.parentNode;
                moveBox.style.top = box.style.top || "";
                moveBox.style.left = box.style.left || "";
                moveBox.style.height = box.offsetHeight + "px";
                moveBox.style.width = box.offsetWidth + "px";
                moveBox.className = moveBox.className + " active";
                moveStart = true;
                document.body.addEventListener("mousemove", moveFunc, false);
            }, false);

            document.addEventListener("mouseup", function(e) {
                if(moveStart === true) {
                    document.body.removeEventListener("mousemove", moveFunc);
                    box.style.top = moveBox.style.top;
                    box.style.left = moveBox.style.left;
                    moveBox.className = moveBox.className.replace(/ active/g, "");
                    moveStart = false;
                    box = null;
                }
            }, false);

            moveBtn = null;
            body = null;
        }
    },
    watch: {
        value(val) {
            if(val === false) {
                this.close();
                return;
            }

            if(this.init) {
                this.init();
                return;
            }

            this.resetClick();
            this.$emit("on-open");
        },
    },
    mounted() {
        if(this.value && this.init) {
            this.init();
        }
        this.$emit('mounted')
    }
}
</script>
