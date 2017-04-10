$(document).ready(function() {


	// particlesJS.load('particles-js', 'particlesjs-config.json', function() {
	//   console.log('callback - particles.js config loaded');
	// });


	var renderOptions = {
		antialias: false,
		transparent: false,
		backgroundColor: 0x061639,
		resolution: window.devicePixelRatio,
		autoResize: true
	}


	var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, renderOptions);
	var stage = new PIXI.Container();


	document.body.appendChild(renderer.view);

	renderer.view.style.position = 'absolute';
	renderer.view.style.top = '0px';
	renderer.view.style.left = '0px';

	renderer.autoResize = true;

	window.onresize = resize;
	resize();

		
	stage.interactive = true;
	stage.containsPoint = () => true;

	stage.buttonMode = true;


	// Use Tink to track the cursor
	let t = new Tink(PIXI, renderer.view);

	let pointer = t.makePointer();

	//pointer.cursor = "pointer";


	var nav_height = $('nav.navbar').innerHeight();
	console.log(nav_height);



	// var card = PIXI.Sprite.fromImage('images/Adrian_Burk-1950.jpg');
	// card.y = 0;
	// card.x = 0;
	// card.vx = 0;
	// card.vy = 0;

	// card.scale.set(0.5,0.5);

	// card.interactive = true;
	// card.buttonMode = true;

	// stage.addChild(card);


	// card.on('pointerdown', function() {
	// 	alert('click');
	// }); 




	//Recursively calls itself to constantly render the stage
	requestAnimationFrame(animate);

	function animate() {

		requestAnimationFrame(animate);

		t.update();

		renderer.render(stage);
	}


	var card;

	//padding around the cards
  	var card_padding = 35;


	var loader = PIXI.loader;


	$.getJSON('cards.json', function(data){

		//Track x positioning for cards
		var last_position = 0 + card_padding;

		//for spacing out the rows on the y axis
		var row_number = 0;

		var cards_on_stage = 0;

		var card_heights = [];

		//determine the average height of the cards to determine row spacing
		var avg_card_height;
	

		//Load cards
		$.each(data.cards, function(i, result){

			//Add all images from JSON into loader
			loader.add('images/' + result.image);

		});


		//Loading progress function
		loader.on('progress', loadProgressHandler);

		function loadProgressHandler(loader, resource) {

			//Display the file `url` currently being loaded
			//console.log("loading: " + resource.url); 

			//Display the precentage of the total files currently loaded
			//console.log("progress: " + loader.progress + "%"); 

			//Display errors if they exist
			if(resource.error){
				console.log('An error occured loading the resource: ' + resource.error);
			}

		}


		//Loop through each loaded card and add to stage
		$.each(data.cards, function(i,result){
			
			loader.load(function(){

				//console.log("Current card url: " + result.image);
				//console.log("Current card name: " + result.name);


				//Make Sprite
				card = new PIXI.Sprite(
				  PIXI.loader.resources['images/' + result.image].texture
				);



			  	var player_container = new PIXI.Container();
		 		
	



			  	//Values to scale size of card
			  	var card_scale_x = 0.5;
			  	var card_scale_y = 0.5;


			  	cards_on_stage++;

			  	card_heights.push(card.height * card_scale_y);

			  	var total_card_height = 0;

			  	for(var i=0; i<card_heights.length; i++){

			  		total_card_height += card_heights[i]; 
			  	}

			  	avg_card_height = total_card_height / cards_on_stage;


			  	//Set x and y position
			  	//card.x = last_position + (card.width * card_scale_x / 2); //divide by 2 to account for the anchor being in the center of the card
			  	//card.y = (row_number * avg_card_height) + (row_number * card_padding) + (card.height * card_scale_y / 2) + nav_height + card_padding;
			  	
			  	/* ***************************** */


			  	player_container.x = last_position + (card.width * card_scale_x / 2);;
			 	player_container.y = (row_number * avg_card_height) + (row_number * card_padding) + (card.height * card_scale_y / 2) + nav_height + card_padding;


			  	
			  	// if( card.x + (card.width * card_scale_x / 2) > window.innerWidth * 2 ){

			  	// 	last_position = 0 + card_padding;
			  	// 	row_number++;

			  	// 	card.x = last_position + (card.width * card_scale_x / 2);
			  	// 	card.y = (row_number * avg_card_height) + (row_number * card_padding) + (card.height * card_scale_y / 2) + nav_height + card_padding;
			  		
			  	// }
			  	/* *********************************** */



			  	if( player_container.x + (card.width * card_scale_x / 2) > window.innerWidth * 2 ){

			  		last_position = 0 + card_padding;
			  		row_number++;

			  		player_container.x = last_position + (card.width * card_scale_x / 2);;
			 		player_container.y = (row_number * avg_card_height) + (row_number * card_padding) + (card.height * card_scale_y / 2) + nav_height + card_padding;
			  		
			  	}




			  	//set anchor point to middle of card
			  	card.anchor.set(0.5, 0.5)

			  
				card.scale.set(card_scale_x, card_scale_y);


				//Make card clickable and show the finger on hover
				card.interactive = true;
				card.buttonMode = true;


				//Adjust the x of where next card will be positioned, plus padding
				last_position += card.width + card_padding; 


				//Add card to stage
				//stage.addChild(card); /* ************************** */

				stage.addChild(player_container);
				player_container.addChild(card);
		


				//Show card info when clicked

				var clicked_on = false;

				card.on('pointerdown', function() {

					clicked_on = true;			 		
			 	});

			 	card.on('pointermove', function() {

			 		clicked_on = false;
			 	});

			 	card.on('pointerup', function() {

			 		if(clicked_on){

				 		var stats_string = '';

				 		//Get each of player's stat names and values
			 			$.each(result.stats, function(key, value) {
						    console.log(key, value);

						    stats_string += key + ' - ' + value + '\n';
						});		

						alert('This is: ' + result.name + '\n' + 'He played in: ' + result.year + '\n' + stats_string);	 		

				 	}
			 	});


			 	//white rect beneath card
			 	var card_info = new PIXI.Graphics();


			 	//text in the rect
			 	var player_name_style = new PIXI.TextStyle({
				    fontFamily: 'Arial',
				    fontSize: 18,
				    fontWeight: 'bold',
				    fontVariant: 'small-caps',
				    fill: '#000',
				    wordWrap: true,
				    wordWrapWidth: card.width*1.25
				});

				var player_name = new PIXI.Text(result.name, player_name_style);

			 	
			 	var player_position_style = new PIXI.TextStyle({
				    fontFamily: 'Arial',
				    fontSize: 16,
				    fontVariant: 'small-caps',
				    fill: '#000',
				    wordWrap: true,
				    wordWrapWidth: card.width*1.25
				});

				var player_position = new PIXI.Text(result.position, player_position_style);


			 	card.on('mouseover', function() {

			 		this.scale.set(0.75,0.75);

			 		//Have card show up on top of the other cards (top of the depth index)
			 		//stage.removeChild(this);
			 		//stage.addChildAt(this, stage.children.length);

			 		/* ************************** */

			 		stage.removeChild(this.parent);
			 		stage.addChildAt(this.parent, stage.children.length);



					card_info.beginFill(0xFFFFFF);

					// draw a rectangle
					//                     x              |    y           |   width   | height
					card_info.drawRect(0 - this.width * 0.5, this.height*0.5, this.width, player_name.height + player_position.height + 12 + 10); //70


					//add rectangle
			 		player_container.addChild(card_info);


			 		player_name.x = 0 - this.width*0.5 + 15;
					player_name.y = this.height*0.5 + 10;

					player_position.x = 0 - this.width*0.5 + 15;
					player_position.y = this.height*0.5 + player_name.height + 12;


					//anchor the x in the middle, leave y at top
					//player_name.anchor.set(0.5, 0);


					//add text
					player_container.addChild(player_name);
					player_container.addChild(player_position);


			 	});

			 	card.on('mouseout', function() {

			 		this.scale.set(card_scale_x, card_scale_y);

			 		player_container.removeChild(card_info);

			 		player_container.removeChild(player_name);
			 		player_container.removeChild(player_position);

			 	});
				
			});
			
		});




		// $.each(data.cards, function(i,result){

		// 	console.log(result.name);


		// 	PIXI.loader
		// 	  .add('images/' + result.image)
		// 	  .load(setup);

		// 	function setup() {

		// 		card = new PIXI.Sprite(
		// 		  PIXI.loader.resources["images/" + result.image].texture
		// 		);

		// 	  	console.log(card.width);

		// 	  	console.log( PIXI.loader.resources[0].texture );

		// 	  	card.y = 0;
		// 		card.x = last_position;
		// 		card.interactive = true;
		// 		card.buttonMode = true;

		// 		last_position = card.width + 20;
		// 	}

		// 	stage.addChild(card);


		// 	// card = PIXI.Sprite.fromImage('images/' + result.image);
		// 	// card.y = 0;
		// 	// card.x = last_position;
		// 	// card.vx = 0;
		// 	// card.vy = 0;

		// 	// card.scale.set(0.5,0.5);

		// 	// card.interactive = true;
		// 	// card.buttonMode = true;

		// 	// stage.addChild(card);

		// 	card.on('pointerdown', function() {
		// 		alert('This is: ' + result.name + '\n' + 'He played in: ' + result.year);
		// 	}); 

	

		// });



	}); //END JSON



	//To reset the loader to load a new batch of files
	//PIXI.loader.reset();



	//Stage interactivity


	var first_x, first_y, next_x, next_y, x_difference, y_difference;


	var rect = new PIXI.Rectangle;
	var left_limit, right_limit, top_limit, bottom_limit;


	// stage.on('mousemove', function(){

	// 	pointer.cursor = 'move';

	// });


	stage.on('pointerdown', function(event){

		if (!this.dragging) {

			// && event.target.pluginName != 'sprite'


	  		this.dragging = true;

	  		// console.log( renderer.plugins.interaction.mouse.global.x );

	  		// first_x = renderer.plugins.interaction.mouse.global.x;
	  		// first_y = renderer.plugins.interaction.mouse.global.y;
	  		first_x = pointer.x;
	  		first_y = pointer.y;


	  		if(!left_limit && !right_limit && !top_limit && !bottom_limit){

		  		left_limit = stage.getBounds(rect).left - card_padding;
				right_limit = stage.getBounds(rect).right + card_padding;

				top_limit = stage.getBounds(rect).top - card_padding - nav_height;
				bottom_limit = stage.getBounds(rect).bottom + card_padding;

				//if the rows of cards do not go all the way to the bottom, set the bottom limit as the bottom of the window
				if(bottom_limit < window.innerHeight){
					bottom_limit = window.innerHeight;
				}

				console.log('left limit: ' + left_limit + '\n right limit: ' + right_limit);
				console.log('top limit: ' + top_limit + '\n bottom limit: ' + bottom_limit);
			}
	  		
    	}

	});

	stage.on('pointermove', function(){

		if (this.dragging) {

			//Change x position
	        //next_x = renderer.plugins.interaction.mouse.global.x;
	        next_x = pointer.x;

	        //get the difference between the last point and the point the pointer just moved to
	        x_difference = first_x - next_x;


	        
	        //only move stage if its between left and right limits
	        if(this.x <= left_limit && this.x >=  window.innerWidth - right_limit){

	        	//move the stage according to how much the pointer was moved
	        	this.x -= x_difference;
    		}
    		
    		//send it back to left limit if it goes over
    		if(this.x > left_limit) {
    			
    			this.x = left_limit;
    		}

    		//send it back to right limit if it goes over
    		if(this.x < window.innerWidth - right_limit){

    			this.x = window.innerWidth - right_limit;
    		}


    		//Set the x position for the next time the pointer is moved
	        first_x = next_x;



	        //Change y position
	        //next_y = renderer.plugins.interaction.mouse.global.y;
	        next_y = pointer.y;

	        //get the difference between the last point and the point the pointer just moved to
	        y_difference = first_y - next_y;





	        //only move stage if its between top and bottom limits
	        if(this.y <= top_limit && this.y >=  window.innerHeight - bottom_limit){

	        	//move the stage according to how much the pointer was moved
	        	this.y -= y_difference;
    		}
    		
    		//send it back to top limit if it goes over
    		if(this.y > top_limit) {
    			
    			this.y = top_limit;
    		}

    		//send it back to bottom limit if it goes over
    		if(this.y < window.innerHeight - bottom_limit){

    			this.y = window.innerHeight - bottom_limit;
    		}



	        //Set the y position for the next time the pointer is moved
	        first_y = next_y;

	    }

	});

	stage.on('pointerup', function(){

		if (this.dragging) {

	        this.dragging = false;

	    }

	});




	function resize() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		// renderer.view.style.width = w + 'px';
		// renderer.view.style.height = h + 'px';

		renderer.resize(w, h)
	}


	render();

	function render(){
		renderer.render(stage);
	}

});