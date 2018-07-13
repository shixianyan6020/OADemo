mui.init({
	swipeBack:false
});
		
var totle={};
var curShopCart;
var cartSupplierItem = [];
var cartWebview;//当前购物车webview
var needlogin;//需要登录的div
var loginDiv = document.querySelector('.login');
var user ;

//选择器
var specSelect = new specOption();
mui.plusReady(function() {
	cartWebview = plus.webview.currentWebview();
	needlogin = document.querySelector('.need-login');
	loginDiv.style.display = 'none';
	//为登录按钮添加事件
	document.querySelector('.need-login button').addEventListener('tap', function() {
		var parentWebView = plus.webview.currentWebview().parent();
		var href = "Mine/login.html";
		var id = "Mine/login.html";
		var aniShow = 'slide-in-bottom';
		var title = '登录';

		mui.fire(parentWebView, 'newWebView', {
			id: id,
			href: href,
			aniShow: aniShow,
			title: title
		});
	}, false);

	//打开确认订单
	var btnAccount = document.getElementById("btnAccount");
	btnAccount.addEventListener("tap", onConfimOrder);

	user = G_getUser();
	//为页面显示的时候添加监听
	cartWebview.addEventListener('show', function() {
		//判断用户是否已经登录,已经登录就需要去获取购物车列表
		if(user != null) {
			//将登录按钮隐藏，并且去获取购物车列表或则更新购物车列表todo
			needlogin.style.display = 'none';
			loginDiv.style.display = 'block';
			if(cartSupplierItem.length <= 0) {
				//加载购物车
				getShopCartItem();
			}

		} else {
			//如果退出登录或者没有登录成功这个div将被显示出来。
			needlogin.style.display = 'block';
			loginDiv.style.display = 'none';
			
		}
	}, false);

	//特殊：添加事件接收登录页面成功后发来的消息
	window.addEventListener('loginSuccess', function() {
		//页面成功后，要隐藏登录模块，然后去加载数据返回
		needlogin.style.display = 'none';
		
		
		//刷新请求购物车数据
		getShopCartItem();

	}, false);
	
	//特殊：添加事件接收登录页面成功后发来的消息
	window.addEventListener('initData', function() {
		//刷新请求购物车数据
		getShopCartItem();
//		console.log("event:initData");

	}, false);	
});	

//结算处理订单
function onConfimOrder()
{
//	specSelect.init();
//	specSelect.showSelect();		
	
	
	
	//首选要获取设置的购物信息
	var orderList =  getSelOrder(curShopCart);
	if(orderList.length==0)
	{
		mui.alert("请选择要结算的商品!");
		return;
	}
	
	if(orderList.length>1)
	{
		mui.alert("请每次选择一个商家进行进行结算");
		return;
	}
	
	var options={};
	options["url"]="../order/orderConfim.html";
	options["id"]="../order/orderConfim.html";
	
	orderInfo = orderList[0];
	
	options["extras"]=orderInfo;
	
	window.openNewWindow(options);

}

function getSelOrder(shopCartList)
{
	var orderList=[];
	
	for (m=0;m<shopCartList.length;m++) {
		
		shopCart = shopCartList[m];
		
		if(!shopCart.store.select.check)
		{
			continue;
		}
		
		//生成临时订单
		var orderInfo = {};
		
		orderInfo["orderFromType"] = "shopCart";
		orderInfo["sc_id"] = shopCart.id;
		shopCart.store["storeName"]= shopCart.store.store_ower;
		orderInfo["store"]=shopCart.store;
		var buyGoodList=[];

		for (n=0;n<shopCart.goods.length;n++) {
			
			good = shopCart.goods[n];
			
			if(good.select.check)
			{
				var buyGood = {};
				buyGood["id"]=good.goods_id;
				buyGood["sci_id"]=good.id;
				buyGood["price"]=good.price;
				buyGood["count"]=good.count;	
				buyGood["goodName"]=good.goods_name;	
				buyGood["imgSmallUrl"]=good.imgSmallUrl;	
				buyGood["specInfo"]=good.spec_info;	
				buyGoodList.push(buyGood);
				//添加订单商品
				console.log(good.goods_name);
			}
		}
		
		orderInfo["goods"] = buyGoodList;
		
		var traninfo = {};
		traninfo["goods_transfee"]="1";
		traninfo["tranFee"]=0;	
		traninfo["tranType"]="包邮";
		
		orderInfo["traninfo"]=traninfo;			
		calcOrderTotal(orderInfo);
		orderList.push(orderInfo);
	}
	
	return orderList;
}

