module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            //压缩（minify）JavaScript文件
            options: {
                // 此处定义的banner注释将插入到输出文件的顶部
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:mm:ss") %> */\n'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'src/js', //js目录下
                    src: ['**/*.js', '!**/.svn', '!**/.idea', '!**/*.db', '!**/hash.js'], //所有js文件
                    dest: 'dist/js' //输出到此目录下
                }]
            }
        },
        jshint: {
            //define the files to lint
            files: ['src/**/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                //这里是覆盖JSHint默认配置的选项
                globals: {
                    console: true,
                    module: true
                }
            }
        },
        copy: {
            js: {
                cwd: 'src/js',
                src: ['**', '!**/.svn', '!**/.idea', '!**/*.db', '!**/hash.js'],
                dest: 'dist/js',
                expand: true
            },
            img: {
                cwd: 'src/images',
                src: ['**', '!**/.svn', '!**/.idea', '!**/*.db'],
                dest: 'dist/images',
                expand: true
            }
        },
        less: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'src/less',
                    src: ['**/*.less', '!**/global.less'],
                    dest: 'src/css',
                    ext: '.css'
                }]
            }
        },
        cssmin: {
            with_banner: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: '**/*.css',
                    dest: 'dist/css'
                }]
            }
        },
        watch: {
            js: {
                files: ['src/js/*.js', '!**/.svn', '!**/.idea', '!**/*.db', '!**/hash.js'],
                tasks: ['copy:js'],
                options: {
                    spawn: false
                }
            },
            less: {
                files: "src/less/*.less",
                tasks: ['less:dev']
            },
            css: {
                files: ['src/css/*.css'],
                tasks: ['cssmin'],
                options: {
                    spawn: false
                }
            },
            image: {
                files: ['src/images/*', '!**/.svn', '!**/.idea', '!**/*.db'],
                tasks: ['copy:img'],
                options: {
                    spawn: false
                }
            }
        },
        concat: {
            options: {
                // 定义一个用于插入合并输出文件之间的字符
                separator: ';'
            },
            dist: {
                // 将要被合并的文件
                src: ['dist/js/*.js','!dist/js/<%= pkg.name %>.js'],
                // 合并后的JS文件的存放位置
                dest: 'dist/js/<%= pkg.name %>.js'
            }
        }
    });
    // 加载提供任务的插件
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    //grunt.loadNpmTasks('grunt-contrib-concat');

    //默认任务
    grunt.registerTask('default', ['uglify', 'less:dev', 'cssmin', 'copy:img']);
    grunt.registerTask('dev', ['copy:js', 'less:dev', 'cssmin', 'copy:img']);

};
