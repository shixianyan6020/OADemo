mui.init({
	pullRefresh: {
		container: '#refreshContainer',
		down: {
			height: 50,
			contentdown: "下拉刷新",
			contentover: "释放立即刷新",
			contentrefresh: "正在刷新...",
			callback: pulldownRefresh
		}
	},
	swipeBack: true
});
		
var currWebView;		
var addressWebview;
var emptyAddress;
var emptyAddressBtn;
var addrList;
mui.plusReady(function() {
	emptyAddress = document.querySelector('.emptyAddress');
	emptyAddressBtn = emptyAddress.querySelector('button');
	
	currWebView = plus.webview.currentWebview();
	currWebView.addEventListener('show',function(e){
		//加载地址列表
		loadAddressList();
	});	

	loadAddressList();
	
//	currWebView.addEventListener('initData',function(e){
//		
//		console.log("收到事件");
//		loadAddressList();
//		
//	});
	
	//将地址的页面初始化
	addressWebview = mui.preload({
		url: 'address.html',
		id: 'address.html',
		styles: {
			top: '0px',
			bottom: '0px'
		}
	});

	//地址页面隐藏后刷新列表
	addressWebview.addEventListener('hide',function(){		
//		console.log("收到事件");
		loadAddressList();
		
	});


	//在当前页面消失的时候close addresswebview
	closeChildWebviewOfhide(plus.webview.currentWebview(), addressWebview.id);

	//地址修改点击事件
//	mui('.mui-table-view').on('tap', '.mui-table-view-cell', function() {
//		var cell = this;
//		mui.alert(cell.id);
//		var name = this.children[0];
//		var phoneNum = this.children[1];
//		var address = this.children[2];
//
//		//showaddressWeb();
//	});
	
	mui('#addressList').on('tap', '.mui-btn',onAddressOption);
	

	//接收rightbar事件
	window.addEventListener('pressRightBar', function() {
		setEditAddress("add");
		showaddressWeb();
	}, false);
});

function pulldownRefresh()
{
	loadAddressList();
		
}


function showaddressWeb() {
	var aniShow = getaniShow();
	//第二次进来的时候不会进plusReady
	if(!addressWebview.getURL() || !addressWebview) {
		addressWebview = mui.preload({
			url: 'address.html',
			id: 'address.html',
			styles: {
				top: '0px',
				bottom: '0px'
			},
		});
		//作为添加地址的事件处理
		addressWebview.addEventListener('loaded', function() {
			addressWebview.show(aniShow);
		}, false);
	} else {
		//作为添加地址的事件处理
		addressWebview.show(aniShow);
	}
}

function loadAddressList()
{
	user = G_getUser();
	if(user==null)
	{
		mui.alert("请先登录");
		return;
	}
	
	var param={"userId":user.id};
	
	ajax_get_Address_List(param,loadAddressListSuccess);
}


function loadAddressListSuccess(res)
{
	mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed  
	if(res.status="success")
	{
		addrList = res.data;
		emptyAddress.style.display = 'none';
		showAddressList(addrList);
	}
	else
	{
		emptyAddress.style.display = 'block';
		emptyAddressBtn.addEventListener('tap', function() {
			showaddressWeb();
		}, false);
	}
	
}

function removeAllChildNode(parentNode)
{
    var children = parentNode.childNodes;
    var childnum = children.length;
    for(var j = 0; j < childnum; j++) {
    	parentNode.removeChild(parentNode.firstChild);
    }	
	
}


function showAddressList(addList)
{
	var addrListNode = document.getElementById("addressList");	
	removeAllChildNode(addrListNode);
	
	for (i=0;i<addList.length;i++) {
		address = addList[i];
		
		addOneAddress(address,addrListNode);
	}
}

function getAddressById(id)
{
	for (i=0;i<addrList.length;i++) {
		address = addrList[i];
		if(address.id==id)
		{
			return address;
		}
	}
}


