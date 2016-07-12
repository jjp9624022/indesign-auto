main();

function main() {

  var myDocument = app.activeDocument;
  var myLayer = myDocument.layers.add({name:"更改列表"});
  var myTextStyle = getTextStyle(myDocument, "更改");
  var myColorA, myColorB, myColorC;



  //颜色
  try {
    myColorA = myDocument.colors.item("Green");
    //If the color does not exist, trying to get its name will generate an error.
    myColorA.name;
  } catch (myError) {
    //The color style did not exist, so create it.
    myColorA = myDocument.colors.add({
      name: "Green",
      model: ColorModel.process,
      colorValue: [100, 0, 100, 0]
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


  try {
    myColorC = myDocument.colors.item("Red");
    //If the color does not exist, trying to get its name will generate an error.
    myColorC.name;
  } catch (myError) {
    //The color style did not exist, so create it.
    myColorC = myDocument.colors.add({
      name: "Red",
      model: ColorModel.process,
      colorValue: [0, 100, 100, 0]
    });
  }

  myLayer = myDocument.activeLayer;
  //当前页，当前文本框，主要作用是对同页面的修改，汇聚在一起
  var presentPage;
  var presentTextFrame;
  //全局总书签
  var myBookMarks = myDocument.bookmarks;
  //全局当前书签
  var prensentBookMarks;
  //获取所有的更改
  var mychanges = text_find_word(myDocument.stories);
  //为了让每一页的注释和更改都出现在一个文本框，在不修改太多代码的情况下，一个简单的排序是合适的。

  //这个排序是个舶来品，我都不是很明白他的含义
  var by = function(name, minor) {
    return function(o, p) {
      var a, b;
      if (o && p && typeof o === 'object' && typeof p === 'object') {
        a = o[name];
        b = p[name];
        if (a === b) {
          return typeof minor === 'function' ? minor(o, p) : 0;
        }
        if (typeof a === typeof b) {
          return a < b ? -1 : 1;
        }
        return typeof a < typeof b ? -1 : 1;
      } else {
        thro("error");
      }
    }
  }
  mychanges.sort(by('page.id', by('id')));
  //多文章的情况下，可能使得序号变的不一致，这个时候，我想，是否可以统一改动id了。

  //循环每个更改，并注入到每页的更改文本框
  for (var i = 0; i < mychanges.length; i++) {
    mychanges[i].id=i+1;
    if (presentPage != mychanges[i].page) {
    //判断更改是否在当前页，如果在，在已有文本框里添加内容，如果不在，则重新建立文本框。  

      

      presentPage = mychanges[i].page;
      presentTextFrame = presentPage.textFrames.add();


      //牛逼的分级书签开始
      var myPageLinkDestination = myDocument.hyperlinkPageDestinations.add(presentPage);
      prensentBookMarks = myBookMarks.add(myPageLinkDestination, {
        name: "更改页" + presentPage.index
      });



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
    //对类别做出判断，如果是注释，那么就添加红色，反之用绿色
    if (mychanges[i].types == "注释") {
      origin.fillColor = myColorC;

    } else {
      origin.fillColor = myColorA;
    }


    var idFrame = presentPage.textFrames.add();
    idFrame.textWrapPreferences.textWrapMode = TextWrapModes.NONE;
    idFrame.geometricBounds = [mychanges[i].position[1] - radius, mychanges[i].position[0] - radius - 1, mychanges[i].position[1] + radius, mychanges[i].position[0] + radius + 1];
    idFrame.contents = "" + mychanges[i].id;

    var myIndexText = idFrame.parentStory.texts.item(0);
    myIndexText.applyParagraphStyle(myTextStyle, true);
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

    presentTextFrame.contents = presentTextFrame.contents + mychanges[i].id + "." + mychanges[i].user + mychanges[i].types + "了" + "“" + mychanges[i].text + "”" + "\r";
    //设置文本格式

    //获取文本样式
    // var myTextStyle=getTextStyle(myDocument);
    //设置样式的详细格式
    //myTextStyle.fillColor=myColor;

    //myTextStyle.justification=Justification.LEFT_ALIGN
    //presentTextFrame.parentStory.texts.item(0).applyParagraphStyle(myTextStyle, true);



    var myText = presentTextFrame.parentStory.paragraphs[-1].texts.item(0);
    myText.applyParagraphStyle(myTextStyle, true);

    var myLinkText = myText.characters.itemByRange(myText.characters[0], myText.characters[-2]).texts.item(0);


    //加入超链接
    try{
    var mylinkSource = myDocument.hyperlinkTextSources.add(myLinkText);
    var myLinkDestination = myDocument.hyperlinkTextDestinations.add(myIndexText);
    myDocument.hyperlinks.add(mylinkSource, myLinkDestination);}catch(error){}


    //在每一页加入书签
    prensentBookMarks.bookmarks.add(myLinkDestination, {
      name: mychanges[i].id + "." + mychanges[i].types + "“" + mychanges[i].text + "”"
    });



    //对文本颜色也进行更改
    if (mychanges[i].types == "注释") {
      myText.fillColor = myColorC;

    } else {
      myText.fillColor = myColorA;
    }

    myText.justification = Justification.LEFT_ALIGN;
    myText.pointSize = 8;
    myText.startParagraph = StartParagraph.ANYWHERE;

  }
}

//辅助的函数，大多用来获取颜色，样式等，不确定的信息


//获取段落样式
function getTextStyle(in_document, in_name) {
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

//获取text对象中的文本内容
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
  //这里是文章的循环
  for (var i = 0; i < myStories.length; i++)

  {
    //这里是获取附注的循环
    for (var m = 0; m < myStories[i].notes.length; m++) {
      var myResult = myStories[i].notes[m].storyOffset;
      x = myResult.horizontalOffset;
      y = myResult.baseline - 2; //防止和其他的重叠。
      z = myResult.horizontalOffset;
      var id = myStories[i].notes[m].index;
      var page = myStories[i].notes[m].storyOffset.parentTextFrames[0].parentPage;
      var userName = myStories[i].notes[m].userName;
      var myText = contentsOfText(myStories[i].notes[m].texts);
      result.push({
        "id": id,
        "position": [x, y, z],
        "types": "注释",
        "text": myText,
        "page": page,
        "user": userName
      });


    }

    //这里是获取更改列表的循环
    //改进了其他状态的能力，比如，判断此文本框是否字啊页面上
    if (myStories[i].trackChanges == true) {
      for (var m = 0; m < myStories[i].changes.length; m++) {
        try { //这么大的try，原因是尽量过滤掉各种不需要考虑的特殊情况，如，更改在页面外，导致其没有归属的页面和位置属性

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


          }


{          var id = myStories[i].changes[m].index;

          var myChangeTypes;
          if (myStories[i].changes[m].changeType == ChangeTypes.DELETED_TEXT) {

            myChangeTypes = "删除";
          } else {
            myChangeTypes = "添加"
          }

          var myText = contentsOfText(myStories[i].changes[m].texts);



          var page = myStories[i].changes[m].storyOffset.parentTextFrames[0].parentPage;
          var userName = myStories[i].changes[m].userName;

          result.push({
            "id": id,
            "position": [x, y, z],
            "types": myChangeTypes,
            "text": myText,
            "page": page,
            "user": userName
          });}

        } catch (myError) {
          //你看，我什么都没有做
        }
      }
    }
  }

  // this returns an array of objects
  return result;
};