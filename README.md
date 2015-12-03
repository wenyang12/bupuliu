## 引入瀑布流模块测试
**安装spm包管理**

>npm install -g spm

**安装瀑布流模块**

>spm install moving-water

**js引入**

````javascript
var movingWater = require('moving-water');//引入瀑布流模块
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
````

**本地运行**

>spm server

在浏览器输入`http://127.0.0.1:8000/index.html` 即可预览

**构建最终代码（不用先建一个dist文件夹，构建时会自动创建这个文件夹）**

>spm build index.html css/*.* //这里构建的时候默认自动构建index.js

>mkdir dist/images  //这里因为构建代码images的时候，会提示没有images文件夹，所以先创建这个文件夹

>spm build images/*.*

**用make构建**
需要创建一个Makefile文件，我这里的源码已经有了，这个文件的代码如下

````
build:
	@spm build index.html css/*.*
	@mkdir dist/images
	@spm build images/*.*
````
其实就是用make编译，帮我们自动执行Makefile里边写入的一个个命令，不用手动每次自己敲。但是，要保证自己电脑安装了make编译，可以安装[cygwin](http://www.cygwin.com/);

然后安装时，添加一个镜像http://mirrors.163.com/cygwin/
![添加镜像图](http://wenyang-public.stor.sinaapp.com/Uploads/20151203/1449121181_1160471122.png)

然后接着下一步选取make点击下一步安装即可

![添加镜像图](http://wenyang-public.stor.sinaapp.com/Uploads/20151203/1449121196_2038698492.png)

>make build  //即可执行Makefile文件里写入的命令，已达到同样效果



最终的代码会被放入dist这个文件夹下。
最终的效果可以看我的[v2版本](https://github.com/wenyang12/bupuliu/tree/v2)
