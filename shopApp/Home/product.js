mui.init({
		swipeBack: false //启用右滑关闭功能
	});

var currentWebview;//当前子页面
var paredntWebview;//父页面
var product_id;
var detail = {};
var curGood = {};
var detailcontent;

var curOptionType="cart";
//选择器
var specSelect = new specOption();

mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	if(currentWebview==null)
	{
		mui.alert("product is null");
	}

	detailcontent = document.getElementById('detailcontent');

	//监听页面隐藏的隐藏的时候清空数据信息
	currentWebview.addEventListener('hide', function() {
		//				detailcontent.innerHTML = '';
		detail = {};
//		mui.alert("hide");
	}, false);
	
	//监听页面隐藏的隐藏的时候清空数据信息
	currentWebview.addEventListener('show', function() {
		//				detailcontent.innerHTML = '';
		detail = {};
		var pid = localStorage.getItem("productId");
//		mui.alert("show"+pid);
	}, false);	

	//
	btnFavGood = document.getElementById('btnFavGood');
	btnFavGood.addEventListener("tap", onFavGood);

	btnAddCart = document.getElementById('btnAddCart');
	btnAddCart.addEventListener("tap", onAddCart);
	
	btnOpenCart = document.getElementById('btnOpenCart');
	btnOpenCart.addEventListener("tap", onOpenCart);	

	btnBuyNow = document.getElementById('btnBuyNow');
	btnBuyNow.addEventListener("tap", onBuyNow);

	//点击立即购买弹出界面的确定按钮
	var btnOK = document.getElementById("btnBuyNowConfim");
	btnOK.addEventListener('tap',onBuyConfim);

//	if(!mui.os.android)
	{
//		var btnGoodMore = document.getElementById('dianji');
//		btnGoodMore.style.display = "";
//		btnGoodMore.addEventListener("tap", showGoodMore);
	}

//	var btnSlider = document.getElementById('slider');
//	btnSlider.addEventListener('slide', onSlider);

	
	window.addEventListener("init",function(options){
//		G_removeAllChildNode(detailcontent);
//		console.log(JSON.stringify(options.detail));
		product_id = options.detail.product_id;
//		mui.alert(product_id);
		if(product_id==undefined || product_id==null || product_id=="")
		{
			product_id= 781;
			mui.alert("数据为空!");
		}
		else
		{
//			mui.alert(product_id+":2");
		}
		
		//像服务器请求
		ajax_get_product_detail({
			goodId: product_id
		},productDetailSuccess);		
	});	

});
		
/**
 * 商品明细加载成功
 * @param {Object} res
 */
function productDetailSuccess(res) 
{
	if(res.status != "success") {
		mui.alert(res.description);
		return;
	}
//	detailcontent.innerHTML = '';
	G_removeAllChildNode(detailcontent);
	curGood = res.data;
	//成功获取可以解析
	var arr = [];
	mui.each(curGood.photos, function(i, photo) {
		arr.push(photo.imgUrl);
	});

	//如果没有循环图,则填充一个商品主图
	if(arr.length == 0) {
		arr.push(curGood.imgUrl);
	}

	detail.detail_small_pictures = arr;

	curGood["product_price"] = {
		"default_price": curGood.goods_price,
		"list_price": curGood.store_price
	};
	//detail.detail_small_pictures = data.detail_small_pictures;
	detail.product_name = curGood.goods_name;
	detail.product_price = {
		"default_price": curGood.goods_price,
		"list_price": curGood.store_price
	};
	//				setHtml();
	showProduct(curGood);
}
		
function showProduct(product) {

	//第一步设置第一个图片滑动
	setSldiderHtml();
	//第二步设置商品名字价钱等
	setproductMessage(product);
	//设置规格
	setProductSpec(product);
	//设置评价
//	setevalute();
	//设置店铺
	setStore(product.store);
	//设置相试宝贝
	//			setGoodsLike();

	showGoodMore();
	//显示加载详情
//	document.getElementById('dianji').style.display = "";
	
}	
		
