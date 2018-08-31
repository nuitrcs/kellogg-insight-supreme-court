/* 
//	- TILDE, TILD3, tild3, ~ and tilde are all js-library catch-words (so to speak) by Frank Elavsky at Northwestern University
//	- Thanks to Kellogg Insight for coordinating the article and collaboration
//	- A special thanks to Dashun Wang for the research materials and data
*/

var tilde = {}

// < or > 0 randomizer
function rnd2() {
	return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
}

/* changing the layout order is called like this:
	circles.on("mouseover",function(){
		var sel = d3.select(this);
		sel.moveToFront();
	});
*/
d3.selection.prototype.moveToFront = function() {
	this.each(function(){ this.parentNode.appendChild(this); });
};

//helpful rounding function
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

//helpful abbreviation function for numbers 
function abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "k", "m", "b","t"];
        var suffixNum = Math.floor( (""+value).length/3 );
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0)  shortNum = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
}
//Transition callback runs when ALL elements have finished
function endall(transition, callback) { 
	var n = 0; 
	transition 
		.each(function() { ++n; }) 
		.on("end", function() { if (!--n) callback.apply(this, arguments); }); 
}


// Fisher-Yates Shuffle
function shuffle(array) {
	var m = array.length, t, i;
	while (m) {
		i = Math.floor(Math.random() * m--);
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	return array;
}

function hex(value) {
  value = Math.max(0, Math.min(255, Math.round(value) || 0));
  return (value < 16 ? "0" : "") + value.toString(16);
}

d3.rgb.prototype.hex = function() {
  return "#" + hex(this.r) + hex(this.g) + hex(this.b);
};

// this is for parsing url
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}