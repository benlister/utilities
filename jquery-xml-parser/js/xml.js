/*
jQuery XML Parser with Sorting and Filtering
Written by Ben Lister (@bahnburner) January 2010 
Last revised Aug 7, 2012
Tutorial: http://blog.darkcrimson.com/2010/01/jquery-xml-parser/

Licensed under the MIT License:
http://www.opensource.org/licenses/mit-license.php
*/

(function($) {
	$.fn.extend({ 
	   xml_parser : function(el) {
	  
		//Construct and display preloader
	     $('<div id="preload_xml" />').html('<img src="images/ajax-loader.gif" alt="loading data" /><h3>Loading Data...</h3>').prependTo($('body'));
	     	
	        el.hide();
	        var e = el;
	        
			//Get XML Data
	        $.ajax({
	            type: 'GET',
	            url: 'xml/data.xml',
	            dataType: 'xml',
	            success: function(data) {
	            
	              //Remove preloader HTML & show data
	       		  $('#preload_xml').remove();
	       		  el.show();
	            
	            var entries     = $(data).find('entry'),
	            	xmlArr      = [];
	            	
	                entries.each(function() {
	
						//Atrributes from XML nodes
	                    var xml_date      	= $(this).attr('date'),
	                        xml_cost 	  	= $(this).attr('cost'),
						    xml_category  	= $(this).attr('category'),
						    xml_name  	  	= $(this).find('name').text(),
						    xml_description = $(this).find('description').text();
						
	                    
	                  // Add matched items to an array
	                  xmlArr += '<tr data-filtercriteria="'+ xml_cost +'">';
	                  
	                    xmlArr += '<td>'+ xml_date +'</td>';
	                    xmlArr += '<td>'+ xml_name +'</td>';
	                    xmlArr += '<td>'+ xml_description +'</td>';
	                    xmlArr += '<td>'+ xml_category +'</td>';
	                    xmlArr += '<td>$'+ xml_cost +'</td>';
	               
	                  xmlArr += '</tr>';
	                             
	                }); // end each loop
	
	                  $(xmlArr).appendTo(el.find('table > tbody'));
	                  
	                  
	 				  //Add sort and zebra stripe to table
					   window.setTimeout(function(){ el.find('table').tablesorter({sortList:[[0,0],[0,0]], widgets: ['zebra']});}, 120);
					  el.find('table').hide().slideDown('200');
					   
					  //Filter results functionality
					 var nav_link = $('#xml_nav li a');
					 
					 nav_link.click( function() {
					  	
					  	var tr 		   = el.find('tbody > tr'),
					  		attr_class = $(this).attr('class');
						tr.show(); //Show all rows
	
						switch (attr_class) {
							case  'filter_10 hit' :
								$(tr).filter(function() {
									return parseFloat($(this).data('filtercriteria')) > 10;
								}).hide();
							break;
							
							case  'filter_10_20 hit' :
								$(tr).filter(function() {
									return parseFloat($(this).data('filtercriteria')) < 10 || parseFloat($(this).data('filtercriteria')) > 20  ;
								}).hide();
							break;
							
							case  'filter_20 hit' :
								$(tr).filter(function() {
									return parseFloat($(this).data('filtercriteria')) < 20;
								}).hide();
	
							break;
							
							case  'filter_0 hit' :
								$(tr).show();
								
							break;
													
						} // end filter switch
							tr.removeClass('stripe');	
							$('table > tbody > tr:visible:odd').addClass('stripe');
					  });// end filter   
					  
				} 
	        }); 
	    } 
       });
    
 $(document).ready(function() {

 	$.fn.xml_parser($('#xml_wrapper'));
 	
 	var nav_link = $('#xml_nav > li > a'); //Navigation <LI> Link for filtering event
	nav_link.click(function() {
		
		//Add hit state to filter link
		nav_link.removeClass('hit'); 
		$(this).addClass('hit');
		
		//Class for styles
		nav_link.parent().removeClass('xml_nav_hit');
		$(this).parent().addClass('xml_nav_hit');
	});
	    }); 	
	
})(jQuery);