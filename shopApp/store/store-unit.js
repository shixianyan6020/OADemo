
var store_common=function()
{
	
	/**
	 * 渲染店铺基本信息
	 * @param {Object} parentId
	 * @param {Object} store
	 */
	var renderStoreName= function(parentId,store)
	{
		if(store==null || parentId==undefined )
		{
			return ;
		}
		
		var storeNameDiv = document.getElementById(parentId);
		if(storeNameDiv==null)
		{
			return ;
		}
		
		G_removeAllChildNode(storeNameDiv);
		if(store.logoUrl ==null)
		{
			store.logoUrl = "../img/50.jpg";
		}
		
		var imgLogo = HCoder.createImgNode({"src":store.logoUrl,"class":"mui-media-object mui-pull-left store-logo-img"});
		storeNameDiv.appendChild(imgLogo);
		
		//店铺logo
		var nameDiv = HCoder.createDivNode({"class":"mui-pull-left","innerHTML":store.store_name});
		var pName = HCoder.createPNode({"class":"mui-ellipsis","innerHTML":store.store_ower});
		
		nameDiv.appendChild(pName);
		storeNameDiv.appendChild(nameDiv);			
	}
	
	/**
	 * 渲染店铺基本信息
	 * @param {Object} parentId
	 * @param {Object} store
	 */
	var renderStoreBase = function(parentId,store)
	{
		var storeBaseDiv = document.getElementById(parentId);
		if(storeBaseDiv==null)
		{
			return ;
		}
		
		G_removeAllChildNode(storeBaseDiv);		
		var pTime = HCoder.createPNode({"class":"mui-ellipsis"});
		pTime.innerHTML="创店时间:"+store.addTime;
		
		var pArea = HCoder.createPNode({"class":"mui-ellipsis"});
		pArea.innerHTML="所在地区:"+store.area_id;		

		var pAddress = HCoder.createPNode({"class":"mui-ellipsis"});
		pAddress.innerHTML="详细地址:"+store.store_address;
		
		var pGoodCount = HCoder.createPNode({"class":"mui-ellipsis"});
		pGoodCount.innerHTML="商品数量:"+store.goodCount+"件商品";	
		var pFavirate = HCoder.createPNode({"class":"mui-ellipsis"});
		pFavirate.innerHTML="店铺收藏:"+store.favorite_count+"人收藏";		

		var pTel = HCoder.createPNode({"class":"mui-ellipsis"});
		pTel.innerHTML="联系电话:"+store.store_telephone;		

		var pQQ = HCoder.createPNode({"class":"mui-ellipsis"});
		pQQ.innerHTML="店铺QQ:"+store.store_qq;	


		storeBaseDiv.appendChild(pTime);
		storeBaseDiv.appendChild(pArea);
		storeBaseDiv.appendChild(pAddress);
		storeBaseDiv.appendChild(pGoodCount);
		storeBaseDiv.appendChild(pFavirate);
		storeBaseDiv.appendChild(pFavirate);
		storeBaseDiv.appendChild(pTel);
		storeBaseDiv.appendChild(pQQ);		
		
	}
	
	/**
	 * 渲染店铺评价信息
	 * @param {Object} parentId
	 * @param {Object} store
	 */
	var renderStoreEvaluate =function(parentId,store)
	{
		var storeEvaluateDiv = document.getElementById(parentId);
		if(storeEvaluateDiv==null)
		{
			return ;
		}
		
		G_removeAllChildNode(storeEvaluateDiv);		
		var pDecs = HCoder.createPNode({"class":"mui-ellipsis"});
		pDecs.innerHTML="描述相符:"+store.point.description_evaluate;
		
		var pService = HCoder.createPNode({"class":"mui-ellipsis"});
		pService.innerHTML="服务态度:"+store.point.service_evaluate;		

		var pShip = HCoder.createPNode({"class":"mui-ellipsis"});
		pShip.innerHTML="发货速度:"+store.point.ship_evaluate;
		

		storeEvaluateDiv.appendChild(pDecs);
		storeEvaluateDiv.appendChild(pService);
		storeEvaluateDiv.appendChild(pShip);		
	
	}
	
	
	
	
	
	
	
	
	return {
		renderStoreName:renderStoreName,
		renderStoreBase:renderStoreBase,
		renderStoreEvaluate:renderStoreEvaluate
		
	};
	
	
}();











