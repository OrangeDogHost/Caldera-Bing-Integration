jQuery(document).on('cf.form.init', function(event, data){

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
			var addressFieldID = jQuery("[placeholder='Address of vehicle']").attr('id');

			//Get field id based on class 'minutes_to_travel'
			//This is computer output field
			var travelTimeFieldID = jQuery('.minutes_to_travel').attr('data-field-wrapper');

			//Travel description box (used for errors and notifying travel time and distance on success
			 var travel_time_description;

			//Subcribes to key presses on the addressField
			state.events().subscribe(addressFieldID, function(value,fieldId){
				//Address field input triggered, clearing timeout.
				clearTimeout(apiTimer);

				apiTimer = setTimeout(function(){

					console.log("Five seconds has passed, grabbing user input.");

					//Grabbing address from Caldera field.
					customerVehicleAddress = data.state.getState(addressFieldID);


					//Bing API request begin.
					jQuery.get("https://dev.virtualearth.net/REST/v1/Routes/Driving",{
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
							}


							//Grabbing main resources
							var bingResources = data.resourceSets[0].resources[0];

							console.log("Bing raw output: ");
							console.log(data);

							//Converts seconds to minutes and rounds down and adds one. E.g. 65 seconds becomes 2 minutes
							travelTimeMinutes = Math.floor(bingResources["travelDurationTraffic"]/60);
							console.log("travelTimeMinutes: "+travelTimeMinutes);

							//Writes data to caldera
							if(travelTimeMinutes !== undefined){
								console.log("Bing request successful, printing to caldera");
								
								//Setting Caldera Value to travel time
								state.mutateState(travelTimeFieldID,travelTimeMinutes);

								//Janky jQuery set that still doesn't have a fix
								console.log("Setting "+travelTimeFieldID+" to "+travelTimeMinutes);
								jQuery("[data-field="+travelTimeFieldID+"]").val(travelTimeMinutes);

								//Trip description.
								travel_time_description = "<h4>Found address! This trip will take "+travelTimeMinutes+" minutes.</h4>";
								//Trigger input to cause Caldera to recalculate
								jQuery(document).trigger('cf.add');


							}else{
								console.log("Bing request unsuccessful, warning user.");

								travel_time_description = "<h4 class='error_message'>Request failed, please check the address and try again.</h4>";
								//TODO get bing error status and print to page
								//TODO add user warning for invalid address
							}
						}//end of BingAPI returned function.
					)//Bing API request over
					.fail(function(){
							travel_time_description = "<h4 class='error_message'>Bing Maps API request failed, please check your address or contact website administrator.</h4>";
						});

					//Sets time_travel_description html to content of variable.
					console.log('Printing to HTML')
					jQuery ('.travel_time_description').html(travel_time_description);
				},5000);

			});//Address field active ends

		 }
});