# Basic tutorial on using pyxus

Covering basic usage of `pyxus` client.

## Installing `pyxus`

Installation can be performed with `pip` for latest version.

`pip install --upgrade git+https://github.com/HumanBrainProject/pyxus.git`

One can use named tag in install, consult with git manuals.

## Tutorial and topics

Tutorial is a commented Python source file called `pynux_basic_tutorial.py`. 
Shapes and data graphs are embedded inside the python code as well, but
ideally they should reside as an external file. The reason of 
embedding is that `hosting URL` appeared in `@id` is read as a 
an environment variable `NEXUS_URL`. Both, shapes and data graphs
are provided seperately as well for reference.

### Topics

* Connection to KG instance via http client object.
* Create a new organisation and list it. (organization name `naro`).
* Create a new domain and list it (domain name `tests`).
* Upload a schema and read it from Nexus. (`foafsh`).
* Create a test instance. TODO
