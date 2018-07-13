
mui.init({
	swipeBack:true
});
		
		
var addressPicker;
var pickerlabel;
var curSelArea=null;
var cityData;		

mui.plusReady(function(){
	
	plus.screen.lockOrientation("portrait-primary");
//	var loginButton =document.getElementById('btnLogin');
	var loginButton = document.getElementById("btnReg");
	loginButton.addEventListener('tap',onRegister);

	G_getById("btnCreateCode").addEventListener('tap',generic_mobile_verify_code);	
	
	var btnCreatecode = document.getElementById("btnCreateCode");
	btnCreatecode.addEventListener('tap',generic_mobile_verify_code);
	
	var cityDataStr = localStorage.getItem("cityData");
	if(cityDataStr!=null)
	{
		
		cityData = JSON.parse(cityDataStr);
	}
	else
	{
		ajax_get_city_data_List({},loadCityDataSuccess);
	}
	
	
	addressPicker = document.getElementById('addressPicker');
	pickerlabel = addressPicker.children[0];


	//监听呼出picker事件
	addressPicker.addEventListener('tap', function() {
		var cityPicker3 = new mui.PopPicker({"layer": 3});
		cityPicker3.setData(cityData);
		cityPicker3.show(function(items) {
			
//			console.log(JSON.stringify(items[0]));
//			console.log(JSON.stringify(items[1]));
//			console.log(JSON.stringify(items[2]));
			curSelArea= items[2];
			curSelArea["fullName"]=(items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
			pickerlabel.innerText = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
		});

	}, false);	
	
});


function loadCityDataSuccess(res)
{
	if(res.status=="success")
	{
		cityData = res.data;
//		cityPicker3.setData(cityData);
		localStorage.setItem("cityData",JSON.stringify(cityData));
		
	}
	
}


function viliData()
{
	var mobile = G_getValue("user.mobile");
	var userName = G_getValue("user.userName");
	var pass = G_getValue("user.password");
	var password_confrim = G_getValue("password_confirm");
	var vCode = G_getValue("vcode");
		
	if(userName=="")
	{
		G_toast("用户名不能为空!");
		return false;
	}
	
	if(pass=="")
	{
		G_toast("密码不能为空!");
		return false;
	}
	
	if(password_confrim=="")
	{
		G_toast("确认密码不能为空");
		return false;
	}
	
	if(pass!=password_confrim)
	{
		G_toast("两次输入的密码不一致!");
		return false;
	}
	
	if(mobile=="")
	{
		G_toast("手机号不能为空!");
		return false;
	}
	
	if(vCode=="")
	{
		G_toast("验证码不能为空!");
		return false;
	}
	
	if(curSelArea==null)
	{
		G_toast("没有选择地址!");
		return false;		
	}
	
	return true;
}

function getRegObj()
{
	var obj = {};
	
	obj["user.mobile"]=G_getValue("user.mobile");
	obj["user.userName"]=G_getValue("user.userName");
	obj["user.password"]=G_getValue("user.password");
	obj["user.trueName"]=G_getValue("user.trueName");
	obj["user.real_name"]=G_getValue("user.trueName");
	obj["user.license_name"]=G_getValue("user.license_name");
	obj["user.register_type"]="mobile";
	obj["user.area_id"]=curSelArea.value;
	
	return obj;
}



function onRegister()
{
	if(!viliData())
	{
		return ;
	}

	data = getRegObj();
	data["waitTip"]="正在注册.....";
	ajax_post_register(data,registerSuccess);

//	G_ajaxPost(G_getHostUrl()+"user/register",data,success);
	document.getElementById("btnReg").setAttribute("disabled",true);
	
}

function saveUser(user)
{
	G_saveJson("user",user);
	
	G_saveText("userId",user.id);
}

function registerSuccess(response)
{
	if(response.status=="success")
	{
		//mui.alert("注册成功");
		mui.confirm("注册成功,是否现在登录?","提示",function(e){
			
//			if(e.index==0)
			{
				mui.back();
			}
		});
		
	}
	else
	{
		mui.toast(response.description);
	}
	
	document.getElementById("btnReg").setAttribute("disabled",false);
//	res = JSON.stringify(response);
//	console.log(res);
}


var time=60;
var time_id="";
function generic_mobile_verify_code()
{

	var mobile = G_getValue("user.mobile");
//	console.log(mobile);
	if(!G_isMobile(mobile))
	{
		G_toast("请输入正确的手机号码,只能是11位数字");
		return ;
	}
	
	var data = {"type":"mobile_vetify_code","mobile":mobile};
	ajax_post_generic_mobile_verify(data,generic_mobile_verify_code_Success);
	
	var btnCode = document.getElementById("btnCreateCode");

	btnCode.setAttribute("disabled",true);
}

function generic_mobile_verify_code_Success(response)
{
	if(response.status=="success")
	{
		 mui.toast("验证码发送成功,15分钟内有效!");
		time_id=setInterval(countDown,1000);
	}
	else
	{
		mui.toast(response.description);
	}	
	
}



function countDown()
{
 	--time;
 	
 	var btnCode = document.getElementById("btnCreateCode");
 	btnCode.innerHTML = time+"秒"
 if(time == 0) {
 	clearInterval(time_id);
 	btnCode.innerHTML = "获取验证码";
	btnCode.setAttribute("disabled",false);
// 	mui(btnCode).button('reset');
 	time = 10;
 }
}
