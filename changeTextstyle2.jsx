main();
function main(){
var myDoc=app.activeDocument;
var myText=app.findGrep();
var myObj=app.findObject();





for (var i=0;i<myObj.length;i++)
{
   var myStyle = myDoc.objectStyles. itemByName ("分栏网格");
   var myT= findMyPage(myObj[i]);
   myT.appliedObjectStyle=myStyle;
}

}

function findMyPage(myOneObj){
   if( myOneObj.parentPage.bounds[3]<=myOneObj.geometricBounds[1]){
       alert(myOneObj.parentPage.textFrames[0])
       return myOneObj.parentPage.textFrames[0].nextTextFrame;
       } else {
           return myOneObj.parentPage.textFrames[0]
           }
    
    }