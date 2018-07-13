mui.init({
	swipeBack: true,
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			callback: pulldownRefresh
		},
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});
	
//分页查询参数
var queryParam={};	
var productsList;
//当前加载到的数据
var curLoadData;
var categorydetailWebview;//当前webview
mui.plusReady(function() {
	categorydetailWebview = plus.webview.currentWebview();
	productsList = document.getElementById('productsList');

	//当reday加载之后，因为每次都要重新load所以每次都会调用到这边。
	//向父页面发送消息获取productID
	mui.fire(categorydetailWebview.parent(), 'getCategoryID', {});
	//紧接着获取父页面返回的productid事件
	window.addEventListener('postCategoryID', function(e) {
//		console.log('收到返回的good class，id为' + e.detail.categoryID);
		logData(JSON.stringify(e.detail));
		
		initGoodList();
		//通过id请求数据
		initQueryParam({"gcId":e.detail.categoryID,"gcLevel":e.detail.categoryLevel,
		"keyword":e.detail.keyword});
		loadGoodList();
	}, false);

	//监听页面hide事件，当页面返回的时候将里面的数据清空
	categorydetailWebview.addEventListener('hide', function() {
		
		clear();
		
	}, false);

	//添加每个item点击的监听事件#productsList
	mui('.mui-table-view').on('tap', '.mui-table-view-cell', function() {
		
		if(this.id !=undefined)
		{
			window.pushDetailView({"product_id": this.id});
		}
	});
});


function clear()
{
	curLoadData = null;
	initPageNumber();
	G_removeAllChildNode(productsList);
}

function initGoodList()
{
	G_removeAllChildNode(productsList);
}

function initQueryParam(options)
{
	queryParam["orderColunm"] = "id";
	queryParam["orderMode"] = "asc";
	queryParam["pageSize"] = 8; 
	queryParam["pageNumber"] = 1;
	queryParam["splitpage"] = 1; 
//	console.log(JSON.stringify(options));
	if(options!=null && options !=undefined)
	{
//		if(options.gcId !=undefined)
//		{
//			queryParam["_query.gcId"] = options.gcId;
//		}
		if(options.gcLevel !=null && options.gcLevel !=undefined )
		{
			if(options.gcLevel==1)
			{
				queryParam["_query.gcBigId"] = options.gcId;
			}
			else
			{
				queryParam["_query.gcId"] = options.gcId;
			}
		}
		else
		{
			queryParam["_query.gcBigId"] = "";		
			queryParam["_query.gcId"] = "";
		}
		
		if(options.keyword !=null && options.keyword !=undefined && options.keyword!="")
		{
			queryParam["_query.names"] = options.keyword;
		}
		else
		{
			queryParam["_query.names"]="";
		}
	}	
}

function loadGoodList()
{
	
	//通过id请求数据
	ajax_get_product_list(queryParam, productlistSuccess);
	
}

function initPageNumber()
{
	queryParam["pageNumber"]= 1;
}

function setNextPageNumber()
{
	queryParam["pageNumber"] += 1;
}

//成功查询分类列表下的数据
function productlistSuccess(resData) {
	
	curLoadData = resData;
	
	window.showGoodList(curLoadData.list,productsList);
	
	if( !curLoadData.first)
	{
		if(curLoadData.hasNextPage)	
		{
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
		}
		else
		{
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		}
	}

}




//function showGoodList(goodList,parentNode)
//{
//	if(goodList ==null || goodList==undefined)
//	{
//		return ;
//	}
//	
//	if(parentNode==undefined)
//	{
//		return;
//	}
//	
//	if(goodList.length==0)
//	{
//		return ;
//	}
//	
//	var isLogin =false;
//	if(G_getUser()!=null)
//	{
//		isLogin = true;
//	}
//
//	for (i=0;i<goodList.length;i++) {
//		
//		good = goodList[i];
//		
//		createGoodNode(good,parentNode,isLogin);
//	}
//	
//}
//
////创建商品列表对象
//function createGoodNode(good,parentNode,isLogin)
//{
//	if(good==null || good== undefined)
//	{
//		return ;
//	}
//	
//	var liNode = HCoder.createLiNode({"class":"mui-table-view-cell mui-media mui-col-xs-6  goodLi","id":good.id});
//	var goodBgDiv = HCoder.createDivNode({"class":"good-bgDiv"});
//	var goodImg = HCoder.createImgNode({"class":"mui-media-object good-img","src":good.imgUrl});
//	var goodBodyDiv = HCoder.createDivNode({"class":"mui-media-body goodBodyDiv"});
//	var goodNameNode = HCoder.createPNode({"class":"mui-ellipsis-2 good-name","innerHTML":good.goods_name});
//	goodBodyDiv.appendChild(goodNameNode);
//	
//	var goodVipPriceNode = HCoder.createH5Node({"class":"mui-ellipsis-1 vip-price","innerHTML":"vip:¥"+good.vipPrice});
//	var goodStorePriceNode = HCoder.createPNode({"class":"store-price","innerHTML":"¥"+good.store_price});
//	var goodSalePriceNode = HCoder.createPNode({"class":"sale-price","innerHTML":"¥"+good.goods_price});
//	if(!isLogin)
//	{
//		goodStorePriceNode.innerHTML="价格登录可见";
//		goodSalePriceNode.innerHTML="";
//		goodVipPriceNode.innerHTML="";
//	}
////	goodBodyDiv.appendChild(goodVipPriceNode);
//	goodBodyDiv.appendChild(goodStorePriceNode);
//	goodBodyDiv.appendChild(goodSalePriceNode);	
//	
//	goodBgDiv.appendChild(goodImg);
//	goodBgDiv.appendChild(goodBodyDiv);
//	
//	liNode.appendChild(goodBgDiv);
//	
//	parentNode.appendChild(liNode);
//	
//}



/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	
	setNextPageNumber();
	loadGoodList();
	
//	console.log("pullupRefresh");
//	mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
}

function pulldownRefresh()
{
	clear();
	loadGoodList();

	mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
}

