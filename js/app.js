//The following code is used as means of example to enable the interface to come alive
//By no means when you look at this code take it too seriously, it's basically a bunch of jQuery queries

$(function() {
    var users = [
    {
        avatar: "img/avatar2.jpg",
        name: "Steve bolhman"
    }, 
    {
        avatar: "img/avatar3.jpg",
        name: "Jeff griffis"
    }, 
    {
        avatar: "img/avatar4.jpg",
        name: "Cody blagg"
    },	
    {
        avatar: "img/avatar5.jpg",
        name: "Curtis uyemoto"
    }, 
    {
        avatar: "img/avatar6.jpg",
        name: "Steph bolh"
    }, 
    {
        avatar: "img/avatar7.jpg",
        name: "Eric greenwood"
    }, 
    {
        avatar: "img/avatar8.jpg",
        name: "Jacob blagg"
    }, 
    {
        avatar: "img/avatar9.jpg",
        name: "Allisa griffis"
    }, 
    {
        avatar: "img/avatar10.jpg",
        name: "Johnny Rock"
    }];

    var messages = ["Hey there!", 
    "this is great, but we'll see what happens", 
    "How's your family?", 
    "Do you have any new stories?", 
    "I'm doing alright, how about you?",
    "OK, hold on a second...",
    "Let's talk later, I'm in the middle of something, sorry",
    "Gators are awesome!"];
    
    var help = ["Enable your microphone with the microphone action button in the toolbar", 
    "Enable chat transcripts with the history action in the toolbar"];
    
    //Ajax events
    $(document).on("click", ".contact", setContact);
    $(document).on("click", "#send", sendMessage); 
    $(document).on("click", ".icon-trash", deleteContact);
    
    //Ready events
    $("#user-text").focus();
    $("[rel='tooltip']").tooltip();
    
    //Load templates
    $.Mustache.load('./tpl/chat.tpl.htm').done(function () {
        loadContacts(users);               
        $("#contacts :first").trigger("click");
    });
    
    
    //Set active menu items
    $("#menu li").click(function() {
        if (!$(this).hasClass("dropdown") && !$(this).parent().hasClass("dropdown-menu")) {
            $(this).toggleClass("active");
            if ($(this).hasClass("mic-enable")) {                
                $("#status-bar").text($(this).hasClass("active") ? 
                "Your microphone is now enabled" : "Your microphone is now disabled")
            }
            if ($(this).hasClass("history-enable")) {                
                $("#status-bar").text($(this).hasClass("active") ? 
                "Your chat history is now enabled for this conversation" : "Your chat history is now disabled for this conversation")
            }
        }
    });
    
    //Search query
    $("#search-button").click(function() {        
        var query = $("#search-input").val();
        var contacts = findContacts(query);
        loadContacts(contacts);
    });
    
    //Update on user typing
    $("#user-text").keypress(function(e) {
        $("#status-bar").text("You're typing a message...");
        if(e.keyCode==13){
        	// Enter pressed... do anything here...
        	$("#send").trigger("click");
    	}
    });
    
    //Set status
    $("#status-menu li > a").click(function() {
        $("#current-status").html($(this).html() + "<b class='caret''></b>");
    });
    
    //History tab
    $("#history-tab").click(function() {        
        $("#search-input").attr("placeholder", "Search chat history...");
        $("#search-input").val("");
        $("#contacts-tab").parent("li").removeClass("active");
        $(this).parent("li").addClass("active");
        $("#add-contact").hide();
        var copy = $.extend(true, [], users);
        loadContacts(copy.splice(0, 3));
    });
    
    //Contacts tab
   $("#contacts-tab").click(function() {       
       $("#search-input").attr("placeholder", "Search for contacts...");
       $("#search-input").val("");
       $("#history-tab").parent("li").removeClass("active");
       $(this).parent("li").addClass("active");
       $("#add-contact").fadeIn();
       loadContacts(users);               
       $("#contacts :first").trigger("click");
   });
   
   //Adding contact action
   $("#add-contact").click(function() {
        $("#new-contact-name").val("");
       $('#myModal').modal('show');
   });
   
   //Save contact
   $("#modal-save").click(function() {      
       var newContact = {
           avatar: "img/avatar99.png",
           name: $("#new-contact-name").val() ? $("#new-contact-name").val() : "New Contact"
       }
       
       $('#contacts').mustache('contact', newContact, { method: 'prepend' });
   });
   
    
    function loadContacts(contacts) {
        $("#contacts").empty();
        for (var i=0; i<contacts.length; i++) {
            $('#contacts').mustache('contact', contacts[i]);
        }
    }
        
    function findContacts(query) {
        //Here you need to find users, perhaps a REST call
        var copy = $.extend(true, [], users);
        return copy.splice(0, 2);
    }
    
    function setContact() { 
        $("#user-text").val("");
        $('#messages').empty();
        $("#contacts > .contact").removeClass("active");       
        $(this).addClass("active");
        var nicknameNode = $(this).find(".nickname")[0];
        $("#chat-title").text($(nicknameNode).text());
        
        if ($("#history-tab").parent("li").hasClass("active")) {
            for (var i=0; i<5; i++) {                
                addBubble(true, messages[Math.floor(Math.random() * 333 % messages.length)]);
                addBubble(false, messages[Math.floor(Math.random() * 333 % messages.length)]);
            }
        }
    }
    
    function sendMessage() {
        addBubble(true, $("#user-text").val());
        $("#user-text").val("");
        $("#status-bar").text("Contact is typing a message...");
        setTimeout(function() {
            addBubble(false, messages[Math.floor(Math.random() * 333 % messages.length)], true);
        }, 1000);
    }
    
    function addBubble(left, text, animated) {
        var contactNode = $("#contacts > .contact.active"),
            data = {
            avatar: left ? "img/avatar1.jpg" : $($(contactNode).find(".avatar")[0]).attr("src"),
            name: left ? "Javier Figueroa" : $($(contactNode).find(".nickname")[0]).text(),
            message: text,
            time: moment().format()  
        };
        
        $('#messages').mustache(left ? 'message-left' : 'message-right', data);
        $("#chat").animate({ scrollTop: $('#messages').height()}, animated ? 1500 : 0);
        $("#status-bar").text(help[Math.floor(Math.random() * 333 % help.length)]);
    }
    
    function deleteContact() {        
        if (!$("#alert").html()) {
            $('#alert').mustache('delete-alert');
        
            $(".chat-alert-yes").click(function() {                
                $(".alert").alert('close');
                var contactNode = $("#contacts > .contact.active");
                $(contactNode).fadeOut();
                $(contactNode).remove();
            });
        }
    }
});