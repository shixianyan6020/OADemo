(function($) {

	
	
})(mui);

mui.init();

mui.plusReady(function(){
	
	
		addEventForTabitem();
	
		addEventForButton();
		
		addEventForTableView();
		
//	mui('.mui-table-view-cell mui-media').on('tap', 'a', function(e) {
//		var item = this;
//		var itemID = this.getAttribute('href');
//		mui.toast(itemID.id);
//	
//	});		
	
	
});


function addEventForTabitem() {
	mui('.mui-bar-tab').on('tap', '.mui-tab-item', function() {
		var tabitem = this;
		
		mui.alert('ddd');
		
		
	});
}

function addEventForButton() {
		
	mui('.mui-content').on('tap', '.mui-btn', function(e) {
		
		mui.toast(this.id);
	    mui(this).button('loading');
	    setTimeout(function() {
	        mui(this).button('reset');
	    }.bind(this), 2000);
	});	
	
}


function addEventForTableView() {
		
	mui('.mui-table-view-chevron').on('tap', '.mui-table-view-cell', function(e) {
		
		mui.toast(this.id);
//	    mui(this).button('loading');
//	    setTimeout(function() {
//	        mui(this).button('reset');
//	    }.bind(this), 2000);
	});	
	
}

