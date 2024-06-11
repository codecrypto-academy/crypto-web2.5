const{ createECDH, createDecipheriv } = require('crypto')
const { exit } = require('process')
const args = require('yargs').argv
const fs = require('fs')


if(!(args.privada && args.publica && args.fichero)){
    console.log("Faltan argumentos.")
    exit(0)
}

const origen = createECDH('secp521r1')
const clavePrivada = fs.readFileSync(`./datos/${args.privada}.key`).toString()
origen.setPrivateKey(clavePrivada, "hex")

const clavePública = fs.readFileSync(`./datos/${args.publica}.pb`).toString()

// Creación de la clave secreta compartida
const claveSecreta = Uint8Array.from(origen.computeSecret(clavePública, "hex", 'binary'))

// Descifrado del fichero

const algoritmo = "aes-256-cbc"
var descifrador = createDecipheriv(algoritmo, claveSecreta.slice(0,32), claveSecreta.slice(0,16))
const texto = fs.readFileSync(`./datos/${args.fichero}`).toString()

console.log(texto)

let desencriptado = descifrador.update(texto, 'hex', 'utf-8')
desencriptado += descifrador.final('utf-8')
console.log(desencriptado)
fs.writeFileSync("./datos/" + args.fichero.toString().substring(0, args.fichero.toString().indexOf('.enc')), desencriptado)