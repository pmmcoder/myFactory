/**
 * Created by pmm on 18/02/05.
 * ���촥����������Ϣ
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
        this.vendorID = '';    //�����̵�id
        // this.triggerConfigFactory = [];
        // this.condition = {};   //��̨���õĴ���������
        // this.actions = {};     //��̨���õĴ���������
        // this.event = '';       //��̨���õĴ���������
        this.userData = {    //�û����������Ľ������
            '1' : '',                //�ÿ�ҳ��URL
            '2' : '',                //ҳ��ȴ�ʱ��
            '3' : '',                //�ÿͷ��ʴ���
            '4' : '',                 //�ÿ͵���
            '5' : '',                 //�ÿͷ���ʱ��
            '6' : '',                 //�ÿͱ�ǩ
            '7' : ''                 //�ÿ͹��ں�
        };
        this.userConfig = {};
        this.userTriggerObj = {};
        this.triggerFactory = [];
        // this.triggerRegisterAnd = [];    //��������������ע��
        // this.triggerRegisterOr = [];    //��������������ע��
        this.triggerAjax = {
            ajaxGetTriggerConfig : '/osp2016/chat/ajax/ajaxIMTrigger.php'
        };
    }
    chatTrigger.prototype = {
        init : function (params) {
            var ex = this;
            //ҳ������ʼ��
            ex.userTriggerObj.chatWinMsg = ex.trigger_container.find('.bw8_ai_chat');

            ex.vendorID = params.vendorID;
            if(ex.vendorID){
                ex.initAjaxData();
            }
        },

        initAjaxData : function () {
            var ex = this;
            //ajaxȥ��ȡ��̨������Ϣ
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
            //������Ϣ�����ɴ���������
            if(!condition || condition === '' || typeof condition === 'undefined'){
                return;
            }
            $.each(condition,function (k,v) {
                if (k === 'or'){
                    $.each(v,function (kk,vv) {
                        //���ش��������
                        switch (vv[1]) {
                            case '1' :          //����
                                triggerRegisterOr.push(function (userData) {
                                    return userData[vv[0]] === vv[2];
                                });
                                break;
                            case '2' :          //������
                                triggerRegisterOr.push(function (userData) {
                                    return userData[vv[0]] !== vv[2];
                                });
                                break;
                            case '3' :          //����
                                triggerRegisterOr.push(function (userData) {
                                    return userData[vv[0]] > vv[2];
                                });
                                break;
                            case '4' :          //С��
                                triggerRegisterOr.push(function (userData) {
                                    return userData[vv[0]] < vv[2];
                                });
                                break;
                            case '5' :          //���ڻ����
                                triggerRegisterOr.push(function (userData) {
                                    return userData[vv[0]] >= vv[2];
                                });
                                break;
                            case '6' :          //С�ڻ����
                                triggerRegisterOr.push(function (userData) {
                                    return userData[vv[0]] <= vv[2];
                                });
                                break;
                            case '7' :          //����
                                triggerRegisterOr.push(function (userData) {
                                    return vv[2].indexOf(userData[vv[0]]);
                                });
                                break;
                            case '8' :          //������
                                triggerRegisterOr.push(function (userData) {
                                    return !vv[2].indexOf(userData[vv[0]]);
                                });
                                break;
                            case '9' :          //��
                                triggerRegisterOr.push(function (userData) {
                                    return userData[vv[0]] === vv[2];
                                });
                                break;
                            case '10' :         //����
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
                        //���ش��������
                        switch (vv[1]) {
                            case '1' :          //����
                                triggerRegisterAnd.push(function (userData) {
                                    return userData[vv[0]] === vv[2];
                                });
                                break;
                            case '2' :          //������
                                triggerRegisterAnd.push(function (userData) {
                                    return userData[vv[0]] !== vv[2];
                                });
                                break;
                            case '3' :          //����
                                triggerRegisterAnd.push(function (userData) {
                                    return userData[vv[0]] > vv[2];
                                });
                                break;
                            case '4' :          //С��
                                triggerRegisterAnd.push(function (userData) {
                                    return userData[vv[0]] < vv[2];
                                });
                                break;
                            case '5' :          //���ڻ����
                                triggerRegisterAnd.push(function (userData) {
                                    return userData[vv[0]] >= vv[2];
                                });
                                break;
                            case '6' :          //С�ڻ����
                                triggerRegisterAnd.push(function (userData) {
                                    return userData[vv[0]] <= vv[2];
                                });
                                break;
                            case '7' :          //����
                                triggerRegisterAnd.push(function (userData) {
                                    return vv[2].indexOf(userData[vv[0]]);
                                });
                                break;
                            case '8' :          //������
                                triggerRegisterAnd.push(function (userData) {
                                    return !vv[2].indexOf(userData[vv[0]]);
                                });
                                break;
                            case '9' :          //��
                                triggerRegisterAnd.push(function (userData) {
                                    return userData[vv[0]] === vv[2];
                                });
                                break;
                            case '10' :         //����
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

        //1������ͷ���(�Ȳ���)
        distributionServiceGroup : function () {
            
        },

        //2������ͷ�(�Ȳ���)
        distributionService : function () {

        },

        //3�ͷ����ÿͷ�����Ϣ
        serviceToClientMsg : function (params) {
            var ex = this;
            var html = ex.modifiedTemplate('service',{chatMsg:params});
            ex.userTriggerObj.chatWinMsg.append(html);
        },

        //4�����˸��ÿͷ�����Ϣ
        robotToClientMsg : function (params) {
            var ex = this;
            var html = ex.modifiedTemplate('robot',{chatMsg:params});
            ex.userTriggerObj.chatWinMsg.append(html);
        },

        //5�ͷ�ģʽ(�Ȳ���)
        serviceModel : function () {

        },

        debuggerModel : function (msg) {
            var ex = this;
            if(ex.debuggerStatsu){
                console.log(msg);
            }
        },

        //ѡ��ִ��ѡ��
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

        //���ش��������
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
                        //������ִ��
                        ex.runOptions(v.triggerActions);
                    }
                }
                else if(v.triggerRegisterAnd.length > 0){
                    if(resultAdd){
                        //������ִ��
                        ex.runOptions(v.triggerActions);
                    }
                }
                else if(v.triggerRegisterOr.length > 0){
                    if(resultOr){
                        //������ִ��
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

            //��ʼ��client����
            ex.userData[userParams.condition] = userParams.userTrigger;

            //�жϴ������Ƿ���Ч
            ex.triggerResult();
        },

        //������Ϣģ�崦����
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