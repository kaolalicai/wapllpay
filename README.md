# 连连支付-WAP SDK

## 连连支付回调
> 异步回调是post请求，以字节流的方式回送数据。
> 成功支付的同步回调是post请求，以字节流的方式回送数据。
> 支付失败直接get请求url_return的地址

**注意：目前只接入了wap端的实名认证支付功能，新增RSA加密方式,目前SDK支持RSA以及MD5两种加密方式,新增加订单查询接口
**若只是接入连连的IOS，Android SDK，也可直接使用本SDK进行数据验证**

## API

[getPrepositPayHtml](#getPrepositPayHtml)

[paySuccess](#paySuccess)

[getStopNotifyData](#getStopNotifyData)

[verify](#verify)

[doQuery](#doQuery)

[getBankPayHtml](#getBankPayHtml)

<a name="getPrepositPayHtml" />

创建订单，异步回调数据解析以及同步回调数据解析

```js
var express = require('express');
var app = express();
var webllpay = require('wapllpay');
var intiData = {
	oid_partner:"",//商户ID,连连后台查看
	key:"",//MD5加密key，连连后台查看
	notify_url:'http://****/webllpay/notify_url',//异步返回地址
	url_return:'http://****/webllpay/url_return',//同步返回地址		
	yt_pub_key:"",//连连公钥
	trader_pri_key:"",//商户私钥
	sign_type:"RSA"//签名方式
}
var initWebllpay = new webllpay(intiData);//实例化
//支付demo 
app.get('/webllpay',function(req,res){
	var testData = {
		user_id:'',//该用户在商户系统中的唯一编号,要求是该编号在商户系统中唯一标识该用户
		no_order:'',//商户系统唯一订单号
		dt_order:'',//商户订单时间,格式:YYYYMMDDH24MISS,14 位数字,精确到秒
		money_order:'0.01',//交易金额,该笔订单的资金总额,单位为 RMB-元。号交易金额大于 0 的数字,精确到小数点后两位。如:49.65
		id_no:'',//证件号码,身份证,18位
		acct_name:'',//银行账号姓名
		card_no:"",
		risk_item:"",//用户注册时间,YYYYMMDDH24MISS,14 位数字,精确到秒
		no_agree:''//绑定卡支付有就传,体验超赞,需要联系连连技术开通，默认不返回，这个值开通后，会在异步回调那里返回该值
	}
	//连连支付api,参数正确会返回表单html
	var html = initWebllpay.getPrepositPayHtml(testData);
	console.log('html:'+html);
	res.send(html);
});
//连连同步回掉以post方式发送字节流
app.post('/webllpay/url_return',function(req,res){
	var body = '';
	//注意：以字节流方式接收数据
	req.on('data',function(chunk){
		//console.log(Buffer.isBuffer(chunk))
		body += chunk
	});
	req.on('end',function(){
		console.log(body);
		var result = webllpay.UTIL.resStringToJSON(body);
		initWebllpay.paySuccess(result,function(err,data){
			if(!err && data.code === 0){
				//已完成支付
				//data
				{ 
					code: 0,
					msg: 'ok',
					data: 
					{ 
						dt_order: '',
						money_order: '0.01',
						no_order: '',
						oid_partner: '',
						oid_paybill: '',
						result_pay: 'SUCCESS',
						settle_date: '20150804',
						sign: 'dkAF4lGGgvwQLB+xhyPbqrPz+QAZikwA2ldCvR1dY5Tem4p+G8TO7jpP0OQgAqX3vYy7s1vHl/5wLT6O2r3t0wNIX/PrAxOl9+QTpb624QQoWXb+xsyAzm+RxojHbww3xNy7BoE23wqOjihaEDkYxiTIDSPOb/LIwOfqQhY8vJ8=',
						sign_type: 'RSA' 
					} 
				}
			}
		});	
  	})
});
//连连异步回掉以post方式发送字节流
app.post('/webllpay/notify_url',function(req,res){
	//注意：以字节流方式接收数据
	var body = '';
	req.on('data',function(chunk){
		//console.log(Buffer.isBuffer(chunk))
		body += chunk
	});
	req.on('end',function(){
		console.log(body);
		var result = webllpay.UTIL.resStringToJSON(body);
		initWebllpay.paySuccess(result,function(err,data){
			if(!err && data.code === 0){
				//已完成支付
				//data
				{ 
					code: 0,
					msg: 'ok',
					data: 
					{ 
						acct_name: '',
						bank_code: '',
						dt_order: '',
						id_no: '',
						id_type: '0',
						info_order: '考拉理财,开启懒人理财生活。',
						money_order: '0.01',
						no_agree: '',
						no_order: 'navy_test1438681106977',
						oid_partner: '',
						oid_paybill: '',
						pay_type: 'D',
						result_pay: 'SUCCESS',
						settle_date: '20150804',
						sign: '884e233450e0ca20ee351c37f5b63eee',
						sign_type: 'MD5' 
					} 
				}
			}
			//注意，这里必须返回固定的json数据给连连
			res.send(initWebllpay.getStopNotifyData());
		});	
  	})
});
//连连支付失败后的同步返回地址，get请求
app.get('/webllpay/url_return',function(req,res){
	res.send('支付失败了');
});
```


<a name="paySuccess" />

创建订单，异步或者同步回调数据解析以及同步回调数据解析

```js
//连连异步回掉以post方式发送字节流
app.post('/webllpay/notify_url',function(req,res){
	//注意：以字节流方式接收数据
	var body = '';
	req.on('data',function(chunk){
		//console.log(Buffer.isBuffer(chunk))
		body += chunk
	});
	req.on('end',function(){
		console.log(body);
		var result = webllpay.UTIL.resStringToJSON(body);
		initWebllpay.paySuccess(result,function(err,data){
			if(!err && data.code === 0){
				//已完成支付
				//data
				{ 
					code: 0,
					msg: 'ok',
					data: 
					{ 
						acct_name: '',
						bank_code: '',
						dt_order: '',
						id_no: '',
						id_type: '0',
						info_order: '考拉理财,开启懒人理财生活。',
						money_order: '0.01',
						no_agree: '',
						no_order: 'navy_test1438681106977',
						oid_partner: '',
						oid_paybill: '',
						pay_type: 'D',
						result_pay: 'SUCCESS',
						settle_date: '20150804',
						sign: '884e233450e0ca20ee351c37f5b63eee',
						sign_type: 'MD5' 
					} 
				}
			}
			//注意，这里必须返回固定的json数据给连连
			res.send(initWebllpay.getStopNotifyData());
		});	
  	})
});


```

<a name="getStopNotifyData" />

获取终止异步回调的相应字符串

**注：当向连连发送字符串时，代表商户已经成功处理回调，连连将终止异步回调。**

```js
//wap异步回调数据
res.send(initWebllpay.getStopNotifyData());
```

<a name="verify" />

签名认证

```js
//连连异步回掉以post方式发送字节流
app.post('/webllpay/notify_url',function(req,res){
	//注意：以字节流方式接收数据
	var body = '';
	req.on('data',function(chunk){
		//console.log(Buffer.isBuffer(chunk))
		body += chunk
	});
	req.on('end',function(){
		console.log(body);
		var result = webllpay.UTIL.resStringToJSON(body);
		//签名认证
		if(initWebllpay.verify(result)){
			//支付结果认证
			if(initWebllpay.success(result)){
				//支付结果以此为准,商户按此进行后续是否发货操作
				console.log('+++++++++++++++++++++++++');
				//注意，这里必须返回固定的json数据给连连
				res.json({"ret_code":"0000","ret_msg":"交易成功"});//连连要求返回的数据，以表示商户正常接受到异步订单处理
			}else{
				res.send('支付不成功');//支付不成功
			}				
		}else{
			//数据认证不通过,数据被篡改
			res.json(result);
		}	
  	})
});
```


<a name="doQuery" />

订单查询接口

```		
initWebllpay.doQuery({
	no_order:"商户订单号"
},function(err,data){
	if(!err){
		//result_pay:SUCCESS, 为支付成功
		data => {
			bank_code: '03080000',
			bank_name: '招商银行',
			card_no: '621483******9421',
			dt_order: '20150609175947',
			info_order: '考拉理财,开启懒人理财生活。',
			money_order: '1.00',
			no_order: '5576b9135cf7efc965da0b2b',
			oid_partner: '2015**************502',
			oid_paybill: '2015**************368',
			pay_type: 'D',
			result_pay: 'SUCCESS',
			ret_code: '0000',
			ret_msg: '交易成功',
			settle_date: '20150609',
			sign: '79ef7f2422565671398487995660c619',
			sign_type: 'MD5'
		}
		//对订单进行验签
		//有三个字段不参与验证bank_name,memo,card_no
		delete data.bank_name;
		delete data.memo;
		delete data.card_no;
		if(self.verify(data)){
			//数据合法
			//todo
		}else{
			//数据被篡改
			//todo
		}
	}
})
```

<a name="getBankPayHtml" />

连连PC支付

```		
initWebllpay.getBankPayHtml({
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
},function(err,resultHtml){
	// todo 
	// resultHtml 为跳转的html
})
```

启动app

```js
app.listen(8007);
console.log('app listen on 8007');
```

## 发布logs

- 1.0.0 版本添加PC支付接口: getBankPayHtml