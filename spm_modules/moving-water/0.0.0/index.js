var movingWater;

movingWater =(function() {
    /*单例模式*/
    var addEvent=(function() {//返回兼容旧浏览器的事件监听
        var instance;
        function init() {
            function temp(target,event,fn) {
                if(window.addEventListener){
                    return target.addEventListener(event, fn);
                }else if(window.attachEvent) {
                    return target.attachEvent('on'+event, fn);
                }
            }
            return temp
        }
        return{
            getInstance: function() {
                if(!instance){
                    instance = init();
                }
                return instance;
            }
        }
    }());
    function init(parent,child,callback){
        var event = addEvent.getInstance();
        event(window,'load',function() {
            var parentEle = document.querySelector(parent);
            var childEle = document.querySelectorAll(child);
            //设置布局宽度
            var docWidth = document.documentElement.offsetWidth || document.body.offsetWidth; //获取可视文档的宽度
            var imgBoxWidth = childEle[0].offsetWidth;//获取图片盒子的宽度
            var cols = Math.floor(docWidth / imgBoxWidth);//一行能放几张图片的个数
            parentEle.style.width = cols * imgBoxWidth + 'px';//设置布局宽度
            main(cols, child);
            scrollAjax(cols, child, parentEle, callback);
        });
    }
    //核心函数
    function main(cols,child) {
        //设置除了第一行图片，往后的图片的布局，计算出第一行图片当中的最小高度，然后把往后的图片用绝对定位摆放在其下边，依次类推。
        var imgHeightArr =[],imgMinHeight, imgMinHeightIndex;
        childEle = document.querySelectorAll(child);
        for(var i = 0,len = childEle.length; i < len; i++) {
            if(i < cols) {
                imgHeightArr[i]  = childEle[i].offsetHeight;
            }else{
                imgMinHeight = Math.min.apply(null, imgHeightArr); //获取第一行图片的最小高度
                imgMinHeightIndex = getImgMinIndex(imgHeightArr, imgMinHeight);//获取第一行图片最小高度对应的位置，即索引值
                //设置接下来除了第一行图片的所有图片布局
                childEle[i].style.position = 'absolute';
                childEle[i].style.top = imgMinHeight + 'px';
                childEle[i].style.left = childEle[imgMinHeightIndex].offsetLeft+'px';
                imgHeightArr[imgMinHeightIndex] = imgMinHeight + childEle[i].offsetHeight;//重新设置最小高度
            }
        }
    }
    //获取第一行图片最小高度对应的位置，即索引值
    function getImgMinIndex(imgHeightArr, imgMinHeight) {
        for(var i in imgHeightArr) {
            if(imgHeightArr[i] === imgMinHeight) {
                return i;
            }
        }
    }
    function scrollAjax(cols,child,parent,callback) {
        var event = addEvent.getInstance();
        event(window,'scroll',function() {
            if(scrollFlag(child)){
                callback(parent);
                main(cols,child);
            }
        })
    }
    //设置滚动条滚动到什么位置，加载图片
    function scrollFlag(child) {
        childEle = document.querySelectorAll(child);
        var lastImgOffsetTop = childEle[childEle.length - 1].offsetTop;
        var lastImgHeight = childEle[childEle.length - 1].offsetHeight;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;//获取滚动条向下滚滚去的高度
        var docHeight = document.documentElement.clientHeight || document.body.clientHeight;//获取文档可视区域的高度
        console.log(lastImgOffsetTop, scrollTop, docHeight,lastImgHeight);
        if(lastImgOffsetTop < scrollTop+docHeight-lastImgHeight) {//滚动条拉动显示最后一张图片底部时加载
            return true;
        }else{
            return false;
        }
    }
    return {
        init:init
    }
}());
module.exports = movingWater;
