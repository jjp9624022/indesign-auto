#coding=utf-8

from flask import Flask
from flask import jsonify
from flask_restful import Resource, Api
from serializers import PageSerializer, ParaSerializer
from lxml import etree
from models import Book, Page,Paragraph
import xmltodict
#flask app setup,and restfull
app = Flask(__name__)
# if __name__ == '__main__':
#     app.run(debug=True)
api = Api(app)


class PageView(Resource):
    def get(self,book_id,page_id):
        book=Book(book_id)
        page=Page(page_id,book)
        return PageSerializer(page).data

class ParaView(Resource):
    def get(self,book_id,page_id,para_id):
        book=Book(book_id)
        page=Page(page_id,book)
        para=Paragraph(id=para_id,in_page=page,in_book=book)
        return ParaSerializer(para).data
api.add_resource(PageView, '/<string:book_id>/<string:page_id>')
api.add_resource(ParaView, '/<string:book_id>/<string:page_id>/<string:para_id>')


if __name__ == '__main__':
    app.run(debug=True)