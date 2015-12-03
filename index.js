/**
 * Created by Administrator on 2015/12/2.
 */
var movingWater = require('moving-water');
movingWater.init('.pubuliu-box','.img-box',callback);
function callback(parent) {
    //模拟数据
    var ajaxData =[{src:'images/1.jpg'},{src:'images/2.jpg'},{src:'images/3.jpg'},{src:'images/4.jpg'},{src:'images/5.jpg'},{src:'images/6.jpg'},{src:'images/7.jpg'},{src:'images/8.jpg'},{src:'images/9.jpg'},{src:'images/10.jpg'}];
    ajaxData.forEach(function(el) {
        var imgBox = document.createElement('div');
        var imgInner = document.createElement('div');
        var img = document.createElement('img');
        imgBox.className='img-box';
        imgInner.className = 'img-inner';
        img.src = el.src;
        imgInner.appendChild(img);
        imgBox.appendChild(imgInner);
        parent.appendChild(imgBox);
    });
}