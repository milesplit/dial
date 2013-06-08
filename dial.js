/*
Copyright (c) 2013 MileSplit, Inc.
Author: Jason Byrne
Contributor: Alan Szlosek
License: MIT
*/
/*   USAGE
	Requires: jQuery or Zepto
	Public properties:
		supports
	Public methods:
		adapter([name[, eventMap]])
		on(event, callback)
		off(token)
		trigger(event, args, target)
		
*/
;(function($){
	// Private methods
    var	adapters = {}, listeners = {},
		speechChangeEvent = null,
		$doc = $(document), geo = navigator.geolocation;
	// Pubsub
	var ps=(function(){var q={},topics={},subUid=-1;q.subscribe=function(topic,func){topics[topic]=topics[topic]||[];var token=(++subUid).toString();topics[topic].push({token:token,func:func});return token}; q.publish=function(topic,args,_this){if(!topics[topic]){return false}setTimeout(function(){var subscribers=topics[topic],len=subscribers?subscribers.length:0;while(len--){subscribers[len].func.call(_this||this,args,topic)}},0);return true};q.unsubscribe=function(token){for(var m in topics){if(topics[m]){for(var i=0,j=topics[m].length;i<j;i++){if(topics[m][i].token===token){topics[m].splice(i,1);return token}}}}return false};return q})();
	// Keys shim
	var keys = function(o){
		if (o.keys) return o.keys;
		var out=[];
		for (var key in o) {
			out.push(key);
		}
		return out;
	};
    // Initalize
	$.dial = { on: ps.subscribe, off:ps.unsubscribe, trigger: ps.publish };
	// Supports
	$.dial.supports = {
		touch: !!window.ontouchstart,
		mouse: !!window.onmousemove,
		keyboard: !!window.onkeydown,
		orientation: !!window.orientation,
		geolocation: !!geo
	};
	$.dial.supports.speech = (function() {
		var input = document.createElement('input');
		input.setAttribute('x-webkit-speech', 'x-webkit-speech');
		input.setAttribute('speech', 'speech');
        speechChangeEvent = ('webkitSpeech' in input) ?
            'webkitspeechchange' : 'speechchange';
		return (speechChangeEvent in input);
	})();
	// Adapters
	$.dial.adapter = function(type, events){
		// Overloads
		if (arguments.length == 0) return adapters;
		else if (arguments.length == 1) return adapters[type];
		// Save adapter
		adapters[type] = events;
		// Initialize
		var handler, map;
		// If voice
		if (type == 'voice') {
            if ($.dial.supports.speech) {
            	// Set handler
                handler = function(e){
                	map = adapters[type][speechChangeEvent];
                	if (typeof map == 'string') {
						// Publish this event
						ps.publish(map, e, e.target);
					} else if ($.isPlainObject(map)) {
						// If we mapped this word
						if (e.results && e.results.length > 0) {
							var word = e.results[0].utterance;
							(map[word]) && ps.publish(events[word], e, e.target);
						}
					}
				};
                // Clear previous
                listeners[type] && $doc.off(listeners[type], handler);
                // Set listener
                $doc.on(speechChangeEvent, handler);
                listeners[type] = speechChangeEvent;
            }
		} else if (type == 'geolocation') {
            if ($.dial.supports.geolocation) {
            	// Set handler
            	handler = function(e){
            		// Only thing that is supported is watchPosition, which is just a formality to pass in to be standard
				    map = adapters[type]['watchPosition'];
				    (typeof map == 'string') && ps.publish(map, e);
		 	   };
                // Clear previous
                listeners[type] && geo.clearWatch(listeners[type]);
                // Set listener
                listeners[type] = geo.watchPosition(handler);
            }
		} else {
			// Generic pointer, keyboard, or otherwise
			// Set handler
			handler = function(e){
				map = adapters[type][e.type];
				if (typeof map == 'string') {
					// Publish this event
	                ps.publish(map, e, e.target);
				} else if ($.isPlainObject(map)) {
					// If we mapped to this mouse button
					(map[e.which]) && ps.publish(map[e.which], e, e.target);
				}
			};
            // Clear previous
            listeners[type] && $doc.off(listeners[type], handler);
			// Set listener on keys
			listeners[type] = keys(events).join(' ');
            $doc.on(listeners[type], handler);
		}
		return $.dial;
	};
})(window.Zepto ? Zepto : jQuery);
