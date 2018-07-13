mui.init({
	swipeBack: false
});
var mainWebView; //当前主webview
var navtitle;
var curTabItemIndex=0; //当前被选中tabitem

var barItemUrl = [];
	barItemUrl.push({"index":0,"title":"首页","url":"baritemHtml/home.html"});
	barItemUrl.push({"index":1,"title":"分类","url":"baritemHtml/category.html"});
	barItemUrl.push({"index":2,"title":"购物车","url":"baritemHtml/cart.html"});
	barItemUrl.push({"index":3,"title":"个人中心","url":"baritemHtml/mine.html"});


var barItemWebView = {}; //每个tabitem所对应显示的页面对象
//父子模版页面
var headerWebView;
var contentWebView;

//商品详情的父子模版
var detailTem;
var detailsub;
mui.plusReady(function() {

	//改变statusbar
	plus.navigator.setStatusBarBackground('#e70f1a');
	navtitle = document.getElementById('nav-title');
	mainWebView = plus.webview.currentWebview();
	
	getRootPath();

	plus.storage.setItem("mainWebViewId",mainWebView.id);
//	console.log(mainWebView.id);
	
	//判断是否已经登陆,若没有登陆将预加载登陆页面，知道登陆成功为止close登陆页面
	judgelogin();
	
	//初始化tab页面,
	inittabitemWebviews();
	//为每个bar－item添加点击事件
	addEventForTabitem();
	//创建父子模版类
	initParentChildTemplate();
	
	//创建店铺父子页面
	preloadStoreView();
	
	
	changeTabEvent();
	
	//接收自定义的事件页面切换
	changeWebViewEvent();

	document.getElementById("searchBox").addEventListener('keyup',onSearchKeyWord);

	setTimeout( "initProductView()" , 1000 );

});

function initProductView()
{
	window.initProductDetailView();
	
}


function getRootPath()
{
		
//	console.log("url:"+window.location.href);
	
	var path=plus.io.convertLocalFileSystemURL('index.html');
	
//	var mainViewUrl = plus.webview.currentWebview().getURL();
	
//	var newurl = plus.io.convertAbsoluteFileSystem(path);
	
	var mainViewUrl = window.location.href;
	if(mainViewUrl==null || mainViewUrl=="")
	{
		mainViewUrl = path;
	}
	
	var index = mainViewUrl.indexOf('www/');
	var rootPath = mainViewUrl.substring(0,index + 4);	
	
//	console.log("root:"+rootPath);	
//	mui.alert("root:"+rootPath+": path:"+mainViewUrl);
	localStorage.setItem("rootPath",rootPath);
	
}



//关闭启动页面
function closeStartScreent() {
	//创建父子模版完成后关闭启动页面
	plus.navigator.closeSplashscreen();

}

//判断是否已经登陆
function judgelogin() {
	//			//测试语句
	//			localStorage.removeItem('user');
	//判断是否已经登录成功//localstorage在页面关闭的时候也同样存在，sessionstorage页面关闭数据不存在
	if(!G_getUser()) {
		mui.preload({
			url: 'Mine/login.html',
			id: 'Mine/login.html',
			styles: {
				top: '0px',
				bottom: '0px'
			}
		});
	}
}

//初始化每个tabitem所对应的页面
function inittabitemWebviews() {
	for(var i = 0; i < barItemUrl.length; i++) {
		
		barItem = barItemUrl[i];
		
		barItem["webView"] = mui.preload({
			url: barItem.url,
			id: barItem.url,
			styles: {
				top: '44px',
				bottom: '51px',
				left: '0px',
				bounce: 'vertical',
				bounceBackground: '#DCDCDC'
			},
			waiting: {
				autoShow: false
			}
		});
		barItem.webView.hide();
		mainWebView.append(barItem.webView);
	}
	barItemUrl[0].webView.show();
//	barItemWebView[0].show();
}

function preloadView(barItem)
{
	if(barItem==null || barItem==undefined)
	{
		return ;
	}
	
	barItem["webView"] = mui.preload({
		url: barItem.url,
			id: barItem.url,
			styles: {
				top: '44px',
				bottom: '51px',
				left: '0px',
				bounce: 'vertical',
				bounceBackground: '#DCDCDC'
			},
			waiting: {
				autoShow: false
			}
		});
	
	mainWebView.append(barItem.webView);	
	barItem.webView.show();
}


//为每个tabitem添加监听
function addEventForTabitem() {
	mui('.mui-bar-tab').on('tap', '.mui-tab-item', function() {
		var tabIndex = this.getAttribute('href');
//		console.log("tab:"+tabIndex);
		changeTab(tabIndex);
	});
}

/**
 * 切换tab窗口
 * @param {Object} index
 */
function changeTab(index)
{
	if(index==null || index==undefined)
	{
		return ;
	}
	
	if(index<0 ||index>=barItemUrl.length)
	{
		return ;
	}
	
	if(curTabItemIndex==index)
	{
		return ;
	}
	curTabItemIndex=index;
	
	barItem = barItemUrl[index];
	navtitle.innerText = barItem.title;
	
	//控制搜索框是否显示
	var searchBox = document.getElementById("searchBox");
	if(index == 0) {
		navtitle.innerText = "";
		searchBox.style.display = "";
	} else {
		searchBox.style.display = "none";
	}	
	
	showCurWebView(index);
	
}

