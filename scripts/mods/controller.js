tilde.extracted_values = d3.scaleLinear()
	.range([-0.4,0,0.4,0.8]),
	y_position = d3.scaleLinear(),
	x_domain = [],
	y_range = [Infinity,0],
	y_domain = [1,36]
tilde.init = function() {
	d3.select('#axis').selectAll('line')
		.each(function(){
			var x = +d3.select(this).attr('x1')
			x_domain.unshift(x)
		})
	tilde.extracted_values.domain(x_domain)
	tilde.data.forEach(function(d){
		var parent = d3.select('#'+d.id)
			.attr('class','wrapper')
			.datum(d)
			.on('mouseover',function(d,i){
				var me = this
				tilde.mouseover(me,d,i)
			})
			.on('mouseout',function(d,i){
				var me = this
				tilde.mouseout(me,d,i)
			})
			.on('click',function(d,i){
				var me = this
				tilde.mouseout(me,d,i)
				window.open(d.wiki,'_blank')
			})
		parent
			.select('.dot')
			.style('fill',function(d,i){
				var x = +d3.select(this).attr('cx')
				var y = +d3.select(this).attr('cy')
				d.chrono = y
				d.value = tilde.extracted_values(x)
				if (y < y_range[0]) y_range[0] = y
				if (y > y_range[1]) y_range[1] = y
				d3.select(this.parentNode)
					.attr('transform',function(d,i){
						return 'translate(0,'+y+')'
					})
				if (!d.name) d.name = d.id
				return 'none'
				if (d.appointed === 'r'){
					return '#E05669'
				}
				return '#555FC0'
			})
			.attr('cy',0)
			.attr('r',12)
			.style('mix-blend-mode','screen')
		parent
			.select('.error-bar')
			.attr('y1',0)
			.attr('y2',0)
			.style('stroke',function(d,i){
				var x1 = +d3.select(this).attr('x1'),
					x2 = +d3.select(this).attr('x2')
				d.min = tilde.extracted_values(x1)
				d.max = tilde.extracted_values(x2)
				if (d.appointed === 'r'){
					return '#E05669'
				}
				return '#555FC0'
			})
			.style('mix-blend-mode','screen')
		parent
			.append('text')
			.html(function(d,i){
				return d.name
			})
			.attr('x',30)
			.attr('y',4)
			.attr('text-anchor','end')
		tilde.drawFace(d.id)
	})
	tilde.count = 1
	tilde.data.sort(function(a,b){
		return b.value - a.value
	})

	tilde.data.forEach(function(d){
		d.rank = tilde.count
		tilde.count++
	})
	y_position
		.domain(y_domain)
		.range(y_range)
	d3.selectAll('.wrapper')
		.attr('transform',function(d,i){
			return 'translate(0,'+y_position(d.rank)+')'
		})
	d3.selectAll('.axis')
		.style('isolation','isolate')
		.style('stroke','#323232')
		.style('opacity','0.3')
	d3.select('#subhead').call(tilde.wrapText,tilde.extracted_values.invert(0.95)-tilde.extracted_values.invert(-0.4))
	d3.select('#footnote').call(tilde.wrapText,tilde.extracted_values.invert(0.95)-tilde.extracted_values.invert(-0.4))
	d3.select('#sort_method')
		.on('click',tilde.swapSorting)
	tilde.sorting = 'By change'
}
tilde.swapSorting = function() {
	if (tilde.sorting === 'By change') {
		tilde.sorting = this.innerHTML = 'Chronologically'
		tilde.moveChrono()
	} else {
		tilde.sorting = this.innerHTML = 'By change'
		tilde.moveValue()
	}
}
tilde.moveChrono = function() {
	d3.selectAll('.wrapper')
		.transition()
		.duration(500)
		.delay(function(d,i){
			return i*15
		})
		.attr('transform',function(d,i){
			return 'translate(0,'+d.chrono+')'
		})
}
tilde.moveValue = function() {
	d3.selectAll('.wrapper')
		.transition()
		.duration(500)
		.delay(function(d,i){
			return i*15
		})
		.attr('transform',function(d,i){
			return 'translate(0,'+y_position(d.rank)+')'
		})
}
tilde.drawFace = function(name) {
	var circle_to_replace = d3.select("#"+name+" circle")
	var pattern = d3.select("#defs").append("pattern")
		.attr('id','pattern_'+name)
		.attr('patternContentUnits','objectBoundingBox')
		.attr('width','100%')
		.attr('height','100%')
		.attr('x',"0%")
		.attr('y',"0%")
		
	pattern.append("image")
		.attr('width',1)
		.attr('height',1)
		.attr('preserveAspectRatio','none')
		.attr('xlink:href',"scripts/images/"+name+".jpg")
		
	var rect = d3.select("#"+name)
		.append('rect')
		.attr('x',function(d,i){
			return +circle_to_replace.attr('cx') - 12
		})
		.attr('y',function(d,i){
			return +circle_to_replace.attr('cy') - 12
		})
		.attr('width',function(d,i){
			return 24
		})
		.attr('height',function(d,i){
			return 24
		})
		.attr('ry',function(){
			return 12
		})
		.attr('rx',function(){
			return 12
		})
		.attr('id','rect_'+name)
		.attr('fill',"url("+ window.location.href + "#pattern_"+name+')')
}
tilde.mouseover = function(ele,d,i) {
	var duration = 1000
	var place_card_left = true
	var source = d3.select(ele).select('.dot')
	if (d.value < 0.2) {
		place_card_left = false
	}

	tilde.tooltip.moveToFront()
	d3.select(ele).moveToFront()
	
	d3.select(ele).select('.dot')
		.transition('mouse')
		.ease(d3.easeElastic)
		.duration(duration)
		.attr('r',50)
	d3.select(ele).select('text')
		.classed('bold',true)
	d3.select(ele).select('rect')
		.transition('mouse')
		.ease(d3.easeElastic)
		.duration(duration)
		.attr('x',function(d,i){
			return +source.attr('cx') - 50
		})
		.attr('y',function(d,i){
			return +source.attr('cy') - 50
		})
		.attr('width',function(d,i){
			return 100
		})
		.attr('height',function(d,i){
			return 100
		})
		.attr('ry',function(){
			return 50
		})
		.attr('rx',function(){
			return 50
		})

	var supplemental = tilde.supplemental[d.id]
	var font_size = parseFloat(d3.select("#subhead").style('font-size'))
	tilde.tooltip
		.attr('transform',function(){
			var translate = 'translate('+source.attr('cx')+','
			if (tilde.sorting === 'By change') translate += y_position(d.rank)
			else translate += d.chrono
			translate +=')'
			return translate
		})
		.style("display", "inline-block")

	tilde.info
		.selectAll("tspan").remove()

	tilde.info
		.attr('text-anchor',function(){
			if (place_card_left) {
				return 'end'
			}
			return 'start'
		})
	var x_adjust = 50
	var padding = 5
	x_adjust += padding
	x_position = x_adjust+padding*2
	if (place_card_left) x_position = -x_position

	tilde.info
		.append("tspan")
		.classed('bold',true)
		.attr('y',-font_size*.70-padding)
		.attr('x',x_position)
		.text(d.fname)

	tilde.info
		.append("tspan")
		.attr('y',font_size*.3)
		.attr('x',x_position)
		.text('('+supplemental.Years+'), ')
		.append("tspan")
		.classed('italic',true)
		.text('Appointed by:')

	tilde.info
		.append("tspan")
		.attr('y',font_size*1.3+padding)
		.attr('x',x_position)
		.text(supplemental.President+' ('+d.appointed+')')

	var w = tilde.info.node().getBBox().width,
		h = Math.abs(x_adjust),
		cx = 0,
		cy = 0

	tilde.tooltip_fill
		.attr('d',function(){
			var d = 'M '
			d += cx + ' '			//x1
			d += cy - h + ' L '		//y1
			d += cx + h + padding*4 + w + ' '	//x2
			d += cy - h + ' L '		//y2
			d += cx + h + padding*4 + w + ' '	//x3
			d += cy + h + ' L '		//y3
			d += cx + ' '			//x4
			d += cy + h 			//y4
			d += ' A '+h+' '+h 		//arc command, rx/ry
			d += ' 0 ' 				//x-axis-rotation
			d += ' 0 ' 				//large-arc-flag
			d += ' 0 ' 				//sweep-flag
			d += cx + ' '			//x5
			d += cy - h + ' Z'		//y5
			return d
		})
		.attr('transform',function(){
			var rotate = 'rotate('
			if (place_card_left) rotate += '180,'+cx+','+source.attr('cy')
			else rotate += 0
			rotate += ')'
			return rotate
		})
		.style('fill',function(){
			if (d.appointed === 'Republican') {
				return '#6E0000'
			}
			return '#14145A'
		})

	var translate = tilde.tooltip.attr('transform')
	tilde.tooltip
		.transition('mouse')
		.duration(0)
		.attr('transform',function(){
			return translate + 'scale(1,'+24/100+')'
		})
	tilde.tooltip
		.transition('mouse')
		.duration(duration)
		.ease(d3.easeElastic)
		.attr('transform',function(){
			return translate + 'scale(1,1)'
		})
}
tilde.easeDown = function(x) {
	x = d3.easeElastic(x)
	if (x < 0) x=0
	else if (x > 1) x = (x+1)/2
	return x
}
tilde.mouseout = function(ele,d,i) {
	d3.select(ele).select('.dot')
		.transition('mouse')
		.ease(tilde.easeDown)
		.duration(1000)
		.attr('r',12)
	d3.select(ele).select('text')
		.classed('bold',false)
	d3.select(ele).select('rect')
		.transition('mouse')
		.ease(tilde.easeDown)
		.duration(1000)
		.attr('x',function(d,i){
			return +d3.select(ele).select('.dot').attr('cx') - 12
		})
		.attr('y',function(d,i){
			return +d3.select(ele).select('.dot').attr('cy') - 12
		})
		.attr('width',function(d,i){
			return 24
		})
		.attr('height',function(d,i){
			return 24
		})
		.attr('ry',function(){
			return 12
		})
		.attr('rx',function(){
			return 12
		})
	tilde.tooltip
		.style("display","none")
}
tilde.wrapText = function(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        x = text.attr('x'),
        dy = parseFloat(text.attr("dy")) || 0,
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}
tilde.tooltip = d3.select("#tooltip");
tilde.tooltip_fill = tilde.tooltip.append('path').attr('id','tooltip_fill')
tilde.info = tilde.tooltip.append('text').attr('id','info')
tilde.init()