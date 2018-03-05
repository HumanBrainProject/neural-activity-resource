
from django.conf.urls import url, include
from django.contrib import admin
# from app.views import browse, segment

from views import CollabID, AppID, Block

# from rest_framework import routers

# router = routers.DefaultRouter()
# router.register(r'users', UserViewSet)

urlpatterns = [

    #general 
    url(r'^collabidrest/$', CollabID.as_view()),
    url(r'^appid/$',AppID.as_view()),
    url(r'^blockdata/$', Block.as_view()),
    # url(r'^', include(router.urls)),
    # url(r'^admin/', admin.site.urls),
    # url(r'^browse/', browse, name='browse'),
    # url(r'^segment/', segment, name='segment'),


]