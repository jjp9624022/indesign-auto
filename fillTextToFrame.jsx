main();

function main() {
  reply = "";
  conn = new Socket;
// access Adobe’s home page
  if (conn.open ("www.adobe.com:80")) {
// send a HTTP GET request
  conn.write ("GET /index.html HTTP/1.0\n\n");
// and read the server’s reply
  reply = conn.read(999999);
  conn.close();
}
  var myDoc = app.activeDocument;
  var myText = app.findGrep();


  for (var i = 0; i < myText.length; i++) {
    var myCopyText = myText[i].contents;
    var myResurt = myText[i].changeGrep();
    myResurt[0].textFrames[0].contents=myCopyText;
  }



}
