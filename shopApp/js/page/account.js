

/**
 *  页面js的操作模版
 * @param {Object} $
 * @param {Object} doc
 */
(function($, doc)
{
	mui.plusReady(index_ready);
	
}(mui, document));

function index_init()
{
	
}

var user =null;
function index_ready()
{
	//绑定升级事件
	var loginButton = getById("btnLogout");
	loginButton.addEventListener('tap',onLogout);
		
}

function onLogout()
{
	mui.confirm("确定要退出?","确认",onConfirmLogout);

}

function onConfirmLogout(e)
{
	if(e.index==1)
	{
		return ;
	}
	
	plus.storage.clear();
	mui.back();
//	user = G_getUser();
//	
//	if(user==null)
//	{
//		return ;
//	}
//	
//	var param = {};
//	param["userId"] = user.id; 
//	G_ajaxPost(G_getHostUrl()+"login/logout",param,success_logout);
	
}


function success_logout(response)
{
	if(response.status=="success")
	{
		plus.storage.clear();
		mui.back();
		var wm_login= mui.openWindow("sign.html");
		
	}
	else
	{
		mui.toast(response.description);
	}
}



