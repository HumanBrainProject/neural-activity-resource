#
#  Basic tutorial of pyxus client
#
#  Neural Activity Resource (NAR)
#  
#  (c) 2017
#
#  Copyright 2017 
#
#  Centre National de la Recherche Scientifique
#  Forschungszentrum Jülich
#  Code is licenced under the Apache 2.0 licence
#
#  * Installing pyxus (python 2.7.x)
#    pip install --upgrade git+https://github.com/HumanBrainProject/pyxus.git
#
#  See pyxus tests: 
#   
#  Tasks covered in the tutorial
#
#  1. Connection to KG instance via http client object.
#  2. Create a new organisation and list it. ('naro')
#  3. Create a new domain and list it ('tests')
#  4. Upload schema and read it. ('test_schema') a portion of foaf
#  5. Create a test instance. (test0)
#


organisation_name = "c57"
domain_name       = "nar"
schema_name       = "f0"
version           = "v0.0.1"
fpath             = organisation_name + "/" \
                    + domain_name + "/" \
                    + schema_name + "/" + version
# DO NOT Edit below unless you know it.

#
# 1. Connection to KG instance via http client object.
#
# Host details and http client
#
import os

#
# NEXUS_URL
# URL of nexus instance
#
host_url = os.environ['NEXUS_URL']
 
nar_host   = {
              'host': host_url, 
              'prefix': 'v0',
              'scheme': 'http'
             }
from pyxus.utils.http_client import HttpClient
nar_client = HttpClient(nar_host)

#
# 2. Create an organisation in KG and list it
#
# Local organization object
#  name, description
#  name should be at most 5 characters
#  host_url/v0/organizations/
#
from pyxus.resources.entity import Organization
from pyxus.resources.repository import OrganizationRepository
naro     = Organization.create_new(organisation_name, "HBP Neural Activity Resource")
# create organization on KG
org_repo = OrganizationRepository(nar_client)
org_repo.create(naro)
# List all organisation : new organization should be listed there 
kg_organizations = org_repo.list()
[print(x) for x in kg_organizations.results]

#
# 3. Create a new domain and list it. (test_schema)
#
from pyxus.resources.repository import DomainRepository
from pyxus.resources.entity import Domain
naro_tests = Domain.create_new(organisation_name, domain_name, "Test schemas")
# create Domain on naro
domain_repo = DomainRepository(nar_client)
domain_repo.create(naro_tests)
# List all domain in naro : new organization should be listed there 
naro_domains = domain_repo.list()
[str(x) for x in naro_domains.results]

#
# 4. Upload schema and read it. ('foaf_sh_schema')
#  
 

host_schema = "http://" + host_url + "/v0/schemas/" + fpath  
                
test_schema = {
        "@id": host_schema,
        "@type": "owl:Ontology",
        "@context": {
            "maxCount": {
                "@id": "sh:maxCount",
                "@type": "xsd:integer"
            },
            "minCount": {
                "@id": "sh:minCount",
                "@type": "xsd:integer"
            },
            "datatype": {
                "@id": "sh:datatype",
                "@type": "@id"
            },
            "name": "sh:name",
            "path": {
                "@id": "sh:path",
                "@type": "@id"
            },
            "nodeKind": {
                "@id": "node:Kind",
                "@type": "@id"
            },
            "description": "sh:description",
            "class": {
                "@id": "sh:class",
                "@type": "@id"
            },
            "property": {
                "@id": "sh:property",
                "@type": "@id"
            },
            "isDefinedBy": {
                "@id": "rdfs:isDefinedBy",
                "@type": "@id"
            },
            "targetClass": {
                "@id": "sh:targetClass",
                "@type": "@id"
            },
            "targetObjectOf": {
                "@id": "sh:targetObjectOf",
                "@type": "@id"
            },
            "node": {
                "@id": "sh:node",
                "@type": "@id"
            },
            "rest": {
                "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest",
                "@type": "@id"
            },
            "first": "http://www.w3.org/1999/02/22-rdf-syntax-ns#first",
            "in": {
                "@id": "sh:in",
                "@type": "@id"
            },
            "schema": "http://schema.org/",
            "this": host_schema,
            "foaf": "http://xmlns.com/foaf/0.1/",
            "sh": "http://www.w3.org/ns/shacl#",
            "owl": "http://www.w3.org/2002/07/owl#",
            "xsd": "http://www.w3.org/2001/XMLSchema#",
            "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
            "shapes": {
                "@reverse": "rdfs:isDefinedBy",
                "@type": "@id"
            }
        },
        "shapes": [
            {
              "@id": "foaf:PersonShape",
                "@type": "sh:NodeShape",
                "property": [
                    {
                     "path": "foaf:name",
                     "minCount": 1,
                     "maxCount": 1,
                     "datatype": "xsd:string" 
                    }
                ],
                "targetClass": "foaf:Person"
            }
        ]
    }

test_schema= {'@context': {'foaf': 'http://xmlns.com/foaf/0.1/',
  'narci': 'http://www.purl.org/narci/v0.2.1/schema#',
  'owl': 'http://www.w3.org/2002/07/owl#',
  'rdf': 'http://www.w3.org/2000/01/rdf-schema#',
  'rdfs': 'http://www.w3.org/1999/02/22-rdf-syntax-ns',
  'schema': 'http://schema.org/',
  'skos': 'http://www.w3.org/2004/02/skos/core#',
  'xsd': 'http://www.w3.org/2001/XMLSchema/'},
 '@id': '_:ub4bL15C21',
 'https://www.w3.org/ns/shacl.ttldatatype': {'@id': 'http://www.w3.org/2001/XMLSchema#string'},
 'https://www.w3.org/ns/shacl.ttlmaxCount': 1,
 'https://www.w3.org/ns/shacl.ttlminCount': 1,
 'https://www.w3.org/ns/shacl.ttlpath': {'@id': 'foaf:name'}}

from pyxus.resources.repository import SchemaRepository, Schema
#
# Create/publish a dummy schema called 'foafsh_schema'
# organization , domain, schema_name, version, json_ld_owl
#  
test_schema_obj = Schema.create_new(organisation_name, domain_name, schema_name, version, test_schema)
schema_repo     = SchemaRepository(nar_client)
schema_repo.create(test_schema_obj)
schema_repo.publish(test_schema_obj, True)

#
# Read a schema
#
testschema_read = schema_repo.read(organisation_name, domain_name, schema_name, version)
print(testschema_read)

#
# 5. Create a test instance. (test0)
# TODO
test_instance = { }
#      
from pyxus.resources.repository import InstanceRepository
from pyxus.resources.entity import Instance

# Create an instance of naro/tests/testschema (v0.0.2)
instance_repo = InstanceRepository(nar_client)
test0         = Instance.create_new(organisation_name, domain_name, schema_name, version, test_instance)
instance_repo.create(test0)
# get uuid
single_result = instance_repo.list(subpath=fpath, size=1, deprecated=None)
instance = single_result.results[0]
InstanceRepository._extract_uuid(instance.result_id)

