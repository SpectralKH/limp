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
	var pos = 0, line = 1, col = 0;

	function currentChar(offset = 0) {
		return input.charAt(pos+offset);
	}

	function jumpChar(offset = 1) {
		pos = pos+offset;
	}

	function jumpLine() {
		var nextNewline = input.indexOf("\n", currentChar());
		pos = nextNewline+1;
	}

	function isWhitespace(char) {
		return /^\s*$/.test(char);
	}

	function isDigit(char) {
		return /[0-9]/.test(char);
	}

	function readNumber() {
		var keepRunning = true, firstPeriod = true, number = "";
		while (keepRunning == true) {
			keepRunning = false;
			if ( isDigit(currentChar()) ) {
				keepRunning = true;
			} else if ( currentChar() == "." && firstPeriod == true && isDigit(currentChar(1)) ) {
				keepRunning = true;
				firstPeriod = false;
			}
			if (keepRunning) {
				number += currentChar();
				jumpChar(1);
			} else {
				jumpChar(-1);
			}
		}
		return number;
	}

	function readNext() {
		if ( isWhitespace(currentChar()) ) {
			jumpChar();
			readNext();
		} else if (currentChar() == "/" && currentChar(1) == "/" ) {
			jumpLine();
			readNext();
		} else if (currentChar() == '"') {
			readString();
			jumpChar();
			readNext();
		} else if ( isDigit(currentChar()) ) {
			readNumber();
			jumpChar();
			readNext();
		}
	}
	readNext();
}
