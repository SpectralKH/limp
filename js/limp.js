// First readNext() goes through the script, performing character/type checks;
// For instance, isDigit(). After finding out the type, we read the type;
// readNumber(). readNumber() returns an object with info such as type and
// value. These objects are put into the statements array, which is later
// processed by the parser. The parser loops through the statements array,
// forming the AST, a tree/network object representing the script.


"use strict";

function limpLog(type, msg) {
	if (typeof msg == "object") msg = JSON.stringify(msg, null, 4);
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
var temp = [];
function limp(input) {
	var pos = 0, line = 1, col = 1; // statement

	// CHARACTER CHECK

		function currentChar(offset = 0) {
			return input.charAt(pos+offset);
		}
		function currentCharIsEscaped(offset = 0) {
			return input.charAt(pos - 1 + offset) == "\\" ? true : false;
			//  ToDo: Support \\\
		}

	// END?

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

		function isWhitespace(char = currentChar()) {
			return /\s/.test(char);
		}
		function currentCharIsComment() {
			return currentChar() == "/" && currentChar(1) == "/" && !currentCharIsEscaped() ? true : false;
		}
		function currentCharIsString() {
			return currentChar() == '"' && !currentCharIsEscaped()
		}
		function isDigit(char = currentChar()) {
			return /[0-9]/.test(char);
		}
		function isPunctation(char = currentChar()) {
			return ";(){}".indexOf(char) >= 0;
		}
		function isOperator(char = currentChar()) {
			// return "+-*/%.=<>&|!".indexOf(char) >= 0;
			return "+-*/%=".indexOf(char) >= 0;
		}

	// TYPE READ

		function readString() {
			var keepRunning = true, string = currentChar();
			jumpChar();
			while (keepRunning == true && !endOfInput()) {
				if (currentChar() == '"') {
					limpLog("inf", "got here");
					string += currentChar();
					keepRunning = false;
				} else {
					string += currentChar();
					jumpChar();
				}
			}
			return eval(string);
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
			return eval(number);
		}
		function readOperator() {
			var operator = currentChar();
			// if (currentChar() == "+" && currentChar(1) == "+") operator = "++", jumpChar();
			// if (currentChar() == "-" && currentChar(1) == "-") operator = "--", jumpChar();
			if ("+-*/%".indexOf(operator) >= 0) {
				var type = "arithmetic"
			} else if ("=".indexOf(operator) >= 0) {
				var type = "assignment";
			}
			return {type: type, operator: operator};
		}
		function readKeyword() {
			var keepRunning = true, keyword = currentChar();
			jumpChar();
			while (keepRunning == true && !endOfInput()) {
				if ( /[A-Za-z0-9_]/.test(currentChar()) ) {
					keyword += currentChar();
					jumpChar();
				} else {
					keepRunning = false;
					jumpChar(-1);
				}
			}
			if (keyword == "true") keyword = true;
			if (keyword == "false") keyword = false;
			return keyword;
		}

	// LEXER

		var stat = 0;
		// Statement format: statements[statementIndex].property
		var statements = [];
		statements[stat] = [];
		var ast = [] // parseInputPosition

		readNext();
		function readNext() {
			// limpLog("inf", `--- pos${pos} (${line}:${col})`);
			var value = "";
			var currentStat = statements[stat];
			if (endOfInput()) {
				// limpLog("inf", "---------------------------- script finished");
				parse();
				// limpLog("inf", statements);
			} else if ( isWhitespace() ) { 											// WHITESPACE
				value = "[whitespace]";
				if (currentChar() == "\n") line++;
			} else if (currentCharIsComment()) { 									// COMMENT
				value = "[comment]";
				jumpLine();
				jumpChar(-1);
			} else if ( currentCharIsString() ) { 									// STRING
				value = {type: "string", value: readString()};
				statements[stat].push(value);
			} else if ( isDigit() ) { 												// NUMBER
				value = {type: "number", value: readNumber()};
				statements[stat].push(value);
			} else if ( isPunctation() ) {											// PUNCTATION
				value = {type: "punctation", value: currentChar()};
				if (currentChar() == ";") {
					stat++;
					statements[stat] = [];
				} else {
					statements[stat].push(value);
				}
			} else if ( isOperator() ) { 											// OPERATOR
				value = readOperator();
				statements[stat].push(value);
			} else if ( /[A-Za-z_]/.test(currentChar()) ) { 						// KEYWORD
				value = readKeyword();
				switch (value) {
					case true:
					case false:
						value = {type: "boolean", value: value};
						break;
					case "fn":
						value = {type: "function", value: "whatever"};
						break;
					default:
						value = {type: "variable", value: value};
				}
				statements[stat].push(value);
			} else {
				console.log(currentChar());
				limpLog("err", `Didn't understand character "${currentChar()}" at ${line}:${col}`);
			}
			if (value != "") {
				// limpLog("inf", value);
				jumpChar();
				// if (value != "[whitespace]" && value != "[comment]") pipos++;
				readNext();
			}
		}

	// PARSE
		function parse() {


			var ast = statements;
			function delimit(startIndex, startToken, endToken, separatorToken, inputArr) {
				var parenCount = 0;
				for (var i = startIndex; ; i++) {
					if (inputArr[i].value == "(") {
						parenCount++;
					} else if (inputArr[i].value == ")") {
						if (parenCount == 1) {
							var endIndex = i;
							break;
						} else {
							parenCount--;
						}
					}
				}
				return [startIndex, endIndex];
			}
			function parseTokensArray(tokens) {
				for (var ti = 0; ti < tokens.length; ti++) {
					var token = tokens[ti];
					if (token.type == "arithmetic") {								// ARITHMETICS
						token.left = tokens[ti-1];
						token.right = tokens[ti+1];
						tokens.splice(ti-1, 3, token);
						ti--;
					} else if (token.type == "assignment") { 						// ASSIGNMENTS
						token.left = tokens[ti-1];
						token.right = ast[si].splice(ti+1);
						parseTokensArray(token.right);
						tokens.splice(ti-1, 3, token);
						ti--;
					} else if (token.value == "(") { 								// PARENTHESES
						var delimited = delimit(ti, "(", ")", "", tokens);
						var startIndex = delimited[0];
						var endIndex = delimited[1];
						var body = tokens.slice(startIndex+1, endIndex);
						parseTokensArray(body);
						token[startIndex] = {type: "priority", body: body};
						tokens.splice(startIndex, endIndex+1-startIndex, token[startIndex]);
					}
				}
				// return tokens[0];
			}
			// loop through statements & tokens
			for (var si = 0; si < ast.length; si++) { // statement index
				parseTokensArray(ast[si]);
			}
			limpLog("inf", ast);
			temp = ast;
		}
}
