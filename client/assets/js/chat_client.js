$(document).ready(function(){
	var username;
	$("#chat_div").hide();	
	$("#join_btn").on("click",function(){
		username = $("#user_name").val();
		$("#join_div").slideUp();		
		$("#chat_div").slideDown();		
	});	
	
	var sock = new SockJS("http://localhost:9999/codalochat");
	sock.onopen = function(){};
	
	sock.onclose = function(){};
	
	sock.onmessage = function(e){
		var content = JSON.parse(e.data);
		$old_content = $("#chat_content").html();
		$new_line = "";
		$new_line += "<li class=\"list-group-item\">";
		$new_line += "	<h4 class=\"list-group-item-heading\">"+content.username;
		$new_line +="     <small><span class=\"pull-right label label-default\">"+content.date_time+"</span></small></h4>";
		$new_line += "	<p class=\"list-group-item-text\">";
		$new_line += 	content.message;
		$new_line += "  </p>";						  
		$new_line += "</li>";	
		$("#chat_content").html($old_content+$new_line);
	};
	
	
	$("#chat_btn").on("click",function(){
		var message = $("#user_message").val();
		$("#user_message").val("");
		$("#user_message").focus();
		var send_data = {username: username, message: message};		
		//alert(send_data.username+send_data.message);
		sock.send(JSON.stringify(send_data));		
	});
	
});