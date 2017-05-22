<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>limp</title>
		<!--Roboto--> <link href="https://fonts.googleapis.com/css?family=Roboto+Mono" rel="stylesheet">
		<!--Favicon: http://realfavicongenerator.net -->
		<link rel="stylesheet" type="text/css" href="/css/limp.css?r=<?=rand(0,999)?>">
	</head>

	<body>
		<div class="limp--log"></div>
		<div class="limp--input">
			<script>
			$("body").on("input", "textarea.limp--input textarea", function() {
				var offset = this.offsetHeight - this.clientHeight;
				$(this).css("height", "auto").css("height", this.scrollHeight + offset);
			});
			</script>
			<textarea placeholder="Run limp" rows="1" class="limp--input-limp"></textarea>
			<textarea placeholder="Run JavaScript" rows="1" class="limp--input-js"></textarea>
		</div>
		<script src="js/limp.js?r=<?=rand(0,999)?>"></script>
		<script src="js/script.limp?r=<?=rand(0,999)?>"></script>
		<!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script> -->
	</body>
</html>
