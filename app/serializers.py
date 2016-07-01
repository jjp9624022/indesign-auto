from marshmallow import Serializer, fields

class PageSerializer(Serializer):
    class Meta:
        fields = ("id","number","pageImg","book","paras")
         
class UserSerializer(Serializer):
    class Meta:
        fields = ("id", "title","img", "body", "user","tag", "created_at")

class ChangeSerializer(Serializer):
    user = fields.Nested(UserSerializer)
    class Meta:
	    fields = ("bounds","contents","user","date")

class ParaSerializer(Serializer):
    change = fields.Nested(ChangeSerializer)

    class Meta:
        fields=("id","bounds","contents","change")

class NoteSerializer(Serializer):
    class Meta:
        fields = ("id", "title","img", "body", "user","tag", "created_at")






