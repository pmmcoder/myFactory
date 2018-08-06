验证微信号

微信账号仅支持6-20个字母、数字、下划线或减号，以字母开头

/^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/.test(value)

匹配腾讯QQ号码

[1-9][0-9]{4,}

JS替换字符串中的空格

var reg = /([^\s])\s+([^\s\b])/g;
var str = " 中国  北京   朝阳区  df "; 
str = str.replace(reg, "$1%$2")

匹配Email地址

[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?

匹配网址URL

[a-zA-z]+://[^\s]*

匹配(年-月-日)格式日期

([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))


匹配国内电话号码

\d{3}-\d{8}|\d{4}-\{7,8}

检查手机号码：必须以数字开头，除数字外，可含有“-”

function isMobil(s) { 
    var patrn=/^[+]{0,1}(d){1,3}[ ]?([-]?((d)|[ ]){1,12})+$/;
    if (!patrn.exec(s)) return false
    return true
} 
if(mobilephone!=""&&!/^1[358][0-9]{9}$/.test(mobilephone)){
     alert("移动号码是11个数字");
     return false;
}
//判断是否手机号
function isPhoneNumber(value){
    var flag=false;    
    if(/^(133|153|18[0169])+[0-9]{8}$/.test(value)){
        flag=true;
    }
    return flag;
}

function checkPhone(){ 
    var phone = document.getElementById('phone').value;
    if(!(/^1[34578]\d{9}$/.test(phone))){ 
        alert("手机号码有误，请重填");  
        return false; 
    } 
}

校验普通电话、传真号码：可以“+”开头，除数字外，可含有“-”

function isTel(s) { 
    var patrn=/^[+]{0,1}(d){1,3}[ ]?([-]?((d)|[ ]){1,12})+$/;
    if (!patrn.exec(s)) return false
    return true
}

配置中文字符

[\u4e00-\u9fa5]

匹配18位身份证

身份证号码最后一位目前只有X

/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/


匹配中国邮政编码

[1-9]\d{5}(?!\d)

检查是否是IP地址

(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d).(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d).(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d).(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)

不允许输入如下字符: (像 !@#$%^&* 等)

var userName = $("#userRegistName").val(); 
var first = userName.charCodeAt(0); 
function CheckUserNameFormat(){
    if ((first>=65 && first <= 90)||(first>=97 && first <=122)){
    var pattern =/^[A-Za-z0-9_]+$/;  //首字母必须是A-Z或者a-z
    if(pattern.test(userName)){ 
         ......
    }
} 


匹配数字类型

//匹配正整数
^[1-9]\d*$
//匹配负数
^-[1-9]\d*$
//正数
^-?[1-9]\d*$
//匹配非负正数（正整数 + 0）
^[1-9]\d*|0$
//匹配非正负数（负整数 + 0）
^-[1-9]\d*|0$
//匹配正浮点数
^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$
//匹配负浮点数
^-[1-9]\d*\.\d*|-0\.\d*[1-9]\d*$