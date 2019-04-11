// app.activeScriptUndoMode=UndoModes.ENTIRE_SCRIPT;
    var myDoc=app.activeDocument;
    var myTextFrames=myDoc.textFrames;

linkTextTextFrames();
function linkTextTextFrames(){

    var ts=new Array();
    var by = function(name,minor){
    return function(o,p){
        var a,b;
        if(o && p && typeof o === 'object' && typeof p ==='object'){
            // a = o[name];
            // b = p[name];
            a=o.extractLabel(name);
            b=p.extractLabel(name);
            if(a === b){
                return typeof minor === 'function' ? minor(o,p):0;
            }
            if(typeof a === typeof b){
                return a <b ? -1:1;
            }
            return typeof a < typeof b ? -1 : 1;
        }else{
            thro("error");
        }
    }
}




    for (var x=0;x<myTextFrames.length;x++){
       myTextFrames[x].insertLabel("pageNum", (0-myTextFrames[x].parentPage.index).toString());
       myTextFrames[x].insertLabel("local", (0-myTextFrames[x].geometricBounds[0]).toString());
              myTextFrames[x].insertLabel("id", myTextFrames[x].id.toString());


    ts.push(myTextFrames[x])
  }
   ts.sort(by("pageNum",by("id")));
  // ts.sort(by("id"));

    for (var x=0;x<ts.length-1;x++){

        //  alert(myTextFrames[x].contents.length);
        try{
          ts[x].nextTextFrame=ts[x+1]
            }catch(err)
  {
  //在这里处理错误
  alert(err);
  }
        


    
    }
    
    }
 
 
