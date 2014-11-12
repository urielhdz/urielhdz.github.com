function Map(selector,options){
	if (typeof options === 'undefined') options = {};
	if (typeof selector === 'undefined') selector = "body";
	var self = this;
	self.width = (options.hasOwnProperty("width")) ? options.width : 800;
	self.height = (options.hasOwnProperty("height")) ? options.height : 600;
	self.scale = (options.hasOwnProperty("scale")) ? options.scale : 100;
	self.mouse_over = (options.hasOwnProperty("mouse_over")) ? options.mouse_over : false;
	self.url = (options.hasOwnProperty("url")) ? options.url : "maps/countries.geo.json";
	self.selector = selector;
	self.projection = d3.geo.mercator().translate([self.width/2,self.height/2]).scale([self.scale]);
	self.path = d3.geo.path().projection(self.projection);
	self.svg = d3.select(selector).append("svg").attr({width: self.width, height: self.height});

	self.highlightCountries = function(countries_array,callback,options){
		d3.csv("maps/relatives.csv", function(d) {
		  return {
		    name: d.name,
		    iso_name: d.iso_name,
		    iso2: d.iso2,
		    iso3: d.iso3,
		    numcode: +d.numcode
		  };
		}, function(error, rows) {
		  self.countries_data = rows;
		  self.applyHighlightCountries(countries_array,callback,options)
		});
		
	};

	self.applyHighlightCountries = function(countries_array,callback,options){
		if (typeof options === 'undefined') options = {};
		var color = (options.hasOwnProperty("color")) ? options.color : "yellow";

		for (var i = 0; i < countries_array.length; i++) {
			var country = countries_array[i];
			if(country.length > 3){
				var iso3 = self.searchForCode(country);
				if(iso3){
					d3.select("#"+iso3)
						.attr("fill",color);		
				}
			}
			else{
				d3.select("#"+country)
					.attr("fill",color);
			}
		};
		callback();
	};
	self.heatCountries = function(countries_json,callback,options){
		if (typeof self.countries_data === 'undefined'){
			d3.csv("maps/relatives.csv", function(d) {
			  return {
			    name: d.name,
			    iso_name: d.iso_name,
			    iso2: d.iso2,
			    iso3: d.iso3,
			    numcode: +d.numcode
			  };
			}, function(error, rows) {
			  self.countries_data = rows;
			  self.applyHeatCountries(countries_array,callback,options)
			});	
		}
	};
	self.applyHeatCountries = function(countries_json,callback,options){
		if (typeof options === 'undefined') options = {};
		var color = (options.hasOwnProperty("color")) ? options.color : false;
		var min = Infinity;
		var max = -Infinity;

		for(country in countries_json){
			var country_number = countries_json[country];
			if(country_number > max){
				max = country_number;
			}
			if(country_number < min ){
				min = country_number
			}
		}
		if (min == Infinity || max == -Infinity){
			for(country in countries_json){
				self.heatCountry(country,color);
			}
		}
		for(country in countries_json){
			var country_number = countries_json[country];
			var percentage =  ((country_number - min) / (max - min)) * 100;
			percentage += 20;
			var decimal = parseInt(percentage % 1);
			var ent = parseInt(percentage);
			if(color){
				var custom_color = color.replace(",0)",","+percentage+")");
			}
			else{
				var custom_color = 'rgb(' + (300 - (ent * 2)) + ',' + (255 - (ent * 2)) + ', ' + (255 - (ent * 2)) + ')';
				
			}
			self.heatCountry(country,custom_color);
		}
		
		if (typeof callback != 'undefined') callback();
	};
	self.heatCountry = function(country,color){
		if(country.length > 3){
			var iso3 = self.searchForCode(country);
			if(iso3){
				
				d3.select("#"+iso3)
					.attr("fill",color);		
			}
		}
		else{
			d3.select("#"+country)
				.attr("fill",color);
		}
	}
	self.searchForCode = function(country){
		var ctr = country.toLowerCase();
		var results = self.countries_data.filter(function (country_csv) {
			
		    return country_csv.name.toLowerCase() == ctr || country_csv.iso_name.toLowerCase() == ctr;
		});
		if(results.length > 0){
			
			return results[0].iso3;
		}
		return null;
	}
	self.fill = function(callback,options){
		if (typeof options === 'undefined') options = {};
		var color = (options.hasOwnProperty("color")) ? options.color : "#333";

		
		d3.json(self.url,function(json){
			self.svg.selectAll("path")
				.data(json.features)
				.enter()
				.append("path")
				.attr("id",function(d){return d.id;})
				.attr("d",self.path)
				.attr("fill",color)
				.attr("class","transitionable")
				.on("mouseover",function(){
					if(self.mouse_over){
						d3.select("#"+this.id).attr("opacity","0.7");
					}
				})
				.on("mouseout",function(){
					d3.select("#"+this.id).attr("opacity","1");
				})
				.on("click",function(){
					console.log(":p");
					if(options.hasOwnProperty("click")){
						options.click(this);
					}
				});
			if (typeof callback != 'undefined') callback();
		});	

	};
	self.stroke = function(callback,options){
		if (typeof options === 'undefined') options = {};
		var color = (options.hasOwnProperty("color")) ? options.color : "#333";
		var strokeWidth = (options.hasOwnProperty("strokeWidth")) ? options.strokeWidth : "1";
		d3.json(self.url,function(json){
			self.svg.selectAll("path")
				.data(json.features)
				.enter()
				.append("path")
				.attr("id",function(d){return d.id;})
				.attr("d",self.path)
				.attr("stroke",color)
				.attr("stroke-width",strokeWidth)
				.attr("fill","rgba(0,0,0,0)")
				.attr("class","transitionable")
				.on("mouseover",function(){
					if(self.mouse_over){
						d3.select("#"+this.id).attr("opacity","0.9");
					}
				})
				.on("mouseout",function(){
					d3.select("#"+this.id).attr("opacity","1");
				})
				.on("click",function(){
					
					if(options.hasOwnProperty("click")){
						options.click(this);
					}
				});
			if (typeof callback != 'undefined') callback();
		});

	};
	
}