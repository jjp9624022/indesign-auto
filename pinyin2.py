#coding=utf-8
import sys  
reload(sys)  
sys.setdefaultencoding('utf8')
import win32com.client
app = win32com.client.Dispatch('Indesign.Application')
from pypinyin import pinyin, lazy_pinyin
import pypinyin

myTitles=app.FindGrep()
#处理拼音格式
def addPinyin(sometext):
    mylist=pinyin(sometext)
    str=u''
    for pp in mylist:
        str+=pp[0]+u' '
#去除最后空格
    return str.rstrip()
#添加拼音

for myT in myTitles:
    myT.Texts[0].RubyFlag=True
    myT.Texts[0].RubyString=addPinyin(myT.Texts[0].Contents)
  
