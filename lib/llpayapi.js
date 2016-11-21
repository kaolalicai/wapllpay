var config = require('./config');
var util = require('./util');
var url = require('./serverurlconfig');
var digest = require('./digest');
var defaultKeys = ['version','oid_partner','app_request','sign_type','busi_partner','valid_order','id_type'];//获取配置中默认参数
var keys = ['version','oid_partner','user_id','app_request','sign_type','busi_partner','no_order','dt_order','name_goods','money_order','notify_url','id_type','id_no','acct_name','risk_item'];//必填参数,注意，sign参数是通过其他参数生成的，所以这里不需要写
var optionKeys = ['platform','info_order','url_return','no_agree','valid_order','shareing_data','card_no'];//可选参数
/**
*支付前先检测参数是否合法
*/
function checkParam(data){
	for(var i = 0 , len = keys.length ; i < len ; i++){
		if(!data.hasOwnProperty(keys[i]) || !data[keys[i]]){
			return false;
		}
	}
	return true;
}
/**
*获取配置中的常量
*@param object data
*return object
*/
function defaultKeysValue(){
	var result = {};
	for(var i = 0 , len = defaultKeys.length ; i < len ; i++){
		if(config[defaultKeys[i]]){
			result[defaultKeys[i]] = config[defaultKeys[i]];
		}
	}
	return result;
}
/**
*检查时间格式是否正确，14位
*@param time string
*return boolean
*/
function checkTime(time){
	return time && time.length === 14
}
/**
*连连支付类
*#################
*json:{oid_partner:'',key:'',sign_type:'',busi_partner:'',notify_url:'',url_return:''}
*#################
*/
function Webllpay(json){
	var cloneConfig = util.clone(config);
	this.config = util.extend(cloneConfig,json);
}
/**
*获取卡前置接入支付URL
*@param object jsonData
*return string 
*#################
*jsonData:{
user_id:'',//该用户在商户系统中的唯一编号,要求是该编号在商户系统中唯一标识该用户
no_order:'',//商户系统唯一订单号
dt_order:'',//商户订单时间,格式:YYYYMMDDH24MISS,14 位数字,精确到秒
money_order:'',//交易金额,该笔订单的资金总额,单位为 RMB-元。号交易金额大于 0 的数字,精确到小数点后两位。如:49.65
id_no:'',//证件号码,身份证,18位
acct_name:'',//银行账号姓名

//******************
risk_item:JSON.stringify({
	frms_ware_category:'1009',//商品类目
	user_info_mercht_us:user_id,//商户用户唯一标识,用户在商户系统中的标识
	user_info_dt_register:'',//注册时间,YYYYMMDDH24MISS,14 位数字,精确到秒
	user_info_bind_phone:'',//绑定手机号,如有,需要传送
	risk_state:"1",//0 or 1 ,1表示参数不能修改
})//风险控制参数此字段填写风控参数,采用 json 串的模式传入
}
//******************
*#################
*/
Webllpay.prototype.getPrepositPayHtml = function(jsonData,method,button_name){
	if(!jsonData.risk_item){
		//风险参数必须提供用户注册时间:risk_item.user_info_dt_register
		return "<div style='width:100%;color:red;text-align:center;padding-top:20px;'>缺少风险参数:risk_item</div>";
	}
	var risk_item = this.getRiskItem(jsonData);
	if(typeof jsonData.risk_item === 'string'){
		risk_item['user_info_dt_register'] = jsonData.risk_item;
	}else{
		risk_item = util.extend(risk_item,jsonData.risk_item);
	}
	if(!checkTime(risk_item.user_info_dt_register) || !checkTime(jsonData.dt_order)){
		//风险参数必须提供用户注册时间:risk_item.user_info_dt_register
		return "<div style='width:100%;color:red;text-align:center;padding-top:20px;'>风险参数,用户注册时间:user_info_dt_register 必须是 14 位数字</div>";
	}
	jsonData['risk_item'] = JSON.stringify(risk_item);//risk_item:必须经过序列化
	var defaultValue = util.clone(defaultKeysValue());
	var cloneConfig = util.clone(this.config);
	jsonData = util.extend(cloneConfig,jsonData);
	jsonData = util.extend(defaultValue,jsonData);
	//检测参数是否齐全
	if(!checkParam(jsonData)){
		return "<div style='width:100%;color:red;text-align:center;padding-top:20px;'>参数错误，请检查！</div>";
	}
	jsonData = util.pick(jsonData,keys.concat(optionKeys));//拾取连连支付所支持的参数
	return this._buildRequestForm(jsonData,method,button_name);//返回支付的表单内容
}
/**
 * 建立请求，以表单HTML形式构造（默认）
 * @param $para_temp 请求参数数组
 * @param $method 提交方式。两个值可选：post、get
 * @param $button_name 确认按钮显示文字
 * @param $tip_name 自动进入支付页面的tip
 * @return 提交表单HTML文本
 */
Webllpay.prototype._buildRequestForm = function(para_temp,method,button_name,tip_name) {
	method = method || "POST";
	button_name = button_name || "3秒内不能正常进入支付页面，请点击此处";
	tip_name = tip_name || "正在进入连连安全支付...";
	//待请求参数数组
	var para = this._buildRequestPara(para_temp);
	var sHtml = "<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' /><title>正在进入连连安全支付</title></head><body><form style='width:100%;text-align:center;padding-top:50px;' id='llpaysubmit' name='llpaysubmit' action='" + url.llpay_gateway_new + "' method='" + method + "'>";
	sHtml += "<input type='hidden' name='req_data' value='" + para + "'/>";
	sHtml += "<label style='font-size:14px;' for='submitBtn'>"+tip_name+"</label>";
	sHtml += "<br /><br />";
	//submit按钮控件请不要含有name属性
	sHtml += "<input id='submitBtn' type='submit' style='border:none;background: none;color: green;text-decoration: underline;' value='" + button_name + "'></form>";
	sHtml += "<script>document.forms['llpaysubmit'].submit();</script></body></html>";
	return sHtml;
} 
/**
 * 生成要请求给连连支付的参数数组
 * @param $para_temp 请求前的参数数组
 * @return 要请求的参数数组
 */
