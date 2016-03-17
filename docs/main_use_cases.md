# Main use cases

## Verification of the digitally signed file

In need of verifying a digitally signed document the easiest way is to use the StartSession request (described in chapter 8.1) valuing the SigDocXML parameter. If the only purpose is getting the overview of the content of DigiDoc and no further signing or certificate reading is intended, the StartSession request should be called with the parameter bHoldSession value set to false. In this case no further session closing is necessary. The StartSession request returns the signed document information as a structure of SignedDocInfo, where all the necessary parameters the signed document are readable.

**Image here**

If StartSession is called with parameter bHoldSession=true, after verifying it some additional requests about signed document will be possible:

- to request the information about a data file (GetDataFile method)

- to request the certificate of a certain signer (GetSignerCertificate method)

- to request the validity confirmation response for a certain signature (GetNotary method)

-to request the validity confirmation signer's certificate of a certain signature (GetNotaryCertificate method)

If StartSession is called with parameter bHoldSession=true, further session closing will be necessary.

**Image here**

## Signing

### Mobile Signing in Asynchronous Client-Server mode

**Image here**

1. Application provider sends the files for signing (DigiDoc files or original files) to DigiDoc Service within the StartSession request.
2. As a result of the StartSession request also a created session identifier is returned, what should be used in the headers of following requests.
3. The application sends a MobileSign request to start the signing process. If there's a will to sign more than one original file at a time, it's possible to add additional data files with AddDataFile method before sending the MobileSign request.
4. DigiDocService forwards the signing request to MSSP service, which forwards it in turn to user's phone via a mobile operator.
5. MSSP returns either an errorcode or an information about successful request.
6. DigiDocService returns a response to the application with the MobileSign request. The response is either an errorcode or the information about the signing request.
7. In asynchronous Client-Server mode the application should keep up sending a GetStatusInfo request to DigiDocService until signing process is either successful or unsuccessful.
9. MSSP service sends a note about succeeding/unsucceeding. If signing is successful, also a signature will be sent to the DigiDocService.
2. DigiDocService returns the information about receiving the signature to MSSP.
3. After receiving the signature DigiDoc service sends a request about the user certificate's validity to the OCSP validity confirmation service.
4. The validity confirmation service returns a signed validity confirmation response. A signature, which contains a signed hash and the validity confirmation service response is added to the DigiDoc file in session.
5. Another GetSignedDocInfo request is sent by the Application Provider.
6. DigiDocService returns GetStatusInfoResponse about success or failure of signing operation
7. Application provider request information about document status using GetSignedDocInfo method
8. DigiDocService responds to GetSignedDocInfo
9. The application provider inquires the content of the signed DigiDoc with GetSignedDoc request.
10. DigiDocService returns a DigiDoc file to the application. If the content of the data files is not sent to the service within the StartSession, the application that uses the service has to add it to the DigiDoc container itself.
11. The application closes the session with sending a CloseSession request to the service.
12. The Service returns the CloseSession response.

### Signing with smartcard

The present example is based on the web-page enabling digital signing.

1. User of the digital signing application has chosen a procedure that requires data signing. The user starts the signing procedure pressing the respective button or hyperlink in a company web service.
1. The data meant to be signed will be sent to DigiDocService by StartSession request. A new session is initiated with that. Every session is connected to a (digitally signed) document. But every digitally signed document may contain plenty of original files.

An application sends to the service either

1. a file to be signed
2. the meta information and the hash of the file to be signed (the content of the file has been removed)
3. the entire container to be signed
4. the container to be signed without the bodi(es) of datafile(s) (all the content between the DataFile tags has been removed)

The ways of sending the data necessary for signing are described more precisely in chapter 8.1. Data received within the StartSession request is saved in the session.

1. SessionCode is returned to the application, what enables the following procedures with the session data.
2. Before signing the application may add supplementary data files (AddDataFile request) or remove some datafiles (RemoveDataFile request) or carry out some other procedures with session data.
3. After procedures the current session document information is returned.
4. The signing modules are integrated in the webpage which offers digital signing. Also some information about the signer's role/resolution and the signing location may be asked the user on the webpage. The signing component located on the webpage reads the signer's certificate information from the smartcard. It is recommended to use Javascript library idCard.js for loading signature modules - available from [id.ee](http://www.id.ee)
5. The certificate from the signer's smartcard together with other user inserted signature attributes is forwarded to the signing web-server.
6. Signature parameters are forwarded to DigiDocService with PrepareSignature request.
7. DigiDocService adds new signature information to the session document – signer's certificate and signature parameters and calculates the hash, what should be signed by the signer. The signed hash is sent to the application provider in PrepareSignature response.
8. The hash to be signed together with the signing module is displayed to a user. The user presses the signing button on the webpage. As the result of that the signing module signs the hash (also asks for the PIN-code).

The created signature is set to the hidden field of the form and sent to the web-page which offers the signing functionality.

1. The signature is forwarded to the signing web-server (application provider).
2. The signature is forwarded to DigiDocService with FinalizeSignature request.
3. DigiSocService makes a validity confirmation request about the validity of the signer's certificate to the OCSP validity service.
4. OCSP validity confirmation server returns the validity confirmation of the signature.
5. If the confirmation is positive (i.e. the signer's certificate is valid), SK web-service adds the entire information (the signature and the validity 
   confirmation of the signer) to the creatable digital signature. From now on the digital signature is consistent added to the DigiDoc in session. 
   DigiDocService returns the digital signing application the SignedDocInfo.
6. Application asks for the content of the DigiDoc file with GetSignedDoc request.
7. DigiDocService returns the current DigiDoc document which also contains the added signature.
8. The user is informed about the happy end in digital signing. A digitally signed DigiDoc file is ready for download.

NB! In case that the content of the data file was not sent to servers within StartSession and AddDataFile requests (described in options b and d), it's necessary to add the bodies of data files to DigiDoc file received from the service. TheContentType has to be changed in <DataFile> tag, the reference to hash has to be removed and the contents of data files in Base64 encoding has to be added between <DataFile> tags. If possible the validity of signatures and the integrity of file is checked.

1. The last step for the signing application is to close the session with CloseSession request. After that the service deletes all the data saved within the session.

## Authentication

### Mobile authentication in asynchronous Client-Server mode

**Image here**

1. The Application Provider sends data required for the authentication to DigiDocService using MobileAutheticate (personal identification code, text to be displayed, language)
2. DigiDocService makes a validity confirmation request about the validity of the user's certificate to the OCSP service.
3. OCSP validity confirmation server returns the validity confirmation of the certificate. If the certificate is valid, go to p. 4, otherwise to p. 6.
4. An authentication request is sent to the user's mobile phone through the MSSP service.
5. MSSP responses with information about successfulness of message delivery to the mobile phone
6. If the certificate was valid and delivery of the authentication message through MSSP was successful, information about the end-user is returned to the Application provider. Otherwise, error message is returned.
7. Application Provider will periodically query the Service with GetMobileAuthenticateStatus request. (Note: this is a case for Asynchronous Client-Server Mode; in other mode the Application Provider will just wait for information from the Service).
8. DigiDocService in turn will query MSSP
9. MSSP responses on status of the query
10. Information about authentication status is forwarded to the Application Provider.
11. 13. 14 etc - this loop (7. 8. 9. 10.) goes on until positive answer or error message will arrive.

### Authentication using smartcard

CheckCertificate method can be used as a part of authentication with ID-card, checking the validity of user authentication certificate (located on the smartcard).


