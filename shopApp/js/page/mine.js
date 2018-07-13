mui.init({
	swipeBack: false
});

var aniShow;
var parentWebView;
var currentWebview;
var touxiangimg;
var logoutBtn;
var trueimg;		
var touxiangword;

mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
			parentWebView =currentWebview.parent();
			//aniShow = getaniShow();
			aniShow ="slide-in-bottom";
			
			touxiangimg = document.getElementById('touxiangimg');
			logoutBtn = document.getElementById('logoutBtn');
			trueimg = document.getElementById('trueimg');
			touxiangword = document.getElementById('touxiangword');

			currentWebview.addEventListener('show',function(){
			initShowData();
			},false);

		initShowData();

			mui('.mui-table-view').on('tap', 'a', function() {
				var id = this.getAttribute('href');
				var href = this.href;
				var title = this.innerText;
				var isBars = false;
				var barsIcon = '';
				var categoryID = id;

				//检测已经存在sessionkey否者运行下面的登陆代码
				if(G_getUser()) {} else {
					href = "Mine/login.html";
					id = "Mine/login.html";
					aniShow = 'slide-in-bottom';
					title = '登录';
				}

				if(this.id == 'changeaddress') {
					isBars = true;
					barsIcon = 'mui-icon iconfont icon-tianjia';
				}

				mui.fire(parentWebView, 'newWebView', {
					id: id,
					href: href,
					aniShow: aniShow,
					title: title,
					isBars: isBars,
					barsIcon: barsIcon,
					categoryID:categoryID
				});
			});

			//点击头像登录
			touxiangimg.addEventListener('tap', function() {
				if(!G_getUser()) {
					var id = "Mine/login.html";
					var href = "Mine/login.html";
					var title = '登录';
					var aniShow = 'slide-in-bottom';
					var isBars = false;
					var barsIcon = '';

					mui.fire(parentWebView, 'newWebView', {
						id: id,
						href: href,
						aniShow: aniShow,
						title: title,
						isBars: isBars,
						barsIcon: barsIcon
					});
				}
			}, false);

			//点击登出
			logoutBtn.addEventListener('tap',onLogout);
			
			//点击升级
//			getById("btnUpgrade").addEventListener('tap',onUpgrade);
			//接收登录成功事件
			window.addEventListener('loginSuccess',initShowData);
			
//		testBtn = document.getElementById('testBtn');	
//		testBtn.addEventListener('tap',test2);
			
		});

/**
 * 登录成功
 */
function loginSuccess()
{
	user = G_getUser();
	if(user==null)
	{
		return ;
	}	
	
}

function initShowData()
{
	user = G_getUser();
	
	if(user==null)
	{
		getById("trueimg").style.display = 'none';
		getById("touxiangword").style.color = 'indianred';	
		getById("touxiangimg").style.display = 'inline';			
		getById("logoutBtn").style.display="none";
//		getById("btnUpgrade").style.display="none";
		G_setHTMLById("id_yuer", "");
		G_setHTMLById("id_jifen", "");	
		G_setHTMLById("p_showName", "");
		touxiangword.innerText = "请登录";
		return ;
	}
	
	getById("logoutBtn").style.display = "block";
	logoutBtn.style.display = 'block';
	trueimg.style.display = 'inline';
	touxiangimg.style.display = 'none';
	trueimg.src = '../img/touxiang.jpg';
	touxiangword.innerText = user.trueName;
	touxiangword.style.color = 'black';
	

//	getById("btnLogin").style.display="none";
	
//	console.log(user.userName);
//	G_setHTMLById("p_mobile", user.mobile);
	G_setHTMLById("id_yuer", "余额:" + user.availableBalance);
	G_setHTMLById("id_jifen", "积分:" + user.integral);
	var name = getById("p_showName");
	if(user.userType == 1) {
		G_setHTMLById("p_showName", "普通会员:" + user.trueName);
//		getById("btnUpgrade").style.display= "block";
	} 
	else {
		G_setHTMLById("p_showName", "VIP会员:" + user.trueName);
//		getById("btnUpgrade").style.display="none";
	}
}



//打开VIP升级界面
//function openVipUpgrade()
//{
//	mui.fire(parentWebView, 'newWebView', {
//		id: "Mine/my-vip-needtem.html",
//		href: "Mine/my-vip-needtem.html",
//		aniShow: "slide-in-bottom",
//		title: "VIP升级",
//		isBars: false,
//		barsIcon: ""
//	});
//}

function onLogout()
{
	mui.confirm("确定要退出登录吗?","确认",onConfirmLogout);

}

