"use strict";
var limpErrors = {
	"u01": "Invalid JavaScript data type passed to limp(). Expected string, number or boolean."
}

// console.error(message);
// console.log(message);
// console.warn(message);
// console.info(message);

function limpLogger(type, msg) {
	var html = document.createElement("div");
	var attr = document.createAttribute("class");
	attr.value = "limp--item";
	html.setAttributeNode(attr);
	html.innerHTML = `<div class="limp--label limp--label-${type}">${type}</div>
	<p class="limp--msg">${msg}</p>`
	document.querySelector(".limp--log").appendChild(html);

	if (type == "err") {
		console.error("[limp] "+msg);
	} else if (type == "log") {
		console.log("[limp] "+msg);
	}
}

function limp(script) {
	function limpError(code) {
		limpLogger("err", code+": "+limpErrors[code]);
	}
	function limpLog(msg) {
		limpLogger("log", msg);
	}

	if (typeof script !== "string" && typeof script != "number" && typeof script != "boolean") { // if script is not str/num/bool
		return limpError("u01");
	} // continue if script is is str/num/bool
	script = script.toString().trim();
	limpLog(script);
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