//设置slider
function setSldiderHtml() {
	var picSlider = document.createElement('div');
	picSlider.className = 'mui-slider';
	detailcontent.appendChild(picSlider);

	var picSliderGroup = document.createElement('div');
	picSliderGroup.className = 'mui-slider-group';

	var picsliderindicator = document.createElement('div');
	picsliderindicator.className = 'mui-slider-indicator';
	for(var i = 0; i < detail.detail_small_pictures.length;) {
		var item = detail.detail_small_pictures[i];
		//设置itemdetai
		var div = document.createElement('div');
		div.className = 'mui-slider-item';
		//				var html = '<a href="#"><img src="http://file.huihoo.com'+item+'"/></a>';
		var html = '<a href="#"><img src="' + item + '"/></a>';
		div.innerHTML = html;
		picSliderGroup.appendChild(div);
		//设置itemindicator
		var divindicator = document.createElement('div');
		if(i == 0) {
			divindicator.className = 'mui-indicator mui-active';
		} else {
			divindicator.className = 'mui-indicator';
		}
		picsliderindicator.appendChild(divindicator);

		i = i + 1;
	}
	picSlider.appendChild(picSliderGroup);
	picSlider.appendChild(picsliderindicator);
	var gallery = mui('.mui-slider');
	gallery.slider({
		interval: 0 //自动轮播周期，若为0则不自动播放，默认为0；
	});
}
		
//设置商品信息
function setproductMessage(product){
			var headul= HCoder.createHtmlNode({"type":"ul","id":"headul","class":"mui-table-view"});
			
//			var headul =  document.createElement('ul');
//			headul.id = 'headul';
//			headul.className = 'mui-table-view';
			
			
			var li = HCoder.createHtmlNode({"type":"li","class":"mui-table-view-cell"});
			var div_table = HCoder.createHtmlNode({"type":"div","class":"mui-table"});
			var div_cell = HCoder.createHtmlNode({"type":"div","class":"mui-table-cell mui-col-xs-10"});
			var h5_goodName = HCoder.createHtmlNode({"type":"h5","class":"own-black-color mui-ellipsis-2"});
			h5_goodName.innerHTML=product.goods_name;
			div_cell.appendChild(h5_goodName);
			div_table.appendChild(div_cell);
			li.appendChild(div_table);
			
			headul.appendChild(li);
			detailcontent.appendChild(headul);
				if(plus.storage.getItem("user"))
				{
					//vip价格
					var h5_vipPrice = HCoder.createHtmlNode({"type":"h5","class":"own-main-color"});
					h5_vipPrice.innerHTML='VIP会员价格:    ¥'+product.vipPrice;
					div_cell.appendChild(h5_vipPrice);
					
					//商城价格
					var h5_storePrice = HCoder.createHtmlNode({"type":"h5","class":"own-main-color"});
					h5_storePrice.innerHTML='普通会员价格：  ¥'+product.store_price;
					div_cell.appendChild(h5_storePrice);	
					
					var h6_goodPrice = HCoder.createHtmlNode({"type":"h6","class":"own-text-through"});
					h6_goodPrice.innerHTML='市场价格：  ¥'+product.goods_price;
					div_cell.appendChild(h6_goodPrice);

				}
				else{
					var h5_vipPrice = HCoder.createHtmlNode({"type":"h5","class":"own-main-color"});
					h5_vipPrice.innerHTML="价格登录可见";
					div_cell.appendChild(h5_vipPrice);
				}			
			
			//追加销售数量,关注次数 评论次数
//			var li_saleNum = HCoder.createHtmlNode({"type":"li","class":"mui-table-view-cell"});
//			div_table = HCoder.createHtmlNode({"type":"div","class":"mui-table"});
//			div_cell = HCoder.createHtmlNode({"type":"div","class":"mui-table-cell mui-col-xs-4"});
//			h5_node = HCoder.createHtmlNode({"type":"h5","class":"own-black-color"});
//			h5_node.innerHTML="销量:"+product.goods_salenum+"件";
//			div_cell.appendChild(h5_node);
//			div_table.appendChild(div_cell);
//			
//			div_cell = HCoder.createHtmlNode({"type":"div","class":"mui-table-cell mui-col-xs-2"});
//			h5_node = HCoder.createHtmlNode({"type":"h5","class":"own-black-color"});
//			h5_node.innerHTML="关注:"+product.goods_click+"次";
//			div_cell.appendChild(h5_node);
//			div_table.appendChild(div_cell);
//			
//			div_cell = HCoder.createHtmlNode({"type":"div","class":"mui-table-cell mui-col-xs-3"});
//			h5_node = HCoder.createHtmlNode({"type":"h5","class":"own-black-color"});
//			h5_node.innerHTML="评论:"+product.evaluteCount+"次";
//			div_cell.appendChild(h5_node);
//			div_table.appendChild(div_cell);			
//			
//			li_saleNum.appendChild(div_table);
//			headul.appendChild(li_saleNum);
//			
			//追加快递信息
//			setProductTranInfo(product,headul);
			
			
//			var li_kuaidi = HCoder.createHtmlNode({"type":"li","class":"mui-table-view-cell"});
//			div_table = HCoder.createHtmlNode({"type":"div","class":"mui-table"});
//			div_cell = HCoder.createHtmlNode({"type":"div","class":"mui-table-cell mui-col-xs-10"});
//			var kuaidi_fee = HCoder.createHtmlNode({"type":"h5","class":"own-black-color"});
//			kuaidi_fee.innerHTML="快递12.00元";
//			div_cell.appendChild(kuaidi_fee);
//			div_table.appendChild(div_cell);
//			
//			//追加商家所在城市
//			div_cell = HCoder.createHtmlNode({"type":"div","class":"mui-table-cell mui-col-xs-2 mui-text-right"});
//			var kuaidi_city = HCoder.createHtmlNode({"type":"h5","class":"own-black-color"});
//			kuaidi_city.innerHTML="郑州";
//			div_cell.appendChild(kuaidi_city);
//			div_table.appendChild(div_cell);
//			
//			li_kuaidi.appendChild(div_table);
//			headul.appendChild(li_kuaidi);
			
			//追加商家承诺
			var li_chengnuo = HCoder.createHtmlNode({"type":"li","class":"mui-table-view-cell setbg"});
			div_table = HCoder.createHtmlNode({"type":"div"});
			div_table.appendChild(HCoder.createHtmlNode({"type":"span","class":"mui-icon iconfont icon-queren"}));
			div_table.appendChild(HCoder.createHtmlNode({"type":"span","innerHTML":"商家承诺 正品保障"}));
			li_chengnuo.appendChild(div_table);
			
//			div_table = HCoder.createHtmlNode({"type":"div"});
//			div_table.appendChild(HCoder.createHtmlNode({"type":"span","class":"mui-icon iconfont icon-queren"}));
//			div_table.appendChild(HCoder.createHtmlNode({"type":"span","innerHTML":"7天无理由退换货，退货邮费由买家承担"}));
//			li_chengnuo.appendChild(div_table);
			
			headul.appendChild(li_chengnuo);
}

