
jQuery(function($) {'use strict',


		  
	  //Window Loaded Handler

  $(window).load(function(){'use strict';
		 $(".loader").fadeOut("slow");
		 
  });
	 
	
   	
	 
  
  // ========================================================================= 
	//	Back to Top
	// ========================================================================= 
	 
	if ($('.go-top').length) {
    var scrollTrigger = 100, // px
        backToTop = function () {
            var scrollTop = $(window).scrollTop();
            if (scrollTop > scrollTrigger) {
                $('.go-top').addClass('show');
            } else {
                $('.go-top').removeClass('show');
            }
        };
    backToTop();
    $(window).on('scroll', function () {
        backToTop();
    });
    $('.go-top').on('click', function (e) {
        e.preventDefault();
        $('html,body').animate({
            scrollTop: 0
        }, 700);
    });
}
  
  
//Contact Us
  $("#btn_submit").click(function() { 
        //get input field values
        var user_name       = $('input[name=name]').val(); 
        var user_email      = $('input[name=email]').val();
		var user_message    = $('textarea[name=message]').val();
        
        //simple validation at client's end
        var proceed = true;
        if(user_name==""){ 
            proceed = false;
        }
        if(user_email==""){ 
            proceed = false;
        }
		if(user_message=="") {  
            proceed = false;
        }

        //everything looks good! proceed...
        if(proceed) 
        {
            //data to be sent to server
            post_data = {'userName':user_name, 'userEmail':user_email, 'userMessage':user_message};
            
            //Ajax post data to server
            $.post('contact_me.php', post_data, function(response){  

                //load json data from server and output message     
				if(response.type == 'error')
				{
					output = '<div class="alert-danger">'+response.text+'</div>';
				}else{
				    output = '<div class="alert-success">'+response.text+'</div>';
					
					//reset values in all input fields
					$('.form-inline input').val(''); 
					$('.form-inline textarea').val(''); 
				}
				
				$("#result").hide().html(output).slideDown();
            }, 'json');
			
        }
    });
    
    //reset previously set border colors and hide all message on .keyup()
    $(".form-inline input, .form-inline textarea").keyup(function() { 
        $("#result").slideUp();
    });
    

 //Slider Main
  jQuery('.fullscreenbanner').revolution({
			delay:15000,
			startwidth:1170,
			startheight:500,
			hideThumbs:10,
			fullWidth:"off",
			fullScreen:"on",
			shadow:0,
			dottedOverlay:"none",
			fullScreenOffsetContainer: ""      
	 });
  

//Change Diffrent Logos on Nav
  jQuery(window).scroll(function() {
  
	 if (jQuery(window).scrollTop() >= 25) {
		jQuery(".logo > img").attr("src", "images/logo.png");
	 }
	  else {
		jQuery(".logo > img").attr("src", "images/logo-white.png");
	 }
  
  });
   

// Scroll One Page Menu
  $('a.page-scroll, .cbp-spmenu a').on('click', function(event){
        //var $nav_height = $('#navigation.affix').outerHeight();		
		var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1200, 'easeInOutExpo');
       event.preventDefault();;
		$('#navigation').affix({offset: {top: 50} });
		
		
   });



//Facts Counters Home Page
	 $(".number-counters").appear(function () {
		$(".number-counters [data-to]").each(function () {
		  var e = $(this).attr("data-to");
		  $(this).delay(6e3).countTo({
			 from: 50,
			 to: e,
			 speed: 3e3,
			 refreshInterval: 50
		  })
		})
	 });
		  
	 
	
 //FOr Circular Progress show
	 $('.some').appear(function () {
		 $('.myStat2').circliful() 
	 });   
	 

  
//For Testinomial 
	$("#testinomial-slider").owlCarousel({
		  autoPlay : true,
		  navigation : true,
		  slideSpeed : 250,
		  pagination : false,
		  navigationText :["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
		  singleItem:true
	
	 });

  
//For Publication Section(Home Page)
    $("#publication-slider").owlCarousel({
		  autoPlay: true, 
		  pagination : false,
		  navigationText :["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
		  navigation : true,
		  items : 3,
		  itemsDesktop : [1199,3],
		  itemsDesktopSmall : [979,3]
 
  });
  //Paralax Page Slider
	var owl = $("#paralax-slider");
  owl.owlCarousel({
    autoPlay: 3000,
	 navigation : false,
    singleItem : true,
    transitionStyle : "fade"
  });
    
  
	  // portfolio filtering
    $(".project-wrapper").mixItUp();
	 
	 
	 
 // Popup
   $(".fancybox").fancybox({
		openEffect : 'fade',
		closeClick : true,

    });
	 //Video Popup
	 $('.fancybox-media').fancybox({
		openEffect  : 'fade',
		closeEffect : 'none',
		helpers : {
			media : {}
		}
	});
	
	
	//Push Menu on click
	$('.toggle-menu').jPushMenu();
	  $(document).on('click', function () {
        $('.cbp-spmenu-right').removeClass('menu-open');
    });
    $('#menu-toggle').on('click', function (e) {
        e.stopPropagation();
        $('.cbp-spmenu-right').toggleClass('menu-open');
    });
    $('.cbp-spmenu-right').on('click', function (e) {
        e.stopPropagation();
    });

//Parallax effects
$('#bg-paralax ').parallax("50%", 0.3);
$('#testinomial').parallax("50%", 0.2);
$('.text-rotator').parallax("50%", 0.2);


	 
		  //Initiat WOW JS
		 new WOW().init(); 
		 
  
  });
 if(screen.width <720 ){ 
 $('div, img, input, textarea, button, a').removeClass('wow'); // to remove transition
 }