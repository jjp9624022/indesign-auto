var myTables;
var myFrame;

getTables();
try {
	myTables.everyItem().rows.firstItem().cells.everyItem().appliedCellStyle = app.documents[0].cellStyles.item("表头行", true);
	myTables.everyItem().rows.lastItem().cells.everyItem().appliedCellStyle = app.documents[0].cellStyles.item("表尾行", true);

	myTables.everyItem().cells.everyItem().clearCellStyleOverrides(true);

} catch (err) {
alert(err);
}




function getTables() {
	if (app.documents.length != 0) {
		if (app.selection.length > 0) {
			myObjectList = new Array;
			myTables = app.selection[0].tables;
			myFrame = app.selection[0].parent;
		}
	}
}