function calcOrderTotal(orderInfo)
{
	var total={};
	var totalFee = 0;
	var totalCount=0;
	for (i=0;i<orderInfo.goods.length;i++) {
		good = orderInfo.goods[i];
		
		totalFee  = parseFloat(totalFee)+parseFloat(good.price)*parseFloat(good.count);
		totalCount = parseInt(totalCount)+parseInt(good.count);
	}
	
	total["totalFee"]=totalFee;
	total["totalCount"]=totalCount;
	orderInfo["total"]=total;		
	
}


/**
 * 如果有一个商品被选择,则选中店铺
 * @param {Object} shopCartList
 */
function checkStoreSelectedByGood(shopCartList)
{
	
	for (i=0;i<shopCartList.length;i++) {
		
		shopCart = shopCartList[i];
		var checkCount =0;
		for (j=0;j<shopCart.goods.length;j++) {
			
			good = shopCart.goods[j];
			
			if(good.select.check)
			{
				checkCount++;
//				console.log("checkCount:"+checkCount);
			}
		}
		
//		console.log("checkCount:"+checkCount);==shopCart.goods.length
		if(checkCount>0 )
		{
			storeNode = document.getElementById(shopCart.store.select.id);
			if(storeNode!=undefined && storeNode!=null)
			{
				storeNode.checked=true;
				shopCart.store.select.check=true;
//				console.log("checked:"+shopCart.store.store_ower);
			}
		}
		
		if(checkCount==0)
		{
			storeNode = document.getElementById(shopCart.store.select.id);
			if(storeNode!=undefined && storeNode!=null)
			{
				storeNode.checked=false;
				shopCart.store.select.check=false;
//				console.log("checked false:"+shopCart.store.store_ower);
			}
		}
	}	
}

function initData()
{
	var info = document.getElementById("totleMoney");
	info.innerText=" 合计:¥";	
	
	var cartListDiv = document.getElementById("shopCartList");
	G_removeAllChildNode(cartListDiv);		
	
}

//请求购物车数据
function getShopCartItem()
{
	initData();
	user =  G_getUser();
	if(user==null)
	{
		mui.toast("请先登录");
		return ;
	}
		
	var param = {"userId":user.id};
	window.ajax_post_shop_cart(param,cartItemSuccess);
}


/**
 * 购物车数据加载成功
 * @param {Object} shopCart
 */
function cartItemSuccess(resData) {

	if(resData.status=="success")
	{
		//保存当前的购物车对象
		curShopCart = resData.data;
		showShopCart(curShopCart);
		regAllEvent(curShopCart);
	
		loginDiv.style.display = 'block';		
		
	}
	else
	{
		mui.alert(resData.destination);
	}

}


