# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render
from django.http import HttpResponse
from neo import io
# import numpy as np
# from django.core.serializers.json import DjangoJSONEncoder
# from neo.io import get_io
import jsonpickle
import jsonpickle.ext.numpy as jsonpickle_numpy
from datetime import datetime


jsonpickle_numpy.register_handlers()


class DatetimeHandler(jsonpickle.handlers.BaseHandler):
    def flatten(self, obj, data):
        return obj.strftime('%Y-%m-%d %H:%M:%S.%f')


jsonpickle.handlers.registry.register(datetime, DatetimeHandler)


def browse(request):
    """
    display block
    """

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
    return render(request, 'browse.html', {'data': jsonpickle.encode(block_data)})


def segment(request):
    """
    display chosen segment details
    """
    return HttpResponse("test")



