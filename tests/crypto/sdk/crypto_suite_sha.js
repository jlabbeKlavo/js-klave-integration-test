const { klaveTransaction, klaveCloseConnection, klaveOpenConnection, FQDN } = require('../../../klave_network');


const testSHA_256 = async () => {
  let user_connected = await klaveOpenConnection();
  console.log("user_connected: ", user_connected);
  if (user_connected)
  {
    let digestInput = {
      "algorithm":"sha2-256",
      "clearText":"HelloWorld"
    };
    test_results = await klaveTransaction(FQDN,"digest", digestInput);
  }
  klaveCloseConnection();
}

const testSHA_384 = async () => {
    let user_connected = await klaveOpenConnection();
    console.log("user_connected: ", user_connected);
    if (user_connected)
    {      
      let digestInput = {
        "algorithm":"sha384",
        "clearText":"HelloWorld"
      };
      test_results = await klaveTransaction(FQDN,"digest", digestInput);  
    }
    klaveCloseConnection();
  }
  const testSHA_512 = async () => {
    let user_connected = await klaveOpenConnection();
    console.log("user_connected: ", user_connected);
    if (user_connected)
    {
      let digestInput = {
        "algorithm":"sha512",
        "clearText":"HelloWorld"
      };
      test_results = await klaveTransaction(FQDN,"digest", digestInput);  
  }
  klaveCloseConnection();
}

const testSHA3_256 = async () => {
  let user_connected = await klaveOpenConnection();
  console.log("user_connected: ", user_connected);
  if (user_connected)
  {
    let digestInput = {
      "algorithm":"sha3-256",
      "clearText":"HelloWorld"
    };
    test_results = await klaveTransaction(FQDN,"digest", digestInput);
  }
  klaveCloseConnection();
}

const testSHA3_384 = async () => {
  let user_connected = await klaveOpenConnection();
  console.log("user_connected: ", user_connected);
  if (user_connected)
  {
    let digestInput = {
      "algorithm":"sha3-384",
      "clearText":"HelloWorld"
    };
    test_results = await klaveTransaction(FQDN,"digest", digestInput);  
  }
  klaveCloseConnection();
}

const testSHA3_512 = async () => {
  let user_connected = await klaveOpenConnection();
  console.log("user_connected: ", user_connected);
  if (user_connected)
  {
    let digestInput = {
      "algorithm":"sha3-512",
      "clearText":"HelloWorld"
    };
    test_results = await klaveTransaction(FQDN,"digest", digestInput);  
  }
  klaveCloseConnection();
}

module.exports = {
    testSHA_256,
    testSHA_384,
    testSHA_512,
    testSHA3_256,
    testSHA3_384,
    testSHA3_512
}