function regAllEvent(carts)
{
	mui.each(carts, function(index, cartItem){
		
		var obj = document.getElementById(cartItem.store.select.id);
		obj.addEventListener("change",function(){
			cartItem.store.select.check =this.checked;
			if(this.checked)
			{
				mui.each(cartItem.goods, function(i, product){
				e_pro =document.getElementById(product.select.id);	
				
				product.select.check=true;
				e_pro.checked=product.select.check;	
				});
			}
			else
			{
				mui.each(cartItem.goods, function(i, product){
				e_pro =document.getElementById(product.select.id);	
//				console.log(e_pro.id+e_pro.checked);
				product.select.check=false;
				e_pro.checked=product.select.check;					
				});
			}

		calcTotle();
		});
		
		var btnEdit = document.getElementById(cartItem.store.select.btnEditId);
		if(btnEdit !=undefined)
		{
			btnEdit.addEventListener('tap',function(){
//				console.log("edit:"+cartItem.store.id);
				showStoreEdit(true,cartItem);
			});
		}
		
		var btnOK = document.getElementById(cartItem.store.select.btnOKId);
		if(btnOK !=undefined)
		{
			btnOK.addEventListener('tap',function(){
//				console.log("OK:"+cartItem.store.id);
				showStoreEdit(false,cartItem);
			});
		}
		
		
		mui.each(cartItem.goods, function(i, product){
		
			e_pro =document.getElementById(product.select.id);	
			e_pro.addEventListener("change",function(){
				product.select.check=this.checked;
				calcTotle();
				checkStoreSelectedByGood(curShopCart);
			});
			
			//商品购买数量改变事件
			e_proCount =document.getElementById(product.select.countId);	
			e_proCount.addEventListener("change",function(){
				product.count=this.value;
				
				ajax_update_cartItem_count({"id":product.id,"count":product.count},onUpdateGoodCountSuccess);
				//updateProCount(product);
//				calcTotle();
			});
			
			//删除事件
			e_proDel = document.getElementById(product.select.btnDelId);
			if(e_proDel!=undefined)
			{
				e_proDel.addEventListener('tap',function(){
					console.log("del_"+product.select.btnDelId);
					mui.confirm("确定要删除该商品?","删除提醒",function(e){
						if(e.index==1)
						{
							//异步删除
							ajax_delete_cartItem({"id":product.id},onDeleteGoodSuccess);
//							deleteProFromCart(cartItem,product,i);
						}
					});
				});
			}
			
			//规格选择点击事件
			var e_proSelSpec=document.getElementById(product.select.selSpecId);
			if(e_proSelSpec !=undefined)
			{
				e_proSelSpec.addEventListener('tap',function(){
//					console.log("selSpec_"+product.id);
//					testSetSpec(product.id,"蓝色,XL");
					//触发选择商品规格
					good = {"price":product.price,"stock":100,"id":product.id};
					good["imgSmallUrl"] = product.imgSmallUrl;
					optionData = {"good":good};
					optionData["CallBack"]=onSelSpecOK;
					specSelect.init(optionData);
					specSelect.showSelect();
					
					
				});
			}
			
		});	
	});
	
	mui('.storeDiv').on('tap', '.shopCartLab', function() {
		
		openStore(this.id);
	});	
	
	mui('.rightClassCell').on('tap', '.goodName', function() {
		
		openGoodDetail(this.id);
	});		

}


function openStore(storeId)
{
//	mui.alert("打开店铺页面:"+storeId);

	window.showStoreView({"storeId":storeId});


}

function openGoodDetail(goodId)
{
	//mui.alert("打开商品详细页面:"+goodId);
	window.pushDetailView({"product_id":goodId});
}

//更新商品购买数据的显示
function setProCount(countId,value)
{
//	console.log(countId+" checked"+value);
	mui.each(curShopCart, function(index, store) {
	
		mui.each(store.goods, function(i, product){
			
			if(product.select.countId==countId)
			{
//				console.log(product.select.countId+" checked"+value);
				product.count=value;
			}
		});	
	
	});		
	calcTotle();
	
}

//更新商品购买数据的显示
function updateProCount(product)
{
//	console.log(product.count+"_"+product.select.countId);
	//更新服务器上商品购买数量.	
	var countNode = document.getElementById(product.select.proCountId);
	if(countNode!=undefined)
	{
		countNode.innerHTML="X"+product.count;
	}
	
	calcTotle();
}

function testSetSpec(id,proSpec)
{
	product = getProductById(id);
	if(product==null)
	{
		return;
	}
	
	product.spec_info = proSpec;
	ajax_update_cartItem_spec({"id":product.id,"spec":product.spec_info},onUpdateGoodSpecSuccess);
}

