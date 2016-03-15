#coding=utf-8
import sys
import codecs
reload(sys)  
sys.setdefaultencoding('utf8')
import win32com.client
app = win32com.client.Dispatch('Indesign.Application')
from pypinyin import pinyin, lazy_pinyin, load_single_dict

myTitles=app.FindGrep()
#设置分类错误的拼音
load_single_dict({0x7684:u'de,d\xed'})
def strB2Q(ustring):
    """半角转全角"""
    rstring = ""
    for uchar in ustring:
        inside_code=ord(uchar)
        if inside_code == 32:                                 #半角空格直接转化                  
            inside_code = 12288
        elif inside_code >= 32 and inside_code <= 126:        #半角字符（除空格）根据关系转化
            inside_code += 65248

        rstring += unichr(inside_code)
    return rstring

#处理拼音格式
def addPinyin(sometext):
    mylist=pinyin(sometext,heteronym=True)
    str=u''
    for pp in mylist:
        str+=pp[0]+u' '
#去除最后空格
    
    return strB2Q(str.rstrip())
#添加拼音

for myT in myTitles:
    myT.Texts[0].RubyFlag=True
    myT.Texts[0].RubyString=addPinyin(myT.Texts[0].Contents)
  
