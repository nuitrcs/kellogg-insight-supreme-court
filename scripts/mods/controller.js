var extracted_values = d3.scaleLinear()
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
	extracted_values.domain(x_domain)
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
				d.value = extracted_values(x)
				if (y < y_range[0]) y_range[0] = y
				if (y > y_range[1]) y_range[1] = y
				d3.select(this.parentNode)
					.attr('transform',function(d,i){
						return 'translate(0,'+y+')'
					})
				if (!d.name) d.name = d.id
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
				d.min = extracted_values(x1)
				d.max = extracted_values(x2)
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
}
tilde.moveChrono = function() {
	d3.selectAll('.wrapper')
		.transition()
		.duration(300)
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
		.duration(300)
		.delay(function(d,i){
			return i*15
		})
		.attr('transform',function(d,i){
			return 'translate(0,'+y_position(d.rank)+')'
		})
}
tilde.drawFace = function(name) {
	var circle_to_replace = d3.select("#"+name+" circle")
	d3.select("#defs").append("pattern")
		.attr('id','pattern_'+name)
		.attr('patternContentUnits','objectBoundingBox')
		.attr('width','100%')
		.attr('height','100%')
		.attr('x',"0%")
		.attr('y',"0%")
		.append("image")
		.attr('width',1)
		.attr('height',1)
		.attr('preserveAspectRatio','none')
		.attr('href',"scripts/images/"+name+".jpg")
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
		.attr('fill','url(#pattern_'+name+')')
}
tilde.mouseover = function(ele,d,i) {
	d3.select(ele).moveToFront()
	d3.select(ele).select('.dot')
		.transition('mouse')
		.ease(d3.easeElastic)
		.duration(500)
		.attr('r',35)
	d3.select(ele).select('.error-bar')
		.style('stroke-width',3)
	d3.select(ele).select('text')
		.classed('bold',true)
	d3.select(ele).select('rect')
		.transition('mouse')
		.ease(d3.easeElastic)
		.duration(500)
		.attr('x',function(d,i){
			return +d3.select(ele).select('.dot').attr('cx') - 35
		})
		.attr('y',function(d,i){
			return +d3.select(ele).select('.dot').attr('cy') - 35
		})
		.attr('width',function(d,i){
			return 70
		})
		.attr('height',function(d,i){
			return 70
		})
		.attr('ry',function(){
			return 35
		})
		.attr('rx',function(){
			return 35
		})
}
tilde.mouseout = function(ele,d,i) {
	d3.select(ele).select('.dot')
		.transition('mouse')
		.ease(d3.easeElastic)
		.duration(500)
		.attr('r',12)
	d3.select(ele).select('.error-bar')
		.style('stroke-width',3)
	d3.select(ele).select('text')
		.classed('bold',false)
	d3.select(ele).select('rect')
		.transition('mouse')
		.ease(d3.easeElastic)
		.duration(500)
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
}

tilde.init()