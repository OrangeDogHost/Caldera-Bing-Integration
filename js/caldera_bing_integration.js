$(document).on('cf.form.init', function(event, data){

		/**
	 The object in the variable data has the following keys:
	 
		 //idAttr - The form's ID attribute
		 idAttr: form_id,
		 //formId - The forms's ID
		 formId: formId,
		 //state -the form's state object
		 state: state,
		 //fieldIds the ids of all field
		 fieldIds: CFFIELD_CONFIG[instance].fields.hasOwnProperty('ids') ? CFFIELD_CONFIG[instance].fields.ids : []
	 */
		//Checks that form is the booking form
		 if('CF5e6ff5ed91500' === data.formId){
		 	//User input wait timer
			var apiTimer;

			//Workshop address
			var workshopLocation = "37 Cape Street Perth";

			//Customers vehicle location.
			var customerVehicleAddress;

			//Travel time description
			var travelTimeMinutes;

			//Grabs the form state
			var state = data.state;

			//Grabs field based on placeholder 'Address of vehicle'.
			//This is user input field
			var addressFieldID = $("[placeholder='Address of vehicle']").attr('id');

			//Get field id based on class 'minutes_to_travel'
			//This is computer output field
			var travelTimeFieldID = $('.minutes_to_travel').attr('data-field-wrapper');

			//Subcribes to key presses on the addressField
			state.events().subscribe(addressFieldID, function(value,fieldId){
				//Address field input triggered, clearing timeout.
				clearTimeout(apiTimer);

				apiTimer = setTimeout(function(){

					console.log("Five seconds has passed, grabbing user input.");

					//Grabbing address from Caldera field.
					customerVehicleAddress = data.state.getState(addressFieldID);


					//Bing API request begin.
					$.get("https://dev.virtualearth.net/REST/v1/Routes/Driving",{
						//Company Address
						"wayPoint.1":workshopLocation,
						"wayPoint.2":customerVehicleAddress,
						"key":"AlVpf6djJ1c16hjkWo3O3A4iByw2nnU6ZjbdXfENdjWcVgPpnPLv-3b_HGwZ144N"		
						},
						//This function is run when the data is returned from BingAPI
						function(data,textStatus,jqXHR){
							if(data.authenticationResultCode === 'ValidCredentials'){
								console.log("BingAPI authentication successful");
							}else{
								console.log("BingAPI authentication failed, warning user.");
								//TODO add user warning
							}


							//Grabbing main resources
							var bingResources = data.resourceSets[0].resources[0];

							console.log("Bing raw output: ");
							console.log(data);

							//Converts seconds to minutes and rounds down and adds one. E.g. 65 seconds becomes 2 minutes
							travelTimeMinutes = Math.floor(bingResources.travelDurationTraffic/60);
							console.log("travelTimeMinutes: "+travelTimeMinutes);

							//Writes data to caldera
							if(travelTimeMinutes !== undefined){
								console.log("Bing request successful, printing to caldera");
								
								//Setting Caldera Value to travel time
								//TODO this doesn't seem to work, caldera doesn't update the calculation field.
								state.mutateState(travelTimeFieldID,travelTimeMinutes);

								//Janky jQuery set that still doesn't have a fix
								$("[data-field="+travelTimeFieldID+"]").val(travelTimeMinutes);
							}else{
								console.log("Bing request unsuccessful, warning user.");
								//TODO add user warning
							}
						}//end of BingAPI returned function.
					);//Bing API request over

				},5000);

			});//Address field active ends

		 }
});