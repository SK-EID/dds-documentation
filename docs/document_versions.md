##  Document Versions

| **Ver.** | **Date** | **Author** | **Notes** |
| --- | --- | --- | --- |
| 3.9.1 | 20.10.15 | Andres Voll |
- --From now on the specification is only available in English.
- --Added validation support for signature in BDOC-TS/ASiC-E format. BDOC-TS/ASiC-E signatures can now be validated by using StartSession method, additionally, the signature container related methods supported are GetDataFileInfo, GetDataFile, GetSignedDoc, GetSignedDocInfo, GetSignersCertificate, GetNotary and GetSignersCertificate. Version 3.9.1 does not yet support methods PrepareSignature, MobileSign, AddDataFile, RemoveDataFile, RemoveSignature.
- --The MobileSignHash operation has a new optional attribute "KeyID"
- --The GetMobileCertificate operation ReturnCertData attribute now supports additional values
- --Updated SignedDocInfo chapter 9.1: The Startsession operation now outputs timestamp(s) information for BDOC-TS/ASiC-E containers
 |
| 3.8.1 | 09.03.15 | Risto Alas |
- --Method "MobileCreateSignature" now supports the BDOC-TS (ASiC-E) format. See the parameter "SigningProfile", value "LT"
- --Added timeout durations for Mobile-ID operations
 |
| 3.7.1 | 08.12.14 | Risto Alas |
- --Updated the signing algorithms chapter 4.2: new Mobile-ID SIM cards will support more than one signing algorithm (e.g. both RSA and ECDSA).
- --Elaborated on ECDSA signature verification for GetMobileAuthenticateStatus()
- --Introduced a new reserved value "LT" (_Long Term,_ based on ASiC-E standard) for "SigningProfile" parameter. The value will be used in a future release for the BDOC-TS (BDOC with time-stamps / ASiC-E) format, currently service outputs an error.
 |
| 3.6 | 25.08.14 | Risto Alas, Priit Reiser |
- --Added a description of the BDOC HASHCODE format
- --The MobileCreateSignature operation has a new optional attribute "mime-type"
- --Data file content type has been fixed in chapter 9.3 (DataFileInfo)
 |
| 2.128 | 17.04.14 | Tauri Neitov |
- --Updates to the descriptions of  StartSession() and MobileCreateSignature()
- --Updated container validation info
 |
| 2.127 | 26.03.14 | Tauri Neitov |
- --Updates to the BDOC version 2.1 support
- --Added a chapter about error messages from the DigiDoc library
- --Updated description for the GetMobileCertificate() response
- --Elaborated on the support of ECDSA certificates in the response of the operation GetMobileAuthenticateStatus()
 |
| 2.126 | 16.01.14 | Ago Vesmes,Tauri Neitov | - Corrections to the text.- Updated MobileAuthenticate(), MobileSign(), MobileCreateSignature() and GetMobileCertificate() method descriptions  in relation to the mandatory country field.- Added descriptions of the methods MobileSignHashRequest() and GetMobileSignHashStatusRequest().- Updated descriptions of the SOAP error messages.- Corrected variable name in the method MobileAuthenticate() input.- Updated list of the permitted container formats and versions.- List of the changes to the service is relocated to the website www.id.ee.- Chapters about DigiDoc, Security model of DigiDoc and GetSignatureModules have been removed. |
| 2.125 | 18.03.13 | Ahto Jaago, Liisa Lukin, Ago Vesmes | - Updated MobileAuthenticate(), MobileSign(), MobileCreateSignature() and GetMobileCertificate() method descriptions  - Personal Identity Code and phone number are mandatory. Added language parameter value „LIT". Updated info about the length of MessageToDisplay parameter- Updated the requirements for using Mobile-ID operations - Updated StartSession() method description- Adding signature and creating new container only DIGIDOC-XML 1.3 format is supported  - Updated MobileCreateSignature() and CreateSignedDoc() methods descriptions.- Updated GetMobileCreateSignatureStatus()  method description- Updates 6.2.2Signing with smartcard -added a recommendation to use the idCard.js client side library instead of the GetSignatureModules operation **.** - Added info about file size limit and HASHCODE in section 5.3, 8.1, 8.4, 8.18- Updated error codes in section 9.4, 8.6, 8.20- Added description of differences between Service versions 2.3.5 and 3.2.5. |
| 2.123 | 19.12.08 | Ahto Jaago, Urmo Keskel |
- --Added section „Suggestions and requirements about using the service"
- --Added CheckCertificate method description
- --Added section „Authentication using ID-card"
- --Updated descriptions of following methods and data structure: StartSession, MobileAuthenticate, MobileAuthenticateStatus, AddDataFile,  DataFileInfo
- --Updated section 6.2.1
 |
| 2.122 | 23.04.07 | Urmo Keskel | GetMobileCertificate method added, general text corrections |
| 2.120 | 20.03.07 | Urmo Keskel | Major upgrade |
| 1.105 | 03.05.06 | Urmo Keskel | Changed methods StartSession, MobileSign and PrepareSignature, added parameter signatureProfile. Added methods describing timestamps and certificate revocations lists. |
| 1.104 | 07.02.06 | Urmo Keskel | Added SmartCard signing functions, SessionCode parameter moved from header to body. Removed exampled. |
| 1.103 | 31.10.05 | Urmo Keskel | The first version, this document is based on document "DigiDocService teenuse mudel ja spetsificatioon" created by Veiko Sinivee. |



2. References

| **[1] RFC3275**   | (Extensible Markup Language) XML-Signature Syntax and Processing. March 2002. |
| --- | --- |
| **[2] ETSI TS 101 903**   | XML Advanced Electronic Signatures (XAdES). February 2002. |
| **[3] DigiDoc Format** | DigiDoc Format Specification [http://www.id.ee/28737](http://www.id.ee/28737)   |
| **[4] SOAP** | Simple Object Access Protocol [http://www.w3.org/TR/soap/](http://www.w3.org/TR/soap/) |
| **[5] Time Formats       ** | The W3C note _Date and Time Formats_ [_http://www.w3.org/TR/NOTE-datetime_](http://www.w3.org/TR/NOTE-datetime)_, September 1997_ |
| _**[6]**_ **ETSI TS 102 204** | _Mobile Commerce (M-COMM); Mobile Signature Service; Web Service Interface. V.1.1.4, August 2003._ |
| **[7] RFC 3161** | Internet X.509 Public Key Infrastructure: Time-Stamp Protocol (TSP), August 2001 |
| **[8] NIST P-256** | National Institute of Standards and Technology defined P-256 curve [http://csrc.nist.gov/groups/ST/toolkit/documents /dss/NISTReCur.pdf](http://csrc.nist.gov/groups/ST/toolkit/documents%20/dss/NISTReCur.pdf) |
| **[9] BDOC format specification** | [http://sk.ee/repository/bdoc-spec21.pdf](http://sk.ee/repository/bdoc-spec21.pdf)  |
| **[10] XMLDSig** | XML Signature Syntax and Processing Version 1.1, W3C Recommendation 11 April 2013. http://www.w3.org/TR/xmldsig-core1/ |