function addOneAddress(address,parentNode)
{
	var liNode = HCoder.createLiNode({"class":"mui-table-view-cell","id":address.id});
	
	var div = HCoder.createDivNode({"class":"mui-slider-right mui-disabled"});
	var del_a = HCoder.createANode({"class":"mui-btn mui-btn-grey","id":"del","innerHTML":"删除"});
	var edit_a = HCoder.createANode({"class":"mui-btn mui-btn-yellow","id":"edit","innerHTML":"编辑"});
	var default_a = HCoder.createANode({"class":"mui-btn mui-btn-red","id":"default","innerHTML":"默认"});
	div.appendChild(default_a);
	div.appendChild(edit_a);
	div.appendChild(del_a);
	liNode.appendChild(div);
	
	var divContent
	if(address.isDefault) //默认地址设置为红色
	{
		divContent = HCoder.createDivNode({"class":"mui-slider-handle default"});
	}
	else
	{
		divContent = HCoder.createDivNode({"class":"mui-slider-handle"});
	}
	
	var h5_Name = HCoder.createHtmlNode({"type":"h5","class":"name"});
	h5_Name.innerHTML=address.trueName;
	var h5_Number = HCoder.createHtmlNode({"type":"h5","class":"number"});
	h5_Number.innerHTML=address.mobile;
	var p_full_addr = HCoder.createHtmlNode({"type":"p","class":"address mui-ellipsis-2"});
	if(address.area!=undefined)
	{
		p_full_addr.innerHTML=address.area.fullName+address.area_info;
	}
	else
	{
		p_full_addr.innerHTML=address.area_info;
	}
	
	divContent.appendChild(h5_Name);
	divContent.appendChild(h5_Number);
	divContent.appendChild(p_full_addr);
	liNode.appendChild(divContent);
	
	parentNode.appendChild(liNode);
}

function onAddressOption(event)
{
	var elem = this;
	var li = elem.parentNode.parentNode;
//mui.alert(elem.id + " " + li.id);
	optionId = elem.id;
	address = getAddressById(li.id);
	
	if(optionId=="del") //删除
	{
		var btnArray = ['确认', '取消'];
		mui.confirm('确认删除该条记录？', '删除确认', btnArray, function(e) {
		if(e.index == 0) {
			deleteAddress(address);
			} 
			else {
			setTimeout(function() {
				mui.swipeoutClose(li);
			}, 0);
			}
		});
		
	}
//	
	if(optionId=="default") //设置默认
	{
		var btnArray = ['确认', '取消'];
		mui.confirm('确认设置为默认收货地址？', '设置确认', btnArray, function(e) {
		if(e.index == 0) {
			defaultAddress(address);
			} 
			else {
			setTimeout(function() {
				mui.swipeoutClose(li);
			}, 0);
			}
		});		
	}
	
	if(optionId=="edit") //设置编辑
	{
		setEditAddress("edit",address);
		showaddressWeb();
		
	}
}

function deleteAddress(address)
{
	var param={};
	param["id"]=address.id;
	
	ajax_post_delete_address(param,deleteAddressSuccess);
	
}


function deleteAddressSuccess(res)
{
	if(res.status=="success")
	{
		delId = res.data;
		var delLi = document.getElementById(delId);
		delLi.parentNode.removeChild(delLi);	
	}
}

//设置地址默认
function defaultAddress(address)
{
	user = G_getUser();
	if(user==null)
	{
		mui.alert("请先登录");
		return;
	}	
	var param={};
	param["id"]=address.id;
	param["userId"]=user.id;
	
	ajax_post_default_address(param,defaultAddressSuccess);
	
}

function defaultAddressSuccess(res)
{
	if(res.status=="success")
	{
		loadAddressList();
		addressId = res.data;
		mui.alert("设置成功!");
	}
}

function setEditAddress(optionType,address)
{
	
	if(optionType=="edit")
	{
		address["optionType"] = optionType;
		localStorage.setItem("curAddress",JSON.stringify(address));
	}
	
	if(optionType=="add")
	{
		address = {"optionType":optionType};
		localStorage.setItem("curAddress",JSON.stringify(address));
		
	}
	
}


