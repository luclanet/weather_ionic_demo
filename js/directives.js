angular.module('starter.directives', [])
.directive('unixTime', function() {
	return function(scope, element, attrs){
		var date = new Date(attrs.unixTime * 1000);
		if (!angular.isUndefined(attrs.unixTimeFormat)) {
			var text = attrs.unixTimeFormat;
		} else {
			var text = "D m Y";
		}
		
		var month_s = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		
		text = text.replace("d", (date.getDate().length == 1 ? "0".date.getDate() : date.getDate()));
		text = text.replace("H", (date.getHours().length == 1 ? "0".date.getHours() : date.getHours()));
		text = text.replace("M", month_s[date.getMonth()]);
		text = text.replace("j", date.getDate());
		
		element.text(text);
	};
})
.filter('unixTime', function() {
	return function(input, format) {
		var date = new Date(input * 1000);
		if (!angular.isUndefined(format)) {
			var text = format;
		} else {
			var text = "D m Y";
		}
		
		var month_s = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		
		text = text.replace("d", (date.getDate().length == 1 ? "0".date.getDate() : date.getDate()));
		text = text.replace("H", (date.getHours().length == 1 ? "0".date.getHours() : date.getHours()));
		text = text.replace("M", month_s[date.getMonth()]);
		text = text.replace("j", date.getDate());
		text = text.replace("g", (date.getHours() > 12 ? date.getHours() - 12 : date.getHours()));
		text = text.replace("A", (date.getHours() > 12 ? "PM" : "AM"));
		
		return text;
	};
});

