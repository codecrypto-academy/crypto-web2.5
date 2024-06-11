const { createECDH } = require('crypto')
const args = require('yargs').argv
const fs = require('fs')

console.log(args.nombre)

if(!args.nombre){
    console.log("Falta el nombre en el comando de ejecucion del programa.")
    exit(0)
}

const objetoClaves = createECDH("secp521r1")
const clavePública = objetoClaves.generateKeys("hex")
const clavePrivada = objetoClaves.getPrivateKey("hex")
fs.writeFileSync(`./datos/${args.nombre}.key`, clavePrivada)
fs.writeFileSync(`./datos/${args.nombre}.pb`, clavePública)