import { klaveDeployApp, klaveAddKredits, klaveRequest, klaveCloseConnection, klaveOpenConnection, klaveTransaction } from '../../../klave_network';
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

const testOpenSslImportPrivateKeySignWithKlaveAndVerifyLocally = async () => {

  let user_connected = await klaveOpenConnection();
  if (user_connected)
  {
    let app_id = "test-klave-sdk";
    let fqdn = "test-klave-sdk-smart-contract-1.jlabbe.klave.network";
    //deploy the app
    let wasm_bytes_b64 = (fs.readFileSync(WASM_TESTKLAVESDK)).toString();
    await klaveDeployApp(app_id, fqdn, wasm_bytes_b64);

    //add some kredits to the app
    let kredits = 10000000000;
    await klaveAddKredits(app_id, kredits);

    //import a private key from a PEM file
    let privateKeyb64 = readKeyFile(PRIVATE_KEY_EC_EXAMPLE);
    let keyPair = {"privateKey":privateKeyb64};
    let keyName = "keyOpenSsl";

    let importInput = {
      "keyName":keyName,
      "key": {
        "format": "pkcs8",
        "keyData": privateKeyb64,
        "algorithm": "ecc256",
        "extractable": true,
        "usages": ["sign"]
      }
    };

    let argsKeyInput = JSON.stringify(importInput);    
    let import_results = klaveTransaction(FQDN,"testImportKey", argsKeyInput);

    // //delete the test folder
    // fs.readdirSync(LOCAL_TEST_DIR).forEach(f => fs.rmSync(`${LOCAL_TEST_DIR}/${f}`));

    // //sign with the imported private key
    // let dataToSign = "Hello World";
    // let argsSignInput = {"keyName":keyName,"input":dataToSign};
    // let sign_request = klaveRequest(FQDN,"ecdsaSign",argsSignInput);
    // let signature = await applyTransaction(sign_request);
    // console.log('Signature: ', signature);
    // try {
    //   fs.writeFileSync(LOCAL_TEST_DIR + '/signature.txt', signature.value, { flag: 'w' });
    // } catch (err) {
    //   console.error(err);
    // }

    // //verify the signature with openssl
    // const signatureParserCommand = 'openssl asn1parse -genconf ' + LOCAL_TEST_DIR + '/signature.txt -out ' + LOCAL_TEST_DIR + '/signature_file.txt';
    // execSync(signatureParserCommand, (err, buffer) => {
    //   if (err) {
    //     console.error(err.toString());
    //   } else {
    //     console.log(buffer.toString());
    //   }
    // });

    // //hash the input and save it
    // const saveInput = 'echo -n ' + dataToSign + ' >> ' + LOCAL_TEST_DIR + '/helloWorld.txt'
    // execSync(saveInput, (err, buffer) => {
    //   if (err) {
    //     console.error(err.toString());
    //   } else {
    //     console.log(buffer.toString());
    //   }
    // });

    // const hashCommand = 'openssl dgst -sha256 -binary ' + LOCAL_TEST_DIR + '/helloWorld.txt > ' + LOCAL_TEST_DIR + '/helloWorld.hash'
    // execSync(hashCommand, (err, buffer) => {
    //   if (err) {
    //     console.error(err.toString());
    //   } else {
    //     console.log(buffer.toString());
    //   }
    // });

    // const verifyCommand = 'openssl pkeyutl -verify -in ' + LOCAL_TEST_DIR + '/helloWorld.hash -sigfile ' + LOCAL_TEST_DIR + '/signature_file.txt -inkey ' + KLAVE_PUBLIC_KEY_EC_EXAMPLE +  ' -pubin > ' + LOCAL_TEST_DIR + '/verify_result'
    // execSync(verifyCommand, (err, buffer) => {
    //   if (err) {
    //     console.error(err.toString());
    //   } else {
    //     console.log(buffer.toString());
    //   }
    // });
  }
  klaveCloseConnection();
}

