from user_auth_functions import *

from uuid import UUID
import json


  
def _get_collab_id(request):
    social_auth = request.user.social_auth.get()
    headers = {
        'Authorization': get_auth_header(request.user.social_auth.get())
    }
    ctx = request.GET.getlist('ctx')[0]
    svc_url = settings.HBP_COLLAB_SERVICE_URL    
    url = '%scollab/context/%s/' % (svc_url, ctx)
    res = requests.get(url, headers=headers)
    collab_id = res.json()['collab']['id']

    return collab_id

def _get_app_id(request):
    social_auth = request.user.social_auth.get()
    headers = {
        'Authorization': get_auth_header(request.user.social_auth.get())
    }
    #to get collab_id
    svc_url = settings.HBP_COLLAB_SERVICE_URL    
    ctx = request.GET.getlist('ctx')[0]
    
    url = '%scollab/context/%s/' % (svc_url, ctx)
    res = requests.get(url, headers=headers)
    app_id = res.json()['id']
    
    return app_id
