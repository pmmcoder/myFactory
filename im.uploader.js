/**
 * uploader js doc
 * http://chaping.github.io/plupload/doc/#plupload_doc1
 * upload module
 * usage:
 var u = require('bw8im/im.uploader');
 var bw8Oss = new u('#ossContainer');
 bw8Oss.init();
 bw8Oss.uploader.bind('FilesAdded',function(uploader,files){
        //code ...
    });
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var plupload = require('aliyun/plupload.full.min');
    var bw8OssConfig = {
        accessid: '',
        accesskey: '',
        host: '',//上传文件服务器地址
        policyBase64: '',
        signature: '',
        callbackbody: '',
        filename: '',
        key: '',
        expire: 0,
        g_object_name: '',//生成的新文件名称
        g_object_name_type: 'random_name',
        old_file_name: '',//初始文件名
        aId: 0,//代理商ID
        container:'',
        serverUrl: '/osp2016/chat/getOssSign.php',//签名请求url
        //请求签名
        send_request: function () {
            var xmlhttp = null;
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            }
            else if (window.ActiveXObject) {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }

            if (xmlhttp != null) {
                // bw8OssConfig.aId = document.getElementById('top').data('vendorid');
                var serverUrl = bw8OssConfig.serverUrl + '?aId=' + bw8OssConfig.aId + '&name=' + encodeURI(bw8OssConfig.old_file_name) + '&fileName=' + encodeURI(bw8OssConfig.g_object_name);
                xmlhttp.open("GET", serverUrl, false);
                xmlhttp.send(null);
                return xmlhttp.responseText
            }
            else {
                alert("Your browser does not support XMLHTTP.");
            }
        },
        //获取签名
        get_signature: function () {
            //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
            var now = Date.parse(new Date()) / 1000;
            if (bw8OssConfig.expire < now + 3) {
                var body = bw8OssConfig.send_request();
                var obj = eval("(" + body + ")");
                bw8OssConfig.host = obj['host'];
                bw8OssConfig.policyBase64 = obj['policy'];
                bw8OssConfig.accessid = obj['accessid'];
                bw8OssConfig.signature = obj['signature'];
                bw8OssConfig.expire = parseInt(obj['expire']);
                bw8OssConfig.callbackbody = obj['callback'];
                bw8OssConfig.key = obj['dir'];
                return true;
            }
            return false;
        },
        //检查是否设置上次文件类型
        check_object_radio: function () {
            var tt = document.getElementsByName('myradio');
            for (var i = 0; i < tt.length; i++) {
                if (tt[i].checked) {
                    bw8OssConfig.g_object_name_type = tt[i].value;
                    break;
                }
            }
        },
        //生成随机字符串
        random_string: function (len) {
            len = len || 32;
            var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            var maxPos = chars.length;
            var pwd = '';
            for (var i = 0; i < len; i++) {
                pwd += chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },
        //获取文件扩展名
        get_suffix: function (filename) {
            var pos = filename.lastIndexOf('.');
            var suffix = '';
            if (pos != -1) {
                suffix = filename.substring(pos)
            }
            return suffix;
        },
        //计算文件名 这里使用随机名
        calculate_object_name: function (filename) {
            if (bw8OssConfig.g_object_name_type == 'local_name') {
                bw8OssConfig.g_object_name += "${filename}";
            } else if (bw8OssConfig.g_object_name_type == 'random_name') {
                var suffix = bw8OssConfig.get_suffix(filename);
                bw8OssConfig.g_object_name = bw8OssConfig.g_object_name + bw8OssConfig.random_string(10) + suffix;
            }
            return '';
        },
        //获取已上传的文件名
        get_uploaded_object_name: function (filename) {
            if (bw8OssConfig.g_object_name_type == 'local_name') {
                var tmp_name = bw8OssConfig.g_object_name;
                tmp_name = tmp_name.replace("${filename}", filename);
                return tmp_name;
            } else if (bw8OssConfig.g_object_name_type == 'random_name') {
                return bw8OssConfig.g_object_name;
            }
        },
        //设置文件上传参数
        set_upload_param: function (up, filename, ret, flag) {
            if (filename != '' && flag == false) {
                // var suffix = bw8OssConfig.get_suffix(filename);
                bw8OssConfig.g_object_name = bw8OssConfig.aId + '/';
                bw8OssConfig.calculate_object_name(filename);
            }
            //重新获取签名
            if (ret == false) {
                ret = bw8OssConfig.get_signature();
            }
            //设置参数
            var new_multipart_params = {
                'key': bw8OssConfig.g_object_name,
                'policy': bw8OssConfig.policyBase64,
                'OSSAccessKeyId': bw8OssConfig.accessid,
                'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                'Content-Disposition': 'attachment;' + 'filename=' + encodeURI(bw8OssConfig.old_file_name),
                'callback': bw8OssConfig.callbackbody,
                'signature': bw8OssConfig.signature,
            };
            up.setOption({
                'url': bw8OssConfig.host,
                'multipart_params': new_multipart_params
            });
            up.start();
        }
    };
    var uploderConfig = {
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: 'browse_button',
        // multi_selection: false,//启用多选
        container: bw8OssConfig.container,
        flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
        silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
        url: 'https://oss.aliyuncs.com',
        drop_element:'drop_area',
        filters: {
            // mime_types : [ //只允许上传图片和zip文件
            // { title : "Image files", extensions : "jpg,gif,png,bmp" },
            // { title : "Zip files", extensions : "zip,rar" },
            // ],
            max_file_size: '10mb', //最大只能上传10mb的文件
            prevent_duplicates: true //不允许选取重复文件
        },
        init: {
            // PostInit: function () {},
            // FilesAdded: function (up, files) {},
            BeforeUpload: function (up, file) {
                bw8OssConfig.set_upload_param(up, bw8OssConfig.g_object_name, true, true);
            },
            // UploadProgress: function (up, file) {},
            // FileUploaded: function (up, file, info) {},
            // Error: function (up, err) {}
        }
    };
    function bw8Oss(wrap) {
        //上传容器
        this.wrap = wrap;
        this.ossConfig = bw8OssConfig;
        // this.uploader = null;
        // bw8OssConfig.container = this.wrap;
        // bw8OssConfig.aId = this.wrap.data('aid');
        // $.extend(uploderConfig,data);
        // this.uploader = new plupload.Uploader(uploderConfig);
    }
    //init
    bw8Oss.prototype.init = function (data) {
        var ex = this.wrap;
        bw8OssConfig.container = ex;
        bw8OssConfig.aId = $('#'+ex).data('aid');
        var config  = $.extend(uploderConfig,data);
        this.uploader = new plupload.Uploader(config);
        this.uploader.init();
        return this;
    };
    //formatSize
    bw8Oss.prototype.formatSize = function(size){
        if (size === 'undefined' || /\D/.test(size)) {
            return plupload.translate('N/A');
        }
        function round(num, precision) {
            return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
        }
        var boundary = Math.pow(1024, 4);
        // TB
        if (size > boundary) {
            return round(size / boundary, 1) + " " + plupload.translate('TB');
        }
        // GB
        if (size > (boundary/=1024)) {
            return round(size / boundary, 1) + " " + plupload.translate('GB');
        }
        // MB
        if (size > (boundary/=1024)) {
            return round(size / boundary, 1) + " " + plupload.translate('MB');
        }
        // KB
        if (size > 1024) {
            return Math.round(size / 1024) + " " + plupload.translate('KB');
        }
        return size + " " + plupload.translate('b');
    };
    module.exports = bw8Oss;
});