// const testOpenSslImportPublicKeySignLocallyAndVerifyWithKlave = async () => {

//     let user_connected = await openSCP(KLAVE_ENDPOINT, KLAVE_CONNECTION_KEYPAIR, KLAVE_CONNECTION_KEYPAIR_PWD);
//     if (user_connected)
//     {
//       let app_id = "confidencial";
//       let fqdn = "confidencial13_app";
//       //deploy the app
//       let wasm_bytes_b64 = (fs.readFileSync(KLAVE_WASM_CONFIDENCIAL)).toString();
//       await deployApp(app_id, fqdn, wasm_bytes_b64);
  
//       // //add some kredits to the app
//       let kredits = 10000000000;
//       await addKredits(app_id, kredits);
  
//       //import a public key from a PEM file
//       let publicKeyb64 = readKeyFile(KLAVE_PUBLIC_KEY_EC_EXAMPLE);
//       let keyName = "publicKey2";
//       let argsKeyInput = confidencialKeyInput("pkcs8",publicKeyb64, true, ["verify"], keyName);
//       let import_public_key_request = klaveRequest(FQDN,"importKey",argsKeyInput);
//       let import_results = await applyTransaction(import_public_key_request);
  
//       //delete the test folder
//       fs.readdirSync(LOCAL_TEST_DIR).forEach(f => fs.rmSync(`${LOCAL_TEST_DIR}/${f}`));
  
//       //Format a JWT
//       let jwtHeaderB64 = crypto.Utils.toBase64(Buffer.from("{\"alg\":\"ECDSA\",\"typ\":\"JWT\"}"));
//       let jwtPayloadB64 = crypto.Utils.toBase64(Buffer.from("{\"sub\":\"1234567890\",\"name\":\"John Doe\",\"iat\":1516239022})"));
//       let jwtB64 = jwtHeaderB64 + "." + jwtPayloadB64;
//       try {
//         fs.writeFileSync(LOCAL_TEST_DIR + '/jwtToSign.b64', jwtB64, { flag: 'w' });
//       } catch (err) {
//         console.error(err);
//       }
  
//       //hash the JWT
//       const jwtHashCommand = 'openssl dgst -sha256 -binary ' + LOCAL_TEST_DIR + '/jwtToSign.b64 > ' + LOCAL_TEST_DIR + '/jwtToSign.hash';
//       execSync(jwtHashCommand, (err, buffer) => {
//         if (err) {
//           console.error(err.toString());
//         } else {
//           console.log(buffer.toString());
//         }
//       });
  
//       //sign the JWT using openssl pkeyutl tool
//       const jwtSignCommand = 'openssl pkeyutl -sign -in ' + LOCAL_TEST_DIR + '/jwtToSign.hash -inkey ' + KLAVE_PRIVATE_KEY_EC_EXAMPLE + ' -out ' + LOCAL_TEST_DIR + '/jwtPkeyUtlSignature.raw';
//       execSync(jwtSignCommand, (err, buffer) => {
//         if (err) {
//           console.error(err.toString());
//         } else {
//           console.log(buffer.toString());
//         }
//       });
  
//       //parse the signature
//       const jwtParseSignatureCommand = 'openssl asn1parse -in ' + LOCAL_TEST_DIR + '/jwtPkeyUtlSignature.raw -inform der > ' + LOCAL_TEST_DIR + '/jwtPkeyUtlSignature.asn1';
//       execSync(jwtParseSignatureCommand, (err, buffer) => {
//         if (err) {
//           console.error(err.toString());
//         } else {
//           console.log(buffer.toString());
//         }
//       });
  
//       //verify the signature
//       let hexAsn1Signature = readAsn1Signature(LOCAL_TEST_DIR + '/jwtPkeyUtlSignature.asn1');
//       let b64Asn1Signature = Buffer.from(hexAsn1Signature, 'hex').toString('base64');
  
