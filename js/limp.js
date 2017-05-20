"use strict";
function limp(script) {

	console.log(script.toString());
	switch (typeof script) {
		default: // string, number, boolean
			script = script.toString().trim();
			console.log("TYPE: 1string, 2number or 3boolean");
			break;
		case "null":
			console.log("TYPE: 4null");
			break;
		case "undefined":
			console.log("TYPE: 5undefined");
			break;
		case "function":
			console.log("TYPE: 6function");
			break;
		case "object":
			console.log("TYPE: 7object");
			break;
	}

	return "Limp done";
}

function limpLexer(text) {
	text = text.toString();
	var branches = text.split(/\s+/); //any whitespace with one or more repetitions
	var branchIndex = 0;
	limpLexer.nextBranch = function() {
		if (branchIndex >= branches.length) {
			console.log(null);
		} else {
			console.log(branches[branchIndex++]);
		}
	}
}

// function scratchLexer(text) {
// 	var words = text.split(/\s+/); //any whitespace with one or more repetitions
// 	var next = 0;
// 	this.nextWord = function() {
// 		if (next >= words.length) return null;
// 		return words[next++];
// 	}
// }
//
// function scratch() {
// 	var dictionary = {};
//
// 	this.stack = [];
//
// 	this.addWords = function(newDict) {
// 		for (var word in newDict)
// 			dictionary[word.toUpperCase()] = newDict[word];
// 	}
//
// 	this.run = function(text) {
// 		var lexer = new scratchLexer(text);
// 		var word;
// 		var numVal;
//
// 		while (word = lexer.nextWord()) {
// 			word = word.toUpperCase();
// 			numVal = parseFloat(word);
// 			if (dictionary[word]) {
// 				dictionary[word](this);
// 			} else if (!isNaN(numVal)) {
// 				this.stack.push(numVal);
// 			} else {
// 				throw "Unknown word";
// 			}
// 		}
// 	}
// }
