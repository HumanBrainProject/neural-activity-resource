"""
neural_activity_app URL configuration
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic.base import TemplateView

from neoview.views import Block, Segment, AnalogSignal


urlpatterns = [

    # API
    url(r'^blockdata/$', Block.as_view()),
    url(r'^segmentdata/$', Segment.as_view()),
    url(r'^analogsignaldata/$', AnalogSignal.as_view()),

    # Optional homepage, customize by editing index.html
#    url(r'^$',  TemplateView.as_view(template_name='index.html'), name="home"),
    url(r'^$',  TemplateView.as_view(template_name='hbp.html'), name="home"),
    url(r'^example2/$',  TemplateView.as_view(template_name='example2.html'), name="example2"),
]