/**
 * 设置商品物流信息
 * @param {Object} product
 * @param {Object} parentNode
 */
function setProductTranInfo(product,parentNode)
{
			//追加快递信息
			var li_kuaidi = HCoder.createHtmlNode({
				"type": "li",
				"class": "mui-table-view-cell"
			});
			div_table = HCoder.createHtmlNode({
				"type": "div",
				"class": "mui-table"
			});
			div_cell = HCoder.createHtmlNode({
				"type": "div",
				"class": "mui-table-cell mui-col-xs-10"
			});
			var kuaidi_fee = HCoder.createHtmlNode({
				"type": "h5",
				"class": "own-black-color"
			});
			
			if(product.goods_transfee==1)
			{
				kuaidi_fee.innerHTML = product.tranInfo.tranType;
			}
			else
			{
				kuaidi_fee.innerHTML = product.tranInfo.tranType+":"+ product.tranInfo.tranFee+"元";
			}
			
			div_cell.appendChild(kuaidi_fee);
			div_table.appendChild(div_cell);

			//追加商家所在城市
			div_cell = HCoder.createHtmlNode({
				"type": "div",
				"class": "mui-table-cell mui-col-xs-2 mui-text-right"
			});
			var kuaidi_city = HCoder.createHtmlNode({
				"type": "h5",
				"class": "own-black-color"
			});
			kuaidi_city.innerHTML = product.tranInfo.fromCity;
			div_cell.appendChild(kuaidi_city);
			div_table.appendChild(div_cell);

			li_kuaidi.appendChild(div_table);
			parentNode.appendChild(li_kuaidi);
	
}

//设置选择商品规格
function setProductSpec(product) {
	if(product.specItems == null) {
		return;
	}

	if(product.specItems.length == 0) {
		return;
	}

	var chooseUl = document.createElement('ul');
	chooseUl.className = 'mui-table-view chooseUl';
	chooseUl.innerHTML = '<li class="mui-table-view-cell">\
								<a href="#" class="mui-navigate-right">选择 商品规格</a>\
								</li>';
	detailcontent.appendChild(chooseUl);

}

