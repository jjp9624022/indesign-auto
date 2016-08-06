main();

function main() {

  var myDoc = app.activeDocument;
  var myText = app.findGrep();


  for (var i = 0; i < myText.length; i++) {
    var myCopyText = myText[i].contents;
    var myResurt = myText[i].changeGrep();
    myResurt[0].textFrames[0].contents=myCopyText;
  }



}
