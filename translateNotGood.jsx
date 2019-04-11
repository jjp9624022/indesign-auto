main();

function main() {

  var myDoc = app.activeDocument;
  var myText = app.findGrep();
  var myAllTextFrame=app.findObject();

  for (var i = myText.length-1; i >= 0; i--) {



    var myCopyText = myText[i].contents;
        myAllTextFrame[0].contents+="\n"+i+":"+myCopyText;


  }



}
