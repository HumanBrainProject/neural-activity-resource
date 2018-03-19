"""neural_activity_app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from app.views import home
# from rest_framework import routers

# router = routers.DefaultRouter()
# router.register(r'users', UserViewSet)

from app.views import Block, Segment, AnalogSignal

# from rest_framework import routers

# router = routers.DefaultRouter()
# router.register(r'users', UserViewSet)

urlpatterns = [

    #general 
    url(r'^blockdata/$', Block.as_view()),
     url(r'^segmentdata/$', Segment.as_view()),
    url(r'^analogsignaldata/$', AnalogSignal.as_view()),
  
    # url(r'^', include(router.urls)),
    url(r'^admin/', admin.site.urls),
    url(r'^', home, name='home')
]