//规格选择完成回调
function onSelSpecOK(resData)
{
	console.log(JSON.stringify(resData));
	//更新界面,保存.
	product = getProductById(resData.id);
	if(product==null)
	{
		return;
	}
	product.spec_info = resData.spec_info;
	//更新服务器上商品购买数量.	
	var specSelNode = document.getElementById(product.select.selSpecId);
	if(specSelNode!=undefined)
	{
		specSelNode.innerHTML=product.spec_info;
	}	
	
	ajax_update_cartItem_spec({"id":product.id,"spec":product.spec_info},onUpdateGoodSpecSuccess);
	
}


//更新商品购买规格
function updateProSpec(product)
{
	//更新服务器上商品购买数量.	
	var specNode = document.getElementById(product.select.proSpecId);
	if(specNode!=undefined)
	{
		specNode.innerHTML=product.spec_info;
	}
	
	
	
	
}

//更新规格回调
function onUpdateGoodSpecSuccess(resData)
{
	if(resData.status=="success")
	{
		product = getProductById(resData.data);
		if(product !=null)
		{
			updateProSpec(product);
		}
		
	}
	else
	{
		mui.alert(resData.destination);
	}	
	
}


//更新数量成功回调
function onUpdateGoodCountSuccess(resData)
{
	if(resData.status=="success")
	{
		product = getProductById(resData.data);
		if(product !=null)
		{
			updateProCount(product);
		}
		
	}
	else
	{
		mui.alert(resData.destination);
	}
}

//删除成功回调
function onDeleteGoodSuccess(resData)
{
	if(resData.status=="success")
	{
		deleteGoodFromCartById(resData.data);
	}
	else
	{
		mui.alert(resData.destination);
	}
}

function getProductById(id)
{
	for (mn=0;mn<curShopCart.length;mn++) {
		
		cart = curShopCart[mn];
		for (h=0;h<cart.goods.length;h++) {
			product = cart.goods[h];
			if(product.id==id)
			{
				return product;
			}
		}
	}	
	
	return null;

}

function deleteGoodFromCartById(id)
{
	mui.each(curShopCart, function(index, cartItem){
		
		mui.each(cartItem.goods, function(i, product){
			
			if(product.id==id)
			{
				deleteProFromCart(cartItem,product,i);
				return ;
			}
		});
	});
	
}

// 从购物车中移除选择的商品
function deleteProFromCart(oneCart,product,delIndex)
{
	//删除节点
	var goodNode = document.getElementById(product.select.nodeId);
	if(goodNode !=undefined)
	{
		parentNode = goodNode.parentNode;
		if(parentNode !=undefined)
		{
			parentNode.removeChild(goodNode);
		}
		else
		{
			console.log("parent is undefined");
		}
	}
	
	oneCart.goods.remove(delIndex);
	if(oneCart.goods.length==0)
	{
		var storeNode = document.getElementById(oneCart.store.select.nodeId);
		if(storeNode!=undefined)
		{
			storeNode.parentNode.removeChild(storeNode);
		}
		
		//还需要从购物车数组中删除购物车
		deleteCartById(curShopCart,oneCart.id);
	}
	
}

//更新购物车id删除购物车
function deleteCartById(cartList,cartId)
{
	for (mn=0;mn<cartList.length;mn++) {
		
		cart = cartList[mn];
		if(cart.id==cartId)
		{
			cartList.remove(mn);
			return ;			
		}
	}
	
}



function calcTotle()
{
	totleMoney =parseFloat("0");
	mui.each(curShopCart, function(index, store) {
	
		mui.each(store.goods, function(i, product){
			
			if(product.select.check)
			{
//				console.log(product.id+" checked"+parseFloat(product.price));
				totleMoney += parseFloat(product.price)*parseFloat(product.count);
			}
		
		});	
	
	});
	
	totle["money"]=totleMoney;
	
	showTotle();
}

function showTotle()
{
	var info = document.getElementById("totleMoney");
	
	info.innerText=" 合计:¥"+totle["money"]+" ";
	
}