Webllpay.prototype._buildRequestPara = function(para_temp) {
	//除去待签名参数数组中的空值和签名参数
	var para_filter = util.paraFilter(para_temp);
	//对待签名参数数组排序
	var para_sort = util.sortObjectByKey(para_filter);
	//生成签名结果
	var mysign = this._buildRequestMysign(para_sort);
	//签名结果与签名方式加入请求提交参数组中
	para_sort['sign'] = mysign;
	para_sort['sign_type'] = this.config['sign_type'].toUpperCase();
	return JSON.stringify(para_sort);
}
/**
 * 生成签名结果
 * @param $para_sort 已排序要签名的数组
 * return 签名结果字符串
 */
Webllpay.prototype._buildRequestMysign = function(para_sort){
	//把数组所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
	var prestr = util.jsonToSearch(para_sort);
	var signType = this.config['sign_type'].trim().toUpperCase();
	var mysign = "";
	switch(signType){
		case "MD5" :
			mysign = digest.md5Sign(prestr, this.config['key']);
			break;
		case "RSA" :
			mysign = digest.Rsasign(prestr, this.config['trader_pri_key'],'MD5');
			break;
		default :
			mysign = "";
	}
	return mysign;
}
/**
 * 对连连支付返回的数据进行认证
 * @param json object
 * return boolean
 */
Webllpay.prototype.verify = function(json){
	if(!util.isObject(json)){
		return false;
	}
	var result = util.clone(json);
	var sign = result.sign;
	var sign_type = result.sign_type;
	if(!sign){
		return false;
	}
	delete result.sign;
	var para_sort = util.sortObjectByKey(result);
	var prestr = util.jsonToSearch(para_sort);
	var signType = this.config['sign_type'].trim().toUpperCase();
	signType = sign_type || signType;
	if(signType === 'MD5'){
		return digest.md5Verify(prestr,sign,this.config.key);
	}else{
		return digest.Rsaverify(prestr,sign,this.config.yt_pub_key,'MD5');
	}
}
/**
 * 返回结果字段result_pay必须是SUCCESS才表示支付成功。
 * @param json object
 * return boolean
 */
Webllpay.prototype.success = function(result){
	return result.result_pay === 'SUCCESS';
}
//异步或者同步回调进行数据解析的函数，判断是否支付成功
Webllpay.prototype.paySuccess = function(data,cbf){
	var code = 0,msg = 'ok';
	if(!util.isObject(data)){
		msg = 'wapllpay SDK log : the param must be object.';
		console.warn(msg);
		return cbf(msg);
	}
	if(!data.sign){
		msg = '参数不全，需要dsign参数';
		return cbf(msg);
	}
	var verifyData = this.verify(data);
	if(!verifyData){
		msg = '验签不通过';
		return cbf(msg);
	}
	if(!this.success){
		code = 1,msg = '未支付成功，请勿执行订单更新操作。';
	}
	cbf(null,{code:code,msg:msg,data:data});		
}

//获取终止异步回调的相应字符串
Webllpay.prototype.getStopNotifyData = function(){
	return {"ret_code":"0000","ret_msg":"交易成功"};
}
/**
*获取默认的风险参数
*return object
*/
Webllpay.prototype.getRiskItem = function(json){
	var risk_item = {
		frms_ware_category:'2009',//商品类目
		user_info_mercht_userno:json.user_id,//商户用户唯一标识,用户在商户系统中的标识
		user_info_dt_register:'20150428094500',//注册时间,YYYYMMDDH24MISS,14 位数字,精确到秒
		user_info_full_name:json.acct_name,//用户注册姓名
		user_info_id_no:json.id_no,//用户注册证件号码
		user_info_identify_type:"1",//实名认证方式,是实名认证时,必填1:银行卡认证2:现场认证3:身份证远程认证4:其它认证
		user_info_identify_state:"1",//是否实名认证,1:是 0:无认证,商户自身是否对用户信息进行实名认证。默认:0
	}
	return risk_item; 
}
/**订单查询接口
@param 订单查询
@cb function
*/
Webllpay.prototype.doQuery = function(json,cb){
	var self = this;
	var defaultValue = util.clone(defaultKeysValue());
	var cloneConfig = util.clone(this.config);
	json = util.extend(cloneConfig,json);
	json = util.extend(defaultValue,json);
	//检测参数是否齐全
	if(!json.no_order){
		return cb("参数错误，请检查！");
	}
	json = util.pick(json,['oid_partner','sign_type','sign','no_order','dt_order','oid_paybill','query_version']);//拾取连连支付所支持的参数
	var obj = this._buildRequestPara(json);
	var request = require('request');
	request.post({url:url.llpay_query_url,body:obj},function(error, response, body){
		if(!error && response.statusCode === 200){
			try{
				cb(null,JSON.parse(body));
			}catch(e){
				cb(e);
			}
		}else{
			cb(error, response, body);
		}	
	})
}
Object.defineProperty(Webllpay, "UTIL", {
  get: function () {
    return util;
  }
});
Object.defineProperty(Webllpay, "DIGEST", {
  get: function () {
    return digest;
  }
});
module.exports = Webllpay;