mui.init({swipeBack: true});


var curStore=null;
mui.plusReady(function(){
	
	curWebView=plus.webview.currentWebview();
	
	curStore = curWebView.store;
	
//	console.log("about:"+JSON.stringify(curStore));
	
	store_common.renderStoreName('store_name',curStore);
	store_common.renderStoreBase('store_base_div',curStore);
	store_common.renderStoreEvaluate('store_evaluate_div',curStore);



});
	
	
	



