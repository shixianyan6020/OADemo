


//================元素操作=====================================//
function getTextBoxById(boxId)
{
	return document.getElementById(boxId);
}

function getById(id)
{
	return document.getElementById(id);
}

function G_getById(id)
{
	return document.getElementById(id);
}

function G_setHTMLById(id,value)
{
	var element = getById(id);
	if(element==null)
	{
		return false;
	}
	
	element.innerHTML= value;
}

function G_setValue(id,value)
{
	var element = getById(id);
	if(element==null)
	{
		return false;
	}	
	element.value= value;
}

function G_getValue(id)
{
	el = getById(id);
	if(el)
	{
		return el.value;
	}
	return "";
}


function G_isMobile(s) {
	var patrn = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
  if (!patrn.exec(s)) {
  	return false;
    }
    return true;
}

function G_removeAllChildNode(parentNode)
{
	if(parentNode.childNodes==null || parentNode.childNodes==undefined)
	{
		return ;
	}
	
    var children = parentNode.childNodes;
    var childnum = children.length;
    for(var j = 0; j < childnum; j++) {
    	parentNode.removeChild(parentNode.firstChild);
    }	
	
}

/*
　 *　方法:Array.remove(dx)
　 *　功能:删除数组元素.
　 *　参数:dx删除元素的下标.
　 *　返回:在原数组上修改数组
*/
//经常用的是通过遍历,重构数组.
Array.prototype.remove=function(dx)
{
	if(isNaN(dx) || dx > this.length) {
		return false;
	}
	for(var i = 0, n = 0; i < this.length; i++) {
		if(this[i] != this[dx]) {
			this[n++] = this[i];
		}
	}
	this.length -= 1;
}


//-------------------------------信息提示------------------------///
function toast(msg)
{
	plus.nativeUI.toast(msg);
}

function G_toast(msg)
{
	plus.nativeUI.toast(msg);
}
function G_alert(msg)
{
	plus.nativeUI.alert(msg,null,"系统提示","关闭");
}


//===================================本地存储相关============================//
/*
 * 保存json对象到本地
 */
function G_saveJson(key,jsonData)
{
	if(jsonData==null)
	{
		return false;
	}
	
	plus.storage.setItem(key,JSON.stringify(jsonData));	
}

/**
 * 保存文本到本地
 * @param {Object} key
 * @param {Object} dataTxt
 */
function G_saveText(key,dataTxt)
{
	plus.storage.setItem(key,dataTxt);	
}

/**
 * 根据key获取保存的json对象
 * @param {Object} key
 */
function G_getObjByKey(key)
{
	dataTxt= plus.storage.getItem(key);
	if(dataTxt==null)
	{
		return null;
	}
	
	dataJson =JSON.parse(dataTxt);
	
	return dataJson;
}

/**
 * 根据key获取保存的文本
 * @param {Object} Key
 */
function G_GetTxtByKey(Key)
{
	if(key==null || key ==undefined)
	{
		return null;
	}
	
	if(plus.storage.getLength()==0)
	{
		return null;
	}
	
	return plus.storage.getItem(key);
}

function G_saveUser(user)
{
	G_saveJson("user",user);
	
	G_saveText("userId",user.id);	

}

function G_getUser()
{
	return G_getObjByKey("user");
}

function G_getUserId()
{
	return G_GetTxtByKey("userId");
}

