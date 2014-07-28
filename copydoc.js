//copydoc
//=======
var request = require('request');

module.exports = {
	//Set your dev/ref/prod or other commmon servers
	// TODO: Remove int/ext reference as they don't apply to global usage
	servers: {
		"dev":{
			"int":"",
			"ext":""
		},
		"ref":{
			"int":"",
			"ext":""
		},
		"prod":{
			"int":"",
			"ext":""
		}
	},
	
	dbs: {
		"int":"",
		"ext":""		
	}, 
		
	copy: function(data){
	

		//From Server: Where are we getting this data from?
		var fromServer = (data.body.cfrom !== '')? data.body.cfrom : this.servers[ data.body.from ][ data.body.serverType ];
		var fromLocation = ( fromServer + "/" + this.dbs[ data.body.serverType ]).split(' ').join('');
		
		//Where are we sending it to
		var toServer = (data.body.cto !== '')? data.body.cto : this.servers[ data.body.to ][ data.body.serverType ]; 
		var toLocation = toServer  + '/_replicate';
		
		//Target Database
		var target = this.dbs[ data.body.serverType ];   
				
		//Authentication
		var username = '';
		var password = '';
		var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
								
		//Setup Auth Headers
		if(!data.body.noAuth){
			var headers = {'Content-Type':"application/json", 'Authorization': auth}				
		}else{
			var headers = {'Content-Type':"application/json"}	
		}
		
		//Start Request
		request({url:fromServer}, function (fError, fResponse, fBody) {
		  if (!fError && fResponse.statusCode == 200) {
			  			
			console.log(fBody);
			
			var myObj = {"source":fromLocation, "target": target  , "doc_ids":[data.body.docid]}; 
			 
	  	    request(
	  			{
	  				method:"post", 
	  				url:toLocation,	
	  				headers:headers,
	  				body:JSON.stringify(myObj)

	  			}, 
	  			function (tErr, tResponse, tBody){
	  				console.log(tResponse.request);
	  	    		if(tErr){
	  	    			return console.log("upload failed", tErr);
	  	    		}
	  				return console.log("You did it!, server gave us", tBody);
	  	    });
			
	  	    request(
	  			{
	  				method:"post", 
	  				url:toLocation,	
	  				headers:headers,
	  				body:JSON.stringify(myObj)
	  			}, 
	  			function (tErr, tResponse, tBody){
	  				console.log(tResponse.request);
	  	    		if(tErr){
	  	    			return console.log("upload failed", tErr);
	  	    		}
	  				return console.log("You did it!, server gave us", tBody);
	  	    });
		
			
		  }
		})
		

		
		return data.body;
	}
	
}



