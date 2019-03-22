var myFilteredFiles;
app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;

myExtensions = [".jpg", ".jpeg", ".eps", ".ps", ".pdf", ".tif", ".tiff", ".gif", ".psd", ".ai", "png"]
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
    var sortedFiles = myFilteredFiles.sort(sortNumber)
    myFillImage(sortedFiles);


  }
}

function sortNumber(a, b) {
  //alert(a.name.split(".")[0]);
  return a.name.split(".")[0] - b.name.split(".")[0]
}


function myFillImage(myFiles) {

  var myDoc = app.activeDocument;
  var myObj = app.findObject();
  var myXML = myDoc.xmlElements[0].xmlElements[0].xmlElements;
  alert(myXML.length);


  //for (var i = 0; i < myObj.length; i++) {
  for (var i = 0; i < myXML.length; i++) {

    //alert(myObj[i].id);
    try {
      // myObj[i].place(myFiles[i]);
      // myObj[i].fit(FitOptions.FILL_PROPORTIONALLY);
      myXML[i].xmlContent.place(myFiles[i]);
      myXML[i].xmlContent.fit(FitOptions.FILL_PROPORTIONALLY);

    } catch (err) {
      alert(err);
    }
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
