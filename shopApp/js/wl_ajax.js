

var new_element=document.createElement("script");
new_element.setAttribute("type","text/javascript");
new_element.setAttribute("src","../js/ajax.js");// 在这里引入了a.js
document.body.appendChild(new_element);

(function(w){
	
	
	//加载当前用户的购物车数据
	w.ajax_post_shop_cart = function(options,Callback){
		if(Callback==null)
		{
			ajax_post_loading(options,"shopCart/list",cartItemSuccess);
		}
		else
		{
			ajax_post_loading(options,"shopCart/list",Callback);
		}	
	}	
	
	//加载当前用户的订单数据
	w.ajax_post_load_order_list = function(options,Callback){
		if(Callback==null)
		{
			ajax_post_loading(options,"order/query",orderLoadSuccess);
		}
		else
		{
			ajax_post_loading(options,"order/query",Callback);
		}	
	}		
	
})(window);
