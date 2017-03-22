var webllpay = require('../lib/llpayapi');
var should = require('should');
var muk = require('muk');
var request = require('request');
describe('#intiPay.getPrepositPayHtml()',function(){
	var intiPay = new webllpay({
		notify_url:'http://192.168.1.120:8008/webllpay/notify_url',
		url_return:'http://192.168.1.120:8008/webllpay/url_return'
	});
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
		var resultHtml = intiPay.getPrepositPayHtml({
			user_id:'54cef05579337f164b365050',//该用户在商户系统中的唯一编号,要求是该编号在商户系统中唯一标识该用户
			no_order:'5518d825d5cdc86106eeeee',//商户系统唯一订单号
			dt_order:'20150428163735',//商户订单时间,格式:YYYYMMDDH24MISS,14 位数字,精确到秒
			money_order:'0.01',//交易金额,该笔订单的资金总额,单位为 RMB-元。号交易金额大于 0 的数字,精确到小数点后两位。如:49.65
			id_no:'440882************',//证件号码,身份证,18位
			acct_name:'谢**',//银行账号姓名
			card_no:"6227***********",
			risk_item:"20150428094501",//用户注册时间,YYYYMMDDH24MISS,14 位数字,精确到秒
		})
		resultHtml.indexOf('<form ').should.not.equal(-1);
	});
});

describe('#intiPay.getBankPayHtml()',function(){
  var intiPay = new webllpay({
    notify_url:'http://192.168.1.120:8008/webllpay/notify_url',
    url_return:'http://192.168.1.120:8008/webllpay/url_return'
  });

  it('should return <div style=\'width:100%;color:red;text-align:center;padding-top:20px;\'>缺少风险参数:risk_item</div>',function(){
    intiPay.getBankPayHtml({
      user_id:'54cef05579337f164b365050',//该用户在商户系统中的唯一编号,要求是该编号在商户系统中唯一标识该用户
      no_order:'5518d825d5cdc86106eeeee',//商户系统唯一订单号
      dt_order:'20150428163735',//商户订单时间,格式:YYYYMMDDH24MISS,14 位数字,精确到秒
    }).should.equal("<div style='width:100%;color:red;text-align:center;padding-top:20px;'>缺少风险参数:risk_item</div>");
  });

  it('should return <div style=\'width:100%;color:red;text-align:center;padding-top:20px;\'>风险参数,用户注册时间:user_info_dt_register 必须是 14 位数字</div>',function(){
    intiPay.getBankPayHtml({
      user_id:'54cef05579337f164b365050',//该用户在商户系统中的唯一编号,要求是该编号在商户系统中唯一标识该用户
      no_order:'5518d825d5cdc86106eeeee',//商户系统唯一订单号
      dt_order:'201504281635',//商户订单时间,格式:YYYYMMDDH24MISS,14 位数字,精确到秒
      risk_item:'20150428163735'
    }).should.equal("<div style='width:100%;color:red;text-align:center;padding-top:20px;'>风险参数,用户注册时间:user_info_dt_register 必须是 14 位数字</div>");
  });

  it('should return <div style=\'width:100%;color:red;text-align:center;padding-top:20px;\'>参数错误，请检查！</div>',function(){
    intiPay.getBankPayHtml({
      // user_id:'54cef05579337f164b365050',//该用户在商户系统中的唯一编号,要求是该编号在商户系统中唯一标识该用户
      no_order:'5518d825d5cdc86106eeeee',//商户系统唯一订单号
      dt_order:'20150428163735',//商户订单时间,格式:YYYYMMDDH24MISS,14 位数字,精确到秒
      risk_item:'20150428163735'
    }).should.equal("<div style='width:100%;color:red;text-align:center;padding-top:20px;'>参数错误，请检查！</div>");
  });

  it('should return form html',function(){
    var resultHtml = intiPay.getBankPayHtml({
      user_id:'54cef05579337f164b365050',//该用户在商户系统中的唯一编号,要求是该编号在商户系统中唯一标识该用户
      no_order:'5518d825d5cdc86106eeeee',//商户系统唯一订单号
      dt_order:'20150428163735',//商户订单时间,格式:YYYYMMDDH24MISS,14 位数字,精确到秒
      timestamp: '20150428163735',
      money_order:'0.01',//交易金额,该笔订单的资金总额,单位为 RMB-元。号交易金额大于 0 的数字,精确到小数点后两位。如:49.65
      id_no:'440882************',//证件号码,身份证,18位
      acct_name:'谢**',//银行账号姓名
      card_no:"6227***********",
      bank_code: "01050000",
      risk_item:"20150428094501",//用户注册时间,YYYYMMDDH24MISS,14 位数字,精确到秒
    })
    console.log(resultHtml);
    resultHtml.indexOf('<form ').should.not.equal(-1);
  });
});

describe('#doQuery()',function(){
	describe('should ok',function(){
		var intiPay = new webllpay({
			notify_url:'http://192.168.1.120:8008/webllpay/notify_url',
			url_return:'http://192.168.1.120:8008/webllpay/url_return',
			sign_type:"RSA"
		});
		before(function(){
			muk(request,'post',function(json, callback){
				describe('#json.url should be "https://yintong.com.cn/traderapi/orderquery.htm"#',function(){
					var body = JSON.parse(json.body);
					// console.log(body);
					//地址必须是"https://yintong.com.cn/traderapi/orderquery.htm"
					it('url should ok',function(){
						json.url.should.be.equal("https://queryapi.lianlianpay.com/orderquery.htm");				
					});
					it('sign_type should ok',function(){
						body.sign_type.should.be.equal('RSA');
					});
					it('sign should ok',function(){
						body.sign.should.be.equal("n+NZFmGeGqYer6I1HYTTDUY6lF1QxZPMUkJAVlLtL5qnjd6RM+8Zed8twCt1LxOYALvP9ZqP96lJcmm0z7MAk22yCD9Cwmx6vZm8JlbLnxYs+iERLyWEVTYebdGLUFY6PzYCKiN701BGnjTqHgxHXhoLoQUO4s9ILRis9a2P5rY=");
					})
				});			
				var res = {
					"oid_partner":"201103171000000000",
					"dt_order":"20130515094013",
					"no_order":"2013051500001",
					"sign_type":"RSA",
					"sign":"ZPZULntRpJwFmGNIVKwjLEF2Tze7bqs60rxQ22CqT5J1UlvGo575QK9z/+p+7E9cOoRoWzqR6xHZ6WVv3dloyGKDR0btvrdqPgUAoeaX/YOWzTh00vwcQ+HBtXE+vPTfAqjCTxiiSJEOY7ATCF1q7iP3sfQxhS0nDUug1LP3OLk="
				};
				process.nextTick(function(){
					callback(null,{statusCode:200},JSON.stringify(res));
				})
			})
		});
		after(function(){
			muk.restore();
		});
		it('doQuery should ok',function(done){
			intiPay.doQuery({
				no_order:"5518d825d5cdc86106errrr"
			},function(err,data){
				data.should.have.properties(['oid_partner','dt_order','no_order','sign_type','sign']);
				done(err);
			})
		})
	});
});
