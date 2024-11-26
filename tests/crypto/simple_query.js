import {APP_ID, FQDN} from './klave_network.js';

const testSimpleQuery = async () => {

    let user_connected = await openSCP(KLAVE_ENDPOINT, KLAVE_CONNECTION_KEYPAIR, KLAVE_CONNECTION_KEYPAIR_PWD);
    if (user_connected)
    {
      //deploy the app
      let wasm_bytes_b64 = (fs.readFileSync(KLAVE_WASM_SIMPLEQUERY)).toString();
      await deployApp(APP_ID, FQDN, wasm_bytes_b64);
  
      //add some kredits to the app
      let kredits = 10000000000;
      await addKredits(APP_ID, kredits);
  
      //test simple query
      let args = {"staticK":null};
      let testSpecificField = klaveQuery(FQDN,"testSameSignature",args);
      let results = await applyTransaction(testSpecificField);
      console.log(results.success);
    }
    closeSCP();
  }
  