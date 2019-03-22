app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
myExtensions = [".doc", ".docx"]
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






var myDoc = app.activeDocument;
var myObj = app.findObject();
for (var i = 0; i < myObj.length; i++) {


  try {

   myObj[i].place(File(findFileByName(findTitle(myObj[i],titlesInfo),myFiles)));
    // myObj[i].place(File(myFiles[i]));
    myObj[i].fit(Options.FILL_PROPORTIONALLY);
    // myResurt[0].textFrames[0].contents=myCopyText;

  } catch (err) {
    //alert(err);
  }
}



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
