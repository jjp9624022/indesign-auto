main();

function main() {

	var myDoc = app.activeDocument;
	var myText = app.findGrep();


	for (var i = 0; i < myText.length; i++) {
		var num = 100;
		var compare = 60;
		try {
			num = myText[i].characters[-1].baseline - myText[i].parentTextFrames[0].geometricBounds[0]

			// alert(myText[i].characters[-1].baseline);

		} catch (err) {
			num = 100;

		}
		if (num < compare) {

			var myCopyText = myText[i].contents;
			var myResurt = myText[i].changeGrep();
			myResurt[0].groups[0].textFrames[0].contents = myCopyText;

		}



	}
}