function showShopCart(shopCartList)
{
	var cartListDiv = document.getElementById("shopCartList");
	var root_u = HCoder.createUlNode({"class":"mui-table-view"});
	for (i=0;i<shopCartList.length;i++) {
		
		shopCart = shopCartList[i];
		showOneShopCart(shopCart,root_u);
		
	}
	cartListDiv.appendChild(root_u);
	
	
	mui('.mui-numbox').numbox();
	
}

function showOneShopCart(shopCart,parentNode)
{
	shopCart.store["select"]={"check":false,"id":"store_"+shopCart.store.id};
	shopCart.store.select["btnEditId"]="edit_"+shopCart.store.id;
	shopCart.store.select["btnOKId"]="ok_"+shopCart.store.id;
	shopCart.store.select["nodeId"]="node_"+shopCart.store.id;
	
	//首先创建商家信息
	var liStoreNode = HCoder.createLiNode({"class":"mui-table-view-cell storeLi"});
	liStoreNode.id = shopCart.store.select.nodeId;
	
	var storeDiv = HCoder.createDivNode({"class":"mui-input-row mui-checkbox mui-left storeDiv"})
	var storeLab = HCoder.createLabelNode({"class":"shopCartLab ","id":shopCart.store.id});
	storeLab.innerText=shopCart.store.store_ower;
	
	var storeCheck = HCoder.createInputNode({"type":"checkbox","id":shopCart.store.select.id});
	
	storeDiv.appendChild(storeLab);
	storeDiv.appendChild(storeCheck);
	
	//编辑按钮
//	var optionSpan = HCoder.createSpanNode({"class":"shopCartOption","innerHTML":"编辑"});
//	storeDiv.appendChild(optionSpan);
	var btnEdit = HCoder.createBtnNode({"class":"mui-btn mui-btn-red shopCartOption","innerHTML":"编辑"});
	btnEdit.id = shopCart.store.select.btnEditId;
	
	var btnOK = HCoder.createBtnNode({"class":"mui-btn mui-btn-red shopCartOption","innerHTML":"完成"});
	btnOK.style.display="none";
	btnOK.id = shopCart.store.select.btnOKId;
	
	liStoreNode.appendChild(storeDiv);
	liStoreNode.appendChild(btnEdit);
	liStoreNode.appendChild(btnOK);
	
	parentNode.appendChild(liStoreNode);
	
	for (j=0;j<shopCart.goods.length;j++) {
		
		good = shopCart.goods[j];
//		console.log(JSON.stringify(good));
		showOneGoodItem(good,parentNode);
	}

}


