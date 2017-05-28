"use strict";
var limpErrors = {
	"u01": "Invalid JavaScript data type passed to limp(). Expected string."
}

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

function wordType(word) {
	var type;
	if ( /(^\d*$|^\d*\.\d+$)/.test(word) ) { // NUMBER, digit OR optional digit . digit
		type = "number";
	} else if (word == "true" || word == "false") { // BOOLEAN
		type = "boolean";
	} else if ( /^".*"$/.test(word) ) { // STRING, starts & ends with "
		type = "string";
	} else if ( /^[+\-*/%]$|^[+-]{2}$/.test(word) ) { // OPERATOR, + - * % ++ --
		type = "operator";
	} else if ( /^\$.*/.test(word) ) {
		type = "variable";
	} else { // OTHER
		type = "instruction";
	}
	return type;
}

function limp(script) {
	var words = script.trim().match( /[^\s"]+|"[^"]*"/g ); // trim & split into array where there is whitespace, except in quotes

	var currentWord, currentType;
	for (var wordIndex = 0; wordIndex < words.length; wordIndex++) { // loop through words array
		currentWord = words[wordIndex];
		currentType = wordType(currentWord);
		limpLog("inf", "["+currentType+"]		"+currentWord);
		switch (currentType) {
			case "number":
				// do code...
				break;
			case "boolean":
				// do code...
				break;
			case "string":
				// do code...
				break;
			case "operator":
				switch (currentWord) {
					case "+":
						limpLog("inf", words[wordIndex-1]+words[wordIndex+1]);
						break;
					case "-":
						limpLog("inf", words[wordIndex-1]-words[wordIndex+1]);
						break;
					case "*":
						limpLog("inf", words[wordIndex-1]*words[wordIndex+1]);
						break;
					case "/":
						limpLog("inf", words[wordIndex-1]/words[wordIndex+1]);
						break;
					case "%":
						limpLog("inf", words[wordIndex-1]%words[wordIndex+1]);
						break;
					case "++":
						limpLog("inf", words[wordIndex-1]+1);
						break;
					case "--":
						limpLog("inf", words[wordIndex-1]-1);
						break;
				}
				break;
			case "instruction":
				// do code...
				break;
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
