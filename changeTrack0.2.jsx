main();

function main() {

  var myDocument = app.activeDocument;
  var myLayer = myDocument.layers.add();
  var myTextStyle=getTextStyle(myDocument,"更改");
  var myColorA, myColorB;



  //颜色
  try {
    myColorA = myDocument.colors.item("Red");
    //If the color does not exist, trying to get its name will generate an error.
     myColorA.name;
  } catch (myError) {
    //The color style did not exist, so create it.
    myColorA = myDocument.colors.add({
      name: "Red",
      model: ColorModel.process,
      colorValue: [0, 100, 100, 0]
    });
  }
  //Create another color.
  try {
    myColorB = myDocument.colors.item("White");
    //If the color does not exist, trying to get its name will generate an error.
    myColorB.name;
  } catch (myError) {
    //The color style did not exist, so create it.
    myColorB = myDocument.colors.add({
      name: "White",
      model: ColorModel.process,
      colorValue: [0, 0, 0, 0]
    });
  }

  myLayer = myDocument.activeLayer;
  //当前页，当前文本框，主要作用是对同页面的修改，汇聚在一起
  var presentPage;
  var presentTextFrame;
  //获取所有的更改
  var mychanges = text_find_word(myDocument.stories);
  //循环每个更改，并注入到每页的更改文本框
  for (var i = 0; i < mychanges.length; i++) {
    //判断更改是否在当前页，如果在，在已有文本框里添加内容，如果不在，则重新建立文本框。  
    if (presentPage != mychanges[i].page) {

      presentPage = mychanges[i].page;
      presentTextFrame = presentPage.textFrames.add();
      //清除可能的绕排
      presentTextFrame.textWrapPreferences.textWrapMode = TextWrapModes.NONE;
      //这里开始建立新的文本框，位置，我选择在页面的左上角到左下角,然后向左边偏移100。
      var offset = 5;
      var width = 100;
      presentTextFrame.geometricBounds = [presentPage.bounds[0] + offset, presentPage.bounds[1] + offset, presentPage.bounds[2] - offset, presentPage.bounds[1] + width - offset];
    }


    //画坐标，和圆形id的坐标


    //半径
    var radius = 1.5;
    //画圆开始
    var origin = presentPage.ovals.add();
    //清除可能的绕排
    origin.textWrapPreferences.textWrapMode = TextWrapModes.NONE;
    origin.geometricBounds = [mychanges[i].position[1] - radius, mychanges[i].position[0] - radius, mychanges[i].position[1] + radius, mychanges[i].position[0] + radius];
    //   [mychanges[i].position[1], mychanges[i].position[0], mychanges[i].position[1] + 20, mychanges[i].position[2] + 30]
    origin.fillColor = myColorA;
    var idFrame = presentPage.textFrames.add();
    idFrame.textWrapPreferences.textWrapMode = TextWrapModes.NONE;
    idFrame.geometricBounds = [mychanges[i].position[1] - radius, mychanges[i].position[0] - radius, mychanges[i].position[1] + radius, mychanges[i].position[0] + radius];
    idFrame.contents = "" + mychanges[i].id;

    var myIndexText = idFrame.parentStory.texts.item(0);
    myIndexText .applyParagraphStyle(myTextStyle,true);
    myIndexText.fillColor = myColorB;
    myIndexText.justification = Justification.CENTER_ALIGN;
    myIndexText.pointSize = 7;
    myIndexText.startParagraph = StartParagraph.ANYWHERE;

    //画线开始
    var gl = presentPage.graphicLines.add();
    gl.textWrapPreferences.textWrapMode = TextWrapModes.NONE;
    gl.paths.item(0).pathPoints[0].anchor = [mychanges[i].position[0], mychanges[i].position[1]];
    gl.paths.item(0).pathPoints[1].anchor = [mychanges[i].position[2], mychanges[i].position[1]];
    gl.strokeColor = myColorA;
    presentTextFrame.contents = presentTextFrame.contents + mychanges[i].id + "," + mychanges[i].user + mychanges[i].types + "了" + "“" + mychanges[i].text + "”" + "\r";
    //设置文本格式

    //获取文本样式
    // var myTextStyle=getTextStyle(myDocument);
    //设置样式的详细格式
    //myTextStyle.fillColor=myColor;

    //myTextStyle.justification=Justification.LEFT_ALIGN
    //presentTextFrame.parentStory.texts.item(0).applyParagraphStyle(myTextStyle, true);



    //郁闷，基于样式居然会导致无效，只能曲线救国了。
    var myText = presentTextFrame.parentStory.texts.item(0);
    myText.applyParagraphStyle(myTextStyle,true);
    myText.fillColor = myColorA;
    myText.justification = Justification.LEFT_ALIGN;
    myText.pointSize = 8;
    myText.startParagraph = StartParagraph.ANYWHERE;

  }
}

//辅助的函数，大多用来获取颜色，样式等，不确定的信息


//获取段落样式
function getTextStyle(in_document,in_name) {
  var myStyle;

  try {
    myStyle = in_document.paragraphStyles.item(in_name);
    //If the style does not exist, trying to get its name will generate an error.
   //也叫一声吧,这里是个坑啊！！
    myStyle.name;
  } catch (myError) {
    //新建样式均不成功，inVaild=false
    myStyle = in_document.paragraphStyles.add({
      name: in_name,
      basedOn: "[No paragraph style]"
    });
  }
  return myStyle;
}


//获取颜色
function getColor(in_document, colorName, in_colorValue) {
  var in_color;
  try {
    //因此建议在ui中建立此颜色
    in_color = in_document.colors.item(colorName);
//居然需要叫一声，艹！
    in_color.name;
  } catch (myError) {
    //新建样式均不成功，inVaild=false
    in_color = in_document.colors.add({
      name: colorName,
      model: ColorModel.PROCESS,
      colorValue: in_colorValue
    });

  }


  return in_color;
}
//获取文章中的修改条目，并获取其位置、修改人、修改类别等信息
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
          z = myResult.horizontalOffset;
        } else {
          var myResult = myStories[i].changes[m].insertionPoints;
          x = myResult[0].horizontalOffset;
          y = myResult[0].baseline;
          z = myResult[-1].horizontalOffset;
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
        var userName = myStories[i].changes[m].userName;

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