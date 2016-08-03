main();
myNoTextTextFrames();
function main(){

var myText=app.findGrep();
for  (var i=0; i<myText.length;i++)
{
          try{

    myText[i].parentTextFrames[0].parentPage.appliedMaster=NothingEnum.NOTHING;
    }catch(err)
  {
  //在这里处理错误
  alert(err);
  }
 //   myText[i].parentTextFrames[0].nextTextFrame.parentPage.appliedMaster=NothingEnum.NOTHING;
//跨页的操作       
       // myText[i].parentTextFrames[0].nextTextFrame.parentPage.parent.appliedMaster=NothingEnum.NOTHING;

    
    }
app.findGrepPreferences = NothingEnum.nothing;
app.changeGrepPreferences = NothingEnum.nothing;
app.findChangeGrepOptions.includeFootnotes = false;
app.findChangeGrepOptions.includeHiddenLayers = false;
app.findChangeGrepOptions.includeLockedLayersForFind = false;
app.findChangeGrepOptions.includeLockedStoriesForFind = false;
app.findChangeGrepOptions.includeMasterPages = false;
}

function myNoTextTextFrames(){
    var myDoc=app.activeDocument;
    var myTextFrames=myDoc.textFrames;
    for (var x=0;x<myTextFrames.length;x++){
        if (myTextFrames[x].contents.length<1){
        //  alert(myTextFrames[x].contents.length);
        try{
          myTextFrames[x].parentPage.appliedMaster=NothingEnum.NOTHING;
            }catch(err)
  {
  //在这里处理错误
  alert(err);
  }
        

}
    
    }
    
    }