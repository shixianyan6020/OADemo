
var new_element=document.createElement("script");
new_element.setAttribute("type","text/javascript");
new_element.setAttribute("src","../js/md5.js");// 在这里引入了a.js
document.body.appendChild(new_element);

var load_element=document.createElement("script");
load_element.setAttribute("type","text/javascript");
load_element.setAttribute("src","../js/load.js");// 在这里引入了a.js
document.body.appendChild(load_element);

	
//	var httpUrl = "http://50.50.50.4:8088/api/";
	var httpUrl = "http://www.qiansibei.com:8088/api/";
	var app_key = "9e304d4e8df1b74cfa009913198428ab";
	var v = "v1.0";
	var sign_method = "md5";
	var signConstant = "4f4f8dd219bbdde0ae6bbe02be217c3a";
	session_key = localStorage.getItem('session_key');
	
	//获取当前时间戳
	function getTimestamp(){
		return (Date.parse(new Date())/1000).toString();
	}
	//获取sign签名 
	function getSign(keyOptions){
		var sign = signConstant;
		var isFirst = false;
		for (var  key in keyOptions) {
			if (!isFirst) {
				sign = sign +key+'='+keyOptions[key];
				isFirst = true;
			}else {
				sign = sign + '&';
				sign = sign +key+'='+ keyOptions[key];
			}
		}
		sign = sign + signConstant;
		return sign;
	}
	
	//获取md5 sign签名 
	function getSignContent(keyOptions){
		
		
		var sign = signConstant;
		var isFirst = false;
		for (var  key in keyOptions) {
			if (!isFirst) {
				sign = sign +key+'='+keyOptions[key];
				isFirst = true;
			}else {
				sign = sign + '&';
				sign = sign +key+'='+ keyOptions[key];
			}
		}
		
		
		sign = sign + signConstant;
		return sign;
	}	
	
	
	
	//获取发送数据的
	 function getdata(options,apiName){
//		var timestamp = getTimestamp();
//		var sign = hex_md5(getSign(options));
//		var data = {
//			app_key:app_key,
//			method:apiName,
//			timestamp:timestamp,
//			v:'v1.0',
//			sign_method:'md5',
//			session_key:session_key,
//			sign:sign,
//		};
		
		var data={};
		
		for (var key in options) {
			data[key] = options[key];
		}
		return data;
	}

	//输出日志
	function logData(data)
	{
//		console.log(JSON.stringify(data));
	
	}
	 
	function getErrordescriptionByType(type)
	{
		var des = "";
		if(type=="timeout")
		{
			des="请求超时!";
		}
		else if(type=="error")
		{
			des="请求错误!";
		}
		else if(type=="abort")
		{
			des="请求被取消!";
		}
		else if(type=="parsererror")
		{
			des="数据解析错误!";
		}		
		else if(type=="null")
		{
			des="其他错误";
		}			
		return des;
	}
	 

