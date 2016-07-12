#coding=utf-8
import json
from flask import Response
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
class BookListView(Resource):
    def get(self):
        heroes=[
            {'id':11,'name':'Mr. Nice'},
            {'id':12,'name':u'齐天大圣'},
            {'id':13,'name':'Bombasto'},
            {'id':14,'name':'Celeritas'},
            {'id':15,'name':'Magneta'},
            {'id':16,'name':'RubberMan'},
            {'id':17,'name':'Dynama'},
            {'id':18,'name':'Dr IQ'},
            {'id':19,'name':'Magma'},
            {'id':20,'name':'Tornado'}
        ]
        # return Response(json.dumps(heroes),  mimetype='application/json')
        return jsonify(data=heroes)
api.add_resource(PageView, '/api/<string:book_id>/<string:page_id>')
api.add_resource(ParaView, '/api/<string:book_id>/<string:page_id>/<string:para_id>')
api.add_resource(BookListView, '/api/books')


if __name__ == '__main__':
    app.run(debug=True)