import json
from django.http import HttpResponse, HttpResponseForbidden
from django.shortcuts import render_to_response, render
from uuid import UUID
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.http import  HttpResponseRedirect
from django.core.urlresolvers import reverse
import requests
from hbp_app_python_auth.auth import get_access_token, get_token_type, get_auth_header


from app.url_handler import get_url_ctx

@login_required(login_url='/login/hbp/')
def home(request):

    ctx = get_url_ctx(request)

    #to get app_id
    social_auth = request.user.social_auth.get()

    headers = {
        'Authorization': get_auth_header(request.user.social_auth.get())
    }
    #to get collab_id ///will need to clean a little.
    svc_url = settings.HBP_COLLAB_SERVICE_URL    
    url = '%scollab/context/%s/' % (svc_url, ctx)
    
    res = requests.get(url, headers=headers)

    return render(request, 'home.html', {})


@login_required(login_url='/login/hbp/')
def config(request):
    '''Render the config file'''
    print("configuration")
    res = requests.get(settings.HBP_ENV_URL)
    config = res.json()

    # Use this app client ID
    config['auth']['clientId'] = settings.SOCIAL_AUTH_HBP_KEY

    # Add user token informations
    request.user.social_auth.get().extra_data
    config['auth']['token'] = {
        'access_token': get_access_token(request.user.social_auth.get()),
        'token_type': get_token_type(request.user.social_auth.get()),
        'expires_in': request.session.get_expiry_age(),
    }
    config['build'] = settings.BUILD_INFO

    return HttpResponse(json.dumps(config), content_type='application/json')

@login_required(login_url='/login/hbp/')
def edit(request):
    return render(request, 'edit.html', {})