const testSimpleQuery = async () => {

    let user_connected = await openSCP(KLAVE_ENDPOINT, KLAVE_CONNECTION_KEYPAIR, KLAVE_CONNECTION_KEYPAIR_PWD);
    if (user_connected)
    {
      let app_id = "bbcfccef-af2d-40da-8640-5de044c2da26";
      let fqdn = "67e46b34.bbcfccef.simple-query.nicolas.klave.network";
      //deploy the app
      let wasm_bytes_b64 = (fs.readFileSync(KLAVE_WASM_SIMPLEQUERY)).toString();
      await deployApp(app_id, fqdn, wasm_bytes_b64);
  
      //add some kredits to the app
      let kredits = 10000000000;
      await addKredits(app_id, kredits);
  
      //test simple query
      let args = {"staticK":null};
      let testSpecificField = klaveQuery(fqdn,"testSameSignature",args);
      let results = await applyTransaction(testSpecificField);
      console.log(results.success);
    }
    closeSCP();
  }
  