//设置webview的切换显示的函数
function showCurWebView(index) {
	for(var i = 0; i < barItemUrl.length; i++) {
		barItem = barItemUrl[i];
		
		if(barItem.webView==null )
		{
			console.log(" is null ");
			continue;
		}
		if(parseInt(i) == parseInt(index)) {
//			console.log(" show: "+index);
			var view = plus.webview.getWebviewById(barItem.url);
			if(view!=null)
			{
				view.show();
			}
			else
			{
				//如果为空,则重新加载
				preloadView(barItem);
				console.log(barItem.url+" is null ");
			}
			
//			barItem.webView.show();
		} else {
//			console.log(" hide: "+i);
			barItem.webView.hide();
		}
	}
}

/**
 * 切换主界面tab显示
 */
function changeTabEvent()
{
	window.addEventListener('changeTab',function(ops){
		
		console.log(JSON.stringify(ops.detail));
		changeTab(ops.detail.tabIndex);
		
	},false);
	
}



//初始化父子模版函数
function initParentChildTemplate() {
	headerWebView = mui.preload({
		url: 'template-main.html',
		id: 'template-main.html',
		styles: {
			top: '0px',
			bottom: '0px'
		},
		extras: {
			mtype: 'main'
		}
	});
	contentWebView = mui.preload({
		url: '',
		id: 'template-sub.html',
		styles: {
			top: '45px',
			bottom: '0px',
			bounce: 'vertical',
			bounceBackground: '#DCDCDC'
		},
		extras: {
			mtype: 'sub'
		}
	});
	contentWebView.hide();
	headerWebView.hide();
	contentWebView.addEventListener('loaded', function() {
		contentWebView.show();
	}, false);
	headerWebView.addEventListener('hide', function() {
		//设置statusbar
		//				plus.navigator.setStatusBarBackground('#41cea9');
		contentWebView.hide();
	}, false);
	headerWebView.addEventListener('show', function() {
		//设置statusbar
		//				plus.navigator.setStatusBarBackground('#f7f7f7');
	});
	headerWebView.append(contentWebView);
}

//添加监听事件
function changeWebViewEvent() {
	window.addEventListener('newWebView', function(options) {

//						var list = plus.webview.all();
//						mui.each(list,function(index,item){
//							console.log(item.id);
//						});

		var id = options.detail.id;
//		mui.toast("new web event:"+id);
		var href = options.detail.href;
		var aniShow = options.detail.aniShow;
		var title = options.detail.title;
		//是否显示按钮
		var isBars = options.detail.isBars;
		var barsIcon = options.detail.barsIcon;
		var categoryID = options.detail.categoryID;

//		console.log(id);
//		console.log(href);
//		console.log(aniShow);
//		console.log(title);
//		console.log(categoryID);
		//需要特殊处理的地方，比如说登陆页面模态，需要有时候被控制在内存中。
		if(id == 'Mine/login.html') {
			var loginWebView = plus.webview.getWebviewById(id);
			if(loginWebView) {
				loginWebView.show(aniShow);
			} else {
				//这个条件下面是为了适应当登录页面并没有初始化，或者初始化之后用户又已经登录了这个页面被删除之后再次登录
				loginWebView = mui.preload({
					url: 'Mine/login.html',
					id: id,
					styles: {
						top: '0px',
						bottom: '0px'
					}
				});
				
				loginWebView.addEventListener('loaded', function() {
					loginWebView.show(aniShow);
				}, false);
			}
		} 
		 else if(~id.indexOf('.html')) {
			if(!~id.indexOf('needtem.html')) {
				mui.openWindow({
					url: href,
					id: id,
					styles: {
						popGesture: 'close'
					},
					show: {
						aniShow: aniShow
					},
					waiting: {
						autoShow: false
					}
				});
			} else {
				//headerWebView.hide();如果在这里添加这个代码，会导致监听事件在下面contentwebview show之后又隐藏掉它
				contentWebView.hide();
				//像template-main传送事件让他更改标题
				mui.fire(headerWebView, 'templateFire', {
					id: id,
					title: title,
					aniShow: aniShow,
					target: href,
					isBars: isBars,
					barsIcon: barsIcon,
					categoryID: categoryID
				});

				//如果为展示category或者商品信息的页面，需要每次都重新加载，因为存在刷新页面信息的东西;
				//再次加载页面显示的也是之前加载的页面信息，所以这里，在这个页面返回的时候将里面的数据清空
				if(mui.os.ios || (mui.os.android && parseFloat(mui.os.version) < 4.4))
				{
					var str = contentWebView.getURL();
					var index = str.indexOf('www/');
					str = str.substring(index + 4);
//					console.log("index:"+str);
					if((!~id.indexOf('category-detail')) && (contentWebView.getURL() == href || str == href)) {
						console.log("loaded");
						contentWebView.show();
					} else {
						console.log("new load");
						contentWebView.loadURL(href);
					}
					headerWebView.show(aniShow, 150);
				}
			}
		}
	}, false);
}


function onSearchKeyWord(event)
{
	var keyWord = document.getElementById("searchBox").value;
	var e = event ||window.event ||arguments.callee.caller.arguments[0];
	if(e !=null && e.keyCode==13)
	{
//		mui.alert("搜索:"+keyWord);
		if(keyWord=="")
		{
			mui.toast("搜索关键字不能为空!");
			return ;
		}
		
		var options = {title:"商品搜索","keyword":keyWord};
//		{title: title,categoryID: itemID,"categoryLevel":1}
		
		window.pushProListView(options);
		
	}
	else
	{
		console.log(e.keyCode);
	}

}


//两次点击返回
var first = null;
mui.back = function() {
	//首次按键
	if(!first) {
		first = new Date().getTime();
		mui.toast("再按一次退出");
		setTimeout(function() {
			first = null;
		}, 1000);
	} else {
		if(new Date().getTime() - first < 1000) {
			plus.runtime.quit();
		}
	}
}


