/* globals document */
/**
* HuScroll - (Hide ugly) Scroll
* author: dobrapyra (Michał Zieliński)
* version: 2017-02-19 update1
*/
var HuScroll = function(el, options){ this.init(el, options); };
HuScroll.prototype = {
	constructor: HuScroll,

	init: function(el, options){
		var _this = this;
		if( !_this._setVars(el, options) ) return;
		_this._prepareDom();
		_this._hideScroll();
		_this._addBars();
		_this._bindBarsEvents();
		_this.refreshBars();
		_this._setEvents();
	},

	_setVars: function(el, options){
		if( !el ) return false;
		var _this = this;

		_this._scroll = el;
		_this._scroll._hus = _this;

		options = options || {};
		_this._cssClass = options.cssClass || 'huscroll';

		_this._nativeHidden = {
			v: false,
			h: false
		};

		_this._horizontal = options.horizontal || false;

		_this._checkSupport();

		return true;
	},

	_checkSupport: function(){
		var testEl = document.createElement('div'), style;
		testEl.style.transform = 'translate(1px, 1px)';
		style = testEl.getAttribute('style');
		this._xySupport = !!( style && style.indexOf('translate') >= 0 );
	},

	_prepareDom: function(){
		var scroll = this._scroll, wrapper, sClass, cssClass = this._cssClass;

		wrapper = document.createElement('div');
		wrapper.setAttribute( 'class', cssClass + '__wrapper' );
		sClass = cssClass + ( !this._horizontal ? '--v' : '--h' );
		this._addClass( scroll, [ cssClass, sClass ] );
		scroll.parentElement.insertBefore( wrapper, scroll );
		wrapper.appendChild( scroll );
		this._scrollWrapper = wrapper;
	},

	_addClass: function(el, cssClass){
		var i, classes = el.getAttribute( 'class' ).split(' ');
		if( typeof cssClass !== 'object' ){
			this._insertUnique( classes, cssClass );
		}else{
			for( i = 0; i < cssClass.length; i++ ){
				this._insertUnique( classes, cssClass[i] );
			}
		}
		el.setAttribute( 'class', classes.join(' ') );
	},

	_insertUnique: function(arr, item){
		if( arr.indexOf(item) < 0 ) arr.push( item );
	},

	_hideScroll: function(){
		var scroll = this._scroll;

		if( !this._horizontal ){

			scroll.style.marginLeft = 0;
			scroll.style.marginRight = 0;
			var wDiff = scroll.offsetWidth - scroll.scrollWidth;
			scroll.style.marginLeft = '';
			if( wDiff ){
				scroll.style.maxWidth = 'none';
				scroll.style.marginRight = -wDiff+'px';
				this._nativeHidden.v = true;
			}

		}else{

			scroll.style.marginTop= 0;
			scroll.style.marginBottom = 0;
			var hDiff = scroll.offsetHeight - scroll.scrollHeight;
			scroll.style.marginTop = '';
			if( hDiff ){
				scroll.style.maxHeight = 'none';
				scroll.style.marginBottom = -hDiff+'px';
				this._nativeHidden.h = true;
			}

		}

	},

	_addBars: function(){
		var _this = this, sBar, sBarVars, cssClass = _this._cssClass, nativeHidden = _this._nativeHidden;

		_this._scrollBar = {
			v: null,
			h: null
		};

		if( nativeHidden.v || nativeHidden.h ){

			if( nativeHidden.v ){
				sBar = document.createElement('div');
				sBar.setAttribute( 'class', cssClass + '__bar ' + cssClass + '__bar--v' );
				sBar._hus = {};
				sBarVars = sBar._hus;
				sBarVars.moveStart = null;
				sBarVars.moveDiff = 0;
				sBarVars.scrollBefore = null;
				_this._scrollWrapper.appendChild( sBar );
				_this._scrollBar.v = sBar;
			}

			if( nativeHidden.h ){
				sBar = document.createElement('div');
				sBar.setAttribute( 'class', cssClass + '__bar ' + cssClass + '__bar--h' );
				sBar._hus = {};
				sBarVars = sBar._hus;
				sBarVars.moveStart = null;
				sBarVars.moveDiff = 0;
				sBarVars.scrollBefore = null;
				_this._scrollWrapper.appendChild( sBar );
				_this._scrollBar.h = sBar;
			}
			
		}
	},

	_setEvents: function(){
		var _this = this, scroll = _this._scroll;

		scroll.addEventListener( 'scroll', function(e){
			// console.log( 'scroll' );
			// _this.refreshBars();
			_this._setBarsPos();
		} );

		scroll.addEventListener( 'wheel', function(e){
			// console.log( 'wheel' );
		} );

	},

	_bindBarsEvents: function(){ 
		var _this = this, scrollBar = _this._scrollBar, sBar, sBarVars, sBarEvents;
		
		if( scrollBar.v !== null ){
			sBar = scrollBar.v;
			sBarVars = sBar._hus;
			sBarVars.events = {};
			sBarEvents = sBarVars.events;

			sBar.addEventListener( 'mousedown', function elh(e){
				sBarEvents.mousedown = elh;
				_this._moveBegin( e, sBarVars, false );

				document.addEventListener( 'mousemove', function elh(e){
					sBarEvents.mousemove = elh;
					_this._moveUpdate( e, sBarVars, false );
				} );

				document.addEventListener( 'mouseup', function elh(e){
					sBarEvents.mouseup = elh;
					_this._moveEnd( e, sBarVars );
				} );

				document.addEventListener( 'mouseleave', function elh(e){
					sBarEvents.mouseleave = elh;
					_this._moveEnd( e, sBarVars );
				} );

			} );

		}

		if( scrollBar.h !== null ){
			sBar = scrollBar.h;
			sBarVars = sBar._hus;
			sBarVars.events = {};
			sBarEvents = sBarVars.events;

			sBar.addEventListener( 'mousedown', function elh(e){
				sBarEvents.mousedown = elh;
				_this._moveBegin( e, sBarVars, true );

				document.addEventListener( 'mousemove', function elh(e){
					sBarEvents.mousemove = elh;
					_this._moveUpdate( e, sBarVars, true );
				} );

				document.addEventListener( 'mouseup', function elh(e){
					sBarEvents.mouseup = elh;
					_this._moveEnd( e, sBarVars );
				} );

				document.addEventListener( 'mouseleave', function elh(e){
					sBarEvents.mouseleave = elh;
					_this._moveEnd( e, sBarVars );
				} );

			} );

		}

	},

	_unbindSomeBarsEvents: function( sBarVars ){
		var sBarEvents = sBarVars.events;

		if( sBarEvents.mousemove )	document.removeEventListener( 'mousemove', sBarEvents.mousemove );
		if( sBarEvents.mouseup )	document.removeEventListener( 'mouseup', sBarEvents.mouseup );
		if( sBarEvents.mouseleave ) document.removeEventListener( 'mouseleave', sBarEvents.mouseleave );
	},

	_moveBegin: function(e, sBarVars, horizontal){
		var scroll = this._scroll;
		if( !horizontal ){
			sBarVars.moveStart = e.clientY;
			sBarVars.scrollBefore = scroll.scrollTop;
		}else{
			sBarVars.moveStart = e.clientX;
			sBarVars.scrollBefore = scroll.scrollLeft;
		}
		scroll.style.userSelect = 'none';
		scroll.style.pointerEvents = 'none';
	},

	_moveUpdate: function(e, sBarVars, horizontal){
		if( sBarVars.moveStart === null ) return;
		if( !horizontal ){
			sBarVars.moveDiff = e.clientY - sBarVars.moveStart;
		}else{
			sBarVars.moveDiff = e.clientX - sBarVars.moveStart;
		}
		this._barMoveToScroll( horizontal );
	},

	_moveEnd: function(e, sBarVars){
		var scroll = this._scroll;
		this._unbindSomeBarsEvents( sBarVars );
		sBarVars.moveStart = null;
		sBarVars.moveDiff = 0;
		sBarVars.scrollBefore = null;
		scroll.style.userSelect = '';
		scroll.style.pointerEvents = '';
	},

	_setBarsSize: function(){
		var _this = this, scroll = _this._scroll, scrollBar = _this._scrollBar, size, sBar, sBarVars;

		if( scrollBar.v !== null ){
			sBar = scrollBar.v;
			sBarVars = sBar._hus;
			size = scroll.offsetHeight / scroll.scrollHeight;
			// sBar.style.height = ( size * 100 ) + '%';
			sBar.style.height = ( size * scroll.offsetHeight ) + 'px';
			sBarVars.size = size;
			sBarVars.scrollRange = scroll.scrollHeight - scroll.offsetHeight;
			sBarVars.moveRange = scroll.offsetHeight - sBar.offsetHeight;
		}

		if( scrollBar.h !== null ){
			sBar = scrollBar.h;
			sBarVars = sBar._hus;
			size = scroll.offsetWidth / scroll.scrollWidth;
			// sBar.style.width = ( size * 100 ) + '%';
			sBar.style.width = ( size * scroll.offsetWidth ) + 'px';
			sBarVars.size = size;
			sBarVars.scrollRange = scroll.scrollWidth - scroll.offsetWidth;
			sBarVars.moveRange = scroll.offsetWidth - sBar.offsetWidth;
		}

	},

	_setBarsPos: function(){
		var _this = this, scroll = _this._scroll, scrollBar = _this._scrollBar, pos, sBar, sBarVars, xys = _this._xySupport;

		if( scrollBar.v !== null ){
			sBar = scrollBar.v;
			sBarVars = sBar._hus;
			pos = scroll.scrollTop / sBarVars.scrollRange;
			pos *= scroll.offsetHeight * ( 1 - sBarVars.size );
			if( xys ){
				sBar.style.transform = 'translateY(' + pos + 'px)';
			}else{
				sBar.style.top = pos + 'px';
			}
			sBarVars.pos = pos;
		}

		if( scrollBar.h !== null ){
			sBar = scrollBar.h;
			sBarVars = sBar._hus;
			pos = scroll.scrollLeft / sBarVars.scrollRange;
			pos *= scroll.offsetWidth * ( 1 - sBarVars.size );
			if( xys ){
				sBar.style.transform = 'translateX(' + pos + 'px)';
			}else{
				sBar.style.left = pos + 'px';
			}
			sBarVars.pos = pos;
		}

	},

	_barMoveToScroll: function(horizontal){
		var newScroll, sBarVars;

		if( !horizontal ){
			sBarVars = this._scrollBar.v._hus;
		}else{
			sBarVars = this._scrollBar.h._hus;
		}

		newScroll = sBarVars.scrollBefore + ( sBarVars.scrollRange * sBarVars.moveDiff / sBarVars.moveRange );
		// .scrollTop or .scrollLeft do the same
		// if( newScroll > sBarVars.scrollRange ) newScroll = sBarVars.scrollRange;
		// if( newScroll < 0 ) newScroll = 0;

		if( !horizontal ){
			this._scroll.scrollTop = newScroll;
		}else{
			this._scroll.scrollLeft = newScroll;
		}

	},

	refreshBars: function(){
		this._setBarsSize();
		this._setBarsPos();
	}

};