//       let argsVerificationInput = {"keyName":keyName, "data":jwtB64, "signature":b64Asn1Signature};
//       let verification_request = klaveRequest(FQDN,"verify",argsVerificationInput);
//       let verification = await applyTransaction(verification_request);
  
//       console.log("signature has been verified by Klave: " + verification);
//     }
//     closeSCP();
//   }
  
//   const testSubtleCryptoImportPrivateKeyJwkSignWithKlaveAndVerifyLocally = async () => {
  
//     let user_connected = await openSCP(KLAVE_ENDPOINT, KLAVE_CONNECTION_KEYPAIR, KLAVE_CONNECTION_KEYPAIR_PWD);
//     if (user_connected)
//     {
//       let app_id = "confidencial";
//       let fqdn = "confidencial_app_14";
//       //deploy the app
//       let wasm_bytes_b64 = (fs.readFileSync(KLAVE_WASM_CONFIDENCIAL)).toString();
//       await deployApp(app_id, fqdn, wasm_bytes_b64);
  
//       // //add some kredits to the app
//       let kredits = 10000000000;
//       await addKredits(app_id, kredits);
  
//       //create an key using ECDSA with subtle crypto
//       let ecdsaSubtleKey = await subtle.generateKey(
//         {
//           name: "ECDSA",
//           namedCurve: "P-256",
//         },
//         true,
//         ["sign", "verify"],
//       );
  
//       //import a private key from a PEM file
//       let keyName = "ecdsaSubtleKey";
//       const exportedPrivateKey = await subtle.exportKey("jwk",ecdsaSubtleKey.privateKey);
//       const exportedprivateKeyValue = exportedPrivateKey.d;
//       const exportedRawPrivateKey = Array.from(new Uint8Array(Buffer.from(exportedprivateKeyValue, 'base64')));
  
//       eckles.exportSync({jwk: exportedPrivateKey}).then(function (pem) {
//         console.log(pem);
//       });
  
//       //format is 2, algorithm is 0, extractable is 0
//       let argsKeyInput = confidencialKeyRawInput(keyName,2,exportedRawPrivateKey,0,1);
//       let import_private_key_request = klaveRequest(FQDN,"importRawKey",argsKeyInput);
//       let import_results = await applyTransaction(import_private_key_request);
  
//       //sign with the imported private key
//       let dataToSign = "Hello World";
//       let argsSignInput = {"keyName":keyName,"input":dataToSign};
//       let sign_request = klaveRequest(FQDN,"sign",argsSignInput);
//       let signature = await applyTransaction(sign_request);
//       console.log('Signature: ', signature);
//       try {
//         fs.writeFileSync(LOCAL_TEST_DIR + '/signature.txt', signature.value, { flag: 'w' });
//       } catch (err) {
//         console.error(err);
//       }
  
//     }
//     closeSCP();
//   }
  
//   const testSubtleCryptoImportPrivateKeyPkcs8SignWithKlaveAndVerifyLocally = async () => {
  
//     let user_connected = await openSCP(KLAVE_ENDPOINT, KLAVE_CONNECTION_KEYPAIR, KLAVE_CONNECTION_KEYPAIR_PWD);
//     if (user_connected)
//     {
//       let app_id = "confidencial";
//       let fqdn = "confidencial_app_14";
//       //deploy the app
//       let wasm_bytes_b64 = (fs.readFileSync(KLAVE_WASM_CONFIDENCIAL)).toString();
//       await deployApp(app_id, fqdn, wasm_bytes_b64);
  
//       // //add some kredits to the app
//       let kredits = 10000000000;
//       await addKredits(app_id, kredits);
  
//       //delete the test folder
//       fs.readdirSync(LOCAL_TEST_DIR).forEach(f => fs.rmSync(`${LOCAL_TEST_DIR}/${f}`));
  
//       //create an key using ECDSA with subtle crypto
//       let ecdsaSubtleKey = await subtle.generateKey(
//         {
//           name: "ECDSA",
//           namedCurve: "P-256",
//         },
//         true,
//         ["sign", "verify"]
//       );
  
//       //import a private key from a PEM file
//       let keyName = "ecdsaSubtleKey";
//       const exportedPrivateKey = await subtle.exportKey("pkcs8",ecdsaSubtleKey.privateKey);
//       const exportedPublicKey = await subtle.exportKey("raw",ecdsaSubtleKey.publicKey);
//       // const exportedAsString = ab2str(exportedPrivateKey);
//       // const exportedAsBase64 = btoa(exportedAsString);
  
//       const exportedBase64PrivateKey = (Buffer.from(exportedPrivateKey)).toString('base64');
//       const exportedBase64PrivateKeyFormatOpenssl = "-----BEGIN PRIVATE KEY-----\n" + exportedBase64PrivateKey + "\n-----END PRIVATE KEY-----";
  
//       console.log('Write pkcs8 file: ');
//       try {
//         fs.writeFileSync(LOCAL_TEST_DIR + '/privateKeyB64Pkcs8', exportedBase64PrivateKeyFormatOpenssl, { flag: 'w' });
//       } catch (err) {
//         console.error(err);
//       }
  
//       //convert the pkcs8 format in sec1 format with openssl
//       const pkcs8ToSec1Command = 'openssl ec -in ' + LOCAL_TEST_DIR + '/privateKeyB64Pkcs8 -out ' + LOCAL_TEST_DIR + '/privateKeyB64Sec1';
//       execSync(pkcs8ToSec1Command, (err, buffer) => {
//         if (err) {
//           console.error(err.toString());
//         } else {
//           console.log(buffer.toString());
//         }
//       });
  
//       // const arr = new Uint8Array(exportedPrivateKey);
//       // const arrh = new Uint8Array(exportedPrivateKey);
//       // for (let i = 0; i < arr.length; i++) {
//       //   if (i % 2){
//       //     let temp = arr[i-1];
//       //     arr[i-1] = arr[i];
//       //     arr[i] = temp;
//       //   }
//       // }
//       // const finalArray = new Uint8Array(arr.length - 29);
//       // for (let j = 29; j < arr.length; j++) {
//       //   finalArray[j-29] = arr[j];
//       // }
//       // const exportedHexPrivateKey = (Buffer.from(exportedPrivateKey)).toString('hex');
//       // const exportedHexPrivKey = (Buffer.from(finalArray)).toString('hex');
//       // const exportedBase64Pkcs1PrivKey = (Buffer.from(finalArray)).toString('base64');
  
//       //const exportedBase64Pkcs1PrivKeyManual = "MHcCAQEEIAUwusx4tAxFZO06FJUxtH9+W6rcW3MU/pW3s0ndsBCloAoGCCqGSM49AwEHoUQDQgAEmKJFQH436gGiYpbWtJEErmYgCX41+VnEm7T0lGwraVUGxc7ccPCaHfR6PyHQM3taprsr3MJEZYt9OQs44L3htA==";
  
  
//       //import a private key from a PEM file
//       let privateKeyb64 = readKeyFile(LOCAL_TEST_DIR + '/privateKeyB64Sec1');
  
//       //format is 2, algorithm is 0, extractable is 0
//       let argsKeyInput = confidencialKeyInput("pkcs8",privateKeyb64, true, ["sign"], keyName);
//       let import_private_key_request = klaveRequest(FQDN,"importKey",argsKeyInput);
//       let import_results = await applyTransaction(import_private_key_request);
  
