#target "InDesign"
main();
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

//居然要提前开始查询xpath，其实这是否可以由python端来做呢？
//其实是正确的，这个脚本应该被用来指定更新，或者全局更新xml结构。
//也应该restful？？？
function mySimulateXPath(myXPath) {
	var myXMLElements = new Array;
	var myRuleProcessor = app.xmlRuleProcessors.add(myXPath);
	try {
		var myMatchData = myRuleProcessor.startProcessingRuleSet(app.documents.item(0).xmlElements.item(0));
		while (myMatchData != undefined) {
			var myElement = myMatchData.element;
			myXMLElements.push(myElement);
			myMatchData = myRuleProcessor.findNextMatch();
		}
		myRuleProcessor.endProcessingRuleSet();
		myRuleProcessor.remove();
		return myXMLElements;
	} catch (myError) {
		myRuleProcessor.endProcessingRuleSet();
		myRuleProcessor.remove();
		throw myError;
	}
}

function drawOrigin(in_page, in_color, in_position) {
	//画圆开始
	var rectangle = in_page.rectangles.add();
	//清除可能的绕排
	rectangle.textWrapPreferences.textWrapMode = TextWrapModes.NONE;
	rectangle.geometricBounds = [in_position[1], in_position[0], in_position[3], in_position[2]];
	// alert("传出的"+[in_position[1],in_position[0],in_position[3],in_position[2]])
	//   [mychanges[i].position[1], mychanges[i].position[0], mychanges[i].position[1] + 20, mychanges[i].position[2] + 30]
	//对类别做出判断，如果是注释，那么就添加红色，反之用绿色

	rectangle.fillColor = in_color;
}


function getXmlElement(object, tag, tagDesObject) {



	try {
		var myStoryXMLElement = object.xmlElements.item(tag.name);
		myStoryXMLElement.xmlAttributes.add("id", "" + myStories[i].id);
		myStories[i].markup(myStoryXMLElement);
	} catch (myError) {
		var myStoryXMLElement = object.xmlElements.add(tag.name);
		myStoryXMLElement.xmlAttributes.add("id", "" + myStories[i].id);
		myStories[i].markup(myStoryXMLElement);
	}

}
function main() {
	app.scriptPreferences.measurementUnit=MeasurementUnits.MILLIMETERS;

	var myDocument = app.activeDocument;
	var myStories = myDocument.stories;
	//本文件的xml结构
	//全局化tag名称，为后续修改做准备。
	var STORY_TAG = "story";
	var PARA_TAG = "paragraph";

	var myXML = myDocument.xmlElements.item(0);
	//其实后续还是要做下判断，如果原文有此tag就应当使用而不是创建。
	var myStoryTag;
	var myParaTag;

	try {
		myStoryTag = myDocument.xmlTags.item(STORY_TAG);
		myStoryTag.name;

	} catch (myErr) {
		myStoryTag = myDocument.xmlTags.add(STORY_TAG);

	}
	try {
		myParaTag = myDocument.xmlTags.item(PARA_TAG);
		myParaTag.name;

	} catch (myErr) {
		myParaTag = myDocument.xmlTags.add(PARA_TAG);

	}
	for (var i = 0; i < myStories.length; i++) {
		var myStoryXMLElement = myXML.xmlElements.add(myStoryTag);
		myStoryXMLElement.xmlAttributes.add("id", ""+myStories[i].id);
		myStories[i].markup(myStoryXMLElement);
		var presentPage;
		for (var m = 0; m < myStories[i].paragraphs.length; m++) {
			//获取段落级别上的位置。

			var myResult = myStories[i].paragraphs[m].insertionPoints;
			var page = myResult[0].parentTextFrames[0].parentPage;

			if(prensent!=page){
				
			}
			x1 = myResult[0].horizontalOffset;
			y1 = myResult[0].baseline-myResult[0].pointSize ;
			
			//仍需改进
            //分栏的交接应该分开两个，甚至分页。所以，应该继续重构
           //不必纠结了，直接仅选择第一个文本栏即可，这样也可以做好权利划分
           //这是个便易的方式，来处理x偏移，两行的段落必有-2行占满框架（栏）宽度，一行的就不必纠结占满的问题。
			if (myStories[i].paragraphs[m].lines.length > 1) {
				x2 = myStories[i].paragraphs[m].lines[-2].endHorizontalOffset + myResult[-1].pointSize;
			} else {
				x2 = myStories[i].paragraphs[m].lines[0].endHorizontalOffset + myResult[-1].pointSize;
			}
			// x2 = myStories[i].paragraphs[m].lines[-1].endHorizontalOffset;
			//这会判断段落是否有多个textColumns，分栏，分页的情况下，段落会有多个textColumns。
			if (myStories[i].paragraphs[m].textColumns.length > 1) {
				y2 = myStories[i].paragraphs[m].textColumns[0].lines[-1].baseline;
			} else {
				y2 = myStories[i].paragraphs[m].lines[-1].baseline;
			}
			// var id = myStories[i].notes[m].index;
			// var page = myStories[i].notes[m].storyOffset.parentTextFrames[0].parentPage;
			// var userName = myStories[i].notes[m].userName;
			// var myText = contentsOfText(myStories[i].notes[m].texts);
			

			//重要的来了，标记xml，这也是不得已的事情，只有xml支持完整的标记方式，其余的貌似都不太好用。后续支持也方便
			var myParaXMLElement = myStoryXMLElement.xmlElements.add(myParaTag);
			myParaXMLElement.xmlAttributes.add("id", ""+myParaXMLElement.id);
			myParaXMLElement.xmlAttributes.add("bounds", x1 + "," + y1 + "," + x2 + "," + y2);
			//这里的id估计是动态的，后续需要把这个id的属性换成uid，然后用label属性传入。
			myParaXMLElement.xmlAttributes.add("page", ""+page.id);


			myStories[i].paragraphs[m].markup(myParaXMLElement);
			// var myColor=getColor(myDocument, "red", [0, 100, 100, 0]);
   //          drawOrigin(page,myColor,[x1,y1,x2,y2]);


		}



		
	}


}