function onConfirmLogout(e)
{
	if(e.index==0)
	{
		return ;
	}
	
//	plus.storage.clear();
//	mui.back();
	user = G_getUser();
	if(user==null)
	{
		return ;
	}
	
	var param = {};
	param["userId"] = user.id; 
	param["waitTip"] = "注销中....."; 
//	G_ajaxPost(G_getHostUrl()+"login/logout",param,success_logout);
	ajax_post_logout(param,success_logout);
	
}


function success_logout(response)
{
	if(response.status=="success")
	{
//		plus.storage.clear();
		
		plus.storage.removeItem("userId");
		plus.storage.removeItem("user");
		plus.storage.removeItem("addrList");
		initShowData();
		G_toast("已经退出登录,请重新登录");
	}
	else
	{
		mui.toast(response.description);
	}
}

function test2()
{
//		var itemID = "2389";
//		var indexWebview = plus.webview.getWebviewById("HBuilder");
//		var anishow = getaniShow();
//		mui.toast("show:"+itemID);
//		//弹入分类商品列表
//		mui.fire(indexWebview, "newWebView", {
//			"id": "Home/product-detail-needtem.html",
//			"href": "Home/product-detail-needtem.html",
//			"aniShow": anishow,
//			"title": "商品详情",
//			"isBars": false,
//			"barsIcon": "",
//			"product_id": itemID
//		});	
//headerWebView = plus.webview.getWebviewById("template-main.html");
//
//var id = 'category/category-detail-needtem.html';
//var title = "洗护";
//var href = 'category/category-detail-needtem.html';
//var isBars = false;
//var barsIcon = '';
//var aniShow = getaniShow();
//var categoryID = "1";
//mui.fire(headerWebView, 'templateFire', {
//	id: 'category/category-detail-needtem.html',
//	title: "洗护",
//	aniShow: aniShow,
//	target: 'category/category-detail-needtem.html',
//	isBars: false,
//	barsIcon: "",
//	categoryID: "1"
//});
//
//headerWebView.show(aniShow, 150);	

//	window.pushProListView({title: "洗护",categoryID: "1"});
		
//	var options={};
//	options["url"]="../order/orderConfim.html";
//	options["id"]="../order/orderConfim.html";
//	
//	
//	var orderInfo = {};	
//	var store = {};
//	store["id"]=2423432;
//	store["storeName"]="美容美发学校";
//	store["imgUrl"]="../img/50.jpg";
//
//	orderInfo["store"]=store;
//	
//	var goodList = [];	
//	var good = {};
//	good["id"]=3434;
//	good["price"]=20;
//	good["count"]=2;	
//	good["goodName"]="测试商品名称";	
//	good["imgSmallUrl"]="../img/50.jpg";
//	good["specInfo"]="颜色分类:红色 100ml";
//	goodList.push(good);
//	
//	var good2 = {};
//	good2["id"]=3435;
//	good2["price"]=18;
//	good2["count"]=5;	
//	good2["goodName"]="测试商品名称1";	
//	good2["imgSmallUrl"]="../img/50.jpg";
//	good2["specInfo"]="颜色分类:蓝色 200ml";
//	goodList.push(good2);	
//	
//	orderInfo["goods"]=goodList;
//	
//	var traninfo = {};
//	traninfo["goods_transfee"]=0;
//	traninfo["tranFee"]=8;	
//	traninfo["tranType"]="快递";	
//	
//	orderInfo["traninfo"]=traninfo;	
//	
//	//
//	var total={};
//	total["totalFee"]=1000;
//	total["totalCount"]=10;
//	orderInfo["total"]=total;	
//	
//	
//	
//	options["extras"]=orderInfo;
//	
//	window.openNewWindow(options);
	
	
//	var options={};
//	options["url"]="../Mine/pay-select.html";
//	options["id"]="../Mine/pay-select.html";	
//	window.openNewWindow(options);
	
//	console.log("dddd");
//	showStoreView({});


}




function test()
{

//	
	var productID = "2389";
	anishow = getaniShow();
	window.pushDetailView({
//		"id": "Home/product-detail-needtem.html",
//		"target": "Home/product-detail-needtem.html",
//		"aniShow": aniShow,
		"product_id": productID
	});

//	detailTem = plus.webview.getWebviewById("product-detail-tem.html");
//	anishow = getaniShow();
//	var productID = "2389";
//	id = "Home/product-detail-needtem.html";
//	mui.fire(detailTem, "detailTemplate", {
//		"id": "Home/product-detail-needtem.html",
//		"target": "Home/product-detail-needtem.html",
//		"aniShow": aniShow,
//		"product_id": productID
//	});

	//if(mui.os.ios || (mui.os.android && parseFloat(mui.os.version) < 4.4)) 
//	{
//		//detailsub.loadURL(id);
//		detailTem.show(aniShow);
//	}
	
	
	
}




