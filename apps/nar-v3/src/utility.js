

function uuidFromUri(uri) {
    const parts = uri.split("/");
    return parts[parts.length - 1];
  }


export { uuidFromUri }