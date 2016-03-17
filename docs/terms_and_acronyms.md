## Terms and Acronyms

* **Application Provider** - Client of the DigiDocService, provides an application that uses digital signing, signature verification and/or authentication. 
*  **Control Code** - 4-digit number used in mobile authentication and mobile signing which is cryptographically linked with hash value to be signed. Control Code is displayed both in mobile phone and computer application in order to provide for authenticity of the signing request. 
* **Hash, Hash value** - Data to be signed which is cryptographically derived from Datafiles and other parameters to be signed 
* **Mobile-ID** - Service based on Wireless PKI providing for mobile authentication and digital signing. Mobile-ID user uses special SIM card with private keys on it. Hash to be signed is sent over the mobile network to the phone and the user shall enter PIN code to perform transaction. The signed result is sent back to the service. 
* **MSSP** - Mobile Signature Service Provider. Described in standard ETSI TS 102 204 [6]. 
* **Original file, Datafile** - File to be digitally signed. The file is in arbitrary file format 
* **Signing** - Used in this case as „forming the digital signature" according to the Digital Signature Law. The procedure includes besides signing the validity confirmation request. 
* **Verification** - Checking the validity of signatures of the digitally signed data. 
* **Transaction, session** - Communication while a file (DigiDoc or the original data file) is forwarded to the web service and some operations related to these are followed, i.e. a DigiDoc is created out of the data file, then signed and returned to the application. After closing the transaction all the information created during the transaction is deleted from the service-server |


