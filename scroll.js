var Scroll = function(el, options){ this.init(el, options); };
Scroll.prototype = {
	constructor: Scroll,

	init: function(el, options){
		if( !this._setVars(el, options) ) return;
		this._prepareDom();
		this._hideScroll();
		// addCustomBar if this._nativeHidden
		this._setEvents();
	},

	_setVars: function(el, options){
		if( !el ) return false;
		this._scroll = el;

		this._nativeHidden = false;

		return true;
	},

	_prepareDom: function(){
		this._scrollWrapper = document.createElement('div');
		addClass( this._scrollWrapper, 'scroll__wrapper' );
		this._scroll.parentElement.insertBefore( this._scrollWrapper, this._scroll );
		this._scrollWrapper.appendChild( this._scroll );
	},

	_hideScroll: function(){
		this._scroll.style.marginLeft = 0;
		this._scroll.style.marginRight = 0;
		var wDiff = this._scroll.offsetWidth - this._scroll.scrollWidth;
		this._scroll.style.marginLeft = '';
		if( wDiff ){
			this._scroll.style.marginRight = -wDiff+'px';
			this._nativeHidden = true;
		}
	},

	_setEvents: function(){
		this._scroll.addEventListener( 'scroll', function(e){
			console.log( 'scroll' );
		} );
	},

	refresh: function(){
		
	}

};