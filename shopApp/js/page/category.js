mui.init({
	swipeBack:false
});
		
var categoryWebview;//这个页面的实例
var categoryStair = [];//第一级category数据存储
		
var categoryStairHtml;//categoryStair的div
var categoryMoversHtml;//categoryMovers的div
var curParentId ="";  //当前显示的一级分类id

var parentWebView;//父类
mui.plusReady(function() {
	categoryWebview = plus.webview.currentWebview();
	categoryStairHtml = document.getElementById('categoryStair');

	categoryMoversHtml = document.getElementById('categoryMovers');
	parentWebView = plus.webview.currentWebview().parent();
		
	loadOneGradeCategory();
	categoryWebview.addEventListener('show', function() {
		//当页面显示的时候如果已经存在数据就不再请求
		loadOneGradeCategory();
	}, false);

	//为第一级分类监听点击事件
	mui('#categoryStair').on('tap', '.mui-control-item', function() {
		var categoryA = this;
		curParentId = this.id;
		loadChildClass(this.id);
		//加载对应分类的商品信息
		//get_sub_categoryByParentID(item.getAttribute('href').substring(9));
	});

	//监听第二级分类的点击事件
	mui('#categoryMovers').on('tap', '.mui-table-view-cell', function() {
		var categoryA = this;
		
		showGoodByCategroy(this.id,this.innerText);
	});

});

function showGoodByCategroy(classId,title)
{
	
//	console.log("id:"+id+" "+title);
	window.pushProListView({title: title,categoryID: classId,"categoryLevel":2});
//	var id = 'category/category-detail-needtem.html';
//	var href = 'category/category-detail-needtem.html';
//	var isBars = false;
//	var barsIcon = '';
//	var aniShow = getaniShow();
//
//	//弹入分类商品列表
//	mui.fire(parentWebView, 'newWebView', {
//		id: id,
//		href: href,
//		aniShow: aniShow,
//		title: title,
//		isBars: isBars,
//		barsIcon: barsIcon,
//		categoryID: classId
//	});	
	
}


function loadOneGradeCategory()
{
	if(categoryStair.length<=0)
	{
		ajax_get_sys_good_category({},onLoadOneGradeSuccess);
	}
	else
	{
		showOneGrade();
	}
	
}

function onLoadOneGradeSuccess(res)
{
	if(res.status=="success")
	{
		categoryStair = res.data;
		
		showOneGrade();
	}
	else
	{
		mui.alert(res.description);
	}

}

function showOneGrade()
{
	G_removeAllChildNode(categoryStairHtml);
	if(categoryStair==null || categoryStair==undefined)
	{
		return ;
	}
	
	if(categoryStair.length<=0)
	{
		return ;
	}
	
	for (i=0;i<categoryStair.length;i++) {
		goodClass = categoryStair[i];
		
		aNode = HCoder.createANode({"id":goodClass.id,"class":"mui-control-item","href":'#category'+goodClass.id});
		aNode.innerHTML=goodClass.className;
		categoryStairHtml.appendChild(aNode);
	}

	//设置初始化第一个的mui-active
	document.querySelector('.mui-control-item').classList.add('mui-active');
	
	firstOneGrade = categoryStair[0];
	loadChildClass(firstOneGrade.id);
	
}

function getOneGrade(id)
{
	for (i=0;i<categoryStair.length;i++) {
		goodClass = categoryStair[i];
		if(id==goodClass.id)
		{
			return goodClass;
		}
	}	
	
	return null;
}

function setChildData(parentId,childs)
{
	oneGrade = getOneGrade(parentId);
	if(oneGrade!=null)
	{
		oneGrade["childs"]=childs;
	}
}


function loadChildClass(parentId)
{
	oneGradeClass =  getOneGrade(parentId);
	if(oneGradeClass.childs ==undefined)
	{
		var param={"parentId":parentId};
		ajax_get_sys_good_category(param,loadChildClassSuccess);		
	}
	else
	{
		showChildClass(oneGradeClass.childs);
	}
	
}

function loadChildClassSuccess(res)
{
	if(res.status=="success")
	{
		setChildData(curParentId,res.data);	
		showChildClass(res.data);
	}
	else
	{
		mui.alert(res.description);
	}	
	
}

function showChildClass(goodClassList)
{	
	if(goodClassList==null || goodClassList==undefined)
	{
		retrun ;
	}

	G_removeAllChildNode(categoryMoversHtml);
	var divNode = HCoder.createDivNode({"class":"mui-control-content mui-active"});
	var uNode = HCoder.createUlNode({"class":"mui-table-view"});
	
	for (i=0;i<goodClassList.length;i++) {
		
		goodClass = goodClassList[i];
		
		var liNode = HCoder.createUlNode({"id":goodClass.id,"class":"mui-table-view-cell"});
		liNode.innerHTML=goodClass.className;
		uNode.appendChild(liNode);
	}
	divNode.appendChild(uNode);
	categoryMoversHtml.appendChild(divNode);
	
//	console.log(categoryMoversHtml.innerHTML);
	
}
