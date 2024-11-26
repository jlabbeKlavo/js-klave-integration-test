const { klaveDeployApp, klaveAddKredits, klaveRequest, klaveCloseConnection, klaveOpenConnection, klaveTransaction } = require('../../../klave_network');
const fs = require('fs');

//wasm to deploy must be copied post generation coming from yarn build command
const app_id = "test_sdk";
const fqdn = "main.7a032d48.test-klave-sdk.IntegrationTests.klave.network";
const WASM_TESTKLAVESDK = './config/wasm/testklavesdk_b64';

const testRunCmdCryptoSDKApp = async () => {
  let user_connected = await klaveOpenConnection();
  console.log("user_connected: ", user_connected);
  if (user_connected)
  {
    let testInput = {
      "useDefault":true
    };    
    let test_results = await klaveTransaction(FQDN,"testECDSA_256_PKCS8_KeyECC", JSON.stringify(testInput));
    test_results = await klaveTransaction(FQDN,"testECDSA_384_PKCS8_KeyECC", JSON.stringify(testInput));
    test_results = await klaveTransaction(FQDN,"testECDSA_521_PKCS8_KeyECC", JSON.stringify(testInput));
    test_results = await klaveTransaction(FQDN,"testECDSA_256_PKCS8_SC", JSON.stringify(testInput));
    test_results = await klaveTransaction(FQDN,"testECDSA_256_SEC1_SC", JSON.stringify(testInput));
    test_results = await klaveTransaction(FQDN,"testAES_128_RAW_KeyAES", JSON.stringify(testInput));

    testInput = {
      "useDefault":false
    };  
    test_results = await klaveTransaction(FQDN,"testECDSA_256_PKCS8_KeyECC", JSON.stringify(testInput));
    test_results = await klaveTransaction(FQDN,"testECDSA_384_PKCS8_KeyECC", JSON.stringify(testInput));
    test_results = await klaveTransaction(FQDN,"testECDSA_521_PKCS8_KeyECC", JSON.stringify(testInput));
    test_results = await klaveTransaction(FQDN,"testECDSA_256_PKCS8_SC", JSON.stringify(testInput));
    test_results = await klaveTransaction(FQDN,"testECDSA_256_SEC1_SC", JSON.stringify(testInput));
    test_results = await klaveTransaction(FQDN,"testAES_128_RAW_KeyAES", JSON.stringify(testInput));

    //Generate a key in a first transaction and use it in a second one
    testInput = {
      "keyName":"testKey",
      "key": {
        "format":"",
        "keyData":"",
        "algorithm": "aes128gcm",
        "extractable": true,
        "keyUsages": ["encrypt", "decrypt"]
      }
    };
    test_results = await klaveTransaction(FQDN,"generateKey", testInput);

    testInput = {
      "keyName":"testKey",
    };
    test_results = await klaveTransaction(FQDN,"testAES_128_RAW_KeyAES_external_key", testInput);

    testInput = {
      "keyName":"testKey",
    };
    test_results = await klaveTransaction(FQDN,"testSHA_256", testInput);

  }
  klaveCloseConnection();
}

module.exports = {
  testRunCmdCryptoSDKApp,
}
