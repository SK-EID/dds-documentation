# Introduction

DigiDoc is a SOAP-based web service enabling an easy integration for the functionality of digital signing, verifying signatures and authentication with other information systems.

The service is usable in different development environments and platforms featuring SOAP 1.0-encoded support.

**Functionality of the service:**

* Authentication with Mobile-ID
* Verification of certificate's validity (including any smartcard)
* Creation of DigiDoc/BDOC files
* Digital signing of DigiDoc/BDOC with Mobile-ID
* Digital signing of DigiDoc/BDOC with ID card (and other smartcards)
* Verification of digitally signed files (DigiDoc/BDOC) and validity of signatures
* Hash signing with Mobile-ID.

Access to the service is created on the basis of an IP address. A contract with Sertifitseerimiskeskus needs to be signed for using the service. The price of using the DigiDocService 
depends on the number of signature and authentication queries per month and on the number of concurrent queries coming from one application.

DigiDocService supports DigiDoc container formats ``DIGIDOC-XML 1.3`` and ``BDOC 2.1`` with ``time-marks``. BDOC with ``time-stamps`` (``BDOC-TS``, ``ASiC-E``) format is supported since version 3.8 for 
using ``MobileCreateSignature`` method. Validation of BDOC-TS file format is supported starting from 3.9. Version 3.9.1 does not yet support methods ``PrepareSignature``, ``MobileSign``, ``AddDataFile``, 
``RemoveDataFile``, ``RemoveSignature``, support will be added to version 3.10.

Older formats (``SK-XML 1.0``, ``DIGIDOC-XML 1.1`` and ``DIGIDOC-XML 1.2``) are only supported for verification (document container format is checked in the ``MobileCreateSignature`` and ``CreateSignedDoc`` methods). 
If an inappropriate combination of given format and version number is used in request parameters, a SOAP error object with error message "Invalid format and version combination" will be returned.

##  Formats of digitally signed files

###  DDOC format

The format of the digitally signed file is based on ETSI TS 101 903 standard called "XML Advanced Electronic Signatures (XAdES)". This standard provides syntax for digital 
signatures with various levels of additional validity information.

In order to comply with the security model described above, the XAdES profile of "XAdES-X-L" is used in the DigiDoc system but "time-marks" are used i
nstead of "time-stamps" – signing (and certificate validation) time comes with OCSP response.

**This profile:**

* Allows for incorporating following signed properties
    * Certificate used for signing
    * Signing time
    * Signature production place
    * Signer role or resolution
* Incorporates full certificate validity information within the signature
    * OCSP response
    * OCSP responder certificate

As of result, it is possible to verify signature validity without any additional external information – the verifier should trust the issuer of signer's certificate and a OCSP responder certificate.

**Image here**

Original files (which were signed) along with the signature(s), validation confirmation(s) and certificates are encapsulated within container with "SignedDoc" being as a root element.

DigiDoc system uses file extension. ``ddoc`` to distinguish digitally signed files according to the described file format.

Syntax of the ``.ddoc`` files is described in the separate document [3] DigiDoc Format Specification in detail.

###  BDOC format

In addition starting from version 3.5 DigiDocService also supports BDOC 2.1 _with__time-marks_ (BDOC-TM). BDOC _with time-stamps_ (BDOC-TS, ASiC-E) format is supported since version 3.8 for using MobileCreateSignature method. Validation of BDOC-TS file format is supported starting from 3.9. Version 3.9.1 does not yet support methods PrepareSignature, MobileSign, AddDataFile, RemoveDataFile, RemoveSignature, support will be added to version 3.10.

 The description of BDOC file format is available in BDOC specification [9].

Starting from 2015 BDOC is default digital signature format in Estonia, therefore it's important to add BDOC file format support to your service. For more information about BDOC file format, please visit [http://www.id.ee/?id=34336](http://www.id.ee/?id=34336)

Instructions for DigiDocService service users on how to migrate to BDOC format are available at id.ee website: [http://www.id.ee/?lang=en&id=37072](http://www.id.ee/?lang=en&id=37072) .

## Signing algorithms

DigiDocService supports signatures using the ECDSA (Elliptic Curve Digital Signature Algorithm) and RSA algorithms.

The service automatically chooses the appropriate algorithms for signing and authentication. To learn which algorithm is 
used in a particular case, application providers should inspect the certificate returned by the service.

ECDSA is currently only supported for Mobile-ID. If user's SIM card does not have ECDSA support, RSA algorithm is used. 
For DDOC file format only RSA is supported, BDOC format supports RSA and ECDSA.

A single signer can have multiple active certificates, each with a different signing algorithm. In such cases, 
DigiDocService chooses the most suitable certificate automatically.

The choice is based on following conditions:

- if user's SIM-card supports ECDSA, authentication (operation MobileAuthenticate) is always done using the ECDSA certificate.
- If user's SIM-card supports ECDSA and RSA, then ECDSA is used for signing BDOC files (operation MobileSign and MobileCreateSignature). As the DDOC file format does not support ECDSA, DDOC files are always signed using RSA.

For SIM cards that support both ECDSA and RSA the GetMobileCertificate method **by**** default** returns the ECDSA certificate; similarly, the MobileSignHash method chooses ECDSA. But starting from version 3.9 it is possible to request ECDSA (ECC) or RSA certificate.

RSA is commonly used with either 1024-bit or 2048-bit keys. ECDSA is implemented over the NIST P-256 [8] curve and the signatures are encoded according to the XMLDSig specification [10] (i.e., two 256-bit integers appended to each other, zero-padded on the left if necessary; the result is then converted to Base64). The total raw ECDSA signature size is always 512 bits.



