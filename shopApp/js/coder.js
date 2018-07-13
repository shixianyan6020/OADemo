
var HCoder={
	
	create_html_p : function(p) {
		var html = '';
		if(p == undefined) {
			return html;
		}

		if(p.id != undefined) {
			html += '<p id="' + p.id + '">';
		} else {
			html += '<p>';
		}

		html += p.content;

		html += '</p>';

		return html;
	},
	
	//创建一个btn
	create_html_btn2 : function(attrs) {
		var html = '<button type="button" class="mui-btn"';
		if(attrs == undefined) {
			return html;
		}

		if(attrs.id != undefined) {
			html += ' id="' + p.id + '"';
		} 
		
		if(attrs.class != undefined) {
			html += ' class="' + attrs.class + '"';
		} 		
		
		html += '>';

		html += attrs.innerHTML;

		html += '</button>';

		return html;
	},
	
		//创建一个btn
	create_html_btn : function(attrs) {
		
		attrs["type"]="button";
		attrs["isAddType"]=true;
		attrs["class"]="mui-btn mui-btn-danger";

		return HCoder.create_html_base(attrs);
	},

	/**
	 *创建一个图片
	 * @param {Object} attrs
	 */
	create_img : function(attrs) {
		
		attrs["type"]="img";
		return HCoder.create_html_base(attrs);
	},

	/**
	 *创建一个段落 
	 * @param {Object} attrs
	 */
	create_p : function(attrs) {
		
		attrs["type"]="p";
		return HCoder.create_html_base(attrs);
	},	
	/**
	 *创建一个div 
	 * @param {Object} attrs
	 */
	create_div : function(attrs) {
		
		attrs["type"]="div";
		return HCoder.create_html_base(attrs);
	},	
	//创建一个基本html元素
	create_html_base: function(attrs) {
		
		var html = ' ';
		if(attrs == undefined) {
			return html;
		}
		
		if(attrs.type==undefined)
		{
			return html;
		}
		html += '<'+attrs.type;
		
		if(attrs.isAddType)
		{
			html += ' type="'+attrs.type+'" ';
		}

		if(attrs.id != undefined) {
			html += ' id="' + attrs.id + '"';
		} 
		
		if(attrs.class != undefined) {
			html += ' class="' + attrs.class + '"';
		} 	
		
		if(attrs.style != undefined) {
			html += ' style="' + attrs.style + '"';
		}
		
		if(attrs.href != undefined) {
			html += ' href="' + attrs.href + '"';
		}		
		
		if(attrs.value != undefined) {
			html += ' value="' + attrs.value + '"';
		}	
		
		if(attrs.checked != undefined) {
			html += ' checked="' + attrs.checked + '"';
		}	
		if(attrs.src != undefined) {
			html += ' src="' + attrs.src + '"';
		}		
		
		html += '>';

		if(attrs.innerHTML !=undefined)
		{
			html += attrs.innerHTML;
		}
	
		html += '</'+attrs.type+'>';

		return html;
	},	
	
	createHtmlNode:function(attrs){
		
		if(attrs == undefined) {
			return html;
		}
		
		if(attrs.type==undefined)
		{
			return html;
		}
		var html = document.createElement(attrs.type);
		
		if(attrs.isAddType)
		{
			html.type=attrs.type;
		}

		if(attrs.id != undefined) {
			html.id= attrs.id;
		} 
		
		if(attrs.class != undefined) {
			html.className = attrs.class ;
		} 	
		
		if(attrs.style != undefined) {
			html.style=attrs.style;
		}
		
		if(attrs.href != undefined) {
			html.href = attrs.href;
		}		
		
		if(attrs.value != undefined) {
			html.value=attrs.value;
		}	
		
		if(attrs.checked != undefined) {
			html.checked=attrs.checked;
		}	
		if(attrs.src != undefined) {
			html.src =attrs.src;
		}		
		
		if(attrs.innerHTML !=undefined)
		{
			html.innerHTML = attrs.innerHTML;
		}
		
		if(attrs.name !=undefined)
		{
			html.name = attrs.name;
		}		

		return html;
		
	},
	createDivNode:function(atrrs){
		
		atrrs["type"]="div";
		return HCoder.createHtmlNode(atrrs);
	},
	createImgNode:function(atrrs){
		
		atrrs["type"]="img";
		return HCoder.createHtmlNode(atrrs);
	},	
	createLiNode:function(atrrs){
		
		atrrs["type"]="li";
		return HCoder.createHtmlNode(atrrs);
	},
	createUlNode:function(atrrs){
		
		atrrs["type"]="ul";
		return HCoder.createHtmlNode(atrrs);
	},
	createANode:function(atrrs){
		
		atrrs["type"]="a";
		return HCoder.createHtmlNode(atrrs);
	},
	createPNode:function(atrrs){
		
		atrrs["type"]="p";
		return HCoder.createHtmlNode(atrrs);
	},
	createH5Node:function(atrrs){
		
		atrrs["type"]="h5";
		return HCoder.createHtmlNode(atrrs);
	},
	createH4Node:function(atrrs){
		
		atrrs["type"]="h4";
		return HCoder.createHtmlNode(atrrs);
	},	
	createLabelNode:function(atrrs){
		
		atrrs["type"]="label";
		return HCoder.createHtmlNode(atrrs);
	},	
	createBtnNode:function(atrrs){
		
		atrrs["type"]="button";
		return HCoder.createHtmlNode(atrrs);
	},	
	createSpanNode:function(atrrs){
		
		atrrs["type"]="span";
		return HCoder.createHtmlNode(atrrs);
	},	
	createInputNode:function(attrs){
		
		var html = document.createElement("input");
		
		if(attrs.value != undefined) {
			html.value=attrs.value;
		}	
		
		if(attrs.id != undefined) {
			html.id= attrs.id;
		} 
		
		if(attrs.name != undefined) {
			html.name= attrs.name;
		}		
		
		if(attrs.class != undefined) {
			html.className = attrs.class ;
		} 	
		
		if(attrs.style != undefined) {
			html.style=attrs.style;
		}		
		
		if(attrs.type != undefined) {
			html.type=attrs.type;
		}		
		
		if(attrs.value != undefined) {
			html.value=attrs.value;
		}
		
		return html;
	}	
};




