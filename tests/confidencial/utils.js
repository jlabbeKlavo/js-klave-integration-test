export const confidencialKeyInput = (keyName, keyPair, format, extractable) => {
    let input = {
        "keyName":keyName,
        "keyPair":keyPair,
        "format":format,
        "extractable":extractable
    };
    return input;
}
  