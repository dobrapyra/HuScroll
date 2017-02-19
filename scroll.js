var Scroll = function(el, options){ this.init(el, options); };
Scroll.prototype = {
	constructor: Scroll,

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
		this._scroll.scroll = this;

		options = options || {};

		this._nativeHidden = {
			v: false,
			h: false
		};

		this._horizontal = options.horizontal || false;

		return true;
	},

	_prepareDom: function(){
		var wrapper, classes, className;

		wrapper = document.createElement('div');
		wrapper.setAttribute( 'class', 'scroll__wrapper' );
		className = !this._horizontal ? 'scroll--v' : 'scroll--h';
		classes = this._scroll.getAttribute( 'class' ).split(' ');
		classes.push('className');
		this._scroll.setAttribute( 'class', classes.join(' ') );
		this._scroll.parentElement.insertBefore( wrapper, this._scroll );
		wrapper.appendChild( this._scroll );
		this._scrollWrapper = wrapper;
	},

	_hideScroll: function(){

		if( !this._horizontal ){

			this._scroll.style.marginLeft = 0;
			this._scroll.style.marginRight = 0;
			var xDiff = this._scroll.offsetWidth - this._scroll.scrollWidth;
			this._scroll.style.marginLeft = '';
			if( xDiff ){
				this._scroll.style.marginRight = -xDiff+'px';
				this._nativeHidden.v = true;
			}

		}else{

			this._scroll.style.marginTop= 0;
			this._scroll.style.marginBottom = 0;
			var yDiff = this._scroll.offsetHeight - this._scroll.scrollHeight;
			this._scroll.style.marginTop = '';
			if( yDiff ){
				this._scroll.style.marginBottom = -yDiff+'px';
				this._nativeHidden.h = true;
			}

		}

	},

	_addBars: function(){
		var sBar, sBarVars;

		this._scrollBar = {
			v: null,
			h: null
		};

		if( this._nativeHidden.v ){
			sBar = document.createElement('div');
			sBar.setAttribute( 'class', 'scroll__bar scroll__bar--v' );
			sBar._scroll = {};
			sBarVars = sBar._scroll;
			sBarVars.moveStart = null;
			sBarVars.moveDiff = 0;
			sBarVars.scrollBefore = null;
			this._scrollWrapper.appendChild( sBar );
			this._scrollBar.v = sBar;
		}

		if( this._nativeHidden.h ){
			sBar = document.createElement('div');
			sBar.setAttribute( 'class', 'scroll__bar scroll__bar--h' );
			sBar._scroll = {};
			sBarVars = sBar._scroll;
			sBarVars.moveStart = null;
			sBarVars.moveDiff = 0;
			sBarVars.scrollBefore = null;
			this._scrollWrapper.appendChild( sBar );
			this._scrollBar.h = sBar;
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
				this._scroll.moveStart = e.clientY;
				this._scroll.scrollBefore = _this._scroll.scrollTop;
			} );

			this._scrollBar.v.addEventListener( 'mousemove', function(e){
				if( this._scroll.moveStart === null ) return;
				this._scroll.moveDiff = e.clientY - this._scroll.moveStart;
				_this._barMoveToScroll(false);
			} );

			this._scrollBar.v.addEventListener( 'mouseup', function(e){
				this._scroll.moveStart = null;
				this._scroll.moveDiff = 0;
				this._scroll.scrollBefore = null;
			} );

			this._scrollBar.v.addEventListener( 'mouseleave', function(e){
				this._scroll.moveStart = null;
				this._scroll.moveDiff = 0;
				this._scroll.scrollBefore = null;
			} );

		}

		if( this._scrollBar.h !== null ){

			this._scrollBar.h.addEventListener( 'mousedown', function(e){
				this._scroll.moveStart = e.clientX;
				this._scroll.scrollBefore = _this._scroll.scrollLeft;
			} );

			this._scrollBar.h.addEventListener( 'mousemove', function(e){
				if( this._scroll.moveStart === null ) return;
				this._scroll.moveDiff = e.clientY - this._scroll.moveStart;
				_this._barMoveToScroll(true);
			} );

			this._scrollBar.h.addEventListener( 'mouseup', function(e){
				this._scroll.moveStart = null;
				this._scroll.moveDiff = 0;
				this._scroll.scrollBefore = null;
			} );

			this._scrollBar.h.addEventListener( 'mouseleave', function(e){
				this._scroll.moveStart = null;
				this._scroll.moveDiff = 0;
				this._scroll.scrollBefore = null;
			} );

		}

	},

	_setBarsSize: function(){
		var size, sBar, sBarVars;

		if( this._scrollBar.v !== null ){
			sBar = this._scrollBar.v;
			sBarVars = sBar._scroll;
			size = this._scroll.offsetHeight / this._scroll.scrollHeight;
			// sBar.style.height = ( size * 100 ) + '%';
			sBar.style.height = ( size * this._scroll.offsetHeight ) + 'px';
			sBarVars.size = size;
			sBarVars.scrollRange = this._scroll.scrollHeight - this._scroll.offsetHeight;
			sBarVars.moveRange = this._scroll.offsetHeight - sBar.offsetHeight;
		}

		if( this._scrollBar.h !== null ){
			sBar = this._scrollBar.h;
			sBarVars = sBar._scroll;
			size = this._scroll.offsetWidth / this._scroll.scrollWidth;
			// sBar.style.width = ( size * 100 ) + '%';
			sBar.style.width = ( size * this._scroll.offsetHeight ) + 'px';
			sBarVars.size = size;
			sBarVars.scrollRange = this._scroll.scrollWidth - this._scroll.offsetWidth;
			sBarVars.moveRange = this._scroll.offsetWidth - sBar.offsetWidth;
		}

	},

	_setBarsPos: function(){
		var pos, sBar, sBarVars;

		if( this._scrollBar.v !== null ){
			sBar = this._scrollBar.v;
			sBarVars = sBar._scroll;
			pos = this._scroll.scrollTop / ( this._scroll.scrollHeight - this._scroll.offsetHeight );
			pos *= ( this._scroll.offsetHeight - ( this._scroll.offsetHeight * sBarVars.size ) );
			sBarVars.pos = pos;
			sBar.style.transform = 'translateY(' + pos + 'px)';
		}

		if( this._scrollBar.h !== null ){
			sBar = this._scrollBar.h;
			sBarVars = sBar._scroll;
			pos = this._scroll.scrollLeft / ( this._scroll.scrollWidth - this._scroll.offsetWidth );
			pos *= ( this._scroll.offsetWidth - ( this._scroll.offsetWidth * sBarVars.size ) );
			sBarVars.pos = pos;
			sBar.style.transform = 'translateX(' + pos + 'px)';
		}

	},

	_barMoveToScroll: function(horizontal){
		var newScroll, sBarVars;

		if( !horizontal ){
			sBarVars = this._scrollBar.v._scroll;
		}else{
			sBarVars = this._scrollBar.h._scroll;
		}

		newScroll = sBarVars.scrollBefore + ( sBarVars.scrollRange * sBarVars.moveDiff / sBarVars.moveRange );
		if( newScroll > sBarVars.scrollRange ) newScroll = sBarVars.scrollRange;
		if( newScroll < 0 ) newScroll = 0;

		if( !horizontal ){
			this._scroll.scrollTop = newScroll;
		}else{
			this._scroll.scrollLeft = newScroll;
		}

	},

	// refresh: function(){
	// 	this._hideScroll();
	// 	this.refreshBars();
	// },

	refreshBars: function(){
		this._setBarsSize();
		this._setBarsPos();
	}

};