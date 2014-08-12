//copydoc
//=======

// Required Values
// 1. Set servers and datbases
// 2. Set Authentication, if needed
// 3. Set User Ctx Values
var request = require('request');

module.exports = {
	//List of available servers
	servers: {
		"dev":{
		},
		"ref":{
		},
		"prod":{
		}
	},
	
	//Databases on the servers to access
	dbs: {
		"db1":"",
		"db2":""		
	}, 
	
	
	copy: function(data){
	
		//Authentication, Enter your name and password
		var username = 'MYNAME';
		var password = 'MYPASSWORD';
		var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
		
		//From Server: Where are we getting this data from?
		var fromServer = (data.body.cfrom !== '')? data.body.cfrom : this.servers[ data.body.from ][ data.body.serverType ];
		var fromLocation = ( fromServer + "/" + this.dbs[ data.body.serverType ]).split(' ').join('');
		
		//Where are we sending it to
		var toServer = (data.body.cto !== '')? data.body.cto : this.servers[ data.body.to ][ data.body.serverType ]; 
		var toLocation = toServer  + '/_replicator';
		
		//Target Database
		var target = this.dbs[ data.body.serverType ];   
						
		//Setup Headers
		//TODO: Not the best way but works for the time being. 
		// would be great if it was automated somehow or allowed for custome auth values.
		if(!data.body.noauth){
			var headers = {'Content-Type':"application/json", 'Authorization': auth};				
		}else{
			var headers = {'Content-Type':"application/json"};
		}
						
		//Some helpful output
		console.log(fromLocation);	
		console.log(target);
		console.log(toLocation); 
		
		//Start Request
		//Set User_ctx name and roles
		var myObj = {"source":fromLocation, "target": target  , "doc_ids":[data.body.docid], 
						"user_ctx": {
  							"name": "",
								'roles':['']
  	  				}
			}; 
		
		request({
	  				method:"post", 
	  				url:toLocation,	
	  				headers:headers,
	  				body:JSON.stringify(myObj)
	  			}, 
					function (fError, fResponse, fBody) {
  	    		if(fError){
  	    			return console.log("upload failed", fError);			
  	    		}
					  if (!fError && fResponse.statusCode == 200) {
							console.log(fBody.body); 
							return console.log("You did it!, server gave us", fResponse);					
					  }
						console.log(fResponse); 
		})
	
		
		return data.body;
	}
	
}



