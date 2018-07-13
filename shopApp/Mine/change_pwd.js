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
		
var inputList;
var changepwdWebview;

mui.plusReady(function() {
	//选出所有input
	inputList = document.querySelectorAll('input[type="password"]');
	changepwdWebview = plus.webview.currentWebview();

	document.querySelector('button[type="button"]').addEventListener('tap', function() {
		for(var i = 0; i < inputList.length; i++) {
			if(inputList[i].value.length <= 0) {
				var alertMSG;
				if(i == 0) {
					alertMSG = '请输入旧密码';
				} else if(i == 1) {
					alertMSG = '请输入新密码';
				} else if(i == 2) {
					alertMSG = '两次输入密码必须一致';
				}
				mui.toast(alertMSG);
				return;
			}
		}
		if(inputList[1].value != inputList[2].value) {
			mui.toast('两次输入密码必须一致');
			return;
		}
		
		user = G_getUser();
			var param={};
			param["userId"] = user.id;
			param["oldPass"] = inputList[0].value; 
			param["newPass"] = inputList[1].value; 
		
		ajax_post_change_password(param,changePwdSuccess);


	}, false);

	//为页面添加事件监听hide
	changepwdWebview.addEventListener('hide', function() {
	clearContent();
	}, false);

});


function clearContent()
{
	
	//将所有的之前输入过的密码全部清空
	mui.each(inputList, function(index, item) {
		item.value = '';
	});
	
}

function pulldownRefresh() {
	//		console.log("change pwd resresh");
	mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed 

}

function changePwdSuccess(res){
	
	if(res.status=="success")
	{
		clearContent();
		mui.alert("修改成功!");
//		changepwdWebview.hide();
	}
	else
	{
		mui.alert(res.description);
	}
		
		

}