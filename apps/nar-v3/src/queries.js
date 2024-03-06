function buildKGQuery(baseType, structure) {
  return {
    "@context": {
      "@vocab": "https://core.kg.ebrains.eu/vocab/query/",
      query: "https://schema.hbp.eu/myQuery/",
      propertyName: {
        "@id": "propertyName",
        "@type": "@id",
      },
      path: {
        "@id": "path",
        "@type": "@id",
      },
    },
    meta: {
      type: `https://openminds.ebrains.eu/${baseType}`,
      responseVocab: "https://schema.hbp.eu/myQuery/",
    },
    structure: structure,
  };
}

function simpleProperty(name, options) {
  const defaultOptions = {
    sort: false,
  };
  const { sort } = { ...defaultOptions, ...options };
  let propertyName, path;
  if (name == "@id") {
    propertyName = "query:id";
    path = "@id";
  } else if (name == "@type") {
    propertyName = "query:type";
    path = "@type";
  } else if (name.includes("/")) {
    const pathParts = name.split("/");
    propertyName = `query:${pathParts[0]}`;
    path = pathParts.map((part) => `https://openminds.ebrains.eu/vocab/${part}`);
  } else {
    propertyName = `query:${name}`;
    path = `https://openminds.ebrains.eu/vocab/${name}`;
  }
  let prop = {
    propertyName: propertyName,
    path: path,
  };
  if (sort) {
    prop.sort = true;
  }
  return prop;
}

function linkProperty(name, structure, options) {
  const defaultOptions = {
    expectSingle: true,
    filter: "",
    required: false,
    type: null,
  };
  const { expectSingle, filter, required, type } = { ...defaultOptions, ...options };
  let prop = simpleProperty(name);

  if (expectSingle) {
    prop.singleValue = "FIRST";
  }
  if (structure && structure.length > 0) {
    prop.structure = structure;
  }
  if (type) {
    if (typeof prop.path === "string") {
      prop.path = [
        {
          "@id": prop.path,
        },
      ];
    }
    prop.path[0].typeFilter = {
      "@id": `https://openminds.ebrains.eu/${type}`,
    };
  }
  if (filter) {
    prop.filter = {
      op: "CONTAINS",
      value: filter,
    };
  }
  if (required) {
    prop.required = true;
  }
  return prop;
}

function reverseLinkProperty(forwardName, reverseName, structure, options) {
  const defaultOptions = {
    expectSingle: true,
    filter: "",
    required: false,
    type: null,
  };
  const { expectSingle, filter, required, type } = { ...defaultOptions, ...options };
  let prop = linkProperty(forwardName, structure, {
    expectSingle: expectSingle,
    required: required,
    filter: filter,
  });
  prop.path = {
    "@id": `https://openminds.ebrains.eu/vocab/${reverseName}`,
    reverse: true,
  };
  if (type) {
    prop.path.typeFilter = {
      "@id": `https://openminds.ebrains.eu/${type}`,
    };
  }
  return prop;
}

export { buildKGQuery, simpleProperty, linkProperty, reverseLinkProperty };
