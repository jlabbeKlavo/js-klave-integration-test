const { klaveDeployApp, klaveTransaction, klaveQuery, klaveCloseConnection, klaveOpenConnection, APP_ID, FQDN } = require('../../../klave_network');
const { base64ToArrayBuffer, getMessageEncoding, arrayBufferToBase64 } = require('../../../utils');
const { subtle } = require('crypto').webcrypto;

//wasm to deploy must be copied post generation coming from yarn build command
const WASM_TESTKLAVESDK = './config/wasm/test-klave-sdk_b64';

const deploySdkTestApp = async () => {
  let user_connected = await klaveOpenConnection();
  console.log("user_connected: ", user_connected);
  if (user_connected)
  {
    await klaveDeployApp(APP_ID, FQDN, WASM_TESTKLAVESDK);
  }
  klaveCloseConnection();
}

const testECDSA_256_R1_PKCS8 = async (importKey) => {
  console.log("testECDSA_256: importKey{" + importKey + "}");
  let user_connected = await klaveOpenConnection();
  console.log("user_connected: ", user_connected);
  if (user_connected)
  {
    let keyName = "";
    if (importKey) 
    {
      keyName = "ECDSA_256_R1_PKCS8_Key2";
      let importKeyInput = {
        "keyName":keyName,
        "key": {
          "format":"pkcs8",
          "keyData":"MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgTt/Y3m9s0+rVTqnZruGG4zZy4N95uQEj5WTnyZD6p5KhRANCAAR5cjZzyTG+k6FlMs+Igo+mhiC1LOKMl+yg7qpdur6m3GlEpy/4whpA6xi2UnBH9PQsiY5r1xxgivn48YgfuC5h",
          "algorithm": "secp256r1",
          "extractable": true,
          "usages": ["sign"]
        }
      };
      await klaveTransaction(FQDN,"importKey", importKeyInput);
    }
    else 
    {
      keyName = "ECDSA_256_R1_PKCS8_Key1";
      let generateKeyInput = {
        "keyName":keyName,
        "key": {
          "format":"",
          "keyData":"",
          "algorithm": "secp256r1",
          "extractable": true,
          "usages": ["sign"]
        }
      };
      await klaveTransaction(FQDN,"generateKey", generateKeyInput);
    }

    let getPublicKeyInput = {
        "keyName":keyName,
        "format":"spki"
    };
    let test_results = await klaveTransaction(FQDN,"getPublicKey", getPublicKeyInput);

    let exportKeyInput = {
        "keyName":keyName,
        "format":"pkcs8"
    };
    test_results = await klaveTransaction(FQDN,"exportKey", exportKeyInput);

    exportKeyInput = {
        "keyName":keyName,
        "format":"sec1"
    };
    test_results = await klaveTransaction(FQDN,"exportKey", exportKeyInput);

    exportKeyInput = {
        "keyName":keyName,
        "format":"spki"
    };
    test_results = await klaveTransaction(FQDN,"exportKey", exportKeyInput);

    signInput = {
        "keyName":keyName,
        "clearText":"HelloWorld"
    };
    test_results = await klaveTransaction(FQDN,"sign", signInput);

    verifyInput = {
        "keyName":keyName,
        "clearText":"HelloWorld",
        "signatureB64":test_results.message,
    };
    test_results = await klaveTransaction(FQDN,"verify", verifyInput);

}
  klaveCloseConnection();
}

const testECDSA_256_R1_SPKI = async (importKey) => {
  console.log("testECDSA_256_R1_SPKI: importKey{" + importKey + "}");
  let user_connected = await klaveOpenConnection();
  console.log("user_connected: ", user_connected);
  if (user_connected)
  {
    let keyName = "ECDSA_256_R1_SPKI_PublicKey";
    let importKeyInput = {
      "keyName":keyName,
      "key": {
        "format":"spki",
        "keyData":"MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAExnUAwIKzIGBjhn3uFv//++0JfZrgl3zuoGJYMTvbXa55HrJsI1lhayPqEEO3s02WBSi3sAVIw6KULhJoX3tJ4Q==",
        "algorithm": "secp256r1",
        "extractable": true,
        "usages": ["verify"]
      }
    };
    await klaveTransaction(FQDN,"importKey", importKeyInput);

    let getPublicKeyInput = {
        "keyName":keyName,
        "format":"spki"
    };
    let test_results = await klaveTransaction(FQDN,"getPublicKey", getPublicKeyInput);

    exportKeyInput = {
        "keyName":keyName,
        "format":"spki"
    };
    test_results = await klaveTransaction(FQDN,"exportKey", exportKeyInput);
}
  klaveCloseConnection();
}

