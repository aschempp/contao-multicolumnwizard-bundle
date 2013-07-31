/**
 * Contao Open Source CMS
 *
 * @copyright   Andreas Schempp 2011, certo web & design GmbH 2011, MEN AT WORK 2013
 * @package     MultiColumnWizard
 * @license     GNU/LGPL
 * @info        tab is set to 4 whitespaces
 */
var MultiColumnWizard=new Class({Implements:[Options],options:{table:null,maxCount:0,minCount:0,uniqueFields:[]},operationLoadCallbacks:[],operationClickCallbacks:[],operationUpdateCallbacks:[],initialize:function(options){this.setOptions(options);this.options.table=document.id(this.options.table);if(window.Backend){Backend.getScrollOffset()}var self=this;this.options.table.getElement("tbody").getChildren("tr").each(function(el,index){el.getChildren("td.operations a").each(function(operation){var key=operation.get("rel");if(MultiColumnWizard.operationLoadCallbacks[key]){MultiColumnWizard.operationLoadCallbacks[key].each(function(callback){callback.pass([operation,el],self)()})}if(self.operationLoadCallbacks[key]){self.operationLoadCallbacks[key].each(function(callback){callback.pass([operation,el],self)()})}})});this.updateOperations()},updateOperations:function(){var self=this;this.options.table.getElement("tbody").getChildren("tr").each(function(el,index){el.getChildren("td.operations a").each(function(operation){var key=operation.get("rel");operation.removeEvents("click");if(MultiColumnWizard.operationClickCallbacks[key]){MultiColumnWizard.operationClickCallbacks[key].each(function(callback){operation.addEvent("click",function(e){e.preventDefault();callback.pass([operation,el],self)()})})}if(self.operationClickCallbacks[key]){self.operationClickCallbacks[key].each(function(callback){operation.addEvent("click",function(e){e.preventDefault();callback.pass([operation,el],self)();self.updateFields(index)})})}operation.addEvent("click",function(e){e.preventDefault();self.updateOperations.pass([operation,el],self)()});if(MultiColumnWizard.operationUpdateCallbacks[key]){MultiColumnWizard.operationUpdateCallbacks[key].each(function(callback){callback.pass([operation,el],self)()})}if(self.operationUpdateCallbacks[key]){self.operationUpdateCallbacks[key].each(function(callback){callback.pass([operation,el],self)()})}})})},updateRowAttributes:function(level,row){var firstLevel=true;var intInnerMCW=0;var intSubLevels=0;row.getElements(".mcwUpdateFields *").each(function(el){if(el.hasClass("tl_modulewizard multicolumnwizard")){firstLevel=false;intInnerMCW++;el.addClass("mcw_inner_"+intInnerMCW)}if(intInnerMCW!==0&&!el.hasClass("tl_modulewizard multicolumnwizard")&&el.getParent(".mcw_inner_"+intInnerMCW)===null){intInnerMCW--;if(intInnerMCW===0){firstLevel=true}}if(el.hasClass("chzn-container")){el.destroy();return}if(typeOf(el.getProperty("name"))=="string"){var matches=el.getProperty("name").match(/([^[\]]+)/g);var lastIndex=null;var newName="";matches.each(function(element,index){if(!isNaN(parseFloat(element))&&isFinite(element)){lastIndex=index}});matches.each(function(element,index){if(index===0){newName+=element}else{if(index===lastIndex&&firstLevel){newName+="["+level+"]"}else{if(index===(lastIndex-2)&&!firstLevel){newName+="["+level+"]"}else{if(index===lastIndex&&!firstLevel){newName+="["+intSubLevels+++"]"}else{newName+="["+element+"]"}}}}});el.setProperty("name",newName)}if(typeOf(el.getProperty("id"))=="string"){var erg=el.getProperty("id").match(/^(.+)_row[0-9]+_(.+)$/i);if(erg){el.setProperty("id",erg[1]+"_row"+level+"_"+erg[2])}}if(typeOf(el.getProperty("onclick"))=="string"){var erg=el.getProperty("onclick").match(/^(.+)_row[0-9]+_(.+)$/i);if(erg){el.setProperty("onclick",erg[1]+"_row"+level+"_"+erg[2])}}if(typeOf(el.getProperty("for"))=="string"){var erg=el.getProperty("for").match(/^(.+)_row[0-9]+_(.+)$/i);if(erg){el.setProperty("for",erg[1]+"_row"+level+"_"+erg[2])}}switch(el.nodeName.toUpperCase()){case"SELECT":if(el.hasClass("tl_chosen")){new Chosen(el)}break;case"INPUT":if(el.getStyle("display").toLowerCase()=="none"){el.setStyle("display","inline")}if(typeOf(el.getProperty("id"))!="string"){el.destroy()}break;case"SCRIPT":var newScript="";var script=el.get("html").toString();var length=0;var start=script.search(/_row[0-9]+_/i);while(start>0){length=script.match(/(_row[0-9]+)+_/i)[0].length;newScript=newScript+script.substr(0,start)+"_row"+level+"_";script=script.substr(start+length);start=script.search(/_row[0-9]+_/i)}el.set("html",newScript+script);break}});return row},addOperationLoadCallback:function(key,func){if(!this.operationLoadCallbacks[key]){this.operationLoadCallbacks[key]=[]}this.operationLoadCallbacks[key].include(func)},addOperationUpdateCallback:function(key,func){if(!this.operationUpdateCallbacks[key]){this.operationUpdateCallbacks[key]=[]}this.operationLoadCallbacks[key].include(func)},addOperationClickCallback:function(key,func){if(!this.operationClickCallbacks[key]){this.operationClickCallbacks[key]=[]}this.operationClickCallbacks[key].include(func)},killAllTinyMCE:function(el,row){var parent=row.getParent(".multicolumnwizard");if(parent.getElements(".tinymce").length==0){return}var mcwName=parent.get("id");var myRegex=new RegExp(mcwName);var tinyMCEEditors=new Array();var counter=0;tinyMCE.editors.each(function(item,index){if(item.editorId.match(myRegex)!=null){tinyMCEEditors[counter]=item.editorId;counter++}});tinyMCEEditors.each(function(item,index){try{var editor=tinyMCE.get(item);$(editor.editorId).set("text",editor.getContent());editor.remove()}catch(e){console.log(e)}});parent.getElements("span.mceEditor").each(function(item,index){console.log(item.getSiblings("script"));item.dispose()});parent.getElements(".tinymce").each(function(item,index){item.getElements("script").each(function(item,index){item.dispose()})})},reinitTinyMCE:function(el,row,isParent){var parent=null;if(isParent!=true){parent=row.getParent(".multicolumnwizard")}else{parent=row}if(parent.getElements(".tinymce").length==0){return}var varTinys=parent.getElements(".tinymce textarea");varTinys.each(function(item,index){tinyMCE.execCommand("mceAddControl",false,item.get("id"));tinyMCE.get(item.get("id")).show();$(item.get("id")).erase("required");$(tinyMCE.get(item.get("id")).editorContainer).getElements("iframe")[0].set("title","MultiColumnWizard - TinyMCE")})},reinitStylect:function(){if(window.Stylect){$$(".styled_select").each(function(item,index){item.dispose()});Stylect.convertSelects()}}});Object.append(MultiColumnWizard,{operationLoadCallbacks:{},operationClickCallbacks:{},operationUpdateCallbacks:{},addOperationLoadCallback:function(key,func){if(!MultiColumnWizard.operationLoadCallbacks[key]){MultiColumnWizard.operationLoadCallbacks[key]=[]}MultiColumnWizard.operationLoadCallbacks[key].include(func)},addOperationUpdateCallback:function(key,func){if(!MultiColumnWizard.operationUpdateCallbacks[key]){MultiColumnWizard.operationUpdateCallbacks[key]=[]}MultiColumnWizard.operationUpdateCallbacks[key].include(func)},addOperationClickCallback:function(key,func){if(!MultiColumnWizard.operationClickCallbacks[key]){MultiColumnWizard.operationClickCallbacks[key]=[]}MultiColumnWizard.operationClickCallbacks[key].include(func)},copyUpdate:function(el,row){var rowCount=row.getSiblings().length+1;if(this.options.maxCount>0&&rowCount>=this.options.maxCount){el.setStyle("display","none")}else{el.setStyle("display","inline")}},copyClick:function(el,row){this.killAllTinyMCE(el,row);var rowCount=row.getSiblings().length+1;if(this.options.maxCount==0||(this.options.maxCount>0&&rowCount<this.options.maxCount)){var copy=row.clone(true,true);level=row.getAllPrevious().length;copy=this.updateRowAttributes(++level,copy);copy.inject(row,"after");if(copy.getElements("script").length>0){copy.getElements("script").each(function(script){Browser.exec(script.get("html"))})}var that=this;copy.getAllNext().each(function(row){that.updateRowAttributes(++level,row)})}this.reinitTinyMCE(el,row,false);this.reinitStylect()},deleteUpdate:function(el,row){var rowCount=row.getSiblings().length+1;if(this.options.minCount>0&&rowCount<=this.options.minCount){el.setStyle("display","none")}else{el.setStyle("display","inline")}},deleteClick:function(el,row){this.killAllTinyMCE(el,row);var parent=row.getParent(".multicolumnwizard");if(row.getSiblings().length>0){var rows=row.getAllNext();level=row.getAllPrevious().length;row.dispose();row.destroy.delay(10,row);var that=this;rows.each(function(row){that.updateRowAttributes(level++,row)})}else{row.getElements("input,select,textarea").each(function(el){MultiColumnWizard.clearElementValue(el)})}this.reinitTinyMCE(el,parent,true)},upClick:function(el,row){this.killAllTinyMCE(el,row);var previous=row.getPrevious();if(previous){var previousPosition=previous.getAllPrevious().length;previous=this.updateRowAttributes(99999,previous);row=this.updateRowAttributes(previousPosition,row);previous=this.updateRowAttributes(previousPosition+1,previous);row.inject(previous,"before")}this.reinitTinyMCE(el,row,false)},downClick:function(el,row){this.killAllTinyMCE(el,row);var next=row.getNext();if(next){var rowPosition=row.getAllPrevious().length;row=this.updateRowAttributes(99999,row);next=this.updateRowAttributes(rowPosition,next);row=this.updateRowAttributes(rowPosition+1,row);row.inject(next,"after")}this.reinitTinyMCE(el,row,false)},clearElementValue:function(el){if(el.get("type")=="checkbox"||el.get("type")=="radio"){el.checked=false}else{el.set("value","")}}});MultiColumnWizard.addOperationUpdateCallback("copy",MultiColumnWizard.copyUpdate);MultiColumnWizard.addOperationClickCallback("copy",MultiColumnWizard.copyClick);MultiColumnWizard.addOperationUpdateCallback("delete",MultiColumnWizard.deleteUpdate);MultiColumnWizard.addOperationClickCallback("delete",MultiColumnWizard.deleteClick);MultiColumnWizard.addOperationClickCallback("up",MultiColumnWizard.upClick);MultiColumnWizard.addOperationClickCallback("down",MultiColumnWizard.downClick);(function(Backend){if(!Backend){return}Backend.openModalSelectorOriginal=Backend.openModalSelector;Backend.openModalSelector=function(options){Backend.openModalSelectorOriginal(options);var frm=null;var tProtect=60;var id=new URI(options.url).getData("field")+"_parent";var timer=setInterval(function(){tProtect-=1;var frms=window.frames;for(var i=0;i<frms.length;i++){if(frms[i].name=="simple-modal-iframe"){frm=frms[i];break}}if(frm&&frm.document.getElementById(id)){frm.document.getElementById(id).set("id",options.id+"_parent");clearInterval(timer);return}if(tProtect<=0){clearInterval(timer)}},500)}})(window.Backend);window.fireEvent("mcwLoaded");