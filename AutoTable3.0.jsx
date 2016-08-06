var myTables;
var myFrame;
var globalWidth = 79;

getTables();
try {
	// myTables.everyItem().appliedTableStyle = app.documents[0].tableStyles.item("正常表", true);
	myTables.everyItem().cells.everyItem().appliedCellStyle = app.documents[0].cellStyles.item("单元格样式1", true);
	myTables.everyItem().cells.everyItem().clearCellStyleOverrides(true);
	myTables.everyItem().cells.everyItem().texts.everyItem().appliedParagraphStyle = app.documents[0].paragraphStyles.item("表文", true);
	myTables.everyItem().cells.everyItem().texts.everyItem().clearOverrides();
	//myTable.cells.everyItem().appliedCellStyle=app.documents[0].cellStyles.item("正常单元格",true);
	//myTable.rows.everyItem().cells.everyItem().texts.everyItem().appliedParagraphStyle=app.documents[0].paragraphStyles.item("表格正文",true);
	//myTable.cells.texts.everyItem().appliedParagraphStyle=app.documents[0].paragraphStyles.item("表格正文",true);


} catch (err) {

}

for (var i = 0; i < myTables.length; i++) {

	var scare = globalWidth / myTables[i].width;
	for (var m=0;m<myTables[i].columns.length;m++){

	myTables[i].columns[m].width *= scare;
		
	}
}


function getTables() {
	if (app.documents.length != 0) {
		if (app.selection.length > 0) {
			myObjectList = new Array;
			myTables = app.selection[0].tables;
			myFrame = app.selection[0].parent;
		}
	}
	// return app.selection;
}




// pwmRow(myTable.everyItem().columns);

// function pwmRow(theRow) {
// 	for (theColumn in theRow) {
// 		var overflower = theRow.everyItem().cells.anyItem().overflows;

// 		while (!overflower) {
// 			doPart(theColumn);
// 			overflower = theRow.everyItem().cells.anyItem().overflows;
// 		}

// 		while (overflower) {
// 			doDobble(theColumn);
// 			overflower = theRow.everyItem().cells.anyItem().overflows;
// 		}

// 		function doPart(row) {

// 			row.width = row.width * 0.5
// 		}

// 		function doDobble(row) {

// 			row.width = row.width + (row.width * 0.5)
// 		}

// 	}
// }




// function getHeight(f) {
// 	return f.geometricBounds[2] - f.geometricBounds[0];

// }

// function getweith(f) {
// 	return f.geometricBounds[3] - f.geometricBounds[1];

// }