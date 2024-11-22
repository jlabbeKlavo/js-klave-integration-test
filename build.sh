echo building as_module.wasm from AssemblyScript...
pushd assembly
yarn install
yarn run asbuild
base64 -w 0 .klave/0-testklavesdk.wasm > ../config/wasm/testklavesdk_b64
popd
echo done
