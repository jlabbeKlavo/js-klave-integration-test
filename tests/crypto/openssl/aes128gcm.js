import { klaveOpenConnection, klaveCloseConnection, klaveDeployApp, klaveAddKredits, klaveQuery, klaveTransaction } from '../../../klave_network';
const fs = require('fs');
const { subtle } = require('crypto').webcrypto;
const { confidencialKeyInput, readKeyFile} = require('./utils');
const { execSync } = require('child_process');

//wasm to deploy must be copied post generation coming from yarn build command
const WASM_TESTKLAVESDK = './config/wasm/testklavesdk_b64';

//keypairs for testing
const PRIVATE_KEY_EC_EXAMPLE = './config/keyPairs/ec1-priv-key.pem';
const PUBLIC_KEY_EC_EXAMPLE = './config/keyPairs/ec1-pub-key.pem';

//testing directory
const LOCAL_TEST_DIR = './test'

const testOpenSslImportAESPrivateKey = async () => {

    let user_connected = await klaveOpenConnection();
    if (user_connected)
    {
      let app_id = "a5ab301a-b1a1-453e-b012-dcb83a11748a";
      let fqdn = "e2314c9c.a5ab301a.confidencial-app.nicolas.klave.network";
      //deploy the app
      let wasm_bytes_b64 = (fs.readFileSync(WASM_TESTKLAVESDK)).toString();
      await klaveDeployApp(app_id, fqdn, wasm_bytes_b64);

      // //add some kredits to the app
      let kredits = 10000000000;
      await klaveAddKredits(app_id, kredits);

      const usages = new Uint8Array(2);
      usages[0] = 0; // decrypt
      usages[1] = 1; // encrypt
      let n1 = usages.length;
      let n2 = usages.byteLength;

      //aes key
      let aesKey = await subtle.generateKey(
        {
          name: "AES-GCM",
          length: 128,
        },
        true,
        ["encrypt", "decrypt"],
      );
      const exportedAesKey = await subtle.exportKey("raw",aesKey);
      const exportedAesKeyb64 = (Buffer.from(exportedAesKey)).toString('base64');

      //import a private key from a PEM file
      let privateKeyb64 = readKeyFile(PRIVATE_KEY_EC_EXAMPLE);
      //privateKeyb64 = 'MHcCAQEEIBEKERYl9';
      let publicKeyb64 = readKeyFile(PUBLIC_KEY_EC_EXAMPLE);
      //let keyPair = {"privateKey":privateKeyb64,"publicKey":""};

      //test service info      
      let serviceInfoResult = klaveQuery(fqdn, "getServiceInfo", {});

      let keyName = "keyOpenSsl";
      //format is 2, algorithm is 0, extractable is 0
      let argsKeyInput = confidencialKeyInput(keyName, privateKeyb64, null, "pkcs8", true);
      // let argsKeyInput = confidencialKeyInput(keyName, privateKeyb64);
      // let argsKeyInput = {"keyName":keyName, "privateKey":privateKeyb64};
      // let argsKeyInput = {"privateKey":privateKeyb64};      
      let import_results = klaveTransaction(fqdn,"importDeMerde",argsKeyInput);

      // let argsKeyOk = {"privKey":"blabla"};
      // let testOk_request = klaveQuery(fqdn,"testOk",argsKeyOk);
      // let ok_results = await applyTransaction(testOk_request);

      let argsKeyNok = {"privateKey":"blablabla"};      
      let nok_results = klaveQuery(fqdn,"testNok",argsKeyNok);

      //delete the test folder
      fs.readdirSync(LOCAL_TEST_DIR).forEach(f => fs.rmSync(`${LOCAL_TEST_DIR}/${f}`));

      //sign with the imported private key
      let dataToSign = "Hello World";
      let argsSignInput = {"keyName":keyName,"input":dataToSign};      
      let signature = klaveQuery(fqdn,"ecdsaSign",argsSignInput);
      console.log('Signature: ', signature);
      try {
        fs.writeFileSync(LOCAL_TEST_DIR + '/signature.txt', signature.value, { flag: 'w' });
      } catch (err) {
        console.error(err);
      }

      //verify the signature with openssl
      const signatureParserCommand = 'openssl asn1parse -genconf ' + LOCAL_TEST_DIR + '/signature.txt -out ' + LOCAL_TEST_DIR + '/signature_file.txt';
      execSync(signatureParserCommand, (err, buffer) => {
        if (err) {
          console.error(err.toString());
        } else {
          console.log(buffer.toString());
        }
      });

      //hash the input and save it
      const saveInput = 'echo -n ' + dataToSign + ' >> ' + LOCAL_TEST_DIR + '/helloWorld.txt'
      execSync(saveInput, (err, buffer) => {
        if (err) {
          console.error(err.toString());
        } else {
          console.log(buffer.toString());
        }
      });

      const hashCommand = 'openssl dgst -sha256 -binary ' + LOCAL_TEST_DIR + '/helloWorld.txt > ' + LOCAL_TEST_DIR + '/helloWorld.hash'
      execSync(hashCommand, (err, buffer) => {
        if (err) {
          console.error(err.toString());
        } else {
          console.log(buffer.toString());
        }
      });

      const verifyCommand = 'openssl pkeyutl -verify -in ' + LOCAL_TEST_DIR + '/helloWorld.hash -sigfile ' + LOCAL_TEST_DIR + '/signature_file.txt -inkey ' + KLAVE_PUBLIC_KEY_EC_EXAMPLE +  ' -pubin > ' + LOCAL_TEST_DIR + '/verify_result'
      execSync(verifyCommand, (err, buffer) => {
        if (err) {
          console.error(err.toString());
        } else {
          console.log(buffer.toString());
        }
      });
    }
    klaveCloseConnection();
}

module.exports = {
    testOpenSslImportAESPrivateKey,
}
