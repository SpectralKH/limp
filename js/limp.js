"use strict";
var limpErrors = {
	"u01": "Invalid JavaScript data type passed to limp(). Expected string.",
	"u02": "Invalid JavaScript data type passed to limp(). Expected string."
}

// console.error(message);
// console.log(message);
// console.warn(message);
// console.info(message);

function limpLog(type, msg) {
	var html = document.createElement("div");
	var attr = document.createAttribute("class");
	attr.value = "limp--item";
	html.setAttributeNode(attr);
	html.innerHTML = `<div class="limp--label limp--label-${type}">${type}</div>
	<p class="limp--msg">${msg}</p>`
	document.querySelector(".limp--log").appendChild(html);

	if (type == "err") {
		console.error("[limp] "+msg);
	} else if (type == "inf") {
		// console.log("[limp] "+msg);
	}
}

function limp(script) {
	var words = script.trim().match( /[^\s"]+|"[^"]*"/g ); // trim & split into array where there is whitespace, except in quotes

	var currentWord, currentType, wordsType = [];
	for (var wordIndex = 0; wordIndex < words.length; wordIndex++) { // loop through words array
		currentWord = words[wordIndex];
	// IF NUMBER
		if (/(^\d*$|^\d*\.\d+$)/.test(currentWord)) {

			limpLog("inf", "[numb] "+currentWord);
			currentType = wordsType[wordIndex];

	// IF BOOLEAN
		} else if (currentWord == "true" || currentWord == "false") {

			limpLog("inf", "[bool] "+currentWord);

	// IF STRING (starts & ends with ")
		} else if ( /^".*"$/.test(currentWord) ) {

			limpLog("inf", "[strn] "+currentWord);

	// IF OPERATOR (+ - * / % ++ --)
		} else if ( /^[+\-*/%]$|^[+-]{2}$/.test(currentWord) ) {

			switch (currentWord) {
				case "+":
					limpLog("inf", parseFloat(words[wordIndex-1])+parseFloat(words[wordIndex+1]))
					break;
				case "-":
					limpLog("inf", parseFloat(words[wordIndex-1])-parseFloat(words[wordIndex+1]))
					break;
				case "*":
					limpLog("inf", parseFloat(words[wordIndex-1])*parseFloat(words[wordIndex+1]))
					break;
				case "/":
					limpLog("inf", parseFloat(words[wordIndex-1])/parseFloat(words[wordIndex+1]))
					break;
				case "%":
					limpLog("inf", parseFloat(words[wordIndex-1])%parseFloat(words[wordIndex+1]))
					break;
				case "++":
					limpLog("inf", parseFloat(words[wordIndex-1])+1)
					break;
				case "--":
					limpLog("inf", parseFloat(words[wordIndex-1])-1)
					break;
			}

			if (currentWord == "+") {

			}

			limpLog("inf", "[oprt] "+currentWord);

	// IF INSTRUCTION
		} else {

			limpLog("inf", "[inst] "+currentWord);

		}
	}

	var nextWord = function() {
		if (wordIndex >= words.length) {
			return null;
		} else {
			return words[next++];
		}
	}


}




// 	// { SETUP
// 		function limpError(code) {
// 			limpLogger("err", code+": "+limpErrors[code]);
// 		}
// 		function limpLog(msg) {
// 			// limpLogger("log", msg);
// 		}
// 	// }
// 	// { VALIDATE LIMP INPUT
// 		if (typeof script !== "string") return limpError("u01"); // error if not string
// 		if (script.trim() == "") return limpError("u02"); // error if empty
// 		limpLog(script);
//
//
// 	// }
// 	// { LEXER
// 		var words = script.split(/\s+/);
// 		var wordIndex = 0;
// 		limp.nextWord = function() {
// 			if (wordIndex >= words.length) {
// 				console.log(null);
// 			} else {
// 				return words[next++];
// 			}
// 			if (wordIndex >= words.length) return null;
// 			return words[wordIndex++];
// 		}
//
// 		var dictionary = {};
// 		limp.stack = [];
// 		limp.addWords = function (new_dict) {
// 			for (var word in new_dict)
// 				dictionary[word.toUpperCase()] = new_dict[word];
// 		};
// 	// }
// }
