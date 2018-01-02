// In some environments such as Nashorn this may already have a value
// In TopBraid this is redirecting to native Jena calls
var TermFactory = {

    REGEX_URI: /^([a-z][a-z0-9+.-]*):(?:\/\/((?:(?=((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*))(\3)@)?(?=(\[[0-9A-F:.]{2,}\]|(?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*))\5(?::(?=(\d*))\6)?)(\/(?=((?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*))\8)?|(\/?(?!\/)(?=((?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*))\10)?)(?:\?(?=((?:[a-z0-9-._~!$&'()*+,;=:@\/?]|%[0-9A-F]{2})*))\11)?(?:#(?=((?:[a-z0-9-._~!$&'()*+,;=:@\/?]|%[0-9A-F]{2})*))\12)?$/i,

    impl: require("rdflib"),   // This needs to be connected to an API such as $rdf

    // Globally registered prefixes for TTL short cuts
    namespaces: {},

    /**
     * Registers a new namespace prefix for global TTL short cuts (qnames).
     * @param prefix  the prefix to add
     * @param namespace  the namespace to add for the prefix
     */
    registerNamespace: function (prefix, namespace) {
        if (this.namespaces.prefix) {
            throw "Prefix " + prefix + " already registered"
        }
        this.namespaces[prefix] = namespace;
    },

    /**
     * Produces an RDF* term from a TTL string representation.
     * Also uses the registered prefixes.
     * @param str  a string, e.g. "owl:Thing" or "true" or '"Hello"@en'.
     * @return an RDF term
     */
    term: function (str) {
        // TODO: this implementation currently only supports booleans and qnames - better overload to rdflib.js
        if ("true" === str || "false" === str) {
            return this.literal(str, (this.term("xsd:boolean")));
        }

        if (str.match(/^\d+$/)) {
            return this.literal(str, (this.term("xsd:integer")));
        }

        if (str.match(/^\d+\.\d+$/)) {
            return this.literal(str, (this.term("xsd:float")));
        }

        const col = str.indexOf(":");
        if (col > 0) {
            const ns = this.namespaces[str.substring(0, col)];
            if (ns != null) {
                return this.namedNode(ns + str.substring(col + 1));
            } else {
                if (str.match(REGEX_URI)) {
                    return this.namedNode(str)
                }
            }
        }
        return this.literal(str);
    },

    /**
     * Produces a new blank node.
     * @param id  an optional ID for the node
     */
    blankNode: function (id) {
        return this.impl.blankNode(id);
    },

    /**
     * Produces a new literal.  For example .literal("42", T("xsd:integer")).
     * @param lex  the lexical form, e.g. "42"
     * @param langOrDatatype  either a language string or a URI node with the datatype
     */
    literal: function (lex, langOrDatatype) {
        return this.impl.literal(lex, langOrDatatype)
    },

    // This function is basically left for Task Force compatibility, but the preferred function is uri()
    namedNode: function (uri) {
        return this.impl.namedNode(uri)
    },

    /**
     * Produces a new URI node.
     * @param uri  the URI of the node
     */
    uri: function (uri) {
        return TermFactory.namedNode(uri);
    }
};

module.exports = TermFactory;