const { klaveTransaction, klaveCloseConnection, klaveOpenConnection } = require('../../../klave_network');

const fqdn = "test_sdk_smart_contract_2";

const testAES_128 = async () => {
  let user_connected = await klaveOpenConnection();
  console.log("user_connected: ", user_connected);
  if (user_connected)
  {
    let generateKeyInput = {
      "keyName":"AES_128_RAW_Key1",
      "key": {
        "format":"",
        "keyData":"",
        "algorithm": "aes128gcm",
        "extractable": true,
        "usages": ["encrypt", "decrypt"]
      }
    };
    let test_results = await klaveTransaction(fqdn,"generateKey", generateKeyInput);

    let exportKeyInput = {
        "keyName":"AES_128_RAW_Key1",
        "format":"raw"
    };
    test_results = await klaveTransaction(fqdn,"exportKey", exportKeyInput);

    let encryptInput = {
      "keyName":"AES_128_RAW_Key1",
      "clearText":"HelloWorld"
    };
    test_results = await klaveTransaction(fqdn,"encrypt", encryptInput);

    let decryptInput = {
      "keyName":"AES_128_RAW_Key1",
      "cipherTextB64":test_results.message
    };

    test_results = await klaveTransaction(fqdn,"decrypt", decryptInput);

}
  klaveCloseConnection();
}

module.exports = {
    testAES_128
}