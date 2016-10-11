npm install -g grunt-cli
上述命令执行完后，grunt 命令就被加入到你的系统路径中了，以后就可以在任何目录下执行此命令了。

注意，安装grunt-cli并不等于安装了 Grunt！Grunt CLI的任务很简单：调用与Gruntfile在同一目录中 Grunt。

假定Grunt CLI已经正确安装，并且已经有一份配置好package.json 和 Gruntfile 文件的项目了，接下来就很容易拿Grunt练手了：

将命令行的当前目录转到项目的根目录下。
执行npm install命令安装项目依赖的库。
执行 grunt 命令。

一般需要在你的项目中添加两份文件：package.json 和 Gruntfile。

package.json: 此文件被npm用于存储项目的元数据，以便将此项目发布为npm模块。
              你可以在此文件中列出项目依赖的grunt和Grunt插件，放置于devDependencies配置段内。

Gruntfile: 此文件被命名为 Gruntfile.js 或 Gruntfile.coffee，用来配置或定义任务（task）并加载Grunt插件的。  
           此文档中提到的 Gruntfile 其实说的是一个文件，文件名是 Gruntfile.js 或 Gruntfile.coffee。

向已经存在的package.json 文件中添加Grunt和grunt插件的最简单方式是通过npm install <module> --save-dev命令。此命令不光安装了<module>，还会自动将其添加到devDependencies 配置段中，遵循tilde version range格式。

例如，下面这条命令将安装Grunt最新版本到项目目录中，并将其添加到devDependencies内：

npm install grunt --save-dev
同样，grunt插件和其它node模块都可以按相同的方式安装。下面展示的实例就是安装 JSHint 任务模块：
grunt --version

npm install grunt-contrib-jshint --save-dev
在 Grunt 插件 页面可以看到当前可用的 Grunt 插件，他们可以直接在项目中安装并使用。

安装插件之后，请务必确保将更新之后的 package.json 文件提交到项目仓库中。

创建插件

通过 npm install -g grunt-init 命令安装 grunt-init 。
通过 git clone git://github.com/gruntjs/grunt-init-gruntplugin.git ~/.grunt-init/gruntplugin 命令安装grunt插件模版。
在一个空的目录中执行 grunt-init gruntplugin 。
执行 npm install 命令以准备开发环境。
为你的插件书写代码。
执行 npm publish 命令将你创建的 Grunt 插件提发布npm！



