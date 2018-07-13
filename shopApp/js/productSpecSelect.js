/**
 * 商品规格数量选择器
 */
var proSpecSel = function()
{
	var _this=this;
	//当前商品数据
	var _good= null;
	
	//默认为购物车 buy 
	var _optionType="cart";
	
	//点击确认后的回调函数
	var _okCallBack=null;
	
	//购买数量
	var _buyCount=1;
	
	//购买价格
	var _buyPrice=0;

	this.init= function(attrs){
		
		if(attrs!=null && attrs!=undefined)
		{
			if(attrs.okCallBack!=undefined)
			{
				_okCallBack=attrs.okCallBack;
			}
			
			if(attrs.goods!=undefined)
			{
				_good=attrs.goods;
			}		
			
			if(attrs.optionType!=undefined)
			{
				_optionType=attrs.optionType;
			}			
		}		
		
//		var body = document.getElementsByTagName('body')[0];
//		var srcSel= document.getElementById("wm_selectProSpec");
//		if(srcSel!=undefined)
//		{
//			body.removeChild(srcSel);
//		}
//		
//		//以下生成选择器
//		var selectDiv = HCoder.createDivNode({"id":"wm_selectProSpec","class":"box mui-popover mui-popover-action mui-popover-bottom"});
//		var content = HCoder.createDivNode({"class":"mui-content proSpecSel"});
//		
//		var ui = HCoder.createUlNode({"class":"mui-table-view"});
//		var li_Spec = HCoder.createLiNode({"id":"spec","class":"mui-table-view-cell"});
//		var label= HCoder.createLabelNode({"innerHTML":"选择规格"});
//		li_Spec.appendChild(label);
//		ui.appendChild(li_Spec);
//		
//		var li_count = HCoder.createLiNode({"id":"wxpay","class":"mui-table-view-cell"});
//		var label= HCoder.createLabelNode({"innerHTML":"购买数量"});
//		
//		var numberDiv = HCoder.createDivNode({"class":"mui-numbox"});
//		numberDiv.attributes["data-numbox-min"]=3;
//		
//		var btnSub = HCoder.createBtnNode({"id":"btnMinusBount1","class":"mui-btn mui-numbox-btn-minus","innerHTML":"-"});
//		var inputNumber = HCoder.createInputNode({"id":"buyCount1","class":"mui-numbox-input","type":"number","value":"1"});
//		var btnPlus = HCoder.createBtnNode({"class":"mui-btn mui-numbox-btn-plus","innerHTML":"+"});
//		
//		numberDiv.appendChild(btnSub);
//		numberDiv.appendChild(inputNumber);
//		numberDiv.appendChild(btnPlus);
//		
//		li_count.appendChild(label);
//		li_count.appendChild(numberDiv);
//		
//		ui.appendChild(li_count);
//		
//
//		var btn = HCoder.createHtmlNode({"id":"btnBuyNowConfim1","type":"button","class":"mui-btn mui-btn-blue mui-btn-block"});
//		btn.innerHTML="确定";
//		
////		content.appendChild(title);
//		content.appendChild(ui);
//		content.appendChild(btn);
//		selectDiv.appendChild(content);
//		
//		
//		body.appendChild(selectDiv);	
	
	}
	
	this.show = function()
	{
		mui('#wm_selectProSpec').popover('toggle');	
	}
	
	this.hide=function()
	{
		mui('#wm_selectProSpec').popover('hide');
	}


}




