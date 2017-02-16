var Scroll = function(el, options){ this.init(el, options); };
Scroll.prototype = {
	constructor: Scroll,

	init: function(el, options){
		if( !this._setVars(el, options) ) return;
		this._prepareDom();
		this._hideScroll();
		this._addBars();
		this.refresh();
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
		this._scrollWrapper = document.createElement('div');
		this._scrollWrapper.setAttribute( 'class', 'scroll__wrapper' );
		var classes, className;
		className = !this._horizontal ? 'scroll--v' : 'scroll--h';
		classes = this._scroll.getAttribute( 'class' ).split(' ');
		classes.push('className');
		this._scroll.setAttribute( 'class', classes.join(' ') );
		this._scroll.parentElement.insertBefore( this._scrollWrapper, this._scroll );
		this._scrollWrapper.appendChild( this._scroll );
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
		this._scrollBar = {
			v: null,
			h: null
		};

		if( this._nativeHidden.v ){
			this._scrollBar.v = document.createElement('div');
			this._scrollBar.v.setAttribute( 'class', 'scroll__bar scroll__bar--v' );
			this._scrollWrapper.appendChild( this._scrollBar.v );
		}

		if( this._nativeHidden.h ){
			this._scrollBar.h = document.createElement('div');
			this._scrollBar.h.setAttribute( 'class', 'scroll__bar scroll__bar--h' );
			this._scrollWrapper.appendChild( this._scrollBar.h );
		}
	},

	_setEvents: function(){
		var _this = this;

		this._scroll.addEventListener( 'scroll', function(e){
			// console.log( 'scroll' );
			_this.refreshBars();
		} );

		this._scroll.addEventListener( 'wheel', function(e){
			// console.log( 'wheel' );
		} );

	},

	_setBarsSize: function(){
		var size;

		if( this._scrollBar.v !== null ){
			size = this._scroll.offsetHeight / this._scroll.scrollHeight;
			this._scrollBar.v.scrollBarSize = size;
			this._scrollBar.v.style.height = ( size * 100 ) + '%';
		}

		if( this._scrollBar.h !== null ){
			size = this._scroll.offsetWidth / this._scroll.scrollWidth;
			this._scrollBar.h.scrollBarSize = size;
			this._scrollBar.h.style.width = ( size * 100 ) + '%';
		}

	},

	_setBarsPos: function(){
		var pos;

		if( this._scrollBar.v !== null ){
			pos = this._scroll.scrollTop / ( this._scroll.scrollHeight - this._scroll.offsetHeight );
			pos *= ( this._scroll.offsetHeight - ( this._scroll.offsetHeight * this._scrollBar.v.scrollBarSize ) );
			this._scrollBar.v.scrollBarPos = pos;
			this._scrollBar.v.style.transform = 'translateY(' + pos + 'px)';
		}

		if( this._scrollBar.h !== null ){
			pos = this._scroll.scrollLeft / ( this._scroll.scrollWidth - this._scroll.offsetWidth );
			pos *= ( this._scroll.offsetWidth - ( this._scroll.offsetWidth * this._scrollBar.h.scrollBarSize ) );
			this._scrollBar.h.scrollBarPos = pos;
			this._scrollBar.h.style.transform = 'translateX(' + pos + 'px)';
		}

	},

	refresh: function(){
		this._hideScroll();
		this.refreshBars();
	},

	refreshBars: function(){
		this._setBarsSize();
		this._setBarsPos();
	}

};