(function(w){
	//获取sessionKey
	w.ajax_get_SessionKey = function(){
		mui.ajax('http://182.140.244.73:91/sessionkey',{
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				logData(data);
				localStorage.setItem('session_key',data.session_key);
				//关闭启动页面
				closeStartScreent();
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	};
	


	/**
	 * 统一处理的post方法 
	 * @param {Object} options  请求参数 json对象
	 * @param {Object} apiName  请求api路径 字符串
	 * @param {Object} Callback 回调函数
	 */
	w.ajax_post_loading=function(options,apiName,Callback)
	{
		waitTip="载入中.....";
		if(options.waitTip!=undefined)
		{
			waitTip = options.waitTip;
			delete options.waitTip;
		}
//		startLoad();
		var data = getdata(options,apiName);
		plus.nativeUI.showWaiting(waitTip);
		mui.ajax(httpUrl+apiName,{
			data:data,
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:30000,//超时时间设置为30秒；
			success:function(data){
				
				logData(data);
				setTimeout(function(){
//					endLoad();
					plus.nativeUI.closeWaiting();
					Callback(data);
				},500);
			},
			error:function(xhr,type,errorThrown){
//				plus.nativeUI.closeWaiting();
				var resData={};
				resData["status"]="error";
				resData["description"]=getErrordescriptionByType(type);
				
				options["resData"]=resData;
				setTimeout(function(){
					plus.nativeUI.closeWaiting();
					Callback(options);
				},500);			
			}
		});	
	}
		
	/**
	 * 没有等待提示的ajax操作
	 * @param {Object} options  请求参数 json对象
	 * @param {Object} apiName  请求api路径 字符串
	 * @param {Object} Callback 回调函数
	 */
	w.ajax_post_noWait=function(options,apiName,Callback)
	{
		var data = getdata(options,apiName);
		mui.ajax(httpUrl+apiName,{
			data:data,
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:30000,//超时时间设置为30秒；
			success:function(data){
				
				logData(data);
				Callback(data);
			},
			error:function(xhr,type,errorThrown){
				var resData={};
				resData["status"]="error";
				resData["description"]=getErrordescriptionByType(type);
				options["resData"]=resData;
				Callback(options);;			
			}
		});	
	}	

	//获取分类第一级
	w.ajax_get_first_category = function(options,Callback) {
		
		if(Callback==null)
		{
			ajax_post_loading(options,"goodclass/listfirst",categoryStairSuccess);
		}
		else
		{
			ajax_post_loading(options,"goodclass/listfirst",Callback);
		}
	}
	
	//获取系统商品分类列表
	w.ajax_get_sys_good_category = function(options,Callback) {
		
		if(Callback==null)
		{
			ajax_post_loading(options,"goodclass/listShow",categoryStairSuccess);
		}
		else
		{
			ajax_post_loading(options,"goodclass/listShow",Callback);
		}
	}	

	//商品分页查询函数
	w.ajax_get_product_list = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"product/list",productlistSuccess);
		}
		else
		{
			ajax_post_loading(options,"product/list",Callback);
		}		
		

	}
	
	//商品详情
	w.ajax_get_product_detail = function(options,Callback){
		if(Callback==null)
		{
			ajax_post_loading(options,"product/view",productDetailSuccess);
		}
		else
		{
			ajax_post_loading(options,"product/view",Callback);
		}	
	}	
	//商品收藏
	w.ajax_post_product_favorite = function(options,Callback){
		if(Callback==null)
		{
			ajax_post_loading(options,"favorite/save",favGoodSuccess);
		}
		else
		{
			ajax_post_loading(options,"favorite/save",Callback);
		}	
	}	

	//商品加入购物车  如果没有登录,应该暂存到session中.暂未实现
	w.ajax_post_product_add_cart = function(options,Callback){
		if(Callback==null)
		{
			ajax_post_loading(options,"shopCart/addItem",addCartSuccess);
		}
		else
		{
			ajax_post_loading(options,"shopCart/addItem",Callback);
		}	
	}

	//获取推荐商品
	w.ajax_get_Recommend = function(Callback){
		
		var options = {};
		options["_query.recommend"] = 1;
		options["pageSize"] = 6; 
		options["pageNumber"] = 1; 
		options["splitpage"] = 1; 
		options["orderColunm"] =  "addTime"; 
		options["orderMode"] =  "desc";
		if(Callback==null)
		{
			ajax_post_loading(options,"product/list",getRecommendSuccess);
		}
		else
		{
			ajax_post_loading(options,"product/list",Callback);
		}
		
	}
	
	//获取首页轮播图和商品分类数据
	w.ajax_get_home_data = function(options,Callback){
		
//		var options = {};

		if(Callback==null)
		{
			ajax_post_loading(options,"home/home",getHomeDataSuccess);
		}
		else
		{
			ajax_post_loading(options,"home/home",Callback);
		}
		
	}	
	
	//获取楼层数据
	w.ajax_get_Floor = function(Callback){
		
		var options = {};
//		options["floorId"] = "2"; 
//		options["_query.gcId"] = options["floorId"];
//		options["pageSize"] = 6; 
//		options["pageNumber"] = 1; 
//		options["splitpage"] = 1; 
//		options["orderColunm"] =  "addTime"; 
//		options["orderMode"] =  "desc";
		if(Callback==null)
		{
			ajax_post_loading(options,"product/floor",getFloorSuccess);
		}
		else
		{
			ajax_post_loading(options,"product/floor",Callback);
		}
		
	}

	//用户登录
	w.ajax_post_login = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"login/login",login_success);
		}
		else
		{
			ajax_post_loading(options,"login/login",Callback);
		}
	}

	//用户注销
	w.ajax_post_logout = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"login/logout",success_logout);
		}
		else
		{
			ajax_post_loading(options,"login/logout",Callback);
		}
	}

	//用户注册
	w.ajax_post_register = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"user/register",registerSuccess);
		}
		else
		{
			ajax_post_loading(options,"user/register",Callback);
		}
	}
	
	//发送手机验证码
	w.ajax_post_generic_mobile_verify = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"user/mobilesms",generic_mobile_verify_code_Success);
		}
		else
		{
			ajax_post_loading(options,"user/mobilesms",Callback);
		}
	}	
		
	//提交保存充值记录
	w.ajax_post_save_predeposit = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"predeposit/save",predepositSaveSuccess);
		}
		else
		{
			ajax_post_loading(options,"predeposit/save",Callback);
		}
	}
	
	//提交充值支付成功
	w.ajax_post_predeposit_success = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"predeposit/paySuccess",predepositPaySuccess);
		}
		else
		{
			ajax_post_loading(options,"predeposit/paySuccess",Callback);
		}
	}	
	
	//查询充值记录
	w.ajax_post_predeposit_record_success = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"predeposit/list",loadPredepositRecordSuccess);
		}
		else
		{
			ajax_post_loading(options,"predeposit/list",Callback);
		}
	}	
	
	//设置充值记录的支付方式
	w.ajax_post_predeposit_setPayment = function(options,Callback){
		
		if(Callback==null)
		{
			mui.alert("回调函数不能为空!");
		}
		else
		{
			ajax_post_noWait(options,"predeposit/setPayment",Callback);
		}
	}			
	
	
	//升级VIP
	w.ajax_post_upgrade_vip = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"user/upgrade",success_Upgrade);
		}
		else
		{
			ajax_post_loading(options,"user/upgrade",Callback);
		}
	}	


	//获取用户信息
	w.ajax_get_user_center = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"user/userCenter",requestUserCenterSuccess);
		}
		else
		{
			ajax_post_loading(options,"user/userCenter",Callback);
		}
	}	

	//提交获取支付订单信息
	w.ajax_get_pay_orderInfo = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"pay/app_alipay",requestPayOrderInfoSuccess);
		}
		else
		{
			ajax_post_loading(options,"pay/app_alipay",Callback);
		}
	}
	
	//提交支付订单
	w.ajax_post_pay_request = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"pay/app_pay",requestPayOrderInfoSuccess);
		}
		else
		{
			ajax_post_loading(options,"pay/app_pay",Callback);
		}
	}	
	
	//提交支付完成通知
	w.ajax_post_pay_success_notice = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"pay/app_paySuccess",requestPayOrderInfoSuccess);
		}
		else
		{
			ajax_post_loading(options,"pay/app_paySuccess",Callback);
		}
	}		
	
	//获取当前用户的地址列表
	w.ajax_get_Address_List = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"address/index",loadAddressListSuccess);
		}
		else
		{
			ajax_post_loading(options,"address/index",Callback);
		}
	}	
	
	//获取城市选择三级数据
	w.ajax_get_city_data_List = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"area/areaJson",loadCityDataSuccess);
		}
		else
		{
			ajax_post_loading(options,"area/areaJson",Callback);
		}
	}	
	
	//保存用户收货地址
	w.ajax_post_save_address = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"address/save",saveAddressSuccess);
		}
		else
		{
			ajax_post_loading(options,"address/save",Callback);
		}
	}	
	
	//修改保存用户收货地址
	w.ajax_post_update_address = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"address/update",saveAddressSuccess);
		}
		else
		{
			ajax_post_loading(options,"address/update",Callback);
		}
	}	
	//删除收货地址
	w.ajax_post_delete_address = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"address/delete",deleteAddressSuccess);
		}
		else
		{
			ajax_post_loading(options,"address/delete",Callback);
		}
	}
	//设置收货地址默认
	w.ajax_post_default_address = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"address/setDefault",defaultAddressSuccess);
		}
		else
		{
			ajax_post_loading(options,"address/setDefault",Callback);
		}
	}	
	
	//修改登录密码
	w.ajax_post_change_password = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"user/modifyPass",changePwdSuccess);
		}
		else
		{
			ajax_post_loading(options,"user/modifyPass",Callback);
		}
	}	
	
	//提交保存订单
	w.ajax_post_save_orderForm = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"order/save",saveOrderSuccess);
		}
		else
		{
			ajax_post_loading(options,"order/save",Callback);
		}
	}	
	//查询订单
	w.ajax_post_view_orderForm = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"order/view",loadOrderSuccess);
		}
		else
		{
			ajax_post_loading(options,"order/view",Callback);
		}
	}	
	
	//订单操作请求 删除 取消,提醒发货.确认收货等
	w.ajax_post_option_orderForm = function(options,Callback){
		
		var param = {};
		param["userId"]=options.userId;
		param["orderId"]=options.orderId;
		param["orderNo"]=options.orderNo;
		param["action"]="order/"+options.action;
//		console.log("action:"+param.action);
		
		var data = getdata(param,param.action);
		plus.nativeUI.showWaiting("操作请求中.....");
		mui.ajax(httpUrl+param.action,{
			data:data,
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:5000,//超时时间设置为5秒；
			success:function(data){
				
				logData(data);
				options["resData"]=data;
				setTimeout(function(){
					plus.nativeUI.closeWaiting();
					Callback(options);
				},500);
			},
			error:function(xhr,type,errorThrown){
				
				var resData={};
				resData["status"]="error";
				resData["description"]=getErrordescriptionByType(type);
				
				options["resData"]=resData;
				setTimeout(function(){
					plus.nativeUI.closeWaiting();
					Callback(options);
				},500);				
			}
		});	
	}		
	
	//删除购物车商品
	w.ajax_delete_cartItem = function(options,Callback){
		
		if(Callback==null)
		{
			mui.alert("回调函数不能为空!");
		}
		else
		{
			ajax_post_noWait(options,"shopCart/deleteItem",Callback);
		}
	}		
	//更新购物车商品数量
	w.ajax_update_cartItem_count = function(options,Callback){
		
		if(Callback==null)
		{
			mui.alert("回调函数不能为空!");
		}
		else
		{
			ajax_post_noWait(options,"shopCart/updateGoodCount",Callback);
		}
	}			
	//更新购物车商品规格
	w.ajax_update_cartItem_spec = function(options,Callback){
		
		if(Callback==null)
		{
			mui.alert("回调函数不能为空!");
		}
		else
		{
			ajax_post_noWait(options,"shopCart/updateGoodSpec",Callback);
		}
	}	
	
	//加载商品规格列表 根据商品id
	w.ajax_post_load_goodSpec = function(options,Callback){
		
		if(Callback==null)
		{
			mui.alert("回调函数不能为空!");
		}
		else
		{
			ajax_post_noWait(options,"goodspec/listByGood",Callback);
		}
	}	
	
	//加载收藏商品和店铺信息或者其他的收藏信息
	w.ajax_post_load_favirate = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"favorite/list",favirateLoadSuccess);
		}
		else
		{
			ajax_post_loading(options,"favorite/list",Callback);
		}
	}		
	
	//删除收藏商品或者店铺
	w.ajax_delete_favirate_item = function(options,Callback){
		
		if(Callback==null)
		{
			mui.alert("回调函数不能为空!");
		}
		else
		{
			ajax_post_noWait(options,"favorite/delete",Callback);
		}
	}
	
	//加载店铺基本信息
	w.ajax_post_load_storeInfo = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"store/view",loadStoreInfoSuccess);
		}
		else
		{
			ajax_post_loading(options,"store/view",Callback);
		}
	}	
	
	//加载店铺自定义商品分类
	w.ajax_load_store_goodClass = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"usergoodclass/listShow",loadUserGoodClassSuccess);
		}
		else
		{
			ajax_post_loading(options,"usergoodclass/listShow",Callback);
		}
	}		
	//加载店铺首页数据
	w.ajax_post_load_storeHome = function(options,Callback){
		
		if(Callback==null)
		{
			ajax_post_loading(options,"store/home",loadStoreHomeSuccess);
		}
		else
		{
			ajax_post_loading(options,"store/home",Callback);
		}
	}		
	
})(window);
