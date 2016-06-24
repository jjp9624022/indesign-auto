main();
function main(){
var myDoc=app.activeDocument;
var myText=app.findGrep();
var myObj=app.findObject();




for  (var i=0; i<myText.length;i++)
{
    
try{
var myStyle = myDoc.objectStyles. itemByName ("分栏网格");
myText[i].parentTextFrames[0].appliedObjectStyle=myStyle;
}
catch (myError){

myText[i].parentTextFrames[0].appliedObjectStyle=myStyle;
}    
    
    
 //   myText[i].parentTextFrames[0].nextTextFrame.parentPage.appliedMaster=NothingEnum.NOTHING;
//跨页的操作       
       // myText[i].parentTextFrames[0].nextTextFrame.parentPage.parent.appliedMaster=NothingEnum.NOTHING;

    
    }
for (var i=myObj.length-1;i>=0;i--)
{
   var myStyle = myDoc.objectStyles. itemByName ("分栏网格");
   var myT= findMyPage(myObj[i]);
   myT.appliedObjectStyle=myStyle;
}

}

function findMyPage(myOneObj){
   if( myOneObj.parentPage.bounds[3]<=myOneObj.geometricBounds[1]){
       return myOneObj.parentPage.textFrames[0].nextTextFrame;
       } else {
           return myOneObj.parentPage.textFrames[0]
           }
    
    }