function showOneGoodItem(product,parentNode)
{
	
	product["select"]={"check":false,"id":"good_"+product.id};
	product.select["nodeId"]="node_"+product.id;
	product.select["countId"]="count_"+product.id;
	product.select["proCountId"]="proCount_"+product.id;
	product.select["proSpecId"]="proSpec_"+product.id;	
	
	product.select["btnDelId"]="del_"+product.id;
	product.select["infoPadId"]="info_"+product.id;
	product.select["editPadId"]="edit_"+product.id;
	product.select["selSpecId"]="selSpec_"+product.id;
	
	
	var liGoodNode = HCoder.createLiNode({"class":"mui-table-view-cell goodLi"});
	liGoodNode.id = product.select.nodeId;
	
	//左边部分
	var leftCellDiv = HCoder.createDivNode({"class":"leftClassCell"});
	var leftCheckDiv = HCoder.createDivNode({"class":"mui-checkbox mui-left"});
	var goodLab = HCoder.createLabelNode({"class":"goodLab "});
	var goodImg = HCoder.createImgNode({"class":"cellImg ","src":product.imgSmallUrl});
	goodLab.appendChild(goodImg);
	var goodCheck = HCoder.createInputNode({"type":"checkbox","id":product.select.id,});
	leftCheckDiv.appendChild(goodLab);
	leftCheckDiv.appendChild(goodCheck);
	
	leftCellDiv.appendChild(leftCheckDiv);
	
	//右边部分
	var rightCellDiv = HCoder.createDivNode({"class":"rightClassCell"});
	rightCellDiv.id = product.select.infoPadId;
	//商品名称
	var goodName = HCoder.createPNode({"class":"mui-ellipsis-2 goodName","id":product.goods_id})
	goodName.innerText=product.goods_name;
	rightCellDiv.appendChild(goodName);
	
//	if(product.spec_info ==undefined)
//	{
//		product.spec_info = "颜色分类:红色,尺寸:100ml";
//	}
	
	//商品规格
	if(product.spec_info !=undefined)
	{
		var goodSpec = HCoder.createPNode({"class":"mui-ellipsis-2 goodSpec "})
		goodSpec.innerText=product.spec_info;
		goodSpec.id = product.select.proSpecId;
		rightCellDiv.appendChild(goodSpec);	
	}
	
	var h4_price = HCoder.createHtmlNode({"type":"h4","class":"price"});
	h4_price.innerHTML="¥:"+product.price;
	
	var h5_Number = HCoder.createHtmlNode({"type":"h5","class":"saleCount"});
	h5_Number.innerHTML="X"+product.count;	
	h5_Number.id= product.select.proCountId;
	rightCellDiv.appendChild(h4_price);
	rightCellDiv.appendChild(h5_Number);
	
	//右边编辑部分
	var rightEditCellDiv = HCoder.createDivNode({"class":"rightEditClassCell"});
	rightEditCellDiv.id = product.select.editPadId;
	
	//创建数字编辑器
	var numberDiv = HCoder.createDivNode({"class":"mui-numbox"});
	numberDiv.setAttribute('data-numbox-min','1');
	var numberSubbtn = HCoder.createBtnNode({"class":"mui-btn mui-btn-numbox-minus","innerHTML":"-"});
	var numberInput = HCoder.createInputNode({"type":"number","class":"mui-input-numbox","value":product.count});
	numberInput.id = product.select.countId;
	var numberPlusbtn = HCoder.createBtnNode({"class":"mui-btn mui-btn-numbox-plus","innerHTML":"+"});
	numberDiv.appendChild(numberSubbtn);
	numberDiv.appendChild(numberInput);
	numberDiv.appendChild(numberPlusbtn);
	
	var btnDel = HCoder.createBtnNode({"id":product.select.btnDelId,"class":"mui-btn mui-btn-red shopCartDel","innerHTML":"删除"});
	rightEditCellDiv.appendChild(numberDiv);	
	rightEditCellDiv.appendChild(btnDel);	
	//商品规格
	if(product.spec_info !=undefined)
	{
		var goodSelSpec = HCoder.createH5Node({"class":"mui-ellipsis-2 goodSelSpec "})
		goodSelSpec.id = product.select.selSpecId;
		goodSelSpec.innerText=product.spec_info;
		rightEditCellDiv.appendChild(goodSelSpec);	
	}	
	
	
	liGoodNode.appendChild(leftCellDiv);
	liGoodNode.appendChild(rightCellDiv);
	liGoodNode.appendChild(rightEditCellDiv);
	
	parentNode.appendChild(liGoodNode);
}

function showStoreEdit(isShow,oneCart)
{
	var btnEdit = document.getElementById(oneCart.store.select.btnEditId);
	var btnOK = document.getElementById(oneCart.store.select.btnOKId);
	if(isShow)
	{
		btnEdit.style.display="none";
		btnOK.style.display="block";
	}
	else
	{
		btnEdit.style.display="block";
		btnOK.style.display="none";
	}
	
	
	mui.each(oneCart.goods, function(i, product)
	{
		var infoPad = document.getElementById(product.select.infoPadId);
		var editPad = document.getElementById(product.select.editPadId);
		
		if(isShow)
		{
			if(infoPad!=undefined)
			{
				infoPad.style.display="none";
			}
			
			if(editPad !=undefined)
			{
				editPad.style.display="block";
			}
		}
		else
		{
			if(infoPad!=undefined)
			{
				infoPad.style.display="block";
			}
			
			if(editPad !=undefined)
			{
				editPad.style.display="none";
			}
		}
		
	});
	
	
}