//设置选择颜色分类
function setChooseColor() {
	var chooseUl = document.createElement('ul');
	chooseUl.className = 'mui-table-view chooseUl';
	chooseUl.innerHTML = '<li class="mui-table-view-cell">\
								<a href="#" class="mui-navigate-right">选择 颜色 分类</a>\
								</li>';
	detailcontent.appendChild(chooseUl);

}

//加载显示商品详细信息
function showGoodMore()
{
	if(curGood==null)
	{
		return ;
	}
	
	var good_more = document.getElementById('good_more');
	G_removeAllChildNode(good_more);
//	content.innerHTML='<pre><img src="/upload/store/38/2016/11/25/c59759cb-b841-407d-ae9f-d16ad2d79ada.png" alt="" /> </pre>';

	var content = HCoder.createHtmlNode({"type":"li","class":"mui-table-view-cell mui-media mui-col-xs-12"});
	content.innerHTML=curGood.goods_details;
	
	good_more.appendChild(content);
	
//	if(mui.os.android) {
//		hasMore = false;
//		mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
//	}
	
//	var btnGoodMore = document.getElementById('dianji');
//	btnGoodMore.style.display="none";	
//	
//	document.getElementById('slider').style.display="";	
}

//设置评价
function setevalute()
{
	evalutes = curGood.evalutes;
	
	var evaluteUl = document.createElement('ul');
	evaluteUl.className = 'mui-table-view';
	detailcontent.appendChild(evaluteUl);
	var evaluteLi = HCoder.createHtmlNode({"type":"li",
		"class": "mui-table-view-cell"
	});
	var p = HCoder.createHtmlNode({
		"type": "p",
		"class": "evaluateTitle"
	});
	p.innerHTML = "宝贝评价";

	evaluteLi.appendChild(p);

	var evaluteDiv = HCoder.createHtmlNode({"type":"div"});
		
	for (var i=0;i<evalutes.length;i++) {
		evaluate = evalutes[i];
//		console.log(evaluate);
		var span = HCoder.createHtmlNode({"type":"span","class":"evaluate"});
		span.innerHTML=evaluate;
		evaluteDiv.appendChild(span);
	}
	evaluteLi.appendChild(evaluteDiv);
	evaluteUl.appendChild(evaluteLi);

}

