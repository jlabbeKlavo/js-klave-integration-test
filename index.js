const { testRunCmdCryptoSDKApp } = require('./tests/crypto/sdk/run_cmd_crypto_suite');
const { testECDSA_256_R1_PKCS8, testECDSA_384_R1_PKCS8, testECDSA_521_R1_PKCS8, testECDSA_256_K1_PKCS8, testSC_Generate_Klave_Import_Sign_SC_Verify, testSC_Generate_Sign_Klave_Import_Verify, testECDSA_256_R1_SPKI, deploySdkTestApp } = require('./tests/crypto/sdk/crypto_suite_ecdsa');
const { testAES_128 } = require('./tests/crypto/sdk/crypto_suite_aes');
const { testSHA_256, testSHA_384, testSHA_512, testSHA3_256, testSHA3_384, testSHA3_512 } = require('./tests/crypto/sdk/crypto_suite_sha');
const { testHTTPS_RandomNumber, testHTTPS_BitcoinPrice } = require('./tests/crypto/sdk/https_suite');
const { klaveAddKredits } = require('./klave_network');

const deployApp = true;
const doNotDeployApp = false;
const importKey = true;
const generateKey = false;

const runTests = async () => {
  await deploySdkTestApp();

  // await testRunCmdCryptoSDKApp();

  // await testECDSA_256_R1_PKCS8(generateKey);
  // await testECDSA_384_R1_PKCS8(generateKey);
  // await testECDSA_521_R1_PKCS8(generateKey);
  // await testECDSA_256_R1_PKCS8(generateKey);
  // await testECDSA_384_R1_PKCS8(generateKey);
  // await testECDSA_521_R1_PKCS8(generateKey);
  // await testAES_128(generateKey);
  // await testECDSA_256_K1_PKCS8(generateKey);

  // await testECDSA_256_R1_PKCS8(importKey);
  // await testECDSA_384_R1_PKCS8(importKey);
  // await testECDSA_521_R1_PKCS8(importKey);
  // await testECDSA_256_R1_PKCS8(importKey);
  // await testECDSA_384_R1_PKCS8(importKey);
  // await testECDSA_521_R1_PKCS8(importKey);
  // await testAES_128(importKey);
  // await testECDSA_256_K1_PKCS8(importKey);

  // await testECDSA_256_R1_SPKI(generateKey);
  // await testECDSA_256_R1_SPKI(importKey);

  // await testSC_Generate_Klave_Import_Sign_SC_Verify();
  // await testSC_Generate_Sign_Klave_Import_Verify();

  await testSHA_256();
  // await testSHA_384();
  // await testSHA_512();
  // await testSHA3_256();
  // await testSHA3_384();
  // await testSHA3_512();

  // await testHTTPS_RandomNumber();
  // await testHTTPS_BitcoinPrice();
};

runTests();
