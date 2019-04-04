# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os.path
from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.views import APIView
from neo.io import get_io
from neo import io
from rest_framework.response import Response
from rest_framework import status
try:
    from urllib import urlretrieve, HTTPError
except ImportError:
    from urllib.request import urlretrieve,HTTPError
try:
    unicode
except NameError:
    unicode = str


def _get_file_from_url(request):
    url = request.GET.get('url')
    if url:
        filename = url[url.rfind("/") + 1:]
        urlretrieve(url, filename)
        # todo: wrap previous line in try..except so we can return a 404 if the file is not found
        #       or a 500 if the local disk is full

        # if we have a text file, try to download the accompanying json file
        name, ext = os.path.splitext(filename)
        if ext[1:] in io.AsciiSignalIO.extensions:  # ext has a leading '.'
            metadata_filename = filename.replace(ext, "_about.json")
            metadata_url = url.replace(ext, "_about.json")
            try:
                urlretrieve(metadata_url, metadata_filename)
            except HTTPError:
                pass

        return filename
    else:
        return JsonResponse({'error': 'URL parameter is missing', 'message': ''},
                             status=status.HTTP_400_BAD_REQUEST)


def _handle_dict(ob):
    return {k: unicode(v) for k, v in ob.items()}


class Block(APIView):

    def get(self, request, format=None, **kwargs):

        na_file = _get_file_from_url(request)

        if 'type' in request.GET and request.GET.get('type'):
            iotype = request.GET.get('type')
            method = getattr(io, iotype)
            r = method(filename=na_file)
            block = r.read_block()
        else:
            try:
                block = get_io(na_file).read_block()
            except IOError as err:
                # todo: need to be more fine grained. There could be other reasons
                #       for an IOError
                return JsonResponse({'error': 'incorrect file type', 'message': str(err)},
                                    status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)

        block_data = {'block': [{
            'annotations': _handle_dict(block.annotations),
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
                    'annotations': _handle_dict(s.annotations),
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

        na_file = _get_file_from_url(request)

        block = get_io(na_file).read_block()
        id_segment = int(request.GET['segment_id'])
        # todo, catch MultiValueDictKeyError in case segment_id isn't given, and return a 400 Bad Request response
        segment = block.segments[id_segment]
        # todo, catch IndexError, and return a 404 response

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
                    'annotations': _handle_dict(segment.annotations),
                    # 'spiketrains': segment.spiketrains,
                    'analogsignals': [{} for a in segment.analogsignals],
                    'as_prop': [{'size': e.size, 'name': e.name} for e in segment.analogsignals]
                    }

        return JsonResponse(seg_data, safe=False)


class AnalogSignal(APIView):

    def get(self, request, format=None, **kwargs):
        na_file = _get_file_from_url(request)

        block = get_io(na_file).read_block()
        id_segment = int(request.GET['segment_id'])
        id_analog_signal = int(request.GET['analog_signal_id'])
        # todo, catch MultiValueDictKeyError in case segment_id or analog_signal_id aren't given, and return a 400 Bad Request response
        segment = block.segments[id_segment]
        analogsignal = segment.analogsignals[id_analog_signal]
        # todo, catch any IndexErrors, and return a 404 response

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
        print("name", analogsignal.name)
        print("size", analogsignal.size)

        # print('analogsignal', analogsignal[0], analogsignal[0].sampling_rate)
        # analog_signal = block.segments[id_segment].analogsignals[id_analog_signal]
        # print(analog_signal)

        analog_signal_values = []
        for item in analogsignal:
            try:  # TODO find a better solution
                analog_signal_values.append(item.item())
            except ValueError:
                analog_signal_values.append(item[1].item())

        analog_signal_times= []
        for item in analogsignal.times:
            analog_signal_times.append(item.item())

        graph_data = {
            "name": analogsignal.name,
            "values": analog_signal_values,
            "values_units": str(analogsignal.units.dimensionality),
            "times": analog_signal_times,
            "times_dimensionality": str(analogsignal.t_start.units.dimensionality),
            "t_start": analogsignal.t_start.item(),
            "t_stop": analogsignal.t_stop.item(),
            "sampling_rate": float(analogsignal.sampling_rate.magnitude),
            "sampling_rate_units": str(analogsignal.sampling_rate.units.dimensionality)
        }

        return JsonResponse(graph_data)
