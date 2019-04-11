#coding=utf-8
import sys
import codecs
reload(sys)  
sys.setdefaultencoding('utf8')
import win32com.client
import goslate
import urllib2
app = win32com.client.Dispatch('Indesign.Application')
proxy_handler = urllib2.ProxyHandler({"https" : "https://127.0.0.1:8087"})
proxy_opener = urllib2.build_opener(urllib2.HTTPHandler(proxy_handler),urllib2.HTTPSHandler(proxy_handler))

gs = goslate.Goslate(opener=proxy_opener)
myTitles=app.FindGrep()


for myT in myTitles:
    myT.Contents=myT.Contents+'\n'+gs.translate(myT.Contents, 'en')
  
