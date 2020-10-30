from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from starlette.middleware.cors import CORSMiddleware

from .resources import pipelines, recordings, vocab, auth, datasets
from . import settings


description = """
The Neural Activity Resource API is a web service to support retrieval and visualization of
in-depth metadata about neurophysiology experiments, including simulation results from modelling studies.

Using the [EBRAINS Knowledge Graph](https://kg.ebrains.eu) as its data store, the Neural Activity Resource API provides:

  - to be completed...

These pages provide interactive documentation. To try out queries, you will need an [EBRAINS user account](https://ebrains.eu/register/).
Please [login here](https://neural-activity-resource.brainsimulation.eu/login), then copy the "access token" into the dialog that appears when you click "Authorize" below.
(this workflow will be simplified in the near future).
"""

app = FastAPI(title="Neural Activity Resource API", description=description, version="0.1")

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SESSIONS_SECRET_KEY
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, tags=["Authentication and authorization"])
app.include_router(recordings.router, tags=["Electrophysiology recordings"])
app.include_router(pipelines.router, tags=["Data analysis pipelines"])
app.include_router(datasets.router, tags=["Datasets"])
app.include_router(vocab.router, tags=["Controlled vocabularies"])
