# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import View, ListView, DetailView, TemplateView
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

from neo import io
import quantities as pq
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
        print(request.GET)
        id_segment = int(request.GET['segment_id'])
        id_analog_signal = int(request.GET['analog_signal_id'])
    
        r = io.AlphaOmegaIO(filename='File_AlphaOmega_2.map')
        block = r.read_block(lazy=False, cascade=True)  
        segment = block.segments[id_segment]
        analogsignal = segment.analogsignals[id_analog_signal]

        # unit = analogsignal.units 
        # t_start = analogsignal.t_start
        # sampling_rate = analogsignal.sampling_rate
        # time_laps = 1/sampling_rate

        print("anaolgsignals", analogsignal, len(analogsignal))
        print( "units",analogsignal.units)
        print( "t_start",analogsignal.t_start)
        print("sampling_rate", analogsignal.sampling_rate)
        print( "t_stop",analogsignal.t_stop)
        print( "times",analogsignal.times)
        print("duration",analogsignal.duration)      
   
        # print('analogsignal', analogsignal[0], analogsignal[0].sampling_rate)
        # analog_signal = block.segments[id_segment].analogsignals[id_analog_signal]
        # print(analog_signal)
  
        analog_signal_values = []
        for item in analogsignal:
            analog_signal_values.append(item.item())

        analog_signal_times= []
        for item in analogsignal.times:
            analog_signal_times.append(item.item())

        graph_data = {"values": analog_signal_values, "times": analog_signal_times,"t_start" : analogsignal.t_start.item(), "t_stop" : analogsignal.t_stop.item()}
        # data = JSON.dumps(graph_data)
        return JsonResponse(graph_data)


# def browse(request):
#     """

def home(request):
    """
    home page
    """
    return render(request, 'home.html', {})


