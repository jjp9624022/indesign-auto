main();
function main(){

var myText=app.findGrep();
for  (var i=0; i<myText.length;i++)
{
    myText[i].parentTextFrames[0].parentPage.appliedMaster=NothingEnum.NOTHING;
    myText[i].parentTextFrames[0].nextTextFrame.parentPage.appliedMaster=NothingEnum.NOTHING;
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

