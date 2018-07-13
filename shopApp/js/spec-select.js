/**
 * 商品规格选择器
 */

specOption=function()
{
	var _this=this;
	
	//当前商品
	var _good=null;
	
	//商品选择规格列表
	var _specList=null;
	
	//当前选择的规格
	var _selSpecInfo="";
	
	//选择完成回调函数
	var _onSelCallBack=null;
	
	//是否显示数据输入框
	var _showNumberBox=true;
	
	//购买数量
	var _initCount = 1;
	
	//数据输入框id
	var _numberInputId="numberInputSpecId";
	
	//打开类型
	var _fromType="buy";
	
	this.setSelectedCallBack = function(Callback)
	{
		if(Callback==null ||Callback==undefined)
		{
			return;
		}
		
		_onSelCallBack = Callback;
	}
	
	
	//初始化选择器
	this.init=function(initData)
	{
		if(initData==null||initData==undefined)
		{
			return;
		}
//		
		if(initData.good!=undefined)
		{
			_good = initData.good;
		}
		else
		{
			//测试数据
			_good = {"price":200,"stock":100,"id":"123","goodId":"453"};
			_good["imgSmallUrl"] = "http://www.qiansibei.com/upload/store/40/2017/01/13/5421f02b-78bb-4c5d-a0e9-0d8a7bb0b9a6.jpg";
			
		}

		if(initData.CallBack !=null && initData.CallBack!=undefined)
		{
			_onSelCallBack = initData.CallBack;
		}
		
		if(initData.fromType !=null && initData.fromType!=undefined)
		{
			_fromType = initData.fromType;
		}		
		
//		_this.initTestData();
	}
	
	this.initTestData= function()
	{
		_specList = [];
		
		spec = {"id":"1","name":"颜色分类","type":"text"};
		specItemList = [];
		specItem = {"id":"1","value":"红色","spec_id":"1","check":true};
		specItemList.push(specItem);
		specItem2 = {"id":"2","value":"蓝色","spec_id":"1","check":false};
		specItemList.push(specItem2);
		specItem3 = {"id":"3","value":"黑色","spec_id":"1","check":false};
		specItemList.push(specItem3);	
		specItem4 = {"id":"4","value":"粉色","spec_id":"1","check":false};
		specItemList.push(specItem4);		
		spec["itemList"] = specItemList;
		_specList.push(spec);
		
		spec2 = {"id":"2","name":"尺寸","type":"text"};
		specItemList2 = [];
		specItem = {"id":"1","value":"S","spec_id":"2","check":false};
		specItemList2.push(specItem);
		specItem2 = {"id":"2","value":"M","spec_id":"2","check":false};
		specItemList2.push(specItem2);
		specItem3 = {"id":"3","value":"L","spec_id":"2","check":true};
		specItemList2.push(specItem3);	
		specItem4 = {"id":"4","value":"XL","spec_id":"2","check":false};
		specItemList2.push(specItem4);	
		specItem5 = {"id":"5","value":"XXL","spec_id":"2","check":false};
		specItemList2.push(specItem5);		
		spec2["itemList"] = specItemList2;
		_specList.push(spec2);		
		
		_this.createSelect();
	}
	
	
	//创建选择器
	this.createSelect = function(CallBack)
	{
		var body = document.getElementsByTagName('body')[0];
		var selectNode = document.getElementById("wm_selectGoodSpec");
		if(selectNode!=undefined)
		{
			body.removeChild(selectNode);
		}
		
		var selectDiv = HCoder.createDivNode({"id":"wm_selectGoodSpec","class":"box mui-popover mui-popover-action mui-popover-bottom"});
		var content = HCoder.createDivNode({"class":"mui-content spec-content"});
		
		var goodDiv = HCoder.createDivNode({"class":"goodInfoDiv"});
		var goodImg = HCoder.createImgNode({"class":"specGoodImg","src":_good.imgSmallUrl});
		goodDiv.appendChild(goodImg);
		
		var tableDiv = HCoder.createDivNode({"class":"mui-table"});
		var tableCellDiv = HCoder.createDivNode({"class":"mui-table-cell mui-col-xs-10"});
		
		var goodPriceNode = HCoder.createH4Node({"class":"specGoodprice"});
		goodPriceNode.innerHTML = "¥"+_good.price;
		var stockNode = HCoder.createH5Node({"innerHTML":"库存:"+_good.stock});
		var okSpecNode = HCoder.createH5Node({"id":"okSpec","innerHTML":"已选:"});
		tableCellDiv.appendChild(goodPriceNode);
		tableCellDiv.appendChild(stockNode);
		tableCellDiv.appendChild(okSpecNode);
		
		//关闭图标
		var tableCellCloseDiv = HCoder.createDivNode({"class":"mui-table-cell mui-col-xs-2"});
		var spanClose = HCoder.createSpanNode({"id":"btnClose","class":"mui-icon mui-icon-close"});
		tableCellCloseDiv.appendChild(spanClose);
		
		tableDiv.appendChild(tableCellDiv);
		tableDiv.appendChild(tableCellCloseDiv);
		goodDiv.appendChild(tableDiv);
		content.appendChild(goodDiv);
		if(_specList!=null)
		{
			for (i=0;i<_specList.length;i++) {
				
				spec = _specList[i];
				
				var specDiv = HCoder.createDivNode({"class":"mui-card"});
				var specNameDiv = HCoder.createDivNode({"class":"mui-card-header"});
				specNameDiv.innerHTML=spec.name;
				
				//创建规格属性列表
				var specContentDiv = HCoder.createDivNode({"class":"mui-card-content"});
				var specItemContentDiv = HCoder.createDivNode({"class":"mui-card-content-inner"});
				for (j=0;j<spec.itemList.length;j++) {
					specItem = spec.itemList[j];
					specItem["btnId"] = "btn_"+spec.id+"_"+specItem.id;
					itemBtn = HCoder.createBtnNode({"class":"mui-btn specBtn","innerHTML":specItem.value});
					itemBtn.id = specItem.btnId;
					if(specItem.check)
					{
						itemBtn.classList.add('mui-btn-red');
					}
					
					specItemContentDiv.appendChild(itemBtn);
				}
				specContentDiv.appendChild(specItemContentDiv);
				specDiv.appendChild(specNameDiv);
				specDiv.appendChild(specContentDiv);
				content.appendChild(specDiv);
			}			
		}

		
		//创建数字框
		_this.createNumberBox(content);
		
		var btnOK = HCoder.createBtnNode({"id":"btnOK","class":"mui-btn mui-btn-red mui-btn-block"});
		btnOK.innerHTML="确定";		
		content.appendChild(btnOK);
		selectDiv.appendChild(content);
		
		body.appendChild(selectDiv);
		
		_this.regEvent();
	}
	
	this.createNumberBox =function(parentNode)
	{
		if(!_showNumberBox)
		{
			return;
		}
		
		var labBuyNode = HCoder.createLabelNode({"innerHTML":"购买数量:"});
		//创建数字编辑器
		var numberDiv = HCoder.createDivNode({"class":"mui-numbox"});
		numberDiv.setAttribute('data-numbox-min','1');
		var numberSubbtn = HCoder.createBtnNode({"class":"mui-btn mui-btn-numbox-minus","innerHTML":"-"});
		var numberInput = HCoder.createInputNode({"type":"number","class":"mui-input-numbox","value":_initCount});
		numberInput.id = _numberInputId;
		var numberPlusbtn = HCoder.createBtnNode({"class":"mui-btn mui-btn-numbox-plus","innerHTML":"+"});
		numberDiv.appendChild(numberSubbtn);
		numberDiv.appendChild(numberInput);
		numberDiv.appendChild(numberPlusbtn);		
		
		parentNode.appendChild(labBuyNode);
		parentNode.appendChild(numberDiv);
		
		
	}
	
	
	
	this.regEvent = function()
	{
		var btnClose = document.getElementById("btnClose");
		btnClose.removeEventListener('tap',_this.onClose);
		btnClose.addEventListener('tap',_this.onClose);
		
		var btnOk = document.getElementById("btnOK");
		btnOk.removeEventListener('tap',_this.onOK);
		btnOk.addEventListener('tap',_this.onOK);		
		
		mui('.mui-card-content-inner').off('tap','.specBtn');
		mui('.mui-card-content-inner').on('tap', '.specBtn',function(){
//			console.log(this.id);
			var strList = new Array();
			strList = this.id.split("_");
			optionData = {};
			optionData["specId"]=strList[1];
			optionData["specItemId"]=strList[2];			
			
			_this.onSelectSpec(optionData);
		});
		
		if(_showNumberBox)
		{
			mui('.mui-numbox').numbox();
		}
		
	}
	
	//弹出显示支付选择器
	this.showSelect = function()
	{
		mui('#wm_selectGoodSpec').popover('toggle');	
	}
	
	this.hideSelect=function()
	{
		mui('#wm_selectGoodSpec').popover('hide');	
	}

	this.onClose = function()
	{
		_this.hideSelect();
//		console.log("close");
	}
	
	this.onOK = function()
	{
//		console.log("select ok");
		
		//获取购买数量
		_initCount = _this.getGoodCount();
		
		
		//触发回调
		if(_onSelCallBack !=null)
		{
//			resData = {};
			_good["spec_info"] = _selSpecInfo;
			//购买数量
			_good["count"] = _initCount;
			_good["fromType"] = _fromType;
//			resData["spec"] = _selSpecInfo;
			_onSelCallBack(_good);
		}

		_this.hideSelect();		
	}
	
	
	this.onSelectSpec=function(optionData)
	{
		spec = _this.getSpecById(optionData.specId);
		for (j=0;j<spec.itemList.length;j++)
		{
			item = spec.itemList[j];
			itemBtn = document.getElementById(item.btnId);
			itemBtn.classList.remove('mui-btn-red');	
			if(item.id == optionData.specItemId)
			{
				item.check =true;
				itemBtn.classList.add('mui-btn-red');	
			}
			else
			{
				item.check =false;
			}
		}
		
		_this.changeSelectedSpec();

		//执行回调
		
		
	}
	
	//获取选择的商品购买数量
	this.getGoodCount = function()
	{
		var numberNode= document.getElementById(_numberInputId);
		if(numberNode !=undefined)
		{
			return numberNode.value;
		}
		
		return 0;
	}
	
	this.getSpecById=function(specId)
	{
		for (i=0;i<_specList.length;i++) 
		{
			spec = _specList[i];
			if(spec.id==optionData.specId)
			{
				return spec;
			}
		}
		
		return null;
	}
	
	/**
	 * 初始化选择状态
	 */
	this.initSpecList= function()
	{
		for (i=0;i<_specList.length;i++) 
		{
			spec = _specList[i];
			for (j=0;j<spec.itemList.length;j++)
			{
				item = spec.itemList[j];
				
				item["check"]=flase;
			}
		}		
	}
	
	this.loadSpecList = function()
	{
		if(_good==null)
		{
			mui.alert("商品为空!");
			return;
		}
		
		if(_good.goodId==undefined)
		{
			mui.alert("商品ID为空!");
			return;
		}
		
		var param = {"goodId":_good.goodId};
		ajax_post_load_goodSpec(param,_this.onLoadSpecSuccess);
	}
	
	
	/**
	 * 加载商品规格完成回调
	 */
	this.onLoadSpecSuccess=function(res)
	{
		if(res.status=="success")
		{
			_specList = res.data;
			
			//初始化为未选择
			_this.initSpecList();
			_this.createSelect();
			
		}
		else
		{
			mui.alert(res.description);
		}
	}
	
	
	
	
	//更新已选规格到界面
	this.changeSelectedSpec=function()
	{
		var selectedInfo = "";
		for (i=0;i<_specList.length;i++)
		{
			spec = _specList[i];
			for (j=0;j<spec.itemList.length;j++)
			{
				item = spec.itemList[j];
				if(item.check)
				{
					selectedInfo = selectedInfo+spec.name+":"+item.value;
					selectedInfo = selectedInfo+",";
				}
			}
		}
		selectedInfo=selectedInfo.substring(0,selectedInfo.length-1);
		
		_selSpecInfo = selectedInfo;
		
		//更新界面
		var okSpecNode = document.getElementById("okSpec");		
		okSpecNode.innerHTML ="已选:"+selectedInfo;
		
	}
	

}