const testECDSA_384_R1_PKCS8 = async (importKey) => {
  console.log("testECDSA_384: importKey{" + importKey + "}");
  let user_connected = await klaveOpenConnection();
  console.log("user_connected: ", user_connected);
  if (user_connected)
  {
    let keyName = "";
    if (importKey) 
    {
      keyName = "ECDSA_384_PKCS8_Key2";
      let importKeyInput = {
        "keyName":keyName,
        "key": {
          "format":"pkcs8",
          "keyData":"MIG2AgEAMBAGByqGSM49AgEGBSuBBAAiBIGeMIGbAgEBBDAQZxlf/3lwVVda6CTmi/6IVwq9/ph6+PP4pXZLDm2mqkteZnSG++3b5WvB8cNR5B+hZANiAARzmnpXrdUIRGcy/Ibh6f1erNaOhUvla929Qzfow0Gb3veXSEeo0A+HboAsX+jVIemwKy/Tvx7yP8gcSw5x8Cz2Ytg3h8vNsHP8XUts4Bm5bSxMoTQAP5ctE8cTP54oShY=",
          "algorithm": "secp384r1",
          "extractable": true,
          "usages": ["sign"]
        }
      };
      await klaveTransaction(FQDN,"importKey", importKeyInput);
    }
    else 
    {
      keyName = "ECDSA_384_PKCS8_Key1";
      let generateKeyInput = {
        "keyName":keyName,
        "key": {
          "format":"",
          "keyData":"",
          "algorithm": "secp384r1",
          "extractable": true,
          "usages": ["sign"]
        }
      };
      await klaveTransaction(FQDN,"generateKey", generateKeyInput);
    }

    let getPublicKeyInput = {
      "keyName":keyName,
      "format":"spki"
    };
    test_results = await klaveTransaction(FQDN,"getPublicKey", getPublicKeyInput);

    let exportKeyInput = {
        "keyName":keyName,
        "format":"pkcs8"
    };
    test_results = await klaveTransaction(FQDN,"exportKey", exportKeyInput);

    exportKeyInput = {
        "keyName":keyName,
        "format":"sec1"
    };
    test_results = await klaveTransaction(FQDN,"exportKey", exportKeyInput);

    exportKeyInput = {
        "keyName":keyName,
        "format":"spki"
    };
    test_results = await klaveTransaction(FQDN,"exportKey", exportKeyInput);

    signInput = {
        "keyName":keyName,
        "clearText":"HelloWorld"
    };
    test_results = await klaveTransaction(FQDN,"sign", signInput);

    verifyInput = {
        "keyName":keyName,
        "clearText":"HelloWorld",
        "signatureB64":test_results.message,
    };
    test_results = await klaveTransaction(FQDN,"verify", verifyInput);

}
  klaveCloseConnection();
}

const testECDSA_521_R1_PKCS8 = async (importKey) => {
  console.log("testECDSA_521: importKey{" + importKey + "}");
  let user_connected = await klaveOpenConnection();
  console.log("user_connected: ", user_connected);
  if (user_connected)
  {
    let keyName = "";
    if (importKey) 
    {
      keyName = "ECDSA_521_PKCS8_Key2";
      let importKeyInput = {
        "keyName":keyName,
        "key": {
          "format":"pkcs8",
          "keyData":"MIHuAgEAMBAGByqGSM49AgEGBSuBBAAjBIHWMIHTAgEBBEIA+dv0qK5sFDxMRPWGogkUbOAaZ/JURhljECO3hCfrj5ivSSgJaejSjdWFaebWfxBSFPkyTGfNemTaAWcNaBAlstahgYkDgYYABAB0TjLBB9top4MBjRD2djBxBlwvRqVoLeQPomOx6BlS5w5uZjWGdPOxJutXc9bYNw/ijgCGmWBxDtM5KOHGi5M1KACNQ43MLsalSsuPoHArH+9YnOyd/4wI9fnZTsmuaFOXV0NxNA4osW8eGYSZOUcQvAfGgNLTGYUmdYm/2sj/2kZlGA==",
          "algorithm": "secp521r1",
          "extractable": true,
          "usages": ["sign"]
        }
      };
      await klaveTransaction(FQDN,"importKey", importKeyInput);
    }
    else 
    {
      keyName = "ECDSA_521_PKCS8_Key1";
      let generateKeyInput = {
        "keyName":keyName,
        "key": {
          "format":"",
          "keyData":"",
          "algorithm": "secp521r1",
          "extractable": true,
          "usages": ["sign"]
        }
      };
      await klaveTransaction(FQDN,"generateKey", generateKeyInput);
    }

    let getPublicKeyInput = {
      "keyName":keyName,
      "format":"spki"
    };
    test_results = await klaveTransaction(FQDN,"getPublicKey", getPublicKeyInput);

    let exportKeyInput = {
        "keyName":keyName,
        "format":"pkcs8"
    };
    test_results = await klaveTransaction(FQDN,"exportKey", exportKeyInput);

    exportKeyInput = {
        "keyName":keyName,
        "format":"sec1"
    };
    test_results = await klaveTransaction(FQDN,"exportKey", exportKeyInput);

    exportKeyInput = {
        "keyName":keyName,
        "format":"spki"
    };
    test_results = await klaveTransaction(FQDN,"exportKey", exportKeyInput);

    signInput = {
        "keyName":keyName,
        "clearText":"HelloWorld"
    };
    test_results = await klaveTransaction(FQDN,"sign", signInput);

    verifyInput = {
        "keyName":keyName,
        "clearText":"HelloWorld",
        "signatureB64":test_results.message,
    };
    test_results = await klaveTransaction(FQDN,"verify", verifyInput);

}
  klaveCloseConnection();
}