//设置店铺
function setStore(store) {
	if(store == null) {
		return;
	}
	
	if(store.point==null)
	{
		store.point={description_evaluate:0,service_evaluate:0,ship_evaluate:0};
	}
	
	if(store.logoUrl ==null)
	{
		store.logoUrl = "../img/bg.jpeg";
	}

	var storeUl = HCoder.createUlNode({"class":"mui-table-view"});
	
	var storeLi= HCoder.createLiNode({"id":store.id,"class":"mui-table-view-cell"});
	
	//店铺logo
	var imgDiv = HCoder.createDivNode({"class":"evaluaterHead"});
	var imgLogo = HCoder.createImgNode({"src":store.logoUrl});
	var spanName = HCoder.createSpanNode({"class":"mui-ellipsis","innerHTML":store.store_name});
	imgDiv.appendChild(imgLogo);
	imgDiv.appendChild(spanName);
	storeLi.appendChild(imgDiv);

	//店铺评价:
	var pointDiv = HCoder.createDivNode({"class":"mui-table"});
	var descriptionDiv = HCoder.createDivNode({"class":"mui-table-cell mui-col-xs-4"});
	descriptionDiv.innerHTML="描述相符:"+store.point.description_evaluate;
	pointDiv.appendChild(descriptionDiv);
	
	var serviceDiv = HCoder.createDivNode({"class":"mui-table-cell mui-col-xs-4"});
	serviceDiv.innerHTML="服务态度:"+store.point.service_evaluate;
	pointDiv.appendChild(serviceDiv);	
	
	var shipDiv = HCoder.createDivNode({"class":"mui-table-cell mui-col-xs-4"});
	shipDiv.innerHTML="发货速度:"+store.point.ship_evaluate;
	pointDiv.appendChild(shipDiv);		

	storeLi.appendChild(pointDiv);
	
	//全部商品
	var goodCountDiv = HCoder.createDivNode({"class":"mui-table storeLink"});
	var countDiv = HCoder.createDivNode({"class":"mui-table-cell mui-col-xs-6","innerHTML":"<br/>"});
	var spanCount = HCoder.createSpanNode({"class":"evaluate lingBtn","innerHTML":"宝贝数量:"+store.goodCount});
	countDiv.appendChild(spanCount);
	goodCountDiv.appendChild(countDiv);
	
	//收藏信息
	var favirateDiv = HCoder.createDivNode({"class":"mui-table-cell mui-col-xs-6","innerHTML":"<br/>"});
	var spanFavirate = HCoder.createSpanNode({"class":"evaluate lingBtn","innerHTML":"收藏次数:"+store.favorite_count});
	favirateDiv.appendChild(spanFavirate);
	goodCountDiv.appendChild(favirateDiv);
	
	
	storeLi.appendChild(goodCountDiv);
	
	storeUl.appendChild(storeLi);
		
	detailcontent.appendChild(storeUl);
	
	storeLi.addEventListener('tap',function(){
		openStore(store.id);
	});
	

//	var storeUl = document.createElement('ul');
//	storeUl.className = 'mui-table-view';
//	storeUl.innerHTML = '<li class="mui-table-view-cell">\
//				<div class="evaluaterHead">\
//					<img src="../img/bg.jpeg" />\
//					<span class="mui-ellipsis">' + store.store_ower + '</span>\
//				</div>\
//				<div class="mui-table">\
//					<div class="mui-table-cell mui-col-xs-4">发货速度：4.8</div>\
//					<div class="mui-table-cell mui-col-xs-4">店铺等级：5.0</div>\
//					<div class="mui-table-cell mui-col-xs-4">发货数度：4.5</div>\
//				</div>\
//				<div class="mui-table storeLink " style="text-align: center;">\
//					<div class="mui-table-cell mui-col-xs-6">396<br/><span class="stroemsg">全部宝贝</span><br/><span class="evaluate lingBtn">查看宝贝分类</span></div>\
//					<div class="mui-table-cell mui-col-xs-6">3.3万<br/><span class="stroemsg">收藏次数</span><br/><span class="evaluate lingBtn">进入店铺吧</span></div>\
//				</div>\
//			 </li>';
//	detailcontent.appendChild(storeUl);
	
}

function openStore(storeId)
{
//	console.log("store:"+storeId);
	showStoreView({"storeId":storeId});
	
}
		
function setGoodsLike() {
	var goods = document.createElement('ul');
	goods.className = 'mui-table-view mui-grid-view';
	detailcontent.appendChild(goods);

	var word = document.createElement('p');
	word.className = 'own-black-color';
	word.style.marginBottom = '0px';
	word.style.marginLeft = '5px';
	word.style.paddingTop = '5px';
	word.innerText = '相似商品';
	goods.appendChild(word);

	for(var i = 0; i < 8; i++) {
		var goodsItem = document.createElement('li');
		goodsItem.className = 'mui-table-view-cell mui-media mui-col-xs-3';
		goodsItem.innerHTML = '<a href="#">\
							<img class="mui-media-object" style="max-width: 100%;height: auto" src="../img/3.jpg" />\
							<div class="mui-media-body ">\
								<p class="mui-ellipsis-2">尽量不要福建省批发价我佩服排位积分排位</p>\
								<p class="price">¥22.0</p>\
							</div>\
						</a>'
		goods.appendChild(goodsItem);
	}

}				

//收藏商品
function onFavGood() {
	if(p_judgeLogin()) {
		return;
	}

	params = {};
	params["goodId"] = product_id;
	params["userId"] = G_getUser().id;

	ajax_post_product_favorite(params, favGoodSuccess);
}

//收藏商品成功回调
function favGoodSuccess(response) {
	
	if(response.status=="success")
	{
		mui.toast("收藏成功");
	}
	else
	{
		mui.toast(response.description);
	}
}

//根据用户类型 返回购买价格
function getPrice()
{
	var price=0;
	user=  G_getUser();
	if(user.userType==2)
	{
		price = curGood.vipPrice;
	}
	else{
		price = curGood.store_price;
	}	

	return price;
}

function getBuyCount()
{
	var count = document.getElementById("buyCount").value;
	
	return count;
}

//加入购物车		
function onAddCart() {
	
	if(p_judgeLogin()) {
		return;
	}
	
	if(curGood==null)
	{
		return ;
	}
	
	openSelSpecWnd("cart");

}

