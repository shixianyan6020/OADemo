var myTabItem=function(){
	
	//编号
	var _id="";
	
	//滚动条对象
	var _scrollItem=null;
	
	//是否注册滚动条事件
	var _isRegPullup=false;
	
	//是否默认
	var _isActive=false;
	
	//额外数据
	var _extData=null;
	
	//分页查询数据
	var _pageData=null;
	
	//保存无数据加载显示的divid 方便删除
	var _noDataDivId="";
	
	//保存加载到最后一页的数据
	var _lastDataDivId="";
	
	this.init = function(attrs)
	{
		if(attrs==null || attrs==undefined)
		{
			return ;
		}
		
		_id = attrs.id;
		_isActive = attrs.isActive;
		_scrollItem = attrs.scrollItem;
		_isRegPullup= attrs.isRegPullup;
		
		if(attrs.extData!=null && attrs.extData!=undefined)
		{
			_extData=attrs.extData;
		}
		
		_pageData={};
		
	}
	
	this.setId=function(itemId){
		_id=itemId;
	}
	
	this.getId=function(){
		return _id;
	}
	
	this.setScrollItem=function(item){
		_scrollItem = item;
	}
	
	this.getScrollItem=function()
	{
		return _scrollItem;
	}
	
	this.setActive=function(avtive)
	{
		_isActive= avtive;
	}
	
	this.getActive=function(){
		return _isActive;
	}
	
	this.setIsReg=function(bReg)
	{
		_isRegPullup = bReg;
	}

	this.getIsReg=function()
	{
		return _isRegPullup;
	}
	
	this.getExtData = function()
	{
		return _extData;
	}
	
	this.setExtData=function(extData)
	{
		_extData=extData;
	}
	
	this.toString = function()
	{
//		alert(_id);
		console.log(_id);
	}
	
	this.showLastData=function()
	{
		if(_scrollItem==null ||_scrollItem==undefined)
		{
			return;
		}
		
		_lastDataDivId = _id+"lastdataDiv";
		
		var orderDiv = HCoder.createDivNode({"id":_lastDataDivId,"class":""});
		var noDataP =HCoder.createPNode({"class":"","innerHTML":"以下没有数据!"});
		var noDataP2 =HCoder.createPNode({"class":"","innerHTML":"以下没有数据!"});
		orderDiv.appendChild(noDataP);
		orderDiv.appendChild(noDataP2);

		_scrollItem.appendChild(orderDiv);
	}
	
	this.removeLastDataDiv=function ()
	{
		var nodeDiv = document.getElementById(_lastDataDivId);
		if(nodeDiv==null || nodeDiv==undefined)
		{
			return;
		}
		
		_scrollItem.removeChild(nodeDiv);
	}
	
	this.showNoData=function(noDataTip)
	{
		if(_scrollItem==null ||_scrollItem==undefined)
		{
			return;
		}
		
		_noDataDivId = _id+"nodataDiv";
		
		infoTip="没有加载到数据!";
		if(noDataTip!=undefined)
		{
			infoTip=noDataTip;
		}
		
		var orderDiv = HCoder.createDivNode({"id":_noDataDivId,"class":""});
		var noDataP =HCoder.createPNode({"class":"","innerHTML":infoTip});
		orderDiv.appendChild(noDataP);

		_scrollItem.appendChild(orderDiv);
	}
	
	this.removeNoDataDiv=function ()
	{
		var nodeDiv = document.getElementById(_noDataDivId);
		if(nodeDiv==null || nodeDiv==undefined)
		{
			return;
		}
		
		_scrollItem.removeChild(nodeDiv);
	}	
	
	this.initShow=function()
	{
		if(_scrollItem==null || _scrollItem==undefined)
		{
			return ;
		}
		
		G_removeAllChildNode(_scrollItem.children[0]);
		
		this.removeLastDataDiv();
		
		this.removeNoDataDiv();
		
	}
	
	
}



