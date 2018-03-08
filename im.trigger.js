/**
 * Created by pmm on 18/02/05.
 * 聊天触发器配置信息
 * example ajax data:{
            "event": "page_enter",
            "condition": [
                "or"=>[
                    [
                        "2",
                        "1",
                        "60"
                    ],
                    [
                        "1",
                        "1",
                        "20180206"
                    ]
                ]
            ],
            "actions": [
                [
                    "3",
                    "4"
                ]
            ]
        };
 */
define(function(require, exports, module) {
    "use strict";
    var $ = require('jquery');
    var formatData = require("bw8im/im.date");

    function chatTrigger(win_container) {
        this.trigger_container = $(win_container);
        this.debuggerStatsu = true;
        this.vendorID = '';    //服务商的id
        // this.triggerConfigFactory = [];
        // this.condition = {};   //后台配置的触发器条件
        // this.actions = {};     //后台配置的触发器动作
        // this.event = '';       //后台配置的触发器名称
        this.userData = {    //用户动作出发的结果反馈
            '1' : '',                //访客页面URL
            '2' : '',                //页面等待时间
            '3' : '',                //访客访问次数
            '4' : '',                 //访客地区
            '5' : '',                 //访客访问时间
            '6' : '',                 //访客标签
            '7' : ''                 //访客公众号
        };
        this.userConfig = {};
        this.userTriggerObj = {};
        this.triggerFactory = [];
        // this.triggerRegisterAnd = [];    //触发器条件函数注册
        // this.triggerRegisterOr = [];    //触发器条件函数注册
        this.triggerAjax = {
            ajaxGetTriggerConfig : '/osp2016/chat/ajax/ajaxIMTrigger.php'
        };
    }
    chatTrigger.prototype = {
        init : function (params) {
            var ex = this;
            //页面对象初始化
            ex.userTriggerObj.chatWinMsg = ex.trigger_container.find('.bw8_ai_chat');

            ex.vendorID = params.vendorID;
            if(ex.vendorID){
                ex.initAjaxData();
            }
        },

        initAjaxData : function () {
            var ex = this;
            //ajax去获取后台配置信息
            $.getJSON(ex.triggerAjax.ajaxGetTriggerConfig,{vendorID:ex.vendorID},function (data) {
                if(data){
                    $.each(data,function (k,v) {
                        var condition = v.condition;
                        var actions = v.actions;
                        ex.initConfig(condition,actions);
                    });
                }
                else{
                    ex.debuggerModel(data);
                }
            });
        },

        initConfig : function (condition,actions) {
            var ex = this;
            var triggerRegisterOr =[];
            var triggerRegisterAnd =[];
            //配置信息的生成触发器条件
            if(!condition || condition === '' || typeof condition === 'undefined'){
                return;
            }
            $.each(condition,function (k,v) {
                if (k === 'or'){
                    $.each(v,function (kk,vv) {
                        //返回触发器结果
                        switch (vv[1]) {
                            case '1' :          //等于
                                triggerRegisterOr.push(function (userData) {
                                    return userData[vv[0]] === vv[2];
                                });
                                break;
                            case '2' :          //不等于
                                triggerRegisterOr.push(function (userData) {
                                    return userData[vv[0]] !== vv[2];
                                });
                                break;
                            case '3' :          //大于
                                triggerRegisterOr.push(function (userData) {
                                    return userData[vv[0]] > vv[2];
                                });
                                break;
                            case '4' :          //小于
                                triggerRegisterOr.push(function (userData) {
                                    return userData[vv[0]] < vv[2];
                                });
                                break;
                            case '5' :          //大于或等于
                                triggerRegisterOr.push(function (userData) {
                                    return userData[vv[0]] >= vv[2];
                                });
                                break;
                            case '6' :          //小于或等于
                                triggerRegisterOr.push(function (userData) {
                                    return userData[vv[0]] <= vv[2];
                                });
                                break;
                            case '7' :          //包含
                                triggerRegisterOr.push(function (userData) {
                                    return vv[2].indexOf(userData[vv[0]]);
                                });
                                break;
                            case '8' :          //不包含
                                triggerRegisterOr.push(function (userData) {
                                    return !vv[2].indexOf(userData[vv[0]]);
                                });
                                break;
                            case '9' :          //是
                                triggerRegisterOr.push(function (userData) {
                                    return userData[vv[0]] === vv[2];
                                });
                                break;
                            case '10' :         //不是
                                triggerRegisterOr.push(function (userData) {
                                    return userData[vv[0]] !== vv[2];
                                });
                                break;
                            default:
                                break;
                        }
                    });
                }
                else if(k === 'and'){
                    $.each(v,function (kk,vv) {
                        //返回触发器结果
                        switch (vv[1]) {
                            case '1' :          //等于
                                triggerRegisterAnd.push(function (userData) {
                                    return userData[vv[0]] === vv[2];
                                });
                                break;
                            case '2' :          //不等于
                                triggerRegisterAnd.push(function (userData) {
                                    return userData[vv[0]] !== vv[2];
                                });
                                break;
                            case '3' :          //大于
                                triggerRegisterAnd.push(function (userData) {
                                    return userData[vv[0]] > vv[2];
                                });
                                break;
                            case '4' :          //小于
                                triggerRegisterAnd.push(function (userData) {
                                    return userData[vv[0]] < vv[2];
                                });
                                break;
                            case '5' :          //大于或等于
                                triggerRegisterAnd.push(function (userData) {
                                    return userData[vv[0]] >= vv[2];
                                });
                                break;
                            case '6' :          //小于或等于
                                triggerRegisterAnd.push(function (userData) {
                                    return userData[vv[0]] <= vv[2];
                                });
                                break;
                            case '7' :          //包含
                                triggerRegisterAnd.push(function (userData) {
                                    return vv[2].indexOf(userData[vv[0]]);
                                });
                                break;
                            case '8' :          //不包含
                                triggerRegisterAnd.push(function (userData) {
                                    return !vv[2].indexOf(userData[vv[0]]);
                                });
                                break;
                            case '9' :          //是
                                triggerRegisterAnd.push(function (userData) {
                                    return userData[vv[0]] === vv[2];
                                });
                                break;
                            case '10' :         //不是
                                triggerRegisterAnd.push(function (userData) {
                                    return userData[vv[0]] !== vv[2];
                                });
                                break;
                            default:
                                break;
                        }
                    });
                }
                else{
                    return;
                }
                ex.triggerFactory.push({
                    triggerRegisterOr:triggerRegisterOr,
                    triggerRegisterAnd:triggerRegisterAnd,
                    triggerActions : actions
                });
            });

        },

        //1分配给客服组(先不做)
        distributionServiceGroup : function () {
            
        },

        //2分配给客服(先不做)
        distributionService : function () {

        },

        //3客服给访客发送消息
        serviceToClientMsg : function (params) {
            var ex = this;
            var html = ex.modifiedTemplate('service',{chatMsg:params});
            ex.userTriggerObj.chatWinMsg.append(html);
        },

        //4机器人给访客发送消息
        robotToClientMsg : function (params) {
            var ex = this;
            var html = ex.modifiedTemplate('robot',{chatMsg:params});
            ex.userTriggerObj.chatWinMsg.append(html);
        },

        //5客服模式(先不做)
        serviceModel : function () {

        },

        debuggerModel : function (msg) {
            var ex = this;
            if(ex.debuggerStatsu){
                console.log(msg);
            }
        },

        //选定执行选项
        runOptions : function (triggerActions) {
            var ex = this;
            $.each(triggerActions,function (k,v) {
                if(v.length > 0){
                    switch (v[0]){
                        case '1':
                            ex.distributionServiceGroup();
                            break;
                        case '2':
                            ex.distributionService();
                            break;
                        case '3':
                            ex.serviceToClientMsg(v[1]);
                            break;
                        case '4':
                            ex.robotToClientMsg(v[1]);
                            break;
                        case '5':
                            ex.serviceModel();
                            break;
                        default:
                            break;
                    }
                }
            });
        },

        //返回触发器结果
        triggerResult : function () {
            var ex = this;
            var resultOr = false;
            var resultAdd = true;
            $.each(ex.triggerFactory,function (k,v) {
                $.each(v.triggerRegisterAnd,function (k,v) {
                    resultAdd = resultAdd && v(ex.userData);
                });
                $.each(v.triggerRegisterOr,function (kk,vv) {
                    resultOr = resultOr || vv(ex.userData);
                });
                if(v.triggerRegisterAnd.length > 0 && v.triggerRegisterOr.length > 0){
                    if(resultOr && resultAdd){
                        //触发器执行
                        ex.runOptions(v.triggerActions);
                    }
                }
                else if(v.triggerRegisterAnd.length > 0){
                    if(resultAdd){
                        //触发器执行
                        ex.runOptions(v.triggerActions);
                    }
                }
                else if(v.triggerRegisterOr.length > 0){
                    if(resultOr){
                        //触发器执行
                        ex.runOptions(v.triggerActions);
                    }
                }
            });


        },

        /*
        * userParams = {
             userValue : {
                 win_style : 1,
                 vendorLogo : 'https://bangwo8.oss-cn-shenzhen.aliyuncs.com/80126/rhFzmywixa.jpg',
                 kf_photo : 'https://bangwo8.oss-cn-shenzhen.aliyuncs.com/80126/rhFzmywixa.jpg'
             },
             condition : '2',
             userTrigger : '60'
         }*/
        userStartEvent : function (userParams) {
            var ex = this;

            ex.userConfig.win_style = parseInt(userParams.userValue.win_style) || 1;
            ex.userConfig.vendorLogo = userParams.userValue.vendorLogo;
            ex.userConfig.kf_photo = userParams.userValue.kf_photo;

            //初始化client数据
            ex.userData[userParams.condition] = userParams.userTrigger;

            //判断触发器是否生效
            ex.triggerResult();
        },

        //接受消息模板处理函数
        modifiedTemplate:function (type,params) {
            var ex = this;
            var params = params || {};
            var window_temp = {};
            var html = '';
            if(ex.userConfig.win_style === 1){
                window_temp.temp1 = 'chat_time_ai_person_narrow';
                window_temp.temp2 = 'clientele_chat_ai_icon_narrow';
                window_temp.temp3 = 'bw8_chat_content_font_narrow';
            }else{
                window_temp.temp1 = 'chat_time_ai_person_wide';
                window_temp.temp2 = 'clientele_chat_ai_icon_wide';
                window_temp.temp3 = 'bw8_chat_content_font_wide';
            }
            switch (type){
                case 'robot':
                html += '<div class="bw8_ai_chat_content">'+
                    '<div class="'+window_temp.temp1+'">'+formatData.formatTime()+'</div>'+
                    '<div class="'+window_temp.temp2+' dhn_fl" >'+
                    '<div class="chat_ai_icon"></div>'+
                    '</div>'+
                    '<div class="'+window_temp.temp3+' dhn_fl">'+
                    '<span class="bw8_chat_left_pc_top_arrow bw8_chat_skin"></span>'+
                    '<div>'+params.chatMsg +'</div>'+
                    '</div>'+
                    '</div>'+
                    '</div>';
                break;
            case 'service':
                var kfPhotoStyle = '';
                kfPhotoStyle = 'style="border-radius:50px;background : url('+ex.userConfig.kf_photo+') no-repeat;background-size:36px 36px;"';

                html += '<div class="bw8_ai_chat_content">'+
                    '<div class="'+window_temp.temp1+'">'+formatData.formatTime()+'</div>'+
                    '<div class="'+window_temp.temp2+' dhn_fl" >'+
                    '<div class="chat_ai_icon" '+kfPhotoStyle+'></div>'+
                    '</div>'+
                    '<div class="'+window_temp.temp3+' dhn_fl">'+
                    '<span class="bw8_chat_left_pc_top_arrow bw8_chat_skin"></span>'+
                    '<div>'+params.chatMsg +'</div>'+
                    '</div>'+
                    '</div>'+
                    '</div>';
                break;
            }
            return html;
        }
    };
    module.exports = chatTrigger;
});