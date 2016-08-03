main();

function main() {

  objectStyles

  var dlg = new Window('dialog', '调整框架宽度', [100, 100, 480, 490]);
  dlg.btnPnl = dlg.add('panel', [25, 15, 355, 90], '选择参考物件');

  dlg.btnPn2 = dlg.add('panel', [25, 230, 355, 360], '');
  dlg.btnPnl.asFrameBounds = dlg.btnPnl.add('radiobutton', [20, 10, 170, 30], '依据文本框架');
  dlg.btnPnl.asColumnsBounds = dlg.btnPnl.add('radiobutton', [20, 40, 170, 60], '依据框架分栏');
  dlg.btnPnl.asColumnsBounds.onClick=function(){dlg.msgPnl.titleEt.enabled=true;}
  dlg.btnPnl.asFrameBounds.onClick=function(){dlg.msgPnl.titleEt.enabled=false;}

  dlg.msgPnl = dlg.add('panel', [25, 110, 355, 210], '参数');
  dlg.msgPnl.titleEt = dlg.msgPnl.add('statictext', [10, 10, 60, 30],'自定宽度');
  dlg.msgPnl.titleEt = dlg.msgPnl.add('edittext', [70, 10, 110, 30],'40');
  dlg.msgPnl.titleEt.enabled=false;
  // dlg.asFrameBounds.value = true;

  dlg.btnPn2.buildBtn = dlg.btnPn2.add('button', [10, 10, 70, 30], '确定', {
    name: 'ok'
  });
  dlg.btnPn2.cancelBtn = dlg.btnPn2.add('button', [80, 10, 140, 30], '取消', {
    name: 'cancel'
  });

  dlg.show();
  dlg.btnPn2.buildBtn.onClick= doChange(dlg);



}


function doChange(dlg) {
  var myDoc = app.activeDocument;
  var myObj = app.findObject();
  // alert('ok');

  for (var i = 0; i < myObj.length; i++) {
    // alert (myObj[i].geometricBounds);
    // alert (myObj[i].parentPage.textFrames[0].geometricBounds);
    // myObj[i].geometricBounds[1]=myObj[i].parentPage.textFrames[0].geometricBounds[1];
    // myObj[i].geometricBounds[3]=myObj[i].parentPage.textFrames[0].geometricBounds[3];
    if (dlg.btnPnl.asFrameBounds.value) {

      myObj[i].geometricBounds = [myObj[i].geometricBounds[0],
        myObj[i].parentPage.textFrames[0].geometricBounds[1],
        myObj[i].geometricBounds[2],
        myObj[i].parentPage.textFrames[0].geometricBounds[3]
      ];
    } else if (dlg.btnPnl.asColumnsBounds.value) {
     // alert(dlg.msgPnl.titleEt.text);
     var sale=Number(dlg.msgPnl.titleEt.text)/(myObj[i].geometricBounds[3]-myObj[i].geometricBounds[1])*(myObj[i].geometricBounds[2]-myObj[i].geometricBounds[0])

      myObj[i].geometricBounds = [
      myObj[i].geometricBounds[0],
      myObj[i].geometricBounds[1],
      myObj[i].geometricBounds[0]+sale,
      myObj[i].geometricBounds[1]+Number(dlg.msgPnl.titleEt.text),
      ];
      myObj[i].fit(FitOptions.frameToContent);
    }



    // alert (myObj[i].geometricBounds);

  }
}