const testECDSA_256_K1_PKCS8 = async (importKey) => {
  console.log("testECDSA_256_K1: importKey{" + importKey + "}");
  let user_connected = await klaveOpenConnection();
  console.log("user_connected: ", user_connected);
  if (user_connected)
  {
    let keyName = "";
    if (importKey) 
    {
      keyName = "ECDSA_256_K1_PKCS8_Key2";
      let importKeyInput = {
        "keyName":keyName,
        "key": {
          "format":"pkcs8",
          "keyData":"MIGEAgEAMBAGByqGSM49AgEGBSuBBAAKBG0wawIBAQQgdotrkhFSi/ZUg+8aWEkFsV0P8xoMzVkJuHrecImH7mWhRANCAAQuKJ81apcue7qHvP4HL3M/3B05oApnu68l9AXlLJgoHjKARx7MrRJhBhCVXR50bcAqCAsWQONCqJpLt9SasrjA",
          "algorithm": "secp256k1",
          "extractable": true,
          "usages": ["sign"]
        }
      };
      await klaveTransaction(FQDN,"importKey", importKeyInput);
    }
    else 
    {
      keyName = "ECDSA_256_K1_PKCS8_Key1";
      let generateKeyInput = {
        "keyName":keyName,
        "key": {
          "format":"",
          "keyData":"",
          "algorithm": "secp256k1",
          "extractable": true,
          "usages": ["sign"]
        }
      };
      await klaveTransaction(FQDN,"generateKey", generateKeyInput);
    }

    let getPublicKeyInput = {
        "keyName":keyName,
        "format":"spki"
    };
    let test_results = await klaveTransaction(FQDN,"getPublicKey", getPublicKeyInput);

    let exportKeyInput = {
        "keyName":keyName,
        "format":"pkcs8"
    };
    test_results = await klaveTransaction(FQDN,"exportKey", exportKeyInput);

    exportKeyInput = {
        "keyName":keyName,
        "format":"sec1"
    };
    test_results = await klaveTransaction(FQDN,"exportKey", exportKeyInput);

    exportKeyInput = {
        "keyName":keyName,
        "format":"spki"
    };
    test_results = await klaveTransaction(FQDN,"exportKey", exportKeyInput);

    signInput = {
        "keyName":keyName,
        "clearText":"HelloWorld"
    };
    test_results = await klaveTransaction(FQDN,"sign", signInput);

    verifyInput = {
        "keyName":keyName,
        "clearText":"HelloWorld",
        "signatureB64":test_results.message,
    };
    test_results = await klaveTransaction(FQDN,"verify", verifyInput);

}
  klaveCloseConnection();
}

