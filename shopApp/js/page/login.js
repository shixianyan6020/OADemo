
mui.init({
	swipeBack: false
});

var account;
var psd;
var login;
var register;
var repsd;

var loginWebview;
mui.plusReady(function() {

	plus.screen.lockOrientation("portrait-primary");

	account = document.querySelector('input[type="text"]');
	psd = document.querySelector('input[type="password"]');
	login = document.getElementById('loginBtn');
	register = document.getElementById('register');
	repsd = document.getElementById('repsd');
	

//	//检测本地的登录过的账号。
//	if(localStorage.getItem('account')) {
//		account.value = localStorage.getItem('account');
//	}

	//登陆的点击事件
	login.addEventListener('tap',onLogin);

	//注册按钮的点击事件
	register.addEventListener('tap', function() {
//		

		window.openNewWindow({"url":'../Mine/register-needtem.html'});
//		var aniShow = getaniShow();
//		var HBuilder = plus.webview.getWebviewById('HBuilder');
//		mui.fire(HBuilder, 'newWebView', {
//			id: 'Mine/register-needtem.html',
//			href: 'Mine/register-needtem.html',
//			aniShow: aniShow,
//			title: '用户注册'
//		});
	}, false);

});


function AddLoginHide()
{
loginWebview = plus.webview.currentWebview();

		//添加事件接收close事件，并且要判断是否已经登录成功，然后页面close，因为login页面是预先加载的页面
		//在这里向需要的页面发送消息事件通知已经登录做响应的处理
		loginWebview.addEventListener('hide', function() {

			/*当前需要发送的id 之后会更多
			[LOG] : HBuilder
			[LOG] : Mine/login.html
			[LOG] : baritemHtml/home.html
			[LOG] : baritemHtml/category.html
			[LOG] : baritemHtml/xinyuandan.html
			[LOG] : baritemHtml/cart.html
			[LOG] : baritemHtml/mine.html
			[LOG] : template-main.html
			[LOG] : template-sub.html
			*/
			//					var list = plus.webview.all();
			//					mui.each(list,function(index,item){
			//						console.log(item.id);
			//					});

			var cartwebview = plus.webview.getWebviewById('baritemHtml/cart.html');
			var minewebview = plus.webview.getWebviewById('baritemHtml/mine.html');

			mui.fire(cartwebview, 'loginSuccess', {});
			mui.fire(minewebview, 'loginSuccess', {});

//			loginWebview.close();
		}, false);
	
	
}


function viliData()
{
	var mobile = G_getValue("mobile");
	var pass = G_getValue("password");	
	
//	if(mobile=="")
//	{
//		G_toast("手机号不能为空!");
//		return false;
//	}
		
	if(mobile=="")
	{
		G_toast("用户帐号不能为空!");
		return false;
	}
	
	if(pass=="")
	{
		G_toast("密码不能为空!");
		return false;
	}
	
	return true;
	
}

function onLogin()
{
	if(!viliData())
	{
		return ;
	}
	
	var mobile = getById("mobile");
	var password = getById("password");
	
	var msg  = mobile.value+" "+password.value;
	
	//向窗口注册登录成功
	AddLoginHide();	

	
	var param={"username":mobile.value,"password" : password.value};
	param["waitTip"] = "登录中....";
	ajax_post_login(param,login_success);
	
	
//	var url =G_getHostUrl()+"login/login";
//	mui.ajaxSettings.beforeSend=onAjaxStart;
//	mui.ajaxSettings.complete= onAjaxEnd;
//	mui.post(url,data,success,"json");
	
	
}

function saveUser(user)
{
	G_saveJson("user",user);
	
	G_saveText("userId",user.id);
}

function login_success(response)
{
	if(response.status=="success")
	{
	//	mui.alert(" 登录成功");
	
	//保存用户信息.
		var user = response.data;
		if(user==null)
		{
			mui.alert("返回数据不正确,登录失败!");
			return;
		}
		
		saveUser(user);
		
//		mui.back();

		loginWebview = plus.webview.currentWebview();
		loginWebview.hide();

		mui.toast('登录成功');
	}
	else
	{
		mui.toast(response.description);
	}
	
}

