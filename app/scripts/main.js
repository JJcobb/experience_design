$(document).ready(function() {


	var renderOptions = {
		antialias: false,
		transparent: false,
		resolution: window.devicePixelRatio,
		autoResize: true
	}


	var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, renderOptions);
	var stage = new PIXI.Container();

	document.body.appendChild(renderer.view);

	renderer.view.style.position = "absolute";
	renderer.view.style.top = "0px";
	renderer.view.style.left = "0px";

	renderer.autoResize = true;

	window.onresize = resize;
	resize();

		

	stage.interactive = true;
	stage.containsPoint = () => true;




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

		renderer.render(stage);
	}


	var card;

	var loader = PIXI.loader;


	$.getJSON('cards.json', function(data){

		//Track x positioning for cards
		var last_position = 0;
	

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
				console.log("An error occured loading the resource: " + resource.error);
			}

		}


		//Loop through each loaded card and add to stage
		$.each(data.cards, function(i,result){
			
			loader.load(function(){

				//console.log("Current card url: " + result.image);
				//console.log("Current card name: " + result.name);


				//Make Sprite
				card = new PIXI.Sprite(
				  PIXI.loader.resources["images/" + result.image].texture
				);


			  	//console.log("Current card width: " + card.width);


			  	//Values to scale size of card
			  	var card_scale_x = 0.5;
			  	var card_scale_y = 0.5;


			  	//Set x and y position
			  	card.x = last_position + (card.width * card_scale_x / 2);
			  	card.y = 0 + (card.height * card_scale_y / 2);

			  	//can also do:
			  	//card.position.set(x, y)


			  	//set anchor point to middle of card
			  	card.anchor.set(0.5, 0.5)

			  
				card.scale.set(card_scale_x, card_scale_y);


				//Make card clickable and show the finger on hover
				card.interactive = true;
				card.buttonMode = true;


				//Adjust the x of where next card will be positioned, plus padding
				last_position += card.width + 10; 


				//Add card to stage
				stage.addChild(card);


				//Show card info when clicked
				card.on('pointerdown', function() {
			 		alert('This is: ' + result.name + '\n' + 'He played in: ' + result.year);
			 	});


			 	card.on('mouseover', function() {

			 		this.scale.set(0.75,0.75);

			 		stage.removeChild(this);
			 		stage.addChildAt(this, stage.children.length);

			 	});

			 	card.on('mouseout', function() {

			 		this.scale.set(0.5,0.5);

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
	var left_limit, right_limit;


	stage.on('pointerdown', function(event){

		if (!this.dragging) {

	  		this.dragging = true;

	  		// console.log( renderer.plugins.interaction.mouse.global.x );

	  		first_x = renderer.plugins.interaction.mouse.global.x;
	  		first_y = renderer.plugins.interaction.mouse.global.y;


	  		left_limit = stage.getBounds(rect).left;
			right_limit = stage.getBounds(rect).right;

			console.log(left_limit + " " + right_limit);
	  		
    	}

	});

	stage.on('pointermove', function(){

		if (this.dragging) {

			//Change x position
	        next_x = renderer.plugins.interaction.mouse.global.x;

	        x_difference = first_x - next_x;



	        //if(this.x > left_limit){

	        	this.x -= x_difference;
    		//}

    		// (this.x + window.innerWidth) < right_limit




	        first_x = next_x;


	        //Change y position
	        next_y = renderer.plugins.interaction.mouse.global.y;

	        y_difference = first_y - next_y;

	        this.y -= y_difference;

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