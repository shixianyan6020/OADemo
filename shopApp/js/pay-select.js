

function createPayTypeSelect(CallBack)
{
	var selectDiv = HCoder.createDivNode({"id":"wm_selectPayType","class":"box mui-popover mui-popover-action mui-popover-bottom"});
	var content = HCoder.createDivNode({"class":"mui-content"});
	var title = HCoder.createH5Node({"style":"text-align: center; margin-top: 10px;"});
	title.innerHTML="选择支付方式";
	
	var ui = HCoder.createUlNode({"class":"mui-table-view mui-table-view-radio"});
	var li_alipay = HCoder.createLiNode({"id":"alipay","class":"mui-table-view-cell mui-selected"});
	li_alipay.innerHTML='<a class="mui-navigate-right">支付宝</a>';
	ui.appendChild(li_alipay);
	
	var li_wxpay = HCoder.createLiNode({"id":"wxpay","class":"mui-table-view-cell"});
	li_wxpay.innerHTML='<a class="mui-navigate-right">微信</a>';	
	ui.appendChild(li_wxpay);
	
	var li_balance = HCoder.createLiNode({"id":"balance","class":"mui-table-view-cell"});
	li_balance.innerHTML='<a class="mui-navigate-right">余额</a>';	
	ui.appendChild(li_balance);	
	
	var btn = HCoder.createHtmlNode({"id":"btnPay","type":"button","class":"mui-btn mui-btn-blue mui-btn-block"});
	btn.innerHTML="确认支付";
	
	content.appendChild(title);
	content.appendChild(ui);
	content.appendChild(btn);
	selectDiv.appendChild(content);
	
	
	var body = document.getElementsByTagName('body')[0];
	body.appendChild(selectDiv);
	
	document.getElementById("btnPay").addEventListener('tap',function(e){
		
		var payType = document.getElementById("wm_selectPayType");
		var sel= payType.querySelector('.mui-selected');	
		
		CallBack(sel.id);
		//mui.alert(sel.id);
	});		
	
}

function showPaySelect()
{
	mui('#wm_selectPayType').popover('toggle');	
	
}




