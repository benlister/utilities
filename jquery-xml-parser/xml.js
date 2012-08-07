/*
jQuery XML Parser with Sorting and Filtering
Written by Ben Lister (darkcrimson.com) revised 25 Apr 2010
Tutorial: http://blog.darkcrimson.com/2010/01/jquery-xml-parser/

Licensed under the MIT License:
http://www.opensource.org/licenses/mit-license.php
*/

$(function() {
	
    function xml_parser(wrapper) {
    
	//Construct and display preloader
     $('<div id="preload_xml"></div>').html('<img src="images/ajax-loader.gif" alt="loading data" /><h3>Loading Data...</h3>').prependTo($('body'));
     	
     	//Hide Content (this is sloppy but easy to customize..)
        $(wrapper).hide();
		
		//Get XML Data
        $.ajax({
            type: 'GET',
            url: 'xml/data.xml',
            dataType: 'xml',
            success: function(xml_list) {
            
			  //Remove preloader HTML & show data
       		  $('#preload_xml').remove();
       		  $(wrapper).show();
				
				var xmlArr = [];
                $(xml_list).find('entry').each(function() {
					
					//Meta Data
                    var xml_date      	= $(this).attr('date'); 
                    var xml_cost 	  	= $(this).attr('cost');
					var xml_category  	= $(this).attr('category');
					
					//Description
					var xml_name  	  	= $(this).find('name').text();
					var xml_description = $(this).find('description').text();
					
                    
                  // Add matched items to an array
                  xmlArr += '<tr filterCriteria="';
                  xmlArr += xml_cost;
                  xmlArr += '"><td>';
                  xmlArr += xml_date;
                  xmlArr += '</td><td class="xml_name">';
                  xmlArr += xml_name;
                  xmlArr += '</td><td>';
                  xmlArr += xml_description;
                  xmlArr += '</td><td>';
                  xmlArr += xml_category;
                  xmlArr += '</td><td class="xml_cost">$';
                  xmlArr += xml_cost;
                  xmlArr += '</td></tr>';
                             
                }); // end each loop

                  //Append array to table (this way is much faster than doing this individually for each item)
                  $(xmlArr).appendTo(wrapper +' table tbody');
                  
                  
 				  //Add sort and zebra stripe to table (NOTE: this does not work as intended with sort feature)
				   window.setTimeout('$("'+ wrapper +' table").tablesorter({sortList:[[0,0],[0,0]], widgets: [\'zebra\']});', 120);
				   $(wrapper +' table').hide().slideDown('200');
				   
				  //Filter results functionality
				 var nav_link = $('#xml_nav li a');
				 nav_link.click( function() {
				  	var tr = wrapper +' table tbody tr';
					$(tr).show(); //Show all rows
					switch ($(this).attr("class")) {
						case  "filter_10 hit" :
							$(tr).filter(function (index) {
								return parseFloat($(this).attr('filterCriteria')) > 10;
							}).hide();
						break;
						
						case  "filter_10_20 hit" :
							$(tr).filter(function (index) {
								return parseFloat($(this).attr('filterCriteria')) < 10 || parseFloat($(this).attr("filterCriteria")) > 20  ;
							}).hide();
						break;
						
						case  "filter_20 hit" :
							$(tr).filter(function (index) {
								return parseFloat($(this).attr('filterCriteria')) < 20;
							}).hide();

						break;
						
						case  "filter_0 hit" :
							$(tr).show();
						break;
												
					} // end filter switch
						$(tr).removeClass('stripe');	
						$(tr + ':visible:odd').addClass('stripe');
				  });// end filter   
				  
			} // end post AJAX call operaitons
        }); // end AJAX
    } // end function
    
    
 	//Function Call
 	var wrapper = '#xml_wrapper'; // Id of wrapper
 	xml_parser(wrapper);
 	
 	var nav_link = $('#xml_nav li a'); //Navigation <LI> Link for filtering event
	nav_link.click(function() {
		
		//Add hit state to filter link
		nav_link.removeClass('hit'); 
		$(this).addClass('hit');
		
		//Class for styles
		nav_link.parent().removeClass('xml_nav_hit');
		$(this).parent().addClass('xml_nav_hit');
	});
	
	
	
});