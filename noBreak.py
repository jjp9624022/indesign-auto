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
	for textsGroup in jieba.tokenize(myT.Contents):
		if myT.Characters[textsGroup[1]].baseline!=myT.Characters[textsGroup[2]-1].baseline:
			for num in range(textsGroup[1],textsGroup[2]):
				myT.Characters[num].NoBreak=True
			
					

