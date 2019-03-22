main();

function main() {

	var myDoc = app.activeDocument;
	var myText = app.findGrep();


	for (var i = 0; i < myText.length; i++) {

			myText[i].textVariableInstances[0].convertToText();

			//var myResurt = myText[i].changeGrep();
			//myResurt[0].groups[0].textFrames[0].contents = myCopyText;
      //myResurt[0].textFrames[0].contents = myCopyText;

		}



}
