YUI.add("scrollview",function(C){var E=C.ClassNameManager.getClassName,M="scrollview",I=10,B=150,J={scrollbar:E(M,"scrollbar"),vertical:E(M,"vertical"),horizontal:E(M,"horizontal"),child:E(M,"child"),b:E(M,"b"),middle:E(M,"middle"),showing:E(M,"showing")},A="scrollStart",H="scrollChange",N="scrollEnd",L="flick",F="ui";function D(){D.superclass.constructor.apply(this,arguments);}C.ScrollViewBase=C.extend(D,C.Widget,{initializer:function(){this._createEvents();},_createEvents:function(){this.publish(A);this.publish(H);this.publish(N);this.publish(L);},_uiSizeCB:function(){},_transitionEnded:function(){this.fire(N);},bindUI:function(){this.get("boundingBox").on("gesturemovestart",C.bind(this._onGestureMoveStart,this));var O=this.get("contentBox");O._node.addEventListener("webkitTransitionEnd",C.bind(this._transitionEnded,this),false);O._node.addEventListener("DOMSubtreeModified",C.bind(this._uiDimensionsChange,this));O.on("flick",C.bind(this._flick,this),{minDistance:0});this.after("scrollYChange",this._afterScrollYChange);this.after("scrollXChange",this._afterScrollXChange);this.after("heightChange",this._afterHeightChange);this.after("widthChange",this._afterWidthChange);this.after("renderedChange",function(){C.later(0,this,"_uiDimensionsChange");});},syncUI:function(){this.scrollTo(this.get("scrollX"),this.get("scrollY"));},scrollTo:function(P,S,Q,R){var O=this.get("contentBox");if(P!==this.get("scrollX")){this.set("scrollX",P,{src:F});}if(S!==this.get("scrollY")){this.set("scrollY",S,{src:F});}if(Q){R=R||"cubic-bezier(0, 0.1, 0, 1.0)";O.setStyle("-webkit-transition",Q+"ms -webkit-transform");O.setStyle("-webkit-transition-timing-function",R);}else{O.setStyle("-webkit-transition",null);O.setStyle("-webkit-transition-timing-function",null);}O.setStyle("-webkit-transform","translate3d("+(P*-1)+"px,"+(S*-1)+"px,0)");},_onGestureMoveStart:function(O){this._killTimer();this._moveEvt=this.get("boundingBox").on("gesturemove",C.bind(this._onGestureMove,this));this._moveEndEvt=this.get("boundingBox").on("gesturemoveend",C.bind(this._onGestureMoveEnd,this));this._moveStartY=O.clientY+this.get("scrollY");this._moveStartX=O.clientX+this.get("scrollX");this._moveStartTime=(new Date()).getTime();this._moveStartClientY=O.clientY;this._moveStartClientX=O.clientX;this._isDragging=false;this._snapToEdge=false;},_onGestureMove:function(O){this._isDragging=true;this._moveEndClientY=O.clientY;this._moveEndClientX=O.clientX;this._lastMoved=(new Date()).getTime();if(this._scrollsVertical){this.set("scrollY",-(O.clientY-this._moveStartY));}if(this._scrollsHorizontal){this.set("scrollX",-(O.clientX-this._moveStartX));}},_onGestureMoveEnd:function(V){var T=this._minScrollY,O=this._maxScrollY,U=this._minScrollX,Q=this._maxScrollX,R=this._scrollsVertical?this._moveStartClientY:this._moveStartClientX,W=this._scrollsVertical?this._moveEndClientY:this._moveEndClientX,P=R-W,S=+(new Date())-this._moveStartTime;this._scrolledHalfway=false;this._snapToEdge=false;this._isDragging=false;if(this._scrollsHorizontal&&Math.abs(P)>(this.get("width")/2)){this._scrolledHalfway=true;this._scrolledForward=P>0;}if(this._scrollsVertical&&Math.abs(P)>(this.get("height")/2)){this._scrolledHalfway=true;this._scrolledForward=P>0;}if(this._scrollsVertical&&this.get("scrollY")<T){this._snapToEdge=true;this.set("scrollY",T);}if(this._scrollsHorizontal&&this.get("scrollX")<U){this._snapToEdge=true;this.set("scrollX",U);}if(this.get("scrollY")>O){this._snapToEdge=true;this.set("scrollY",O);}if(this.get("scrollX")>Q){this._snapToEdge=true;this.set("scrollX",Q);}if(this._snapToEdge){return;}if(+(new Date())-this._moveStartTime>100){this.fire(N,{staleScroll:true});return;}},_afterScrollYChange:function(O){if(O.src!==F){this._uiScrollY(O.newVal,O.duration,O.easing);}},_uiScrollY:function(P,O,Q){O=O||this._snapToEdge?400:0;Q=Q||this._snapToEdge?"ease-out":null;this.scrollTo(this.get("scrollX"),P,O,Q);},_afterScrollXChange:function(O){if(O.src!==F){this._uiScrollX(O.newVal,O.duration,O.easing);}},_uiScrollX:function(P,O,Q){O=O||this._snapToEdge?400:0;Q=Q||this._snapToEdge?"ease-out":null;this.scrollTo(P,this.get("scrollY"),O,Q);},_afterHeightChange:function(){this._uiDimensionsChange();},_afterWidthChange:function(){this._uiDimensionsChange();},_uiDimensionsChange:function(){var P=this.get("contentBox"),T=this.get("boundingBox"),O=this.get("height"),S=this.get("width"),R=P.get("scrollHeight"),Q=P.get("scrollWidth");if(O&&R>O){this._scrollsVertical=true;this._maxScrollY=R-O;this._minScrollY=0;T.setStyle("overflow-y","auto");}if(S&&Q>S){this._scrollsHorizontal=true;this._maxScrollX=Q-S;this._minScrollX=0;T.setStyle("overflow-x","auto");}},_flick:function(O){this._currentVelocity=O.flick.velocity*O.flick.direction;this._flicking=true;this._flickFrame();this.fire(L);},_flickFrame:function(){var R=this.get("scrollY"),P=this._maxScrollY,T=this._minScrollY,S=this.get("scrollX"),Q=this._maxScrollX,O=this._minScrollX;this._currentVelocity=(this._currentVelocity*this.get("deceleration"));if(this._scrollsVertical){R=this.get("scrollY")-(this._currentVelocity*I);}if(this._scrollsHorizontal){S=this.get("scrollX")-(this._currentVelocity*I);}if(Math.abs(this._currentVelocity).toFixed(4)<=0.015){this._flicking=false;this._killTimer(!(this._exceededYBoundary||this._exceededXBoundary));if(this._scrollsVertical){if(R<T){this._snapToEdge=true;this.set("scrollY",T);}else{if(R>P){this._snapToEdge=true;this.set("scrollY",P);}}}if(this._scrollsHorizontal){if(S<O){this._snapToEdge=true;this.set("scrollX",O);}else{if(S>Q){this._snapToEdge=true;this.set("scrollX",Q);}}}return;}if(this._scrollsVertical&&(R<T||R>P)){this._exceededYBoundary=true;this._currentVelocity*=this.get("bounce");}if(this._scrollsHorizontal&&(S<O||S>Q)){this._exceededXBoundary=true;this._currentVelocity*=this.get("bounce");}if(this._scrollsVertical){this.set("scrollY",R);}if(this._scrollsHorizontal){this.set("scrollX",S);}this._flickTimer=C.later(I,this,"_flickFrame");},_killTimer:function(O){if(this._flickTimer){this._flickTimer.cancel();
}if(O){this.fire(N);}},_setScrollX:function(R){var P=this.get("bounce"),Q=P?-B:0,O=P?this._maxScrollX+B:this._maxScrollX;if(!P||!this._isDragging){if(R<Q){R=Q;}else{if(R>O){R=O;}}}return R;},_setScrollY:function(R){var P=this.get("bounce"),Q=P?-B:0,O=P?this._maxScrollY+B:this._maxScrollY;if(!P||!this._isDragging){if(R<Q){R=Q;}else{if(R>O){R=O;}}}return R;}},{NAME:"scrollview",ATTRS:{scrollY:{value:0,setter:"_setScrollY"},scrollX:{value:0,setter:"_setScrollX"},deceleration:{value:0.98},bounce:{value:0.7}},CLASS_NAMES:J,UI_SRC:F});C.ScrollView=C.ScrollViewBase;var G=C.ScrollView.CLASS_NAMES;function K(){K.superclass.constructor.apply(this,arguments);}K.NAME="scrollbars-plugin";K.NS="scrollbars";K.SCROLLBAR_TEMPLATE=["<div>",'<b class="'+G.child+" "+G.b+'"></b>','<span class="'+G.child+" "+G.middle+'"></span>','<b class="'+G.child+" "+G.b+'"></b>',"</div>"].join("");K.ATTRS={verticalNode:{setter:"_setVerticalNode",value:C.Node.create(K.SCROLLBAR_TEMPLATE)},horizontalNode:{setter:"_setHorizontalNode",value:C.Node.create(K.SCROLLBAR_TEMPLATE)}};C.ScrollbarsPlugin=C.extend(K,C.Plugin.Base,{initializer:function(){this.afterHostMethod("_uiScrollY",this._update);this.afterHostMethod("_uiScrollX",this._update);this.afterHostMethod("_uiDimensionsChange",this._hostDimensionsChange);this.doAfter("scrollEnd",this.flash);},_hostDimensionsChange:function(){var S=this.get("host"),Q=this.get("host").get("boundingBox"),P=this.get("verticalNode"),T=this.get("horizontalNode"),R=P.inDoc(),O=T.inDoc();if(S._scrollsVertical&&!R){Q.append(P);}else{if(!S._scrollsVertical&&R){P.remove();}}if(S._scrollsHorizontal&&!O){Q.append(T);}else{if(!S._scrollsHorizontal&&O){T.remove();}}this._update();C.later(500,this,"flash",true);},_update:function(X,V,Y){var U=this.get("host").get("contentBox"),O=0,R=1,T,b=this.get("host").get("height"),P=this.get("host").get("width"),c=U.get("scrollHeight"),W=U.get("scrollWidth"),Z=this.get("verticalNode"),a=this.get("horizontalNode"),S=this.get("host").get("scrollX")*-1,Q=this.get("host").get("scrollY")*-1;if(!this._showingScrollBars){this.show();}if(a&&c<=b){this.hide();return;}if(Z){O=Math.floor(b*(b/c));R=Math.floor((Q/(c-b))*(b-O))*-1;if(O>b){O=1;}T="translate3d(0, "+R+"px, 0)";if(R>(b-O)){O=O-(R-(b-O));}if(R<0){T="translate3d(0,0,0)";O=O+R;}V=V||0;if(this.verticalScrollSize!=(O-8)){this.verticalScrollSize=(O-8);Z.get("children").item(1).setStyles({"-webkit-transition-property":(V>0?"-webkit-transform":null),"-webkit-transform":"translate3d(0,0,0) scaleY("+(O-8)+")","-webkit-transition-duration":(V>0?V+"ms":null)});}Z.setStyles({"-webkit-transition-property":(V>0?"-webkit-transform":null),"-webkit-transform":T,"-webkit-transition-duration":(V>0?V+"ms":null)});Z.get("children").item(2).setStyles({"-webkit-transition-property":(V>0?"-webkit-transform":null),"-webkit-transform":"translate3d(0,"+(O-10)+"px,0)","-webkit-transition-duration":(V>0?V+"ms":null)});}if(a){O=Math.floor(P*(P/W));R=Math.floor((S/(W-P))*(P-O))*-1;if(O>P){O=1;}T="translate3d("+R+"px, 0, 0)";if(R>(P-O)){O=O-(R-(P-O));}if(R<0){T="translate3d(0,0,0)";O=O+R;}V=V||0;if(this.horizontalScrollSize!=(O-16)){this.horizontalScrollSize=(O-16);a.get("children").item(1).setStyles({"-webkit-transition-property":(V>0?"-webkit-transform":null),"-webkit-transform":"translate3d(0,0,0) scaleX("+this.horizontalScrollSize+")","-webkit-transition-duration":(V>0?V+"ms":null)});}a.setStyles({"-webkit-transition-property":(V>0?"-webkit-transform":null),"-webkit-transform":T,"-webkit-transition-duration":V+"ms"});a.get("children").item(2).setStyles({"-webkit-transition-property":(V>0?"-webkit-transform":null),"-webkit-transform":"translate3d("+(O-12)+"px,0,0)","-webkit-transition-duration":(V>0?V+"ms":null)});}},show:function(P){var O=this.get("verticalNode"),Q=this.get("horizontalNode");this._showingScrollBars=true;if(this._flashTimer){this._flashTimer.cancel();}if(P){if(O){O.setStyle("-webkit-transition","opacity .6s");}if(Q){Q.setStyle("-webkit-transition","opacity .6s");}}if(O){O.addClass(G.showing);}if(Q){Q.addClass(G.showing);}},hide:function(P){var O=this.get("verticalNode"),Q=this.get("horizontalNode");this._showingScrollBars=false;if(this._flashTimer){this._flashTimer.cancel();}if(P){if(O){O.setStyle("-webkit-transition","opacity .6s");}if(Q){Q.setStyle("-webkit-transition","opacity .6s");}}if(O){O.removeClass(G.showing);}if(Q){Q.removeClass(G.showing);}},flash:function(){var O=false;if(this.get("host")._scrollsVertical&&this.get("host").get("contentBox").get("scrollHeight")>this.get("host").get("height")){O=true;}if(this.get("host")._scrollsHorizontal&&this.get("host").get("contentBox").get("scrollWidth")>this.get("host").get("width")){O=true;}if(O){this.show(true);this._flashTimer=C.later(800,this,"hide",true);}},_setVerticalNode:function(O){O=C.one(O);if(O){O.addClass(G.scrollbar);O.addClass(G.vertical);}return O;},_setHorizontalNode:function(O){O=C.one(O);if(O){O.addClass(G.scrollbar);O.addClass(G.horizontal);}return O;}});C.Base.plug(C.ScrollView,C.ScrollbarsPlugin);},"@VERSION@",{requires:["scrollview-base","plugin","widget","event-touch"]});