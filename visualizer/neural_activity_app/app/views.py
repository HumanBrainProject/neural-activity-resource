# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import hashlib
import os.path
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from neo.io import get_io
from rest_framework.response import Response
from rest_framework import status
try:
    from urllib import urlretrieve
except ImportError:
    from urllib.request import urlretrieve



class Block(APIView):

    def get(self, request, format=None, **kwargs):
        url = request.GET.get('url')
        na_file = get_local_path(url)
        try:
            block = get_io(na_file).read_block()
        except IOError:
            return Response({'error': 'incorrect file type'}, status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)

        # read neo file from hd
        block_data = {'block': [{
            'annotations': block.annotations,
            # 'channel_indexes': block.channel_indexes,
            'description': block.description or "",
            # 'file_datetime': block.file_datetime,
            'file_origin': block.file_origin or "",
            # 'index': block.index,
            'name': block.name or "",
            'rec_datetime': block.rec_datetime,
            'segments': [
                {
                    'name': s.name or "",
                    'annotations': s.annotations,
                    'description': s.description or "",
                    # 'epochs': s.epochs,
                    # 'events': s.events,
                    # 'spiketrains': s.spiketrains,
                    # 'spiketrains': [],
                    'rec_datetime': s.rec_datetime,
                    # 'irregularlysampledsignals': s.irregularlysampledsignals,
                    # 'index': s.index,
                    'file_origin': s.file_origin or "",
                    # 'block': s.block,
                    # 'analogsignals': s.analogsignals,
                    'analogsignals': [],
                }
                for s in block.segments],
            }]}

        return JsonResponse(block_data)


class Segment(APIView):

    def get(self, request, format=None, **kwargs):
        url = request.GET.get('url')
        na_file = get_local_path(url)
        block = get_io(na_file).read_block()
        id_segment = int(request.GET['segment_id'])
        segment = block.segments[id_segment]

        seg_data_test = {
                    'name': "segment 1",
                    'description': "a first fake segment",
                    'file_origin': "nowhere",
                    'spiketrains': [{}, {}],
                    'analogsignals': [{}, {}, {}]
                    }

        seg_data = {
                    'name': segment.name or "",
                    'description': segment.description or "",
                    'file_origin': segment.file_origin or "",
                    'annotations': segment.annotations,
                    # 'spiketrains': segment.spiketrains,
                    'analogsignals': [{} for a in segment.analogsignals],
                    #'as_prop': [{'size': e.size, 'name': e.name.decode('cp1252')} for e in segment.analogsignals]
                    'as_prop': [{'size': e.size, 'name': e.name} for e in segment.analogsignals]
                    }

        return JsonResponse(seg_data, safe=False)


class AnalogSignal(APIView):

    def get(self, request, format=None, **kwargs):
        url = request.GET.get('url')
        na_file = get_local_path(url)
        block = get_io(na_file).read_block()
        id_segment = int(request.GET['segment_id'])
        id_analog_signal = int(request.GET['analog_signal_id'])
        segment = block.segments[id_segment]
        analogsignal = segment.analogsignals[id_analog_signal]

        analog_signal_values = []
        for item in analogsignal:
            try:  # TODO find a better solution
                analog_signal_values.append(item.item())
            except ValueError:
                analog_signal_values.append(item[1].item())

        analog_signal_times= []
        for item in analogsignal.times:
            analog_signal_times.append(item.item())

        graph_data = {"values": analog_signal_values,
                      "values_units": str(analogsignal.units.dimensionality),
                      "times": analog_signal_times,
                      "times_dimensionality": str(analogsignal.t_start.units.dimensionality),
                      "t_start": analogsignal.t_start.item(),
                      "t_stop": analogsignal.t_stop.item()
                      }

        return JsonResponse(graph_data)


def get_local_path(url):
    extension = url.rsplit('.', 1)[1]
    filename = "data/" + hashlib.sha1(url.encode()).hexdigest() + '.' + extension
    if os.path.exists(filename):
        return filename
    else:
        return urlretrieve(url, filename)[0]


def home(request):
    """
    home page
    """
    url = request.GET.get('url')

    if url:
        # get url of neo file
        url = url.rsplit('.', 1)[0] + '.h5'  # TODO update for other file extensions
        filename = 'neo_file.h5'
        urlretrieve(url, filename)
        request.session['na_file'] = filename
    else:
        request.session['na_file'] = 'File_AlphaOmega_1.map'

    return render(request, 'home.html', {})