//打开购物车
function onOpenCart()
{
	mui.back();
	
	mui.alert("open  cart");
	//打开购物车
	window.openCart();
	
}



//打开规格数量选择器
function openSelSpecWnd(fromType)
{
	good = {"price":getPrice(),"stock":curGood.goods_inventory,"id":curGood.id};
	good["imgSmallUrl"] = curGood.imgUrl;
	optionData = {"good":good};
	optionData["CallBack"]=onSelSpecOK;	
	optionData["fromType"]=fromType;	
	
	specSelect.init(optionData);
	specSelect.createSelect();	
	specSelect.showSelect();		
	
}


//规格选择完成回调
function onSelSpecOK(resData)
{
	console.log(JSON.stringify(resData));
	curOptionType = resData.fromType;
	
	if(curOptionType=="cart")
	{
		addCart(resData);
	}
	else
	{
		onBuyNowOK(resData);
	}		
	
}


function addCart(buyGood)
{	
	var param = {};
//	param["shopCartItem.count"] = getBuyCount();
//	param["shopCartItem.price"] = buyGood.price; 
	param["shopCartItem.count"] = buyGood.count; 
	param["shopCartItem.price"] = buyGood.price; 
	param["shopCartItem.cart_type"] = "app";
	param["shopCartItem.goods_id"] = curGood.id; 
	param["shopCartItem.spec_info"] = buyGood.spec_info;
	param["storeId"] = curGood.store.id; 
	param["userId"] = user.id;	
	
	ajax_post_product_add_cart(param,addCartSuccess);	
	
	
}

//加入购物车成功回调
function addCartSuccess(response) {
	
	if(response.status=="success")
	{
		mui.toast("添加购物车成功");
		mui('.mui-popover').popover('hide'); 
	}
	else
	{
		mui.toast(response.description);
	}
}

function onBuyConfim()
{
	if(curOptionType=="cart")
	{
		addCart();
	}
	else
	{
		onBuyNowOK();
	}	
	
	mui('#wm_selectspec').popover('hide'); 
}


function showSelSpec(optionType)
{
	curOptionType = optionType;

	mui('#wm_selectspec').popover('toggle');
}

//立即购买	
function onBuyNow() {
	
	if(p_judgeLogin()) {
		return;
	}	
	
//	showSelSpec("buy");
	
	openSelSpecWnd("buy");

}

//立即购买确认,进入提交订单页面,确认提交订单
function onBuyNowOK(buyGood)
{

	if(curGood==null || curGood==undefined)
	{
		return ;
	}
	
	var options={};
	options["url"]="../order/orderConfim.html";
	options["id"]="../order/orderConfim.html";
	
	var orderInfo = {};	
	var store = {};
	store["id"]=curGood.store.id;
	store["storeName"]=curGood.store.store_name;
//	store["imgUrl"]="../img/50.jpg";

	orderInfo["store"]=store;
	
	var goodList = [];	
	var good = {};
	good["id"]=curGood.id;
	good["price"]=buyGood.price;
	good["count"]=buyGood.count;
	//规格暂时为空
	good["specInfo"]=buyGood.spec_info;	
	good["goodName"]=curGood.goods_name;	
	good["imgSmallUrl"]=curGood.imgUrl;	
	

	goodList.push(good);
		
	orderInfo["goods"]=goodList;
	
	var traninfo = {};
	traninfo["goods_transfee"]=curGood.goods_transfee;
	traninfo["tranFee"]=curGood.tranInfo.tranFee;	
	traninfo["tranType"]=curGood.tranInfo.tranType;
	
	orderInfo["traninfo"]=traninfo;	
	orderInfo["orderFromType"] = "nowBuy";		
			
	calcTotal(orderInfo);
	options["extras"]=orderInfo;
	
	window.openNewWindow(options);

}

function calcTotal(orderInfo)
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


function p_judgeLogin()
{
	if(G_getUser()==null)
	{
		mui.toast("请先登录!");
		return true;
//		mui.confirm("是否现在登录?","提示",function(e){
//			
//			
//			
//		});
		
	}
	
	return false;
}

/**
 * 商品详情tab框滑动事件
 * @param {Object} e
 */
function onSlider(e)
{
	slideNumber = e.detail.slideNumber;
	if ( slideNumber== 0)
	{
		console.log("0");
	}
	else if( slideNumber== 1)
	{
		console.log("1");
	}
	else if( slideNumber== 2)
	{
		console.log("2");
	}
	
}



