#coding=utf-8
import sys
import codecs
reload(sys)  
sys.setdefaultencoding('utf8')
import win32com.client
import jieba

app = win32com.client.Dispatch('Indesign.Application')
myTitles=app.FindGrep()

for myT in myTitles:
	result = jieba.tokenize(myT.Contents)
	for textsGroup in result:
		print myT.Characters[0]

		for char in myT.Characters.itemByRange(textsGroup[1],textsGroup[2]):

		 	char.noBreak=True

