"use strict";
(function(w,d,$){

	$(function(){

		var copydocform = $('#copydocform');
		copydocform.submit(copydoc);
		function copydoc(e){
			e.preventDefault();
			console.log(copydocform.serialize());
			$.post('/copy', copydocform.serialize(), function(data){
				
			});
		}


	});


}(window,document,window.jQuery));