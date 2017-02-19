/**
* HuScroll - (Hide ugly) Scroll
* author: dobrapyra (Michał Zieliński)
* version: 2017-02-19
*/
var HuScroll = function(el, options){ this.init(el, options); };
HuScroll.prototype = {
	constructor: HuScroll,

	init: function(el, options){
		if( !this._setVars(el, options) ) return;
		this._prepareDom();
		this._hideScroll();
		this._addBars();
		this._bindBarsEvents();
		this.refreshBars();
		this._setEvents();
	},

	_setVars: function(el, options){
		if( !el ) return false;
		this._scroll = el;
		this._scroll._hus = this;

		options = options || {};
		this._cssClass = options.cssClass || 'huscroll';

		this._nativeHidden = {
			v: false,
			h: false
		};

		this._horizontal = options.horizontal || false;

		return true;
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
		var sBar, sBarVars, cssClass = this._cssClass;

		this._scrollBar = {
			v: null,
			h: null
		};

		if( this._nativeHidden.v || this._nativeHidden.h ){

			if( this._nativeHidden.v ){
				sBar = document.createElement('div');
				sBar.setAttribute( 'class', cssClass + '__bar ' + cssClass + '__bar--v' );
				sBar._hus = {};
				sBarVars = sBar._hus;
				sBarVars.moveStart = null;
				sBarVars.moveDiff = 0;
				sBarVars.scrollBefore = null;
				this._scrollWrapper.appendChild( sBar );
				this._scrollBar.v = sBar;
			}

			if( this._nativeHidden.h ){
				sBar = document.createElement('div');
				sBar.setAttribute( 'class', cssClass + '__bar ' + cssClass + '__bar--h' );
				sBar._hus = {};
				sBarVars = sBar._hus;
				sBarVars.moveStart = null;
				sBarVars.moveDiff = 0;
				sBarVars.scrollBefore = null;
				this._scrollWrapper.appendChild( sBar );
				this._scrollBar.h = sBar;
			}
			
		}
	},

	_setEvents: function(){
		var _this = this;

		this._scroll.addEventListener( 'scroll', function(e){
			// console.log( 'scroll' );
			// _this.refreshBars();
			_this._setBarsPos();
		} );

		this._scroll.addEventListener( 'wheel', function(e){
			// console.log( 'wheel' );
		} );

	},

	_bindBarsEvents: function(){
		var _this = this;
		
		if( this._scrollBar.v !== null ){

			this._scrollBar.v.addEventListener( 'mousedown', function(e){
				_this._moveBegin( e, this._hus, false );
			} );

			this._scrollBar.v.addEventListener( 'mousemove', function(e){
				_this._moveUpdate( e, this._hus, false );
			} );

			this._scrollBar.v.addEventListener( 'mouseup', function(e){
				_this._moveEnd( e, this._hus );
			} );

			this._scrollBar.v.addEventListener( 'mouseleave', function(e){
				_this._moveEnd( e, this._hus );
			} );

		}

		if( this._scrollBar.h !== null ){

			this._scrollBar.h.addEventListener( 'mousedown', function(e){
				_this._moveBegin( e, this._hus, true );
			} );

			this._scrollBar.h.addEventListener( 'mousemove', function(e){
				_this._moveUpdate( e, this._hus, true );
			} );

			this._scrollBar.h.addEventListener( 'mouseup', function(e){
				_this._moveEnd( e, this._hus );
			} );

			this._scrollBar.h.addEventListener( 'mouseleave', function(e){
				_this._moveEnd( e, this._hus );
			} );

		}

	},

	_moveBegin: function(e, sBarVars, horizontal){
		if( !horizontal ){
			sBarVars.moveStart = e.clientY;
			sBarVars.scrollBefore = this._scroll.scrollTop;
		}else{
			sBarVars.moveStart = e.clientX;
			sBarVars.scrollBefore = this._scroll.scrollLeft;
		}
		this._scroll.style.pointerEvents = 'none';
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
		sBarVars.moveStart = null;
		sBarVars.moveDiff = 0;
		sBarVars.scrollBefore = null;
		this._scroll.style.pointerEvents = '';
	},

	_setBarsSize: function(){
		var size, sBar, sBarVars;

		if( this._scrollBar.v !== null ){
			sBar = this._scrollBar.v;
			sBarVars = sBar._hus;
			size = this._scroll.offsetHeight / this._scroll.scrollHeight;
			// sBar.style.height = ( size * 100 ) + '%';
			sBar.style.height = ( size * this._scroll.offsetHeight ) + 'px';
			sBarVars.size = size;
			sBarVars.scrollRange = this._scroll.scrollHeight - this._scroll.offsetHeight;
			sBarVars.moveRange = this._scroll.offsetHeight - sBar.offsetHeight;
		}

		if( this._scrollBar.h !== null ){
			sBar = this._scrollBar.h;
			sBarVars = sBar._hus;
			size = this._scroll.offsetWidth / this._scroll.scrollWidth;
			// sBar.style.width = ( size * 100 ) + '%';
			sBar.style.width = ( size * this._scroll.offsetWidth ) + 'px';
			sBarVars.size = size;
			sBarVars.scrollRange = this._scroll.scrollWidth - this._scroll.offsetWidth;
			sBarVars.moveRange = this._scroll.offsetWidth - sBar.offsetWidth;
		}

	},

	_setBarsPos: function(){
		var scroll = this._scroll, pos, sBar, sBarVars;

		if( this._scrollBar.v !== null ){
			sBar = this._scrollBar.v;
			sBarVars = sBar._hus;
			pos = scroll.scrollTop / sBarVars.scrollRange;
			pos *= scroll.offsetHeight * ( 1 - sBarVars.size );
			sBar.style.transform = 'translateY(' + pos + 'px)';
			sBarVars.pos = pos;
		}

		if( this._scrollBar.h !== null ){
			sBar = this._scrollBar.h;
			sBarVars = sBar._hus;
			pos = scroll.scrollLeft / sBarVars.scrollRange;
			pos *= scroll.offsetWidth * ( 1 - sBarVars.size );
			sBar.style.transform = 'translateX(' + pos + 'px)';
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