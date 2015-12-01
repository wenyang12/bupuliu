---
layout: post
title: "瀑布流"
date: 2015-12-01 11:41:35 +0800
comments: true
categories: [瀑布流]
tags: [瀑布流]
---
## 实现思路
**布局**

以第一行图片为基准设置其余图片（除第一行图片）的布局排版，让这些图片都采用绝对定位，一张一张依次类推的定位在每一列最小高度的下边。

**举个栗子**：

假如界面的宽度一行只能放8张图（相当于8列），即第一行的图片个数为8张，每列也只有1张图，那么第九张图如何来摆放呢？那么第九张图应该让它采用绝对定位。

1. 定位在这8列当中高度最小的下边即可；
2. 接着又重新计算每一列的高度，找出最小的，然后放入接下来的图片，以此类推。

>1跟2不断循环，即可实现瀑布流的布局效果

最后，你会发现瀑布流，拉到最下边的时候总是不断加载图片进来，这个效果可以这么实现：

1. 首先监听滚动条滚动事件;
2. 然后当滚动条滚动到全部显示出最后一张图片时（这个判断很重要，你也可以采用其他类似判断，看你怎么判断），异步加载图片数据；
3. 用这些数据追加到页面即可。

##代码实现

```
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
    /*模块模式*/
    function loadModule(moduleArr) {//页面初始化完成时载入模块
        var event = addEvent.getInstance();
        event(window,'load',function() {
            moduleArr.forEach(function(el) {
                el.init();
            });
        });
        return moduleArr;
    }
    var pubuliuModule = (function() {
        var parentEle = document.querySelector('.pubuliu-box');
        var childEle = document.querySelectorAll('.img-box');
        function init(){
            //设置布局宽度
            var docWidth = document.documentElement.offsetWidth || document.body.offsetWidth; //获取可视文档的宽度
            var imgBoxWidth = childEle[0].offsetWidth;//获取图片盒子的宽度
            var cols = Math.floor(docWidth / imgBoxWidth);//一行能放几张图片的个数
            parentEle.style.width = cols * imgBoxWidth + 'px';//设置布局宽度
            main(cols);
            scrollAjax(cols);
        }
        //核心函数
        function main(cols) {
            //设置除了第一行图片，往后的图片的布局，计算出第一行图片当中的最小高度，然后把往后的图片用绝对定位摆放在其下边，依次类推。
            var imgHeightArr =[],imgMinHeight, imgMinHeightIndex;
            childEle = document.querySelectorAll('.img-box');
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
        function scrollAjax(cols) {
            var ajaxData =[{src:'images/1.jpg'},{src:'images/2.jpg'},{src:'images/3.jpg'},{src:'images/4.jpg'},{src:'images/5.jpg'},{src:'images/6.jpg'},{src:'images/7.jpg'},{src:'images/8.jpg'},{src:'images/9.jpg'},{src:'images/10.jpg'}];
            var event = addEvent.getInstance();
            event(window,'scroll',function() {
                if(scrollFlag()){
                    ajaxData.forEach(function(el) {
                        var imgBox = document.createElement('div');
                        var imgInner = document.createElement('div');
                        var img = document.createElement('img');
                        imgBox.className='img-box';
                        imgInner.className = 'img-inner';
                        img.src = el.src;
                        imgInner.appendChild(img);
                        imgBox.appendChild(imgInner);
                        parentEle.appendChild(imgBox);
                    });
                    main(cols);
                }
            })
        }
        //设置滚动条滚动到什么位置，加载图片
        function scrollFlag() {
            childEle = document.querySelectorAll('.img-box');
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
    loadModule([pubuliuModule]);
```
