/**
 * 支付操作封装
 */
var payOption=function()
{
	var _this=this;
	//是否显示余额支付
	var _isShowBalance=true;
	
	//支付方式选择完成后回调
	var _payTypeSelCallBack=null;
	
	//用户id
	var _userId="";
	//订单编号
	var _orderNo="";
	//订单类型
	var _orderType="goods";
	
	//订单费用
	var _total=0;
	
	//支付方式
	var _payType="alipay";
	
	//支付请求完成回调
	var _payRequestCallBack=null;
	
	//支付完成后回调
	var _paySuccessCallback=null;
	
	//支付通道列表
	var _channelList =null;
	
	//支付结果
	var _payResult=null;
	
	/**
	 * 设置支付数据
	 */
	this.setPayData=function(payData)
	{
		if(payData==null || payData==undefined)
		{
			mui.alert("设置支付数据不能为空!");
			return ;
		}
		
		if(payData.orderNo!=undefined)
		{
			_orderNo = payData.orderNo;
		}
		
		if(payData.orderType!=undefined)
		{
			_orderType = payData.orderType;
		}		
		
		if(payData.total!=undefined)
		{
			_total = payData.total;
		}	
		
		if(payData.payType!=undefined)
		{
			_payType = payData.payType;
		}		
		
		if(payData.userId!=undefined)
		{
			_userId = payData.userId;
		}			
	}
	
	//返回请求支付数据
	this.getPayData=function()
	{
		var payData = {};
		payData["payType"]=_payType;
		payData["orderType"]=_orderType;
		payData["total"]=_total;
		payData["orderNo"]=_orderNo;	
		payData["userId"]=_userId;
		
		return payData;
	}
	
	/**
	 * 初始化
	 */
	this.init=function(attrs)
	{		
		if(attrs!=null && attrs!=undefined)
		{
			if(attrs.showBalance!=undefined)
			{
				_isShowBalance=attrs.showBalance;
			}
			
			if(attrs.payTypeSelCallBack!=undefined)
			{
				_payTypeSelCallBack=attrs.payTypeSelCallBack;
			}		
			
			if(attrs.paySuccessCallback!=undefined)
			{
				_paySuccessCallback=attrs.paySuccessCallback;
			}			
			
		}
		
//		var selectDiv = HCoder.createDivNode({"id":"wm_selectPayType","class":"box mui-popover mui-popover-action mui-popover-bottom"});
//		var content = HCoder.createDivNode({"class":"mui-content"});
//		var title = HCoder.createH4Node({"style":"text-align: center; margin-top: 10px;"});
//		title.innerHTML="选择支付方式";
//		
//		var ui = HCoder.createUlNode({"class":"mui-table-view mui-table-view-radio"});
//		var li_alipay = HCoder.createLiNode({"id":"alipay","class":"mui-table-view-cell mui-selected"});
//		li_alipay.innerHTML='<a class="mui-navigate-right">支付宝</a>';
//		ui.appendChild(li_alipay);
//		
//		var li_wxpay = HCoder.createLiNode({"id":"wxpay","class":"mui-table-view-cell"});
//		li_wxpay.innerHTML='<a class="mui-navigate-right">微信</a>';	
//		ui.appendChild(li_wxpay);
//		
//		if(_isShowBalance)
//		{
//			var li_balance = HCoder.createLiNode({"id":"balance","class":"mui-table-view-cell"});
//			li_balance.innerHTML='<a class="mui-navigate-right">余额</a>';	
//			ui.appendChild(li_balance);	
//		}
//
//		var btn = HCoder.createHtmlNode({"id":"btnPay","type":"button","class":"mui-btn mui-btn-blue mui-btn-block"});
//		btn.innerHTML="确认支付";
//		
//		content.appendChild(title);
//		content.appendChild(ui);
//		content.appendChild(btn);
//		selectDiv.appendChild(content);

		var selectDiv = HCoder.createDivNode({"id":"wm_selectPayType","class":"box mui-popover mui-popover-action mui-popover-bottom"});
		var cardContent = HCoder.createDivNode({"class":"mui-card"});
		var divTitle = HCoder.createDivNode({"class":"mui-card-header"});
		divTitle.innerHTML="选择支付方式";
		var content = HCoder.createDivNode({"class":"mui-card-content"});
		var title = HCoder.createH4Node({"style":"text-align: center; margin-top: 10px;"});
		title.innerHTML="选择支付方式";
		
		var ui = HCoder.createUlNode({"class":"mui-table-view mui-table-view-radio"});
		var li_alipay = HCoder.createLiNode({"id":"alipay","class":"mui-table-view-cell mui-selected"});
		li_alipay.innerHTML='<a class="mui-navigate-right">支付宝</a>';
		ui.appendChild(li_alipay);
		
		var li_wxpay = HCoder.createLiNode({"id":"wxpay","class":"mui-table-view-cell"});
		li_wxpay.innerHTML='<a class="mui-navigate-right">微信</a>';	
		ui.appendChild(li_wxpay);
		
		if(_isShowBalance)
		{
			var li_balance = HCoder.createLiNode({"id":"balance","class":"mui-table-view-cell"});
			li_balance.innerHTML='<a class="mui-navigate-right">余额</a>';	
			ui.appendChild(li_balance);	
		}

		var btn = HCoder.createHtmlNode({"id":"btnPay","type":"button","class":"mui-btn mui-btn-blue mui-btn-block"});
		btn.innerHTML="确认支付";
		
		content.appendChild(ui);
		cardContent.appendChild(divTitle);
		cardContent.appendChild(content);
//		content.appendChild(title);
		
		cardContent.appendChild(btn);
		selectDiv.appendChild(cardContent);
		
		
		var body = document.getElementsByTagName('body')[0];
		body.appendChild(selectDiv);
		
		document.getElementById("btnPay").addEventListener('tap',function(e){
			
			var payType = document.getElementById("wm_selectPayType");
			var sel= payType.querySelector('.mui-selected');	
			
			_payType=sel.id;
			
			if(_payTypeSelCallBack!=null)
			{
				var payData =  _this.getPayData();
				
				_payTypeSelCallBack(payData);
			}
			
			//开始请求
			_this.payContentRequest();
//			CallBack(sel.id);
			//mui.alert(sel.id);,"style":"margin-top: 10px;"
		});
		
		
		//初始化支付通道
		_this.initChannel();
	}
	
	//弹出显示支付选择器
	this.showPaySelect = function()
	{
		mui('#wm_selectPayType').popover('toggle');	
	}
	
	this.hidePaySelect=function()
	{
		mui('#wm_selectPayType').popover('hide');	
	}
	
	/**
	 * 支付内容请求
	 */
	this.payContentRequest=function()
	{	
		var payData = this.getPayData();	
		ajax_post_pay_request(payData,this.payContentRequestSuccess);
	}
	
	this.payContentRequestSuccess=function(resData)
	{
		console.log("payContentRequestSuccess:"+JSON.stringify(resData));
		
		//如果是余额支付,则直接处理支付成功回调..
		if(resData.status=="success")
		{
			if(_payType=="balance")
			{
//				mui.alert("余额支付完成!");
				var data={};
				data["payData"]=_this.getPayData();
				data["resData"]=resData;
				if(_paySuccessCallback !=null)
				{
					_paySuccessCallback(data);
				}
				
				//隐藏弹出框
				_this.hidePaySelect();
			}
			else
			{
				_this.payRequest(resData.data);
				
			}
		}
		else
		{
			mui.alert(resData.description);
		}
		
		if(_payRequestCallBack!=null)
		{
			_payRequestCallBack(resData);
		}

	}
	
	/**
	 * 调用系统支付请求,请求支付.
	 */
	this.payRequest=function(payData)
	{
		channel = _this.getChannelById(_payType);
		if(channel==null)
		{
			mui.alert("支付通道获取失败:"+_payType);
			return;
		}
		
		if(!channel.serviceReady)
		{
			mui.alert("选择的支付方式没有安装相关服务!");
			return ;
		}
		
   		//提交支付
   		plus.payment.request(channel, payData,_this.paySuccess,_this.payError);		
		
	}
	
	/**
	 * 支付成功回调
	 */
	this.paySuccess=function(result)
	{
		_payResult = result;
		console.log(" payresult:"+JSON.stringify(result));

		//发送支付成功通知
		_this.sendPaySuccessNotice();
		
//		mui.alert("支付成功");
	}
	
	/**
	 * 支付失败回调
	 */
	this.payError=function(error)
	{
		mui.alert("支付失败:"+JSON.stringify(error));
		
	}
	
	/**
	 * 发送支付成功通知
	 */
	this.sendPaySuccessNotice=function()
	{
		var payData=_this.getPayData();
		payData["tradeNo"]=_payResult.tradeno;
		
		console.log("send notify:"+JSON.stringify(payData));
		ajax_post_pay_success_notice(payData,_this.sendPayMoticeCallBack);	
	}
	
	/**
	 * 通知回调
	 */
	this.sendPayMoticeCallBack=function(res)
	{
		console.log("sendPayMoticeCallBack"+JSON.stringify(res));
		if(res.status=="success")
		{
			var data = {};
			data["payData"] = _this.getPayData();
			data["resData"] = _payResult;
			
			if(_paySuccessCallback !=null)
			{
				_paySuccessCallback(data);
			}			
		}

		//隐藏弹出框
		_this.hidePaySelect();			
		
	}
	
	
	
	/**
	 * 初始化支付通道
	 */
	this.initChannel=function()
	{
		plus.payment.getChannels(function(channels){
			
			_channelList=channels;
			for(var i in _channelList)
			{
				channel = _channelList[i];
				
				//暂时取消服务安装检测
//				_this.checkPayServices(channel);
				
//				console.log(JSON.stringify(channel));
			}
			
		},function(e){
			mui.alert("获取支付通道失败：" + e.message);
		}
		);
		
	}
	
	/**
	 * 检测支付服务是否准备好.
	 */
	this.checkPayServices =function(channel)
	{
		if(!channel.serviceReady) {
			var txt = null;
			switch(channel.id) {
				case "alipay":
					txt = "检测到系统未安装“支付宝快捷支付服务”，无法完成支付操作，是否立即安装？";
					break;
				default:
					txt = "系统未安装“" + channel.description + "”服务，无法完成支付，是否立即安装？";
					break;
			}
			plus.nativeUI.confirm(txt, function(e) {
				if(e.index == 0) {
					channel.installService();
				}
			}, channel.description);
		}		
	}
	
	/**
	 * 根据支付通道id获取支付通道
	 */
	this.getChannelById=function(channelId)
	{
		if(_channelList==null)
		{
			return null;
		}
		
		for(var i in _channelList)
		{
			var channelTmp = _channelList[i];
			if(channelTmp.id==channelId)
			{
				return channelTmp;
			}
		}	
		
		return null;
		
	}
}


