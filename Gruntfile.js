module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js'],
            options: {
                //大括号包裹
                curly: true,
                //对于简单类型，使用===和!==，而不是==和!=
                eqeqeq: true,
                //对于首字母大写的函数（声明的类），强制使用new
                newcap: true,
                //禁用arguments.caller和arguments.callee
                noarg: true,
                //对于属性使用aaa.bbb而不是aaa['bbb']
                sub: true,
                //查找所有未定义变量
                undef: true,
                //查找类似与if(a = 0)这样的代码
                boss: true,
                //指定运行环境为node.js
                node: true
            },
            // globals: {
            //     console: true,
            //     define: true,
            //     global: true,
            //     module: true
            // }
        },
        uglify: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'src/js',
                    src: ['**/*.js'],
                    dest: 'bin/dist/js'
                }]
            }
        },
        less: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'src/less',
                    src: ['**/*.less', '!**/global.less', '!**/mod-**.less'],
                    dest: 'src/css',
                    ext: '.css'
                }]
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: 'src/css',
                src: '**/*.css',
                dest: 'bin/dist/css',
                ext: ".css"
            },
            conbine: {
                files: {
                    'dist/css/base.min.css': ['bin/dist/css/*.css', '!bin/dist/css/base.css']
                }
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/images',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'bin/dist/images'
                }]
            }
        },
        copy: {
            js: {
                expand: true,
                cwd: 'bin/dist/js',
                src: ['**'],
                dest: 'dist/js'
            },
            css: {
                expand: true,
                cwd: 'bin/dist/css',
                src: ['**'],
                dest: 'dist/css'
            },
            img: {
                expand: true,
                cwd: 'bin/dist/images',
                src: ['**'],
                dest: 'dist/images'
            },
            font: {
                expand: true,
                cwd: 'src/font',
                src: ['**'],
                dest: 'dist/font'
            }
        },
        concat: {
            options: {
                banner: '',
                process: function (src, filepath) {
                    return '//source: ' + filepath + '\n ' + src;

                }
            },
            js: {
                src: ['bin/dist/js/*.js'],
                dest: 'dist/js/base.min.js'
            },
            css: {
                src: ['bin/dist/css/*.css'],
                dest: 'dist/css/base.min.css'
            }
        },
        compress: {
            pub:{
                options: {
                    archive: '<%= pkg.name%>-publish.zip'
                },
                files: [
                    {expand: true, cwd: 'dist/', src: ['**'], dest: '<%= pkg.name%>/dist/'}, 
                    {src: ['*.html'], dest: '<%= pkg.name%>/'}, 
                    {expand: true, cwd: 'view/', src: ['**'], dest: '<%= pkg.name%>/view/'}, 
                ]
            },
            pack:{
                options: {
                    archive: '<%= pkg.name%>-package.zip'
                },
                files: [
                    {expand: true, cwd: 'dist/', src: ['**'], dest: '<%= pkg.name%>/dist/'}, 
                    {expand: true, cwd: 'src/', src: ['**'], dest: '<%= pkg.name%>/src/'}, 
                    {src: ['*.html'], dest: '<%= pkg.name%>/'}, 
                    {expand: true, cwd: 'view/', src: ['**'], dest: '<%= pkg.name%>/view/'}, 
                    {src: ['Gruntfile.js'], dest: '<%= pkg.name%>/'},
                    {src: ['package.json'], dest: '<%= pkg.name%>/'} 
                ]
            }
        },
        clean: {
            build: ['dest','bin','<%= pkg.name%>-publish.zip','<%= pkg.name%>-package.zip'],
        },
        watch: {
            options: {
                dateFormat: function(time) {
                    grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
                    grunt.log.writeln('Waiting for more changes...');
                },
            },
            js: {
                files: ['src/js/*.js', '!**/.svn', '!**/.idea', '!**/*.db', '!**/hash.js'],
                tasks: ['copy:js'],
                options: {
                    spawn: false
                }
            },
            less: {
                files: "src/less/**/*.less",
                tasks: ['less:dev']
            },
            css: {
                files: ['src/css/**/*.css'],
                tasks: ['cssmin'],
                options: {
                    spawn: false
                }
            },
            image: {
                files: ['src/images/**/*', '!**/.svn', '!**/.idea', '!**/*.db'],
                tasks: ['copy:img'],
                options: {
                    spawn: false
                }
            }
        }
    });
    //清理文件和文件夹
    grunt.loadNpmTasks('grunt-contrib-clean');
    //检查js语法错误
    grunt.loadNpmTasks('grunt-contrib-jshint');
    //压缩js文件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //less文件编译到css
    grunt.loadNpmTasks('grunt-contrib-less');
    //压缩css文件
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    //压缩image文件
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    //复制文件和文件夹
    grunt.loadNpmTasks('grunt-contrib-copy');
    //合并文件
    grunt.loadNpmTasks('grunt-contrib-concat');
    //运行预定义的任务只要监视的文件模式添加、更改或删除
    grunt.loadNpmTasks('grunt-contrib-watch');
    //压缩文件和文件夹
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('default', ['uglify', 'less:dev', 'cssmin:minify','imagemin', 'copy','clean']);
    grunt.registerTask('pack',['compress:pack']);
    grunt.registerTask('pub',['compress:pub']);
};
