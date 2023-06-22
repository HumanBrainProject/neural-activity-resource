


function buildKGQuery(baseType, structure) {
    return {
      "@context": {
        "@vocab": "https://core.kg.ebrains.eu/vocab/query/",
        "query": "https://schema.hbp.eu/myQuery/",
        "propertyName": {
          "@id": "propertyName",
          "@type": "@id"
        },
        "path": {
          "@id": "path",
          "@type": "@id"
        }
      },
      "meta": {
        "type": `https://openminds.ebrains.eu/${baseType}`,
        "responseVocab": "https://schema.hbp.eu/myQuery/"
      },
      "structure": structure
    }
}


function simpleProperty(name) {
    let propertyName, path;
    if (name == "@id") {
        propertyName = "query:id";
        path = "@id";
    } else if (name == "@type") {
        propertyName = "query:type";
        path = "@type";
    } else if (name.includes("/")) {
        const pathParts = name.split("/");
        propertyName = `query:${pathParts[0]}`
        path = pathParts.map(part => `https://openminds.ebrains.eu/vocab/${part}`)
    } else {
        propertyName = `query:${name}`
        path = `https://openminds.ebrains.eu/vocab/${name}`
    }
    return {
        propertyName: propertyName,
        path: path
    }
}


function linkProperty(name, structure, options) {
    const defaultOptions = {
        expectSingle: true,
        filter: ""
    }
    const {expectSingle, filter} = {...defaultOptions, ...options}
    let prop = simpleProperty(name);

    if (expectSingle) {
        prop.singleValue = "FIRST"
    }
    if (structure) {
        prop.structure = structure
    }
    if (filter) {
        prop.filter = {
            op: "CONTAINS",
            value: filter
        }
    }
    return prop
}

function reverseLinkProperty(forwardName, reverseName, structure, options) {
    const defaultOptions = {
        expectSingle: true,
        filter: "",
        type: null
    }
    const {expectSingle, filter, type} = {...defaultOptions, ...options}
    let prop = linkProperty(forwardName, structure, {expectSingle: expectSingle, filter: filter})
    prop.path = {
        "@id": `https://openminds.ebrains.eu/vocab/${reverseName}`,
        reverse: true
    }
    if (type) {
        prop.path.typeFilter = {
            "@id": `https://openminds.ebrains.eu/${type}`
        }
    }
    return prop
}


export {
    buildKGQuery, simpleProperty, linkProperty, reverseLinkProperty
}