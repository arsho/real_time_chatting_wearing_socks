var http = require("http");
var sockjs = require("sockjs");

var user_list = {};

function add_zero_prefix(pass_val){
	return (pass_val<10?"0":"")+pass_val;
}

function get_date_time(){
	var server_date = new Date();
	var server_hour = server_date.getHours();	
	var server_am_pm = (server_hour>=12)?"PM":"AM";
	server_hour = server_hour % 12;
	server_hour = server_hour == 0?12:server_hour; 
	server_hour = add_zero_prefix(server_hour);
	var server_min = add_zero_prefix(server_date.getMinutes());
	var server_year = server_date.getFullYear();
	var server_month = add_zero_prefix(server_date.getMonth()+1);
	var server_day = add_zero_prefix(server_date.getDate());
	var date_time_string = "<i class=\"fa fa-clock-o\"></i> "+server_hour+":"+server_min+server_am_pm+"&nbsp;&nbsp;&nbsp;<i class=\"fa fa-calendar\"></i> "+server_day+"/"+server_month+"/"+server_year;
	return date_time_string;
}

function broadcast(message){
	for(var user in user_list){
		user_list[user].write(JSON.stringify(message));
	}
}

var chat = sockjs.createServer();
chat.on("connection",function(conn){
	user_list[conn.id] = conn;
	conn.on("data", function(message){
		parsed_message = JSON.parse(message);
		parsed_message["date_time"] = get_date_time();
		broadcast(parsed_message);
	});
	conn.on("close",function(){
		delete user_list[conn.id];
	});
});

var node_server = http.createServer();
chat.installHandlers(node_server,{prefix:'/codalochat'});
node_server.listen(9999,'0.0.0.0');