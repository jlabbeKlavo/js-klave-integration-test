const { klaveTransaction, klaveCloseConnection, klaveOpenConnection } = require('../../../klave_network');

const fqdn = "main.7a032d48.test-klave-sdk.IntegrationTests.klave.network";

const testHTTPS_RandomNumber = async () => {
    console.log("testHTTPS_RandomNumber");
    let user_connected = await klaveOpenConnection();
    console.log("user_connected: ", user_connected);
    if (user_connected)
    {
        let testInput = {
            "useDefault": true
          };
        test_results = await klaveTransaction(FQDN,"grabRandomNumbers", testInput);      
        console.assert(test_results.length == 5, "testHTTPS_RandomNumber failed")
    }
    klaveCloseConnection();
}

const testHTTPS_BitcoinPrice = async () => {
    console.log("testHTTPS_BitcoinPrice");
    let user_connected = await klaveOpenConnection();
    console.log("user_connected: ", user_connected);
    if (user_connected)
    {
        let testInput = {
            "useDefault": true
          };
        test_results = await klaveTransaction(FQDN,"grabBitcoinPrice", testInput);      
    }
    klaveCloseConnection();
}


module.exports = {
    testHTTPS_RandomNumber,
    testHTTPS_BitcoinPrice
}
