# Data structures

## SignedDocInfo

Presents the structure of a DigiDoc file (container).

* **Format** – File format for the signed container (DIGIDOC-XML and BDOC are supported currently).
* **Version** - The version of a signed file format (in case of DIGIDOC-XML the 
  versions 1.1, 1.2, 1.3; in case of BDOC the version 2.1).
* **DataFileInfo –** Information about the files in container. The data structure is described in chapter 9.3in the current 
  document. A DataFileInfo section may appear 0..n times in an SignedDocInfo section, depending on the number of data files.
* **SignatureInfo** – Contains the info of the signatures in the signed file. This section may appear 0..n times depending on the number of signatures. Contains the following attributes:
    * **Id –** The unique signature's identifier within the current document/transaction. Signatures' identifiers begin with „S" and the signature's sequence number is followed.
    * **Status** – Signature's status information. A signature will be valid, if the value of the attribute is „OK". If a signature is invalid, the value 
      of the attribute will be „Error" and more precise error information is presented in the Error-element. If the signature is valid, but doesn't completely 
      correspond to the container's specification, the value of this element is "OK", while the Error-element has a description of the warning returned by the DigiDoc library.
    * **Error** – Contains the error information discovered during the signature validation check. Contains following attributes:
        * **code** – Error code;
        * **category–** Error category. There are 3 error categories:  
            ``TECHNICAL`` – technical issue;  
            ``USER`` – issue caused by user;  
            ``LIBRARY`` – internal error of the DigiDoc library.  
            ``WARNING`` – A warning from the DigiDoc library. Legally, the signature is valid, but additional changes are not allowed in the container. For more information, see chapter 9.5.  
        * **description –** Error description in English.
    * **SigningTime** – Local time (for example, time of the signer's computer, time of signing web server) of signing according to the "
      The W3C note _Date and Time Formats"_ [5]. NB! This is not the official time of signing, the official time is defined in current structure 
      element _Confirmation-> ProducedAt_.
    * **SignerRole** - The role or resolution marked by the signer at signing. Assigned by following attributes:
        * **Certified** - Defines, whether the role has been assigned by the signer itself or by the CA. Only user-defined roles are in use currently, where the parameter value is 0.
        * **Role** - The text of the role or resolution.
    * **SignatureProductionPlace** - The data, belonging to signature's attributes, describes the place of signing. Those fields are not required in signing.
        * **City** – Name of the city, where it's signed.
        * **StateOrProvince** – Name of the state/province, where it's signed.
        * **PostalCode** – Postal code of the signing location.
        * **CountryName** – Name of the country, where it's signed.
    * **Signer** – Information about the signer including the following attributes:
        * **CommonName** – Name of the signer, taken from the signer certificate's Subject field's CN parameter.
        * **IDCode** –Identification number of the signer, taken from the signer certificate's Subject field's Serial Number parameter.
        * **Certificate** – Main information of the certificate used for signing according to the current document's chapter 9.2.
    * **Confirmation –** OCSP validity confirmation's data structure. Every correct and valid signature contains a structure of a validity confirmation. Confirmation section contains the following attributes:
        * **ResponderID** – Distinguish name of the OCSP validity confirmation server (OCSP Responder ID)
        * **ProducedAt** – Validity Confirmation obtaining time according to the "The W3C note _Date and Time Formats"_ [5] (f.e._"_09.14T21:00:00Z"). This time is counted as the official signing time.
        * **Responder Certificate** - Certificate of the validity confirmation service (OCSP) server according to the format described in current document chapter 9.2.
    * **Timestamps –** Information about the RFC3161 timestamps that are related to the signature. It will be outputted only in case of BDOC-TS/ASiC-E containers. Timestamps section contains the following attributes:
        * **Id** – Currently not included.
        * **Type** - The type of the timestamp. The value for signature's timestamp is always ``SIGNATURE\_TIMESTAMP``.
        * **SerialNumber** - Currently not included.
        * **CreationTime** - the generation time of the the signature's timestamp (f.e. "2014-11-11T15:00:00Z").
        * **Policy** - Currently not included.
        * **Errorbound** - Currently not included.
        * **Ordered** - Currently it is always set to "false".
        * **TSA** - Currently not included.
        * **Certificate** - Main information of the certificate used for signing the timestamp according to the current document's chapter 9.2.
    * **CRLInfo** - Information about signature related revocation list.  The revocation revocation list related functionality is not realized in the service version.

#### Sample of structure

```xml
<SignedDocInfo xsi:type="d:SignedDocInfo">
    <format xsi:type="xsd:string"></format>
    <version xsi:type="xsd:string"></version>
    <DataFileInfo xsi:type="d:DataFileInfo">
        <Id xsi:type="xsd:string"></Id>
        <Filename xsi:type="xsd:string"></Filename>
        <MimeType xsi:type="xsd:string"></MimeType>
        <ContentType xsi:type="xsd:string"></ContentType>
        <Size xsi:type="xsd:int">0</Size>
        <DigestType xsi:type="xsd:string"></DigestType>
        <DigestValue xsi:type="xsd:string"></DigestValue>
        <Attributes xsi:type="d:DataFileAttribute">
            <name xsi:type="xsd:string"></name>
            <value xsi:type="xsd:string"></value>
        </Attributes>
    </DataFileInfo>
    <SignatureInfo xsi:type="d:SignatureInfo">
        <Id xsi:type="xsd:string"></Id>
        <Status xsi:type="xsd:string"></Status>
        <Error xsi:type="d:Error">
            <code xsi:type="xsd:int">0</code>
            <category xsi:type="xsd:string"></category>
            <description xsi:type="xsd:string"></description>
        </Error>
        <SigningTime xsi:type="xsd:string"></SigningTime>
        <SignerRole xsi:type="d:SignerRole">
            <certified xsi:type="xsd:int">0</certified>
            <Role xsi:type="xsd:string"></Role>
        </SignerRole>
        <SignatureProductionPlace si:type="d:SignatureProductionPlace">
            <City xsi:type="xsd:string"></City>
            <StateOrProvince xsi:type="xsd:string"></StateOrProvince>
            <PostalCode xsi:type="xsd:string"></PostalCode>
            <CountryName xsi:type="xsd:string"></CountryName>
        </SignatureProductionPlace>
        <Signer xsi:type="d:SignerInfo">
            <CommonName xsi:type="xsd:string"></CommonName>
            <IDCode xsi:type="xsd:string"></IDCode>
            <Certificate xsi:type="d:CertificateInfo">
                <Issuer xsi:type="xsd:string"></Issuer>
                <Subject xsi:type="xsd:string"></Subject>
                <ValidFrom xsi:type="xsd:string"></ValidFrom>
                <ValidTo xsi:type="xsd:string"></ValidTo>
                <IssuerSerial xsi:type="xsd:string"></IssuerSerial>
                <Policies xsi:type="d:CertificatePolicy">
                    <OID xsi:type="xsd:string"></OID>
                    <URL xsi:type="xsd:string"></URL>
                    <Description xsi:type="xsd:string"></Description>
                </Policies>
            </Certificate>
        </Signer>
        <Confirmation xsi:type="d:ConfirmationInfo">
            <ResponderID xsi:type="xsd:string"></ResponderID>
            <ProducedAt xsi:type="xsd:string"></ProducedAt>
            <ResponderCertificate xsi:type="d:CertificateInfo">
                <Issuer xsi:type="xsd:string"></Issuer>
                <Subject xsi:type="xsd:string"></Subject>
                <ValidFrom xsi:type="xsd:string"></ValidFrom>
                <ValidTo xsi:type="xsd:string"></ValidTo>
                <IssuerSerial xsi:type="xsd:string"></IssuerSerial>
                <Policies xsi:type="d:CertificatePolicy">
                    <OID xsi:type="xsd:string"></OID>
                    <URL xsi:type="xsd:string"></URL>
                <Description xsi:type="xsd:string"></Description>
                </Policies>
            </ResponderCertificate>
        </Confirmation>
    </SignatureInfo>
</SignedDocInfo>
```

## CertificateInfo

Data structure which includes the main fields of the certificate. Used for describing the information of the certificate of the signer and the information of the certificate of the validity confirmation.

Contains the following attributes:

* **Issuer** – The distinguished name of the certificate issuer.
* **IssuerSerial** – The certificate's serial number.
* **Subject** – The distinguished name of the certificate.
* **ValidForm** – The certificate's period of validity according to The W3C note _Date and Time Formats_ _[5] (for example "_09.14T21:00:00Z").
* **ValidTo** – The expiration time of the certificate according to The W3C note _Date and Time Formats_ _[5]_
* **Policies** – Structure of signing policies, may appear 0..n times.
    * **OID** – The unique identifier of signing policies.
    * **URL** - The reference to signing policies (used on company certificates primly).
    * **Description** - A short description of signing policies.

#### Sample of structure

```xml
<Certificate xsi:type="d:CertificateInfo">
    <Issuer xsi:type="xsd:string">/emailAddress=pki@sk.ee/C=EE/O=AS Sertifitseerimiskeskus/OU=ESTEID/SN=1/CN=ESTEID-SK</Issuer>
    <Subject xsi:type="xsd:string">/C=EE/O=ESTEID/OU=digital signature/CN=KESKEL,URMO,38002240232/SN=KESKEL/GN=URMO/serialNumber=38002240232</Subject>
    <ValidFrom xsi:type="xsd:string">2005.03.18T22:00:00Z</ValidFrom>
    <ValidTo xsi:type="xsd:string">2008.03.22T22:00:00Z</ValidTo>
    <IssuerSerial xsi:type="xsd:string">1111128454</IssuerSerial>
    <Policies xsi:type="d:CertificatePolicy">
        <OID xsi:type="xsd:string">1.3.6.1.4.1.10015.1.1.1.1</OID>
        <URL xsi:type="xsd:string">http://www.sk.ee/cps/</URL>
        <Description xsi:type="xsd:string">none</Description>
    </Policies>
</Certificate>
```

## DataFileInfo

The given data structure describes the information of the data file(s) inside DigiDoc. The structure may contain a data file in Base64 format or just a hash of the data file depending on the value of the ContentType attribute.

- **Id** –unique identifier of a file. In case of DIGIDOC-XML format, the data file identifiers start with a symbol „D" followed by the file's sequence number. In case of BDOC format the identifier is the file name, which must be unique. Within a StartSession request the given attribute is not valued and an empty string is sent/forwarded.
- **Filename** – A name of the data file without a path.
- **ContentType** – Data file's content type (HASHCODE, EMBEDDED\_BASE64)
    - ``HASHCODE`` – To service is sent the hashcode\* only not the entire data file's content. The method how to calculate the hashcode is described in parameter _DigestType_ and the hashcode itself is in parameter _DigestValue_.
    - ``EMBEDDED_BASE64`` - The content of the file is in Base64 encoding in DfData attribute.
- **MimeType** – Mime type of datafile.
- **Size** – The actual size of file in bytes.
- **DigestType** - Hashcode type of the data file. In case of DIGIDOC-XML format the form currently supported algorithm is "sha1", in case of BDOC format the supported algorithm is "sha256". Required for HASHCODE content type only.
- **DigestValue** – The value of data file's hash\* in Base64 encoding. Required for HASHCODE content type only.
- **Attributes** - Arbitrary amount of other attributes (meta data), what's add to <Datafile> element in DigiDoc file as attributes (in format <name>="<value>").
- **DfData** - Data file content in Base64 encoding.

\* See example, how to calculate hash over data file and send it to the service from section 8.1

## SOAP Error Messages

The SOAP error message contains error code in the <faultstring> object and additional text in the <detail><message> object.

A new structure of error objects is being used in the responses of the methods MobileSighHash and GetMobileSignHashStatus. The element <faultstring˃ contains the error code. A subelement of the element <detail> is <endpointError> type of object that contains one <message> element with a message that explains the error message, and a zero or more <reason> elements with detailed descriptions of the errror (please see the examples at the end of the chapter).

**Error messages are grouped as follows**:

* **100-199** – errors caused by user (Application Provider) of the service
* **200-299** – internal errors of the service
* **300-399** – errors caused by end user and his/her mobile phone

#### List of error codes:

| **Error Code** | **Explanation** |
| --- | --- |
| 100 | General error |
| 101 | Incorrect input parameters |
| 102 | Some of required input parameters are missing |
| 103 | Service provider does not have access to SK validity confirmation service (OCSP response UNAUTHORIZED) |
| 200 | General error of the service |
| 201 | Missing user certificate |
| 202 | Unable to verify certificate validity |
| 203 | Session is locked by the other SOAP request. |
| 300 | General error related to user's mobile phone |
| 301 | Not a Mobile-ID user |
| 302 | The certificate of the user is not valid (OCSP said: REVOKED) |
| 303 | Certificate is not activated or/and status of the certificate is unknown (OCSP said: UNKNOWN) |
| 304 | Certificates is suspended |
| 305 | Certificate is expired |
| 413 | Incoming message exceeds permitted volume limit. |
| 503 | The number of simultaneous requests of the service has been exceeded. |

#### Example 1 of the service error message

In the request (the first version service, old structure) the phone number format was incorrect or the country code of the phone number was not included in the list of supported country codes.

```xml
<SOAP-ENV:Fault>
   <faultcode>SOAP-ENV:Client</faultcode>
   <faultstring xml:lang="en">102</faultstring>
   <detail>
      <message>User IDcode and Phone number are mandatory</message>
   </detail>
</SOAP-ENV:Fault>
```

#### Example 2 of the service error message

Several errors were identified in the request (the second version service, new structure).

* Sequence of the request parameters was incorrect. Parameter "IDCode" was expected as the first one.
* Phone number does not correspond to the expected type

```xml
<SOAP-ENV:Fault>
   <faultcode>SOAP-ENV:Client</faultcode>
   <faultstring xml:lang="en">101</faultstring>
   <detail>
      <endpointError>
         <message>Request message validation failed</message>
         <reason>cvc-complex-type.2.4.a: Invalid content was found starting with element 'MessageToDisplay'. One of '{IDCode}' is expected.</reason>
         <reason>cvc-minLength-valid: Value '' with length = '0' is not facet-valid with respect to minLength '5' for type 'PhoneNumberType'.</reason>
         <reason>cvc-type.3.1.3: The value '' of element 'PhoneNo' is not valid.</reason>
      </endpointError>
   </detail>
</SOAP-ENV:Fault>
```

## Container validation

When an existing container is sent to DigiDocService, the document is automatically validated. Starting from JDigiDoc library version 3.8 certain technical errors are allowed in the container for compatibility reasons. Such errors are reported as warnings.

When a container has warnings, the signatures are considered legally valid (and thus the status of these signatures is "OK", even though an "Error" element is also present). For some warnings, further modifications to the document are not allowed (adding and removing signatures is not permitted). The following errors are considered warnings:

- 129 WARN\_WEAK\_DIGEST – the container uses a weak hash algorithm (e.g., SHA-1). Adding new signatures is not allowed.
- 173 ERR\_DF\_INV\_HASH\_GOOD\_ALT\_HASH – the XML DataFile element is missing a namespace attribute. Adding signatures is not allowed.
- 176 ERR\_ISSUER\_XMLNS – The XML elements X509IssuerName and/or X509SerialNumber are lacking namespace attributes.
- 177 ERR\_OLD\_VER – The container version is not supported anymore. Adding signatures is not allowed.

For more information about warnings, please refer to the JDigiDoc library documentation: [http://www.id.ee/public/SK-JDD-PRG-GUIDE.pdf](http://www.id.ee/public/SK-JDD-PRG-GUIDE.pdf) , chapter "Validation status VALID WITH WARNINGS".

The warnings are only visible in responses under the SignatureInfo elements. The Status element under SignatureInfo has the value "OK", but there is also an "Error" element present, whose category is set to "WARNING". The warning is specified in the "Code" and "Description" elements.


