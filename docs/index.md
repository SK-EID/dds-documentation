# AS Sertifitseerimiskeskus DigiDocService specification

**Document version: 3.9.1**

**Last update: 22.01.2016**

**Service version: 3.9.1**

## Table of contents

<!---
1. Document Versions        
1. References        
--->

* [Introduction](introduction)        
    * [Formats of digitally signed files](introduction#formats-of-digitally-signed-files)        
        * [DDOC format](introduction#ddoc-format)        
        * [BDOC format](introduction#bdoc-format)       
    * [Signing algorithms](introduction#signing-algorithms)        
* [Terms and Acronyms](terms_and_acronyms)        
* [Suggestions and requirements for Application providers](application_providers)        
    * [Digital signing](application_providers#digital-signing)        
    * [Starting Mobile-ID operations](application_providers#starting-mobile-id-operations)        
    * [Technical suggestions and requirements](application_providers#technical-suggestions-and-requirements)        
* [Main use cases](main_use_cases)        
    * [Verification of the digitally signed file](main_use_cases#verification-of-the-digitally-signed-file)        
    * [Signing](main_use_cases#signing)        
        * [Mobile Signing in Asynchronous Client-Server mode](main_use_cases#mobile-signing-in-asynchronous-client-server-mode)        
        * [Signing with smartcard](main_use_cases#signing-with-smartcard)        
    * [Authentication](main_use_cases#authentication)        
        * [Mobile authentication in asynchronous Client-Server mode](main_use_cases#mobile-authentication-in-asynchronous-client-server-mode)        
        * [Authentication using smartcard](main_use_cases#authentication-using-smartcard)        
* [Authentication API](api/authenticate_api) 
    * [MobileAuthenticate](api/authenticate_api#mobileautheticate)        
    * [GetMobileAuthenticateStatus](api/authenticate_api#getmobileauthenticatestatus)        
    * [CheckCertificate](api/authenticate_api#checkcertificate)        
* [Digital Signature API](api/digital_signature_api)       
    * [StartSession](api/digital_signature_api#startsession)       
        * [HASHCODE](api/digital_signature_api#hashcode)        
    * [CloseSession](api/digital_signature_api#closesession)        
    * [CreateSignedDoc](api/digital_signature_api#createsigneddoc)        
    * [AddDataFile](api/digital_signature_api#adddatafile)        
    * [MobileSign](api/digital_signature_api#mobilesign)        
    * [GetStatusInfo](api/digital_signature_api#getstatusinfo)  
    * [GetSignedDocInfo](api/digital_signature_api#getsigneddocinfo)        
    * [GetSignedDoc](api/digital_signature_api#getsigneddoc)        
    * [GetDataFile](api/digital_signature_api#getdatafile)        
    * [RemoveDataFile](api/digital_signature_api#removedatafile)        
    * [RemoveSignature](api/digital_signature_api#removesignature)        
    * [GetSignersCertificate](api/digital_signature_api#getsignerscertificate)        
    * [GetNotarysCertificate](api/digital_signature_api#getnotaryscertificate)       
    * [GetNotary](api/digital_signature_api#getnotary)        
    * [GetVersion](api/digital_signature_api#GetVersion)        
    * [PrepareSignature](api/digital_signature_api#preparesignature)        
    * [FinalizeSignature](api/digital_signature_api#finalizesignature)        
    * [MobileCreateSignature](api/digital_signature_api#mobilecreatesignature)        
    * [GetMobileCreateSignatureStatus](api/digital_signature_api#getmobilecreatesignaturestatus)        
    * [GetMobileCertificate](api/digital_signature_api#getmobilecertificate)        
    * [MobileSignHash](api/digital_signature_api#mobilesighhash)        
    * [GetMobileSignHashStatusRequest](api/digital_signature_api#getmobilesignhashstatusrequest)        
* [Data structures](api/data_structures)        
    * [SignedDocInfo](api/data_structures#signeddocinfo)        
    * [CertificateInfo](api/data_structures#certificateinfo)       
    * [DataFileInfo](api/data_structures#datafileinfo)        
    * [SOAP Error Messages](api/data_structures#soap-error-messages)        
    * [Container validation](api/data_structures#container-validation)        
* [Service Change History](service_change_history)        


