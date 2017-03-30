$(document).ready(function() {


	var renderOptions = {
		antialiasing: false,
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

	window.onresize = resize;
	resize();

		

	stage.interactive = true;
	stage.containsPoint = () => true;


	var card = PIXI.Sprite.fromImage('images/Adrian_Burk-1950.jpg');
	card.y = 0;
	card.x = 0;
	card.vx = 0;
	card.vy = 0;

	card.scale.set(0.5,0.5);

	card.interactive = true;
	card.buttonMode = true;

	stage.addChild(card);




	requestAnimationFrame(animate);
		function animate() {
		requestAnimationFrame(animate);
		// card.x += card.vx;
		// card.y += card.vy;
		renderer.render(stage);
	}



	card.on('pointerdown', function() {
		alert('click');
	}); 




	$.getJSON('cards.json', function(data){

		var last_position = 0;



		var loader = PIXI.loader;

		$.each(data.cards, function(i,result){

			loader.add('images/' + result.image);
		});

		$.each(data.cards, function(i,result){

			loader.load(function(){

				console.log("Current card url: " + result.image);
				console.log("Current card name: " + result.name);

				card = new PIXI.Sprite(
				  PIXI.loader.resources["images/" + result.image].texture
				);

			  	console.log("Current card width: " + card.width);

			  	card.y = 0;
				card.x = last_position;

				card.scale.set(0.5,0.5);

				console.log(result.name + " should be positioned at x = " + card.x);

				card.interactive = true;
				card.buttonMode = true;

				last_position += card.width + 10; //Where next one will be positioned, plus padding

				stage.addChild(card);

				card.on('pointerdown', function() {
			 		alert('This is: ' + result.name + '\n' + 'He played in: ' + result.year);
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

	});



	

	function resize() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		renderer.view.style.width = w + 'px';
		renderer.view.style.height = h + 'px';
	}

	render();

	function render(){
		renderer.render(stage);
	}

});