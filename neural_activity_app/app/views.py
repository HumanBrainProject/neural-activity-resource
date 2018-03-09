# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import View, ListView, DetailView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import (HttpResponse, JsonResponse,
                         HttpResponseBadRequest,     # 400
                         HttpResponseForbidden,      # 403
                         HttpResponseNotFound,       # 404
                         HttpResponseNotAllowed,     # 405
                         HttpResponseNotModified,    # 304
                         HttpResponseRedirect)       # 302

from rest_framework import (viewsets,
                            status,
                            mixins,
                            generics,
                            permissions,)
from rest_framework.views import APIView
from rest_framework.response import Response

from django.views.decorators.csrf import csrf_exempt, csrf_protect, ensure_csrf_cookie

from toolbox.user_auth_functions import (
    _is_collaborator, 
    is_authorised, 
    get_user_info, 
    is_hbp_member,
    get_storage_file_by_id,
)
from toolbox.nav_functions import (
    _get_collab_id,
    _get_app_id
)

from hbp_app_python_auth.auth import get_access_token, get_auth_header                         

from neo import io
# import numpy as np
# from django.core.serializers.json import DjangoJSONEncoder
# from neo.io import get_io

import jsonpickle
import jsonpickle.ext.numpy as jsonpickle_numpy
import json

from datetime import datetime


jsonpickle_numpy.register_handlers()


class DatetimeHandler(jsonpickle.handlers.BaseHandler):
    def flatten(self, obj, data):
        return obj.strftime('%Y-%m-%d %H:%M:%S.%f')


jsonpickle.handlers.registry.register(datetime, DatetimeHandler)

class Block(APIView): 
   
    def get(self, request, format=None, **kwargs):
       
        # filename = request.get('url')  ##url from collab and file name can be given from js. need to see if the url is temporary or not. if not, directly get url in backend and not in front.  
        #TO FILL
        # read neo file from hd
        r = io.AlphaOmegaIO(filename='File_AlphaOmega_2.map')
        block = r.read_block(lazy=False, cascade=True)
      
        block_data = {
        # 'annotations': block.annotations,
        # 'channel_indexes': block.channel_indexes,
        'description': block.description,
        # 'file_datetime': block.file_datetime,
        'file_origin': block.file_origin,
        # 'index': block.index,
        'name': block.name,
        'rec_datetime': block.rec_datetime,
        'segments': [
            {
                'name': s.name,
                # 'annotations': s.annotations,
                'description': s.description,
                # 'epochs': s.epochs,
                # 'events': s.events,
                'spiketrains': s.spiketrains,
                'rec_datetime': s.rec_datetime,
                # 'irregularlysampledsignals': s.irregularlysampledsignals,
                # 'index': s.index,
                # 'file_origin': s.file_origin,
                # 'block': s.block,
                'analogsignals': s.analogsignals,
            }
            for s in block.segments],
        }
     
        # encoder = DjangoJSONEncoder(ensure_ascii=False, indent=4)
        # return render(request, 'browse.html', {'data': encoder.encode(block_data)})
        #return Response({'data': json.dumps(block_data)})
        return Response({'data': jsonpickle.encode(block_data)})

class Segment(APIView): 
   
    def get(self, request, format=None, **kwargs):
      
        return Response()

class AnalogSignal(APIView): 
   
    def get(self, request, format=None, **kwargs):
       
        return Response()

# def browse(request):
#     """
#     display block
#     """

#     # read neo file from hd
#     r = io.AlphaOmegaIO(filename='File_AlphaOmega_2.map')
#     block = r.read_block(lazy=False, cascade=True)

#     block_data = {
#         # 'annotations': block.annotations,
#         # 'channel_indexes': block.channel_indexes,
#         'description': block.description,
#         # 'file_datetime': block.file_datetime,
#         'file_origin': block.file_origin,
#         # 'index': block.index,
#         'name': block.name,
#         'rec_datetime': block.rec_datetime,
#         'segments': [
#             {
#                 'name': s.name,
#                 # 'annotations': s.annotations,
#                 'description': s.description,
#                 # 'epochs': s.epochs,
#                 # 'events': s.events,
#                 'spiketrains': s.spiketrains,
#                 'rec_datetime': s.rec_datetime,
#                 # 'irregularlysampledsignals': s.irregularlysampledsignals,
#                 # 'index': s.index,
#                 # 'file_origin': s.file_origin,
#                 # 'block': s.block,
#                 'analogsignals': s.analogsignals,
#             }
#             for s in block.segments],
#     }

#     # encoder = DjangoJSONEncoder(ensure_ascii=False, indent=4)
#     # return render(request, 'browse.html', {'data': encoder.encode(block_data)})
#     return render(request, 'browse.html', {'data': jsonpickle.encode(block_data)})


def segment(request):
    """
    display chosen segment details
    """
    return HttpResponse("test")




#general 

class CollabID(APIView): 
    def get(self, request, format=None, **kwargs):
        if self.request.user == "AnonymousUser" :
            collab_id = 0
        else :         
            collab_id = _get_collab_id(request)

        return Response({
            'collab_id': collab_id,
        })

class AppID(APIView): 
    def get(self, request, format=None, **kwargs):

        if self.request.user == "AnonymousUser" :
            app_id = 0
        else :         
            app_id = _get_app_id(request)

        return Response({
            'app_id': app_id,
        })

