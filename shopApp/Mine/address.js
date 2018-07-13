mui.init({
	swipeBack: true
});

var address;
var addressPicker;
var pickerlabel;
var curSelArea=null;
var cityData;
var btnSave;
var currentWebview;
mui.plusReady(function() {
	
	currentWebview =  plus.webview.currentWebview();
	
	currentWebview.addEventListener('show',function(e){
		address = JSON.parse(localStorage.getItem("curAddress"));
		console.log(address.optionType);
		initAddress();
	});
	
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
		var cityPicker3 = new mui.PopPicker({
			layer: 3
		});
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
	
	btnSave = document.getElementById('btnSave');
	btnSave.addEventListener('tap',onSave);
//	        mui(document.body).on('tap', '.mui-btn', function(e) {
//          mui(this).button('loading');
//          setTimeout(function() {
//              mui(this).button('reset');
//          }.bind(this), 2000);
//      });
	
	
});

function initAddress()
{
	if(address==null || address==undefined)
	{
		return ;
	}
	
	if(address.optionType=="edit")
	{
		if(address.area!=null)
		{
			pickerlabel.innerText = address.area.fullName;
			curSelArea = {"value":address.area_id,"text":address.area.fullName};
		}
		
		G_setValue("mobile",address.mobile);
		G_setValue("area_info",address.area_info);
		G_setValue("trueName",address.trueName);
		
	}
	else
	{
		pickerlabel.innerText="省,市,区";
		G_setValue("mobile","");
		G_setValue("area_info","");
		G_setValue("trueName","");		
	}

}

function loadCityDataSuccess(res)
{
	if(res.status=="success")
	{
		cityData = res.data;
		
		localStorage.setItem("cityData",JSON.stringify(cityData));
		
	}
	
}

//判断数据是否有效
function isValide()
{
	var trueName = G_getValue("trueName");
	if(trueName=="")
	{
		mui.toast("收货人姓名不能为空!");
		return false;
	}
	
	var mobile = G_getValue("mobile");
	if(mobile=="")
	{
		mui.toast("收货人手机号码不能为空!");
		return false;
	}
	
	var area_info = G_getValue("area_info");
	if(area_info=="")
	{
		mui.toast("收货人详细地址不能为空!");
		return false;
	}		
	
	if(curSelArea==null || curSelArea==undefined)
	{
		mui.toast("收货人 区域不能为空,请点击设置!");
		return false;
	}
	
	if(address==null || address==undefined)
	{
		address= {"optionType":"add"};
	}
	
	address["trueName"] = trueName;
	address["mobile"] = mobile;
	address["area_info"] = area_info;
	address["area_id"] = curSelArea.value;

	return true;
}


function onSave()
{
	if(!isValide())
	{
		return ;
	}

	user = G_getUser();
	if(user==null)
	{
		mui.alert("没有登录!");
		return ;
	}

	var param = {};
	
	param["address.area_info"] = address.area_info;
	param["address.mobile"] = address.mobile;
	param["address.trueName"] = address.trueName; 
//	param["address.zip"] = "450002"; 
	param["address.area_id"] = address.area_id; 
	param["address.user_id"] = user.id;	
	
	if(address.optionType=="edit")
	{
		param["address.id"] = address.id; 
		ajax_post_update_address(param,saveAddressSuccess);
	}
	else
	{
		ajax_post_save_address(param,saveAddressSuccess);
	}
	
	mui(btnSave).button('loading');
}

function saveAddressSuccess(res)
{
	mui(btnSave).button('reset');
	if(res.status=="success")
	{
//		mui.alert("操作成功!");
		
		mui.fire(currentWebview.parentWindow, 'initData');
		
		currentWebview.hide();
		
	}
	else
	{
		
		
		
	}
	
	
}



