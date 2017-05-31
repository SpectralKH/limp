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

	// CHARACTER CHECK
		function currentChar(offset = 0) {
			return input.charAt(pos+offset);
		}

		function currentCharIsEscaped(offset = 0) {
			return input.charAt(pos - 1 + offset) == "\\" ? true : false;
			//  ToDo: Support \\\
		}

	function endOfInput() {
		return pos >= input.length ? true : false;
	}

	// INPUT NAVIGATION

		function updateCol() {
			var lastNewline = input.lastIndexOf("\n", pos-1);
			col = pos-lastNewline;
		}

		function jumpChar(offset = 1) {
			pos = pos+offset;
			updateCol();
		}

		function jumpLine() {
			var nextNewline = input.indexOf("\n", pos);
			pos = nextNewline+1;
			updateCol();
			line++;
		}

	// TYPE CHECK

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
				case "++":
				case "--":
					return true;
					break;
				default:
					return false;
			}
		}

		function isLetter(char) {
			return /[A-Za-z]/.test(char);
		}

	// TYPE READ
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
				if (start) {
					string += currentChar();
					jumpChar();
					start = false;
				} else if (currentChar() == '"') {
					limpLog("inf", "got here");
					string += currentChar();
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
		limpLog("inf", `--- pos${pos} (${line}:${col})`);
		if (endOfInput()) {
			limpLog("inf", "---------------------------- script finished");
		} else if ( isWhitespace(currentChar()) ) { // WHITESPACE
			limpLog("inf", "[whitespace]");
			if (currentChar() == "\n") {
				line++;
			}
			jumpChar();
			readNext();
		} else if (currentChar() == "/" && currentChar(1) == "/" && !currentCharIsEscaped() ) { // COMMENT
			limpLog("inf", "[comment]");
			jumpLine();
			readNext();
		} else if (currentChar() == '"' && !currentCharIsEscaped() ) { // STRING
			limpLog("inf", readString());
			jumpChar();
			readNext();
		} else if ( isDigit(currentChar()) ) { // NUMBER
			limpLog("inf", readNumber());
			jumpChar();
			readNext();
		} else if ( isOperator(currentChar()) ) { // OPERATOR
			limpLog("inf", "Operator - ToDo");
			jumpChar();
			readNext();
		} else if ( isLetter(currentChar()) ) {
			limpLog("inf", "Letter - ToDo");
			jumpChar();
			readNext();
		} else if ( currentChar() == "$" ) {
			limpLog("inf", "Variable - ToDo");
			jumpChar();
			readNext();
		} else {
			limpLog("err", `Didn't understand character "${currentChar()}" at ${line}:${col} | ${pos}`);
		}
	}
}