const testSC_Generate_Klave_Import_Sign_SC_Verify = async () => {
  console.log("testSC_Generate_Klave_Import_Sign_SC_Verify");
  let user_connected = await klaveOpenConnection();
  console.log("user_connected: ", user_connected);
  if (user_connected)
  {
    let ecdsaSubtleKey = await subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      true,
      ["sign", "verify"],
    );
    const exportedPrivateKey = await subtle.exportKey("pkcs8",ecdsaSubtleKey.privateKey);
    const exportedBase64PrivateKey = (Buffer.from(exportedPrivateKey)).toString('base64');


      let keyName = "Subtle_256_PKCS8_Key1";
      let importKeyInput = {
        "keyName":keyName,
        "key": {
          "format":"pkcs8",
          "keyData":exportedBase64PrivateKey,
          "algorithm": "secp256r1",
          "extractable": true,
          "usages": ["sign"]
        }
      };
      await klaveTransaction(FQDN,"importKey", importKeyInput);

    let getPublicKeyInput = {
        "keyName":keyName,
        "format":"spki"
    };
    let test_results = await klaveTransaction(FQDN,"getPublicKey", getPublicKeyInput);

    let exportKeyInput = {
        "keyName":keyName,
        "format":"pkcs8"
    };
    test_results = await klaveTransaction(FQDN,"exportKey", exportKeyInput);

    exportKeyInput = {
        "keyName":keyName,
        "format":"sec1"
    };
    test_results = await klaveTransaction(FQDN,"exportKey", exportKeyInput);

    exportKeyInput = {
        "keyName":keyName,
        "format":"spki"
    };
    test_results = await klaveTransaction(FQDN,"exportKey", exportKeyInput);

    let message = "HelloWorld";
    signInput = {
        "keyName":keyName,
        "clearText":message
    };
    test_results = await klaveTransaction(FQDN,"sign", signInput);
    let signatureB64 = test_results.message;

    verifyInput = {
        "keyName":keyName,
        "clearText":message,
        "signatureB64":signatureB64,
    };
    test_results = await klaveTransaction(FQDN,"verify", verifyInput);

    let result = await subtle.verify(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      ecdsaSubtleKey.publicKey,
      base64ToArrayBuffer(signatureB64),
      getMessageEncoding(message),
    );
  }
  klaveCloseConnection();
}

const testSC_Generate_Sign_Klave_Import_Verify = async (deployApp) => {
  console.log("testSC_Generate_Klave_Import_Sign_SC_Verify");
  let user_connected = await klaveOpenConnection();
  console.log("user_connected: ", user_connected);
  if (user_connected)
  {
    let ecdsaSubtleKey = await subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      true,
      ["sign", "verify"],
    );
    const exportedPublicKey = await subtle.exportKey("spki",ecdsaSubtleKey.publicKey);
    const exportedBase64PublicKey = (Buffer.from(exportedPublicKey)).toString('base64');


      let keyName = "Subtle_256_PKCS8_Key1";
      let importKeyInput = {
        "keyName":keyName,
        "key": {
          "format":"spki",
          "keyData":exportedBase64PublicKey,
          "algorithm": "secp256r1",
          "extractable": true,
          "usages": ["verify"]
        }
      };
      await klaveTransaction(FQDN,"importKey", importKeyInput);

    let getPublicKeyInput = {
        "keyName":keyName,
        "format":"spki"
    };
    let test_results = await klaveTransaction(FQDN,"getPublicKey", getPublicKeyInput);

    let exportKeyInput = {
        "keyName":keyName,
        "format":"pkcs8"
    };
    test_results = await klaveTransaction(FQDN,"exportKey", exportKeyInput);

    exportKeyInput = {
        "keyName":keyName,
        "format":"sec1"
    };
    test_results = await klaveTransaction(FQDN,"exportKey", exportKeyInput);

    exportKeyInput = {
        "keyName":keyName,
        "format":"spki"
    };
    test_results = await klaveTransaction(FQDN,"exportKey", exportKeyInput);

    let message = "HelloWorld";
    test_results = await subtle.sign(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      ecdsaSubtleKey.privateKey,
      getMessageEncoding(message),
    );
    let signature = new Uint8Array(test_results);

    verifyInput = {
        "keyName":keyName,
        "clearText":message,
        "signatureB64":arrayBufferToBase64(test_results),
    };
    test_results = await klaveTransaction(FQDN,"verify", verifyInput);

    let result = await subtle.verify(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      ecdsaSubtleKey.publicKey,
      signature,
      getMessageEncoding(message),
    );
    if (result) {
      console.log("Subtle Verification successful");      
    }
    else {
      console.log("Subtle Verification failed");      
    }
  }
  klaveCloseConnection();
}

module.exports = {
  deploySdkTestApp,
  testECDSA_256_R1_PKCS8,
  testECDSA_256_R1_SPKI,
  testECDSA_256_K1_PKCS8,  
  testECDSA_384_R1_PKCS8,
  testECDSA_521_R1_PKCS8,
  testSC_Generate_Klave_Import_Sign_SC_Verify,
  testSC_Generate_Sign_Klave_Import_Verify,
}
