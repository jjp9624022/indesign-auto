main();

function main() {



  var myFilteredFiles;
  //var myText = app.findGrep();
  var myTextFrames = app.activeDocument.textFrames;


  var titlesInfo = new Array;
  for (var i = 0; i < myTextFrames.length; i++) {
    titlesInfo[i] = new Array;
  try {
    titlesInfo[i].push(myTextFrames[i].contents);
    // alert(myText[i].parentTextFrames[0].parentPage);
    titlesInfo[i].push(myTextFrames[i].parentPage.id);
  }catch(err){alert(err);}
  }
  //Make certain that user interaction (display of dialogs, etc.) is turned on.
  app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
  myExtensions = [".jpg", ".jpeg", ".eps", ".ps", ".pdf", ".tif", ".tiff", ".gif", ".psd", ".ai"]
  //Display the folder browser.
  var myFolder = Folder.selectDialog("选择需要填充图片的文件夹", "");
  //Get the path to the folder containing the files you want to place.
  if (myFolder != null) {
    if (File.fs == "Macintosh") {
      myFilteredFiles = myMacOSFileFilter(myFolder);
    } else {
      myFilteredFiles = myWinOSFileFilter(myFolder);
    }
    if (myFilteredFiles.length != 0) {
      myFillImage(myFilteredFiles, titlesInfo);


    }
  }



}

function myFillImage(myFiles,  titlesInfo) {

  var myDoc = app.activeDocument;
  var myObj = app.findObject();


  for (var i = 0; i < myObj.length; i++) {


    try {

     myObj[i].place(File(findFileByName(findTitle(myObj[i],titlesInfo),myFiles)));
      // myObj[i].place(File(myFiles[i]));
      myObj[i].fit(Options.FILL_PROPORTIONALLY);
      // myResurt[0].textFrames[0].contents=myCopyText;

    } catch (err) {
      alert(err);
    }
  }


}

function findTitle(myOne, titlesInfo) {
  var txt
  for (var i = 0; i < titlesInfo.length; i++) {
    if (Math.abs(myOne.parentPage.id - titlesInfo[i][1])<=2) {

      txt+=titlesInfo[i][0];

      return txt


    }


  }

}

function findFileByName(text, myFiles) {
  var temp=0;
  var file;

  for (var i = 0; i < myFiles.length; i++) {

    //var likely=levenshtein(text,File.decode(myFiles[i].name));
    var likely=text.match(File.decode(myFiles[i].name)).length;
    alert(likely);
if(likely>temp){
     file=myFiles[i];
           temp=likely;
}
  }
  return file;


}
//Windows version of the file filter.
function myWinOSFileFilter(myFolder) {
  var myFiles = new Array;
  var myFilteredFiles = new Array;
  for (myExtensionCounter = 0; myExtensionCounter < myExtensions.length; myExtensionCounter++) {
    myExtension = myExtensions[myExtensionCounter];
    myFiles = myFolder.getFiles("*" + myExtension);
    if (myFiles.length != 0) {
      for (var myFileCounter = 0; myFileCounter < myFiles.length; myFileCounter++) {
        myFilteredFiles.push(myFiles[myFileCounter]);
      }
    }
  }
  return myFilteredFiles;
}

function myMacOSFileFilter(myFolder) {
  var myFilteredFiles = myFolder.getFiles(myFileFilter);
  return myFilteredFiles;
}
//Mac OS version of file filter
//Have to provide a separate version because not all Mac OS users use file extensions
//and/or file extensions are sometimes hidden by the Finder.
function myFileFilter(myFile) {
  var myFileType = myFile.type;
  switch (myFileType) {
    case "JPEG":
    case "EPSF":
    case "PICT":
    case "TIFF":
    case "8BPS":
    case "GIFf":
    case "PDF ":
      return true;
      break;
    default:
      for (var myCounter = 0; myCounter < myExtensions.length; myCounter++) {
        var myExtension = myExtensions[myCounter];
        if (myFile.name.indexOf(myExtension) > -1) {
          return true;
          break;
        }
      }
  }
  return false;
}
//Function that adds the label.



/**
 * @className:MyLevenshtein.java
 * @classDescription:Levenshtein Distance 算法实现
 * 可以使用的地方：DNA分析 　　拼字检查 　　语音辨识 　　抄袭侦测
 * @author:donghai.wan
 * @createTime:2012-1-12
 */


/**
 * 　　DNA分析 　　拼字检查 　　语音辨识 　　抄袭侦测
 *
 * @createTime 2012-1-12
 */
function levenshtein(str1, str2) {
  //计算两个字符串的长度。
  var len1 = str1.length;
  var len2 = str2.length;
  //建立上面说的数组，比字符长度大一个空间
  var dif = new Array();
  // var dif=[len1 + 1][len2 + 1];
  //赋初值，步骤B。
  for (var a = 0; a <= len1; a++) {
    dif[a] = new Array();
    for (var b = 0; b <= len2; b++) {
      dif[a][b] = "";
    }
    dif[a][0] = a;
  }
  for (var a = 0; a <= len2; a++) {
    dif[0][a] = a;
  }
  //计算两个字符是否一样，计算左上的值
  var temp;
  for (var i = 1; i <= len1; i++) {
    for (var j = 1; j <= len2; j++) {
      if (str1.charAt(i - 1) == str2.charAt(j - 1)) {
        temp = 0;
      } else {
        temp = 1;
      }
      //取三个值中最小的
      dif[i][j] = Math.min(Math.min(dif[i - 1][j - 1] + temp, dif[i][j - 1] + 1),
        dif[i - 1][j] + 1);
    }
  }

  //取数组右下角的值，同样不同位置代表不同字符串的比较

  //计算相似度
  return 1- dif[len1][len2] / Math.max(str1.length, str2.length);



}
