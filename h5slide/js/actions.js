/*
h5Slide - HTML5 powered, browser-based slideshow
Written by Ben Lister (@bahnburner) June 2010 
Last revised Aug 14, 2012

Licensed under the MIT License:
http://www.opensource.org/licenses/mit-license.php
*/


//todo: combine move slide and keyslide functions
(function($) {

	$.fn.h5Slide = {
		init: function(){
			
			var self = this;	
			//Attempt to load from local storage
			if (this.getStorage('slideshow')) $('#slide_wrapper').html(this.getStorage('slideshow'));$('#slide_wrapper > section').css('opacity','1');
			
			$('#slide_wrapper > section > ul, h3 > span').attr('contenteditable','true').keyup(function(){ self.setStorage("slideshow", $('#slide_wrapper').html()); });
			
			$('h3 > span').blur(function(){
		
				if ($(this).html().length === 0) {
					$(this).html('Enter Slide Title');
					self.setStorage("slideshow", $('#slide_wrapper').html());
		
				}
			})
			
			$('#slide_wrapper > section > ul ').keyup(function(){
				if($(this).children('li').length < 1) {
					$(this).html('<li>Click to edit / add text</li>');
					
					self.setStorage("slideshow", $('#slide_wrapper').html());
				}
			});
			
		
			//Create + & -
			$('<ul class="controls"><li><a href="#" id="add_slide" title="Add slide">+</li><li><a href="#" id="remove_slide" title="Remove slide">-</li><li id="remove_all"><a href="#" title="Remove all slides">[- all]</a></li><li id="theme"><a href="#" title="Swap Theme">Theme: Darkness</a></li><li><a href="#" id="pres">Presentation mode: <em>OFF</em></a></li></ul>').appendTo('body > nav');
		
			 this.createMenu();
			
			$('#nav > li a').on("click", function(){
				
				self.moveSlide(parseInt($(this).data('slide')));
				$('#nav > li a.hit').removeClass('hit');
				$(this).addClass('hit');
			});
		
			
			
			$('#add_slide').on('click', function(ev){ ev.preventDefault();self.addSlide(); });
			
			//Remove slide
			$('#remove_slide').click(function(ev){ ev.preventDefault();self.removeSlide()});
		
			$('#remove_all').click(function(ev){
				ev.preventDefault();
				var deleteall = confirm('Delete '+$('#nav li').length+' slide(s) and start over?')
				if (deleteall){
					localStorage.removeItem('currentslide');
					localStorage.removeItem('slideshow');
					localStorage.removeItem('theme');
					window.location.reload( false );
				}
			})
			//Theme toggle
			$('#theme').toggle(function(ev){
				ev.preventDefault();
				$('body').addClass('web375');
				$('#theme').html('<a href="#" title="Swap Theme">Theme: Web 3.75</a>');
				self.setStorage('theme', 'web375');
				
			},function(ev){
				ev.preventDefault();
				$('html,body').removeClass('web375');
				$('#theme').html('<a href="#" title="Swap Theme">Theme: Darkness</a>');	
				self.setStorage('theme', 'dark');
			});
			
			//Presentation Mode 
			$('#pres').on('click',function(ev){
				ev.preventDefault();
				self.presentationMode();
			});
			
			//enable keyboard actions
			this.keyboard();
			
			if (this.getStorage('theme') !== null){ if(this.getStorage('theme') == "web375") { $('body').addClass('web375');$('#theme').html('<a href="#" title="Click to swap themes">Theme: Web 3.75</a>'); } }	
			
		},
		addSlide: function(){
			if(!$('body').hasClass('pres')) {
				var max_slides = $('#nav li').length,
					self = this;
				if (max_slides === 200) { 
					alert('Whoa there, 200 slides? Stop, for the love of RAM!');
					return false;
				} else {
					$('<section><h3><span contenteditable="true">Enter Slide Title</span></h3><ul contenteditable="true"><li>Click to edit / add text</li></ul></section>').appendTo('#slide_wrapper');
					
					$('<li><a href="#" data-slide="'+ (max_slides) +'">'+ (max_slides + 1)  +'</a></li>').appendTo('#nav');
					$('#slide_wrapper > section').stop(false, true).hide();
					$('#nav > li a.hit').removeClass('hit');
					$('#nav > li a[data-slide="' + (max_slides) + '"]').addClass('hit');	
					$('#slide_wrapper > section:eq(' + max_slides + ')').stop(false, true).fadeIn('slow', function(){self.setStorage("slideshow", $('#slide_wrapper').html());});	
					
				}
			}
			
		},
		removeSlide: function(){
			if(!$('body').hasClass('pres')) {
				var nav_li    = $('#nav li'),
					cur_slide = parseInt(nav_li.find('a.hit').data('slide'));
				if(nav_li.length > 1) {
					$('#slide_wrapper > section:eq('+ cur_slide +')').remove();
				
				if (nav_li.find('a.hit').data('slide') >= 0 ) {
					this.moveSlide(cur_slide -  1);
					
				} else {		
					this.moveSlide(cur_slide  +  1);
					
				}
					this.createMenu(cur_slide);
					this.setStorage("slideshow", $('#slide_wrapper').html());
				
				} else {
					alert("Yo Dawg, you need to have at least one slide, aight?");
				}
			}
		},
		
		moveSlide: function(slide){
			var nav_li = $('#nav li'),
			    cs;
			if (slide >= ($('#nav li').length)) {
				cs = 0;
			
			} else {
							
				cs = slide;
			} 
		
			if (slide !== parseInt($('#nav li a.hit').data('slide'))) {
				$('#slide_wrapper > section').hide();
				$('#slide_wrapper > section:eq(' + cs + ')').stop(false, true).fadeIn('slow');
				this.setStorage("currentslide", cs);
	
			} 	
			document.title = $('#slide_wrapper > section:visible').find('h3 > span').html();
			
		},
		
		createMenu: function(s){
			var saved_slide = parseInt(this.getStorage('currentslide'));
			$('#nav').remove();
			$('<ul id="nav"></ul>').appendTo('body > footer');
			$('#slide_wrapper > section').each(function(e){

				$('<li><a href="#" data-slide="'+ e +'">'+ (e + 1)  +'</a></li>').appendTo('#nav');
			});	
			
			if (parseInt(s) >= 1) {
			$('#nav > li a[data-slide='+parseInt((s - 1))+']').addClass('hit'); 
			} else {
			
				
				if (saved_slide != null && saved_slide > 0 ) {
				
					$('#nav > li a[data-slide='+ saved_slide +']').addClass('hit'); 
					$('#slide_wrapper > section').hide();
					$('#slide_wrapper > section:eq('+ (saved_slide) +')').stop(false, true).fadeIn('slow');
				} else {
				
					$('#nav > li a[data-slide=0]').addClass('hit'); 
					$('#slide_wrapper > section').hide();
					$('#slide_wrapper > section:eq(0)').stop(false, true).fadeIn('slow');
					
				}
				
			
			
			}
		},
		
		presentationMode: function(){
			var bod = $('body');
			
			if(!bod.hasClass('pres')) {
				bod.addClass('pres');
				$('#pres > em').html('ON');
			} else {
				
				bod.removeClass('pres');
				$('#pres > em').html('OFF');
			}
			
			
		},
		
		setStorage: function(k,v){
			
			 return localStorage.setItem(k,v);
		},
		getStorage: function(k) {
			
			return localStorage.getItem(k);
		},
		
		currentSlide: function(){
			var hit = $('#nav li a.hit').data('slide');
			return parseInt(hit);
			
		},
		
		keySlide: function(slide) {
				
			if (slide <= ($('#nav li').length - 1) ) {
				cs = slide;
			} else if (slide === ($('#nav li').length)){
				cs = 0;
			} else if (slide < 0) {
				cs = $('#nav li').length - 1;
			} else {
				cs = slide;
			}
			
			$('#nav > li a.hit').removeClass('hit');	
			$('#nav > li a[data-slide='+cs+']').addClass('hit'); 
			$('#slide_wrapper > section').stop(false, true).hide();
			$('#slide_wrapper > section:eq(' + cs + ')').stop(false, true).fadeIn('slow');
			$.fn.h5Slide.setStorage("currentslide", cs);
			document.title = $('#slide_wrapper > section:visible').find('h3 > span').html();
		},
		
		keyboard: function(){
			/*Keybaord commands*/
			$(document).on('keydown.h5slide',function(e){
		   
				if (e.keyCode === 40 || e.keyCode === 37) {  //down or left arrow
					if ($.fn.h5Slide.currentSlide() === 0) {
		    			$.fn.h5Slide.keySlide((parseInt($('#nav li').length) - 1));
		    		} else {
		    			$.fn.h5Slide.keySlide($.fn.h5Slide.currentSlide() - 1);
		    		}
		
				} else if(e.keyCode === 38 || e.keyCode === 39) { //up or right arrow
		
					if ($.fn.h5Slide.currentSlide() === 0) {
		    			$.fn.h5Slide.keySlide(1);
		    		} else {
		    			$.fn.h5Slide.keySlide($.fn.h5Slide.currentSlide() + 1);
		    		}
		 
				}
		
				//esc to exit presentation mode
				if (e.keyCode === 27 && $('body').hasClass('pres')) {
		    		$.fn.h5Slide.presentationMode();
		    		
				}
				//if not editing content, enable +, -, delete actions
				if(!$(document.activeElement).attr('contenteditable')) { 
					if(e.which === 107 || e.which === 187) { //+ key
						$.fn.h5Slide.addSlide();
						return false;
					} else if (e.which === 109 || e.which === 8 || e.which === 189) { //- or delete key
						$.fn.h5Slide.removeSlide();
					}
					
					//p for presentation mode toggle
					if (e.keyCode === 80) {
		    			$.fn.h5Slide.presentationMode();
		    		}
				}
		
		  }); 	
			
		}
		
	}

$(document).ready(function() {
	$.fn.h5Slide.init();
		
});

	
})(jQuery);