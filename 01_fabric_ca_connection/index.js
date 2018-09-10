'use strict';

// Getting the instance of Fabric CA & Fabric CA Client
const HF_CA_INSTANCE       = require('fabric-ca-client')
const HF_CLIENT_INSTANCE   = require('fabric-client')

// Loading the connection profile
var connection = HF_CLIENT_INSTANCE.loadFromConfig('./network-config.yaml')

var certificateAuthority

connection.initCredentialStores().then (function() {
    
    certificateAuthority = connection.getCertificateAuthority();
    
    return connection.getUserContext('admin',true).then( function(user) {
        if (user) {
            console.log("admin user already exists")
        }
        else {
                return certificateAuthority.enroll({enrollmentID:'farmer1',enrollmentSecret:'password'}).then (function(result) {
                        console.log("Enrolled admin user key\n\n"+result.key.toBytes())
                        console.log("\n\n\n\nEnrolled admin user cert\n\n"+result.certificate)

                        var certProperties = {
                                            username: 'farmer1',
                                            mspid: 'Procurement',
                                            cryptoContent: {
                                                privateKeyPEM:result.key.toBytes(),
                                                signedCertPEM: result.certificate
                                            }
                                        }

                        return connection.createUser(certProperties).then(function(userIns){

                            console.log("\n\n\n\n User Creation \n\n"+userIns.toString())
                            return connection.setUserContext(userIns).then(function() {
                                    console.log("User Context initalized successfully !!")
                            })

                        })

                })
        }

    })

})