//       //sign with the imported private key - to be finished
//       let dataToSign = "Hello World";
//       let argsSignInput = {"keyName":keyName,"input":dataToSign};
//       let sign_request = klaveRequest(FQDN,"sign",argsSignInput);
//       let signature = await applyTransaction(sign_request);
//       console.log('Signature: ', signature);
//       try {
//         fs.writeFileSync(LOCAL_TEST_DIR + '/signatureKlave.txt', signature.value, { flag: 'w' });
//       } catch (err) {
//         console.error(err);
//       }
  
//       //sign with subtle crypto
//       let enc = new TextEncoder();
//       let encodedMessage = enc.encode(dataToSign);
//       let subtle_signature = await subtle.sign(
//         {
//           name: "ECDSA",
//           hash: { name: "SHA-256"}
//         },
//         ecdsaSubtleKey.privateKey,
//         encodedMessage
//       );
  
  
//       const subtle_signature_hex = (Buffer.from(subtle_signature)).toString('base64');
//       let a=0;
  
//     }
//     closeSCP();
//   }
  
//   const testSubtleCryptoImportPublicKeyPkcs8SignLocallyAndVerifyWithKlave = async () => {
  
//     let user_connected = await openSCP(KLAVE_ENDPOINT, KLAVE_CONNECTION_KEYPAIR, KLAVE_CONNECTION_KEYPAIR_PWD);
//     if (user_connected)
//     {
//       let app_id = "confidencial";
//       let fqdn = "confidencial_app_14";
//       //deploy the app
//       let wasm_bytes_b64 = (fs.readFileSync(KLAVE_WASM_CONFIDENCIAL)).toString();
//       await deployApp(app_id, fqdn, wasm_bytes_b64);
  
//       // //add some kredits to the app
//       let kredits = 10000000000;
//       await addKredits(app_id, kredits);
  
//       //delete the test folder
//       fs.readdirSync(LOCAL_TEST_DIR).forEach(f => fs.rmSync(`${LOCAL_TEST_DIR}/${f}`));
  
//       //create an key using ECDSA with subtle crypto
//       let ecdsaSubtleKey = await subtle.generateKey(
//         {
//           name: "ECDSA",
//           namedCurve: "P-256",
//         },
//         true,
//         ["sign", "verify"]
//       );
  
//       //import a private key from a PEM file
//       let keyName = "ecdsaSubtleKey";
//       const exportedPublicKey = await subtle.exportKey("raw",ecdsaSubtleKey.publicKey);
//       const exportedPublicKeyb64 = (Buffer.from(exportedPublicKey)).toString('base64');
  
//       let argsKeyInput = confidencialKeyInput("pkcs8",exportedPublicKeyb64, true, ["verify"], keyName);
//       let import_public_key_request = klaveRequest(FQDN,"importKey",argsKeyInput);
//       let import_results = await applyTransaction(import_public_key_request);
  
//       //delete the test folder
//       fs.readdirSync(LOCAL_TEST_DIR).forEach(f => fs.rmSync(`${LOCAL_TEST_DIR}/${f}`));
  
//       //sign with subtle crypto key
//       let enc = new TextEncoder();
//       const dataToSign = "Hello World";
//       let encodedMessage = enc.encode(dataToSign);
//       let subtle_signature = await subtle.sign(
//         {
//           name: "ECDSA",
//           hash: { name: "SHA-256"}
//         },
//         ecdsaSubtleKey.privateKey,
//         encodedMessage
//       );
  
//       const subtle_signature_base64 = (Buffer.from(subtle_signature)).toString('base64');
//       let dataToSignB64 = crypto.Utils.toBase64(Buffer.from(dataToSign));
  
//       //verify the signature with klave
//       let argsVerificationInput = {"keyName":keyName, "data":dataToSignB64, "signature":subtle_signature_base64};
//       let verification_request = klaveRequest(FQDN,"verify",argsVerificationInput);
//       let verification = await applyTransaction(verification_request);
  
//       console.log("signature has been verified by Klave: " + verification);
//       let a=0;
  
//     }
//     closeSCP();
//   }
  