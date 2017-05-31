"use strict";
// var limpErrors = {
// 	"u01": "Invalid JavaScript data type passed to limp(). Expected string."
// }

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

function limp(input) {
	var pos = 0, line = 1, col = 1;

	function currentChar(offset = 0) {
		return input.charAt(pos+offset);
	}

	function currentCharIsEscaped(offset = 0) {
		return input.charAt(pos - 1 + offset) == "\\" ? true : false;
		// Support \\\
	}

	function endOfInput() {
		return pos > input.length ? true : false;
	}

	function jumpChar(offset = 1) {
		pos = pos+offset;
	}

	function jumpLine() {
		var nextNewline = input.indexOf("\n", pos);
		pos = nextNewline+1;
	}

	function isWhitespace(char) {
		return /\s/.test(char);
	}

	function isDigit(char) {
		return /[0-9]/.test(char);
	}

	function isOperator(char) {
		switch (char) {
			case "+":
			case "-":
			case "*":
			case "/":
			case "%":
				// do code
				break;
			case "++":
			case "--":
				// do code
				break;
		}
	}

	function readNumber() {
		var keepRunning = true, firstPeriod = true, number = "";
		while (keepRunning == true && !endOfInput()) {
			keepRunning = false;
			if ( isDigit(currentChar()) ) {
				keepRunning = true;
			} else if ( currentChar() == "." && firstPeriod == true && isDigit(currentChar(1)) ) {
				keepRunning = true;
				firstPeriod = false;
			}
			if (keepRunning) {
				number += currentChar();
				jumpChar();
			} else {
				jumpChar(-1);
			}
		}
		return number;
	}

	function readString() {
		var keepRunning = true, string = "", start = true;
		while (keepRunning == true && !endOfInput()) {
			console.log("pos"+pos);
			if (start) {
				string += currentChar();
				jumpChar();
				start = false;
			} else if (currentChar == '"') {
				console.log("gothere");
				keepRunning = false;
			} else {
				string += currentChar();
				jumpChar();
			}
			start = false;
		}
		return string;
	}

	readNext();
	function readNext() {
		// console.log("pos"+pos);
		if (endOfInput()) {
			console.log("we dun bois");
			return;
		}
		if ( isWhitespace(currentChar()) ) { // WHITESPACE
			limpLog("inf", "[whitespace]");
			if (currentChar() == "\n") {
				line++;
			}
			jumpChar();
			readNext();
		} else if (currentChar() == "/" && !currentCharIsEscaped() ) { // COMMENT
			limpLog("inf", "[comment]");
			jumpLine();
			readNext();
		} else if (currentChar() == '"' && !currentCharIsEscaped() ) { // STRING
			limpLog("inf", readString())
			jumpChar();
			readNext();
		} else if ( isDigit(currentChar()) ) { // DIGIT
			limpLog("inf", readNumber())
			jumpChar();
			readNext();
		} else if ( isOperator(currentChar) && !currentCharIsEscaped() ) { // OPERATOR
			limpLog("inf", readOperator())
			jumpChar();
			readNext();
		}
	}
}
