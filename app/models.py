from flask import g
from simple_idml import idml
from lxml import etree
import xmltodict
# use sample json is ok and not XML.
class Book:
	# stories
	# idml
	# bookName
	# pageNumber
	# editors
	# id
	def __init__(self,id):
#with is bad
#to do
		my_idml_package = idml.IDMLPackage("./test.idml")
		self.stories=my_idml_package.get_story_object_by_xpath("*")
		self.idml=my_idml_package
		self.bookName=""
		self.pageNumber=""
		self.editors=""
		self.id=id

		#print etree.tostring(self.stories.node, pretty_print=True,encoding='UTF-8')
class Page:

	

	def __init__(self,id,in_book):
		self.xmlParas=in_book.stories.node.xpath("//Story/XMLElement[@MarkupTag='XMLTag/story']//XMLElement[@MarkupTag='XMLTag/paragraph' and child::XMLAttribute[@Name='page' and @Value='%s']]"%id)
		self.id=id
		self.number=""
		self.pageImg=""
		self.book=""
		self.paras=[xmlPara.xpath("./XMLAttribute[@Name='id']/@Value")[0] for xmlPara in self.xmlParas]
		

	def getParagraph(self,para_id):
		return [xmlPara for xmlPara in self.xmlParas if xmlPara.xpath("./XMLAttribute[@Name='id']/@Value")[0]==para_id][0]


class Paragraph:
	def __init__(self,id,in_page,in_book):
		self.xml=in_page.getParagraph(id)
		self.bounds=self.xml.xpath("./XMLAttribute[@Name='bounds']/@Value")[0].split(",")
		self.contents=self.xml.xpath("./Content/text()")
		self.changes=""
		

		
class Note:
	def __init__(self,id,in_para,in_page,in_book):
		self.xml=""
		self.bounds=""
		self.contents=""
		self.user=""
		self.date=""
		self.book=""
		self.page=""
		self.paragraph=""
class Change:
	def __init__(self,id,in_para,in_page,in_book):
		self.xml=""
		self.bounds=""
		self.contents=""
		self.user=""
		self.date=""
		self.book=""
		self.page=""
		self.paragraph=""


class User:
	def __init__(self,id,in_para,in_page,in_book):
		self.xml=""
		self.id=id

		

