/*
*
* mads - version 2.00.01  
* Copyright (c) 2015, Ninjoe
* Dual licensed under the MIT or GPL Version 2 licenses.
* https://en.wikipedia.org/wiki/MIT_License
* https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
*
*/
var mads = function () {
    /* Get Tracker */
    if (typeof custTracker == 'undefined' && typeof rma != 'undefined') {
        this.custTracker = rma.customize.custTracker;
    } else if (typeof custTracker != 'undefined') {
        this.custTracker = custTracker;
    } else {
        this.custTracker = [];
    }
    
    /* Unique ID on each initialise */
    this.id = this.uniqId();
    
    /* Tracked tracker */
    this.tracked = [];
    
    /* Body Tag */
    this.bodyTag = document.getElementsByTagName('body')[0];
    
    /* Head Tag */
    this.headTag = document.getElementsByTagName('head')[0];
    
    /* RMA Widget - Content Area */
    this.contentTag = document.getElementById('rma-widget');
    
    /* URL Path */
    this.path = typeof rma != 'undefined' ? rma.customize.src : '';
};

/* Generate unique ID */
mads.prototype.uniqId = function () {
    
    return new Date().getTime();
}

/* Link Opner */
mads.prototype.linkOpener = function (url) {

	if(typeof url != "undefined" && url !=""){
		if (typeof mraid !== 'undefined') {
			mraid.open(url);
		}else{
			window.open(url);
		}
	}
}

/* tracker */
mads.prototype.tracker = function (tt, type, name, value) {
    
    /* 
    * name is used to make sure that particular tracker is tracked for only once 
    * there might have the same type in different location, so it will need the name to differentiate them
    */
    name = name || type; 
    
    if ( typeof this.custTracker != 'undefined' && this.custTracker != '' && this.tracked.indexOf(name) == -1 ) {
       	if( type == 'Indovideo' || type == 'Indolp'){

       		for (var i = 0; i < this.custTracker.length; i++) {
		     		var img = document.createElement('img');
		     		var src = this.custTracker[2];
		     		img.src = src + '&' + this.id;
		     		img.style.display = 'none';
		     		this.bodyTag.appendChild(img);
		     		this.tracked.push(name);
		     	}
	     	}
	     	// else{
	     		for (var i = 0; i < this.custTracker.length; i++) {
	     			if(this.custTracker[i] != '__MW_CLICK_URL__'){
	     				var img = document.createElement('img');
		     			/* Insert Macro */
		     			var src = this.custTracker[i].replace('{{type}}', type);
		     			src = src.replace('{{tt}}', tt);
		     			/* */
		     			img.src = src + '&' + this.id;

		     			img.style.display = 'none';
		     			this.bodyTag.appendChild(img);

		     			this.tracked.push(name);
	     			}
	     		}
	     	// }
    }
};

/* Load JS File */
mads.prototype.loadJs = function (js, callback) {
    var script = document.createElement('script');
    script.src = js;
    
    if (typeof callback != 'undefined') {
        script.onload = callback;
    }
    
    this.headTag.appendChild(script);
}

/* Load CSS File */
mads.prototype.loadCss = function (href) {
    var link = document.createElement('link');
    link.href = href;
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');
    
    this.headTag.appendChild(link);
}

var video;

var indosat = function(){
	var _this = this;
	this.sdk = new mads();
	this.sdk.loadCss(this.sdk.path + 'css/indosat.css');
	this.sdk.loadJs('https://code.jquery.com/jquery-1.11.3.min.js', function(){
		_this.sdk.loadJs('http://cdn.richmediaads.com/nj.library.js')
		_this.sdk.loadJs(_this.sdk.path + 'js/ninjoe.ytComponent.js');
	});
	this.parent = document.querySelector('#rma-widget');
	this.firstScreen();
}

indosat.prototype.firstScreen = function(){
	var _this = this;

	var frame = document.createElement('DIV');
	frame.setAttribute('class', 'first-frame');
	this.parent.appendChild(frame);

	var loader = document.createElement('DIV');
	loader.setAttribute('class', 'loader');
	this.parent.appendChild(loader);

	var vid = document.createElement('DIV');
	vid.setAttribute('class','yt_frame');
	vid.setAttribute('id','yt_frame');
	this.parent.appendChild(vid);

	setTimeout(function(){
		loader.style.display = "none";
		vid.setAttribute('class', 'yt_frame vid');
		document.querySelector('.yt_frame').addEventListener('click', clickHandler, false);
	}, 4000);

	var lbl = document.createElement('P');
	lbl.setAttribute('class', 'first-label');
	lbl.innerHTML = 'Sering Nunggu Buffering Selesai?';
	this.parent.appendChild(lbl);

	var clickHandler = function(){
		_this.sdk.tracker('E', 'Indovideo');
		video = new ytComponent({
			'container': 'yt_frame',
			'width': '320',
			'height': '180',
			'videoId': 'T6hJVEQY6D0',
			'autoplay': true,
			'tracker': _this.sdk
		});

		vid.setAttribute('class', 'yt_frame');
		lbl.innerHTML = '';
		var bg = document.createElement('DIV');
		bg.setAttribute('class', 'final_wrapper fadeIn');
		_this.parent.appendChild(bg);


		var button = document.createElement('DIV');
		button.setAttribute('class', 'btn-cta');
		_this.parent.appendChild(button);

		$('.final_wrapper, .btn-cta').on('click', function(){
			_this.sdk.tracker('CTR', 'Indolp');
			_this.sdk.linkOpener('http://indosatooredoo.com/id/personal');
		});
	}
	
}

function onYouTubeIframeAPIReady() {
    video.loadVideo();
}

function end(){
	$('#rma-widget').append('<div class="video-end tada"></div>');
	$('.video-end').off('click').on('click', function(){
		video.player.playVideo()
		$(this).remove();
	});
}

var i = new indosat();
