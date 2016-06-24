main();

function main() {

  var myDocument = app.activeDocument;
  var myLayer = myDocument.layers.add();

  myLayer = myDocument.activeLayer;

var presentPage;
  var mychanges = text_find_word(myDocument.stories);

  for (var i = 0; i < mychanges.length; i++) {
if(presentPage!=mychanges[i].page){

    var myTextFrame = mychanges[i].page.textFrames.add();
    var myBound = [mychanges[i].position[1], mychanges[i].position[0], mychanges[i].position[1] + 20, mychanges[i].position[2] + 30];
    myTextFrame.geometricBounds = myBound;
    myTextFrame.contents = mychanges[i].user + mychanges[i].types + "了" + mychanges[i].text;
}
    


  }
}



function text_find_word(in_story) {



  var result = new Array(); // this will be our return value

  var myStories = in_story;
  for (var i = 0; i < myStories.length; i++)

  {
    if (myStories[i].trackChanges == true) {
      for (var m = 0; m < myStories[i].changes.length; m++) {

        var x, y, z;
        if (myStories[i].changes[m].changeType == ChangeTypes.DELETED_TEXT) {
          var myResult = myStories[i].changes[m].storyOffset;
          x = myResult.horizontalOffset;
          y = myResult.baseline;
          z = myResult.horizontalOffset + 30;
        } else {
          var myResult = myStories[i].changes[m].insertionPoints;
          x = myResult[0].horizontalOffset;
          y = myResult[0].baseline;
          z = myResult[-1].horizontalOffset + 30;
          //   if (myStories[i].changes[m].lines <= 1) {

          //     x = myStories[i].changes[m].lines[0].insertionPoints[0].horizontalOffset;
          //     y = myStories[i].changes[m].lines[0].insertionPoints[0].myResult.baseline;
          //     z = myStories[i].changes[m].lines[0].insertionPoints[-1].myResult.baseline;
          //   } 
        }



        var id = myStories[i].changes[m].index;

        var myChangeTypes;
        if (myStories[i].changes[m].changeType == ChangeTypes.DELETED_TEXT) {

          myChangeTypes = "删除";
        } else {
          myChangeTypes = "添加"
        }

        var myText = contentsOfText(myStories[i].changes[m].texts);

        function contentsOfText(inTexts) {
          var myContents = "";
          if (inTexts.length > 0) {
            for (var j = 0; j < inTexts.length; j++) {
              myContents += inTexts[j].contents;

            }
          } else {
            myContents = "这里有修改";
          }

          return myContents;
        }

        var page = myStories[i].changes[m].storyOffset.parentTextFrames[0].parentPage;
        var userName=myStories[i].changes[m].userName;

        result.push({
          "id": id,
          "position": [x, y, z],
          "types": myChangeTypes,
          "text": myText,
          "page": page,
          "user": userName
        });
      }
    }
  }

  // this returns an array of objects
  return result;
};