 
 
 var view = {
	 
	 // this method takes a string message and displays it
	 // in the message display area
	 displayMessage: function(msg) {
		 var messageArea = document.getElementById("messageArea");
		 messageArea.innerHTML = msg;
	 },
	 
	 displayHit: function(location) {
		 var cell = document.getElementById(location);
		 cell.setAttribute("class", "hit");
	 },
	 
	 displayMiss: function(location) {
		 var cell = document.getElementById(location);
		 cell.setAttribute("class", "miss");
	 }
 };
 
 
 var model = {
	 boardSize: 7,
	 numShips: 3,
	 shipLength: 3,
	 shipsSunk: 0,
	 
	 ships:  [{ locations: [0, 0, 0], hits: ["", "", ""] },
			  { locations: [0, 0, 0], hits: ["", "", ""] },
		      { locations: [0, 0, 0], hits: ["", "", ""] }],
			  
	fire: function(guess) {
		
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			locations = ship.locations;
			
			var index = locations.indexOf(guess);
			if (index >= 0) {	// if the location is not in the index, a -1 will be returned
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");
				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("Miss!");
		return false;
	},
	
	
	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},
	
	
	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) { // generate locations for the number of ships specified above
			do {
				locations = this.generateShip();
			} while (this.collision(locations)); // if there is a collision, keep generating locations
			this.ships[i].locations = locations;
		}
	},
	
	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;
		
		if (direction === 1) { // 1 being horizontal
			row = Math.floor(Math.random() * this.boardSize); // which is from 0 to 7 (A to G)
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength)); // this can only be from 0-4 since the shipLength is 3 (so it fits on the board)
		} else {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		}
		
		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i)); 
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},
	
	
	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = model.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) { // check generated locations; if the index is -1 then there is no match
					return true;								 // but if the index is >= 0 then it means there is a match (collision)
				}
			}
		}
		return false;
	}
	 
 };
 
 
 
 
 
 
 
 
var controller = {
	guesses: 0,
	

	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk == model.numShips) {
				view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
			}
		}

	}
};



 function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Please enter a valid format (Letter and Number");
	} else {
		firstChar = guess.charAt(0); // Grabs the first character
		var row = alphabet.indexOf(firstChar); // Determine value of char using alphabet list's index 
		var column = guess.charAt(1); // Grab the second character
		
		if (isNaN(row) || isNaN(column)) {
			alert("Invalid entry. Not found on board.");
		} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
			alert("Invalid entry. Out of bounds on the board.");
		} else {
			return row + column;
		}
	}
	return null;
}
 



function handleFireButton() {
	// get the player's guess from the form and send it to the controller
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess); // pass the guess to the controller to validate it

	guessInput.value = ""; // this resets the value in the input so the user doesn't have to delete it
}


function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13) { // keyCode 13 is the Return/Enter key
		fireButton.click(); // so when we see a 13 pressed, we will simulate a click 
		return false;
	}
}



function init() {
	var fireButton = document.getElementById("fireButton"); // get button's ID
	fireButton.onclick = handleFireButton; // Add a click handler function to the button
	
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress; // This handles key press events from HTML input field
	
	model.generateShipLocations(); // immediately generate ship locations 
}



window.onload = init;


/*console.log(controller.processGuess("A0"));
 
console.log(controller.processGuess("B0"));
console.log(controller.processGuess("C0"));
console.log(controller.processGuess("D0"));

console.log(controller.processGuess("D2"));
console.log(controller.processGuess("D3"));
console.log(controller.processGuess("D4"));

console.log(controller.processGuess("G3"));
console.log(controller.processGuess("G4"));
console.log(controller.processGuess("G5"));*/

/*view.displayMiss("00");
view.displayHit("34");
view.displayMessage("yo dawg"); */





