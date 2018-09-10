'use strict';

// Getting the instance of Fabric CA & Fabric CA Client
const HF_CA_INSTANCE       = require('fabric-ca-client')
const HF_CLIENT_INSTANCE   = require('fabric-client')

// Loading the connection profile
var connection = HF_CLIENT_INSTANCE.loadFromConfig('./network-config.yaml')
var certificateAuthority
var enrollResult
var contextIns

async function initalize () {

    await connection.initCredentialStores();
    
    certificateAuthority = await connection.getCertificateAuthority();

    enrollResult = await certificateAuthority.enroll({enrollmentID:'farmer1',enrollmentSecret:'password'})

    var certProperties = {
                    username: 'farmer1',
                    mspid: 'Procurement',
                    cryptoContent: {
                        privateKeyPEM: enrollResult.key.toBytes(),
                        signedCertPEM: enrollResult.certificate
                    }
                }


    console.log("\n\n CERTIFICATE \n\n"+enrollResult.certificate)
    console.log("\n\n PRIVATE KEY \n\n"+enrollResult.key.toBytes())


    var userIns = await connection.createUser(certProperties);
    contextIns = await connection.setUserContext(userIns)

    console.log("\n\n USER CONTEXT \n\n"+contextIns.toString())
}

initalize()

