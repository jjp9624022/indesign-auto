main();

function main() {
	var dlg = new Window('dialog', '自动格式预调', [100, 100, 480, 490]);
	dlg.btnPnl = dlg.add('panel', [25, 15, 355, 130], '预变更');
	dlg.btnPn2 = dlg.add('panel', [25, 145, 355, 275], '选项组');
	dlg.btnPnl.testBtn = dlg.btnPnl.add('button', [10, 10, 70, 30], 'Test');

	dlg.btnPn2.buildBtn = dlg.btnPn2.add('button', [10, 10, 70, 30], '确定', {
		name: 'ok'
	});
	dlg.btnPn2.cancelBtn = dlg.btnPn2.add('button', [80, 10, 140, 30], '取消', {
		name: 'cancel'
	});
	dlg.show();


	reply = "";
	conn = new Socket;
	// access Adobe’s home page
	if (conn.open("www.adobe.com:80")) {
		// send a HTTP GET request
		conn.write("GET /index.html HTTP/1.0\n\n");
		// and read the server’s reply
		reply = conn.read(999999);
		conn.close();
	}
	// alert(reply);
	// $.evalFile("C:\\Users\\jjp\\py4id\\fillTextToFrame.jsx", 3000)
}