echo building as_module.wasm from AssemblyScript...
pushd assembly/apps/test-klave-sdk
yarn install
yarn run build
base64 -w 0 .klave/0-test-klave-sdk.wasm > ../../../config/wasm/test-klave-sdk_b64
popd
echo done
