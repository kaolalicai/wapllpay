var webllpay = require('../lib/llpayapi');
var should = require('should');
var intiPay = new webllpay();
describe('#intiPay.getPrepositPayHtml()',function(){
	it('should return <div style=\'width:100%;color:red;text-align:center;padding-top:20px;\'>缺少风险参数:risk_item</div>',function(){
		intiPay.getPrepositPayHtml({
			user_id:'54cef05579337f164b365050',//该用户在商户系统中的唯一编号,要求是该编号在商户系统中唯一标识该用户
			no_order:'5518d825d5cdc86106eeeee',//商户系统唯一订单号
			dt_order:'20150428163735',//商户订单时间,格式:YYYYMMDDH24MISS,14 位数字,精确到秒
		}).should.equal("<div style='width:100%;color:red;text-align:center;padding-top:20px;'>缺少风险参数:risk_item</div>");
	});
	it('should return <div style=\'width:100%;color:red;text-align:center;padding-top:20px;\'>风险参数,用户注册时间:user_info_dt_register 必须是 14 位数字</div>',function(){
		intiPay.getPrepositPayHtml({
			user_id:'54cef05579337f164b365050',//该用户在商户系统中的唯一编号,要求是该编号在商户系统中唯一标识该用户
			no_order:'5518d825d5cdc86106eeeee',//商户系统唯一订单号
			dt_order:'201504281635',//商户订单时间,格式:YYYYMMDDH24MISS,14 位数字,精确到秒
			risk_item:'20150428163735'
		}).should.equal("<div style='width:100%;color:red;text-align:center;padding-top:20px;'>风险参数,用户注册时间:user_info_dt_register 必须是 14 位数字</div>");
	});
	it('should return <div style=\'width:100%;color:red;text-align:center;padding-top:20px;\'>参数错误，请检查！</div>',function(){
		intiPay.getPrepositPayHtml({
			// user_id:'54cef05579337f164b365050',//该用户在商户系统中的唯一编号,要求是该编号在商户系统中唯一标识该用户
			no_order:'5518d825d5cdc86106eeeee',//商户系统唯一订单号
			dt_order:'20150428163735',//商户订单时间,格式:YYYYMMDDH24MISS,14 位数字,精确到秒
			risk_item:'20150428163735'
		}).should.equal("<div style='width:100%;color:red;text-align:center;padding-top:20px;'>参数错误，请检查！</div>");
	});
	it('should return form html',function(){
		intiPay.getPrepositPayHtml({
			user_id:'54cef05579337f164b365050',//该用户在商户系统中的唯一编号,要求是该编号在商户系统中唯一标识该用户
			no_order:'5518d825d5cdc86106eeeee',//商户系统唯一订单号
			dt_order:'20150428163735',//商户订单时间,格式:YYYYMMDDH24MISS,14 位数字,精确到秒
			money_order:'0.01',//交易金额,该笔订单的资金总额,单位为 RMB-元。号交易金额大于 0 的数字,精确到小数点后两位。如:49.65
			id_no:'440882************',//证件号码,身份证,18位
			acct_name:'谢**',//银行账号姓名
			card_no:"6227***********",
			risk_item:"20150428094501",//用户注册时间,YYYYMMDDH24MISS,14 位数字,精确到秒
		}).should.equal("<form style='width:100%;text-align:center;padding-top:50px;' id='llpaysubmit' name='llpaysubmit' action='https://yintong.com.cn/llpayh5/authpay.htm' method='POST'><input type='hidden' name='req_data' value='{\"acct_name\":\"谢**\",\"app_request\":\"3\",\"busi_partner\":\"101001\",\"card_no\":\"6227***********\",\"dt_order\":\"20150428163735\",\"id_no\":\"440882************\",\"id_type\":\"0\",\"info_order\":\"考拉理财,开启懒人理财生活。\",\"money_order\":\"0.01\",\"name_goods\":\"考拉理财\",\"no_order\":\"5518d825d5cdc86106eeeee\",\"oid_partner\":\"201408071000001546\",\"risk_item\":\"{\\\"frms_ware_category\\\":\\\"2009\\\",\\\"user_info_mercht_userno\\\":\\\"54cef05579337f164b365050\\\",\\\"user_info_dt_register\\\":\\\"20150428094501\\\",\\\"user_info_full_name\\\":\\\"谢**\\\",\\\"user_info_id_no\\\":\\\"440882************\\\",\\\"user_info_identify_type\\\":\\\"1\\\",\\\"user_info_identify_state\\\":\\\"1\\\"}\",\"sign_type\":\"MD5\",\"user_id\":\"54cef05579337f164b365050\",\"valid_order\":\"10080\",\"version\":\"1.2\",\"sign\":\"e3e455b6ee62697e5b762860934ad245\"}'/><input type='submit' style='border:none;background: none;color: green;' value='正在进入连连安全支付...'></form><script>document.forms['llpaysubmit'].submit();</script>");
	});
})