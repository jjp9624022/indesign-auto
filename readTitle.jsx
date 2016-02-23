main();
function main(){
app.findGrepPreferences = NothingEnum.nothing;
app.changeGrepPreferences = NothingEnum.nothing;
app.findChangeGrepOptions.includeFootnotes = false;
app.findChangeGrepOptions.includeHiddenLayers = false;
app.findChangeGrepOptions.includeLockedLayersForFind = false;
app.findChangeGrepOptions.includeLockedStoriesForFind = false;
app.findChangeGrepOptions.includeMasterPages = false;
app.findGrepPreferences.appliedParagraphStyle='标题';
app.findGrepPreferences.findWhat = "~K+";
var myTitles=app.findGrep();
return myTitles;

}

