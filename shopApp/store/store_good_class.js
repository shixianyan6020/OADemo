mui.init({swipeBack: true});


var curStore=null;
var curOneClassList=null;
mui.plusReady(function(){
	
	curWebView=plus.webview.currentWebview();
	
	curStore = curWebView.store;
	
	console.log("class:"+JSON.stringify(curStore));
	if(curStore!=null)
	{
		loadUserGoodClass();
	}
	
	//为第一级分类监听点击事件
	mui('#categoryStair').on('tap', '.mui-control-item', function() {
		loadChildClass(this.id);
	});

	//监听第二级分类的点击事件
	mui('#categoryMovers').on('tap', '.mui-table-view-cell', function() {
//		var categoryA = this;
//		
//		showGoodByCategroy(this.id,this.innerText);
//		console.log("tow:"+this.id);
	});
		
});
	
function loadUserGoodClass()
{
	var param = {"userId":curStore.user_id};
//	var param = {"userId":103};	
	
	ajax_load_store_goodClass(param,loadUserGoodClassSuccess);
}

function loadUserGoodClassSuccess(res)
{
	if(res.status=="success")
	{
		curOneClassList = res.data;
		clearTwoGradeNode('categoryMovers');
		showOneGrade('categoryStair',curOneClassList);
	}
	else
	{
		mui.alert(res.description);
	}
	
}

function clearTwoGradeNode(parentId)
{
	var twoGradeNode = document.getElementById(parentId);
	G_removeAllChildNode(twoGradeNode);		
}

function showOneGrade(parentId,classList)
{
	var oneGradeNode = document.getElementById(parentId);
	G_removeAllChildNode(oneGradeNode);	
	
	if(classList==null)
	{
		mui.toast("店铺宝贝分类加载失败!");
		return ;
	}
	
	if(classList.length==0)
	{
		mui.toast("店铺没有设置宝贝分类");
		return ;
	}	
	
	for (var i=0;i<classList.length;i++) {
		goodClass = classList[i];
		
		aNode = HCoder.createANode({"id":goodClass.id,"class":"mui-control-item","href":'#category'+goodClass.id});
		aNode.innerHTML=goodClass.className;
		oneGradeNode.appendChild(aNode);
	}

	//设置初始化第一个的mui-active
	document.querySelector('.mui-control-item').classList.add('mui-active');
	
	var firstOneGrade = classList[0];
	loadChildClass(firstOneGrade.id);	
	
}

/**
 * 加载用户自定义子分类
 * @param {Object} parentId
 */
function loadChildClass(parentId)
{
	var param={"userId":curStore.user_id,"parentId":parentId};
	ajax_load_store_goodClass(param,loadChildClassSuccess);		
	
}

function loadChildClassSuccess(res)
{
	if(res.status=="success")
	{
		showChildClass('categoryMovers',res.data);
//		showChildClass('categoryMovers',curOneClassList);
	}
	else
	{
		mui.alert(res.description);
	}	
	
}


function showChildClass(parentId,classList)
{
	var oneGradeNode = document.getElementById(parentId);
	G_removeAllChildNode(oneGradeNode);	
	
	if(classList==null)
	{
		mui.toast("店铺宝贝子分类加载失败!");
		return ;
	}
	
	if(classList.length==0)
	{
		mui.toast("店铺没有设置子分类");
		return ;
	}	
	
	var divNode = HCoder.createDivNode({"class":"mui-control-content mui-active"});
	var uNode = HCoder.createUlNode({"class":"mui-table-view"});
		
	for (var i=0;i<classList.length;i++) {
		goodClass = classList[i];
				
		var liNode = HCoder.createUlNode({"id":goodClass.id,"class":"mui-table-view-cell"});
		liNode.innerHTML=goodClass.className;
		uNode.appendChild(liNode);
	}
	divNode.appendChild(uNode);
	oneGradeNode.appendChild(divNode);		
	
}	
	
	
	



