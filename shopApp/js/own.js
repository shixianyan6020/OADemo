

(function(own){
	
	_this = this;
	
	//当页面hide的时候将其中的页面close掉
	own.closeChildWebviewOfhide = function(currentWebview,closedWebviewId){
		currentWebview.addEventListener('hide',function(){
			
			var closeWeb = plus.webview.getWebviewById(closedWebviewId);
			
			if (!currentWebview.getURL() ||!closeWeb ) {
				return;
			}
			closeWeb.close();
			closeWeb = null;
		},false);
	}
	//当页面close的时候将其中的页面close掉
	own.closeChildWebviewOfclose = function(currentWebview,closedWebviewId){
		currentWebview.addEventListener('close',function(){
			var closeWeb = plus.webview.getWebviewById(closedWebviewId);
			if (!currentWebview.getURL() ||!closeWeb ) {
				return;
			}
			closeWeb.close();
			closeWeb = null;
		},false);
	}
	
	//一般情况下设置anishow
	own.getaniShow = function(){
		var aniShow = "pop-in";
		if (mui.os.android) {
			var androidlist = document.querySelectorAll("ios-only");
			if (androidlist) {
				mui.each(androidlist,function(num,obj){
					obj.style.display = "none";
				});
			}
			
			if (parseFloat(mui.os.version) < 4.4) {
				aniShow = "slide-in-right";
			}
		}
		
		return aniShow;
	}
	
	/**
	 *根据商品信息生成html list 
	 * @param {Object} product
	 */
	own.createListHtmlbyProduct = function(item ){
		
		if(item==null)
		{
			return null;
		}
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell mui-media mui-col-xs-6';
		li.innerHTML = '<a href="'+item.product_id+'"><div class= "bgDiv"><img class="mui-media-object" src="'+item.detail_image_url+'"/><div class="mui-media-body"><p class="mui-ellipsis-2">'+item.product_name+'</p><p class="price-one">¥'+item.product_price.default_price+'</p><p class="price-two">¥'+item.product_price.list_price+'</p></div></div></a>';
	
		return li;
	}
	

	
	/**
	 *预加载商品详情显示页面 
	 */
	own.initProductDetailView=function()
	{
//		var rootPath= plus.storage.getItem("rootPath");
		var rootPath= localStorage.getItem("rootPath");
		
//		mui.toast("init:"+rootPath);
		//独立的父子模版页面encodeurl()encodeURI(url)
		var detailTem = mui.preload({
//			url:  rootPath+'Home/product-detail-tem.html',
			url:  encodeURI(rootPath+'Home/product-detail-tem.html'),
			id: 'product-detail-main',
			styles: {
				top: '0px',
				bottom: '0px'
			}
		});
		var detailsub = mui.preload({
//			url: rootPath+'Home/product-detail-needtem.html',
			url: encodeURI(rootPath+'Home/product-detail-needtem.html'),
			id: 'product-detail-sub',
			styles: {
				top: '44px',
				bottom: '0px',
				bounce: 'vertical',
				bounceBackground: '#DCDCDC'
			}
		});
		detailsub.hide();
		detailTem.hide();
		detailsub.addEventListener('loaded', function() {
			detailsub.show();
		}, false);
		detailTem.addEventListener('hide', function() {
			detailsub.hide();
		}, false);
		
		detailTem.append(detailsub);		
		
		
	}	
	
	
	//激活商品明细页面加载
	own.pushDetailView = function(options) {
		var detailMain = plus.webview.getWebviewById('product-detail-main');
		var detailSub = plus.webview.getWebviewById('product-detail-sub');
		
		localStorage.setItem("productId",options.product_id);
		
		
		if(detailMain==null || detailSub==null)
		{
			console.log("detailMain is null ");
			initProductDetailView();
//			logAllWebview();

			detailMain = plus.webview.getWebviewById('product-detail-main');
			detailSub = plus.webview.getWebviewById('product-detail-sub');
			if(detailMain==null || detailSub==null)
			{
				mui.alert("页面加载失败!");
				return ;
			}

		}
	
		if(detailSub!=null)
		{
			mui.fire(detailSub,'init',options);
			detailSub.show();
			detailMain.show();			
		}
	}		
	
//	//激活商品明细页面加载
//	own.pushDetailView = function(options) {
//		var detailTem = plus.webview.getWebviewById('product-detail-tem.html');
//		
//		if(detailTem==null)
//		{
//			console.log("detailtem is null ");
////			initProductDetailView();
////			logAllWebview();
//		}
//	
//		var aniShow = getaniShow();
//		mui.fire(detailTem, "detailTemplate", {
//			"id": "product-detail-needtem.html",
//			"target": "product-detail-needtem.html",
//			"aniShow": aniShow,
//			"product_id": options.product_id
//		});		
//		detailTem.show(aniShow);
//	}	
	
	
	
	
	//激活商品列表显示
	own.pushProListView = function(options) {
		var mianWnd = plus.webview.getWebviewById('template-main.html');
		var aniShow = getaniShow();
		mui.fire(mianWnd, "templateFire", {
			"id": "category/category-detail-needtem.html",
			"target": "category/category-detail-needtem.html",
			"aniShow": aniShow,
			"isBars": false,
			"barsIcon": "",
			"title": options.title,
			"categoryID": options.categoryID,
			"categoryLevel":options.categoryLevel,
			"keyword":options.keyword
		});		
				
		mianWnd.show(aniShow);
	}		
	
	//打开新页面
	own.openNewWindow=function(options)
	{
		if(options.url==null|| options.url==undefined)
		{
			mui.alert("页面路径为空!");
			return;
		}
		
		mui.openWindow(options);
		
	}
	
	/**
	 *打开订单详情页面 
	 * @param {Object} order_id
	 */
	own.openOrderDetail=function (order_id)
		{
			var options={};
			options["url"]="../order/order-detail.html";
			options["id"]="../order/order-detail.html";	
			options["extras"]={"orderId":order_id};	
			mui.openWindow(options);
		}
		
	/**
	 *打开地址添加
	 * @param {Object}
	 */
	own.openNewAddress=function (param)
		{
			if(param !=null )
			{
				if(param.optionType!=undefined)
				{
					address = {"optionType":param.optionType};
					localStorage.setItem("curAddress",JSON.stringify(address));					
				}
			}
			
			var options={};
			options["url"]="../Mine/address.html";
			options["id"]="../Mine/address.html";	
			var addressWebview =  mui.openWindow(options);
			
			if(addressWebview!=null)
			{
				if(param!=null && param.hideCallBack!=undefined)
				{
					addressWebview.addEventListener('hide',param.hideCallBack);
				}
			}
			
//			console.log(JSON.stringify(addressWebview));
			
		}	
		
	
	/**
	 *刷新购物车页面数据
	 */
	own.refushCartView=function ()
		{
			var cartView=plus.webview.getWebviewById('baritemHtml/cart.html');
			if(cartView !=null)
			{
				mui.fire(cartView, 'initData',{});
			}
		}	
		
	own.showGoodList = function(goodList,parentNode)
	{
		if(goodList ==null || goodList==undefined)
		{
			return ;
		}
		
		if(parentNode==undefined)
		{
			return;
		}
		
		if(goodList.length==0)
		{
			return ;
		}
		
		var isLogin =false;
		if(G_getUser()!=null)
		{
			isLogin = true;
		}
	
		for (i=0;i<goodList.length;i++) {
			
			good = goodList[i];
			
			_this.createGoodNode(good,parentNode,isLogin);
		}		
	}
	
	
	own.createGoodNode = function(good,parentNode,isLogin)
	{
		if(good==null || good== undefined)
		{
			return ;
		}
		
		var liNode = HCoder.createLiNode({"class":"mui-table-view-cell mui-media mui-col-xs-6  goodLi","id":good.id});
		var goodBgDiv = HCoder.createDivNode({"class":"good-bgDiv"});
		var goodImg = HCoder.createImgNode({"class":"mui-media-object good-img","src":good.imgUrl});
		var goodBodyDiv = HCoder.createDivNode({"class":"mui-media-body goodBodyDiv"});
		var goodNameNode = HCoder.createPNode({"class":"mui-ellipsis-2 good-name","innerHTML":good.goods_name});
		goodBodyDiv.appendChild(goodNameNode);
		
		var goodVipPriceNode = HCoder.createH5Node({"class":"mui-ellipsis-1 vip-price","innerHTML":"vip:¥"+good.vipPrice});
		var goodStorePriceNode = HCoder.createPNode({"class":"store-price","innerHTML":"¥"+good.store_price});
		var goodSalePriceNode = HCoder.createPNode({"class":"sale-price","innerHTML":"¥"+good.goods_price});
		if(!isLogin)
		{
			goodStorePriceNode.innerHTML="价格登录可见";
			goodSalePriceNode.innerHTML="";
			goodVipPriceNode.innerHTML="";
		}
	//	goodBodyDiv.appendChild(goodVipPriceNode);
		goodBodyDiv.appendChild(goodStorePriceNode);
		goodBodyDiv.appendChild(goodSalePriceNode);	
		
		goodBgDiv.appendChild(goodImg);
		goodBgDiv.appendChild(goodBodyDiv);
		
		liNode.appendChild(goodBgDiv);
		
		parentNode.appendChild(liNode);
			
	}
	
	/**
	 *打开并切换到购物车 
	 */
	own.openCart = function()
	{
		var mainWebViewId =  plus.storage.getItem("mainWebViewId");
		var mainWebView = plus.webview.getWebviewById(mainWebViewId);
		if(mainWebView!=null)
		{
			mui.fire(mainWebView, 'changeTab', {"tabIndex":2});
		}
		
//		
//		var cartView = plus.webview.getWebviewById('baritemHtml/cart.html');
//		if(cartView!=null)
//		{
//			cartView.show();
//		}
		
	}
	
	
	//----------------以下为view 操作相关/---------------////
	//预加载一个webview
	
	//show 一个webview
	
	//预加载店铺页面
	own.preloadStoreView=function(option)
	{
	
		var store_main = mui.preload({
		url: 'store/store-main.html',
		id: 'store_main',
		styles: {
			top: '0px',
			bottom: '0px'
		}
	});		
		
		var store_sub = mui.preload({
		url: 'store/store.html',
		id: 'store_sub',
		styles: {
			top: '0px',
			bottom: '0px'
			}
		});				
		
	store_main.append(store_sub);	
		
	store_sub.hide();
	store_main.hide();
	store_sub.addEventListener('loaded', function() {
		store_sub.show();
	}, false);
	store_main.addEventListener('hide', function() {
		store_sub.hide();
	}, false);		
		
		
	}

	own.showStoreView = function(initData)
	{
		storeView = plus.webview.getWebviewById('store_sub');
		storeMainView = plus.webview.getWebviewById('store_main');
		
		if(storeView !=null && storeMainView !=null)
		{
			mui.fire(storeView,'init',initData);
			
			storeView.show();
			
			storeMainView.show();
		}
	}
	
	own.hideStoreView = function()
	{
		storeView = plus.webview.getWebviewById('store_sub');
		storeMainView = plus.webview.getWebviewById('store_main');
		
		if(storeView !=null && storeMainView !=null)
		{
			storeView.hide();
			
			storeMainView.hide();
		}
	}	

	own.logAllWebview = function()
	{
		var all = plus.webview.all(); 
	
		for(var i=0;i<all.length;i++){
		console.log(all[i].id);
		}
	}	

})(window);
