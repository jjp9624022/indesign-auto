#coding=utf-8
import sys  
reload(sys)  
sys.setdefaultencoding('utf8')
import win32com.client
import codecs
app = win32com.client.Dispatch('Indesign.Application')
from pypinyin import pinyin, lazy_pinyin
import pypinyin
myfile= codecs.open('C:\\Users\\jjp\\py4id\\readTitle.jsx','r','utf-8')
ff=myfile.read()
myTitles=app.DoScript(ff,1246973031)
#处理拼音格式
def addPinyin(sometext):
    mylist=pinyin(sometext)
    str=u''
    for pp in mylist:
        str+=pp[0]+u' '
    print str.rstrip()
    return str.rstrip()
#添加拼音

for myT in myTitles:
    myT.Texts[0].RubyFlag=True
    myT.Texts[0].RubyString=addPinyin(myT.Texts[0].Contents)
  
