const { createCipheriv, createECDH } = require('crypto')
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

// Cifrado del fichero

const algoritmo = "aes-256-cbc"
var cifrador = createCipheriv(algoritmo, claveSecreta.slice(0,32), claveSecreta.slice(0,16))

fs.createReadStream("./datos/" + args.fichero)
    .pipe(cifrador)
    .pipe(new fs.createWriteStream("./datos/" + args.privada + "-" + args.fichero + ".enc"))
