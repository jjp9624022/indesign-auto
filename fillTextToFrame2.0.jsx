main();

function main() {

  var myDoc = app.activeDocument;
  var myText = app.findGrep();


  for (var i = myText.length - 1; i >= 0; i--) {
  	if (myText[i].textFrames[-1]!=null){

    var myP = myText[i].textFrames[-1];
    app.selection = myText[i].characters.itemByRange(myText[i].characters[0], myText[i].characters[-2]);
    app.cut();
    app.selection = myP.texts;
    app.paste();

  		
  	}


  }



}