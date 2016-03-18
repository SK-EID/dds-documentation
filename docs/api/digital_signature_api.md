# Digital Signature API

## StartSession

In most cases the transaction with the service is started using the StartSession method. It possible to also send data files with this operation; such files will be stored in session and can be operated on later. More precisely, there are 3 different ways to use StartSession:

1. The request can contain a DigiDoc or BDOC container. This is useful for signing and verifying existing containers, for adding or removing data files from the container, and also for extracting data file contents. To use this option, use the "SigDocXML" parameter. (Conversely, the "datafile" parameter should be left empty.)
1. A session can also be started without any data files. This is useful for example for creating new BDOC containers (which can be accomplished by invoking the "CreateSignedDoc" operation next). In this case, both parameters should be empty: "SigDocXML" and "datafile".
1. There is also an option for creating DigiDoc containers directly from this operation (this option only works for DigiDoc containers; BDOC can be created with the "CreateSignedDoc" operation). To use this operation, "SigDocXML" parameter should be empty, "datafile" parameter should be filled.

In the course of the StartSession's query a unique session identifier is returned, which should be added to every procedure called within the transaction.

#### Query:

| **Parameter** | **Type** | **R** | **Description** |
| --- | --- | --- | --- |
| SigningProfile | String | - | This value is currently ignored and may be empty. |
| SigDocXML | String | - | BDOC or DDOC document. A DigiDoc in XML transformed to HTML-Escaped format. For example "<DataFile>" should be transformed to „&lt;DataFile&gt;". The container in BDOC format should be coded to BASE64 before it is delivered to the service. |
| bHoldSession | Boolean | - | A flag that indicates whether the data sent within the StartSession should be stored or the session should be closed deleting all the temporary files straight after response.  The default value is "false". |
| datafile | Datafile | - | Given parameter enables to send to service a data file within the StartSession request. Based on the file a DigiDoc container is created. (The BDOC format is not supported in this use case – please see the "CreateSignedDoc" operation). For example, when sending a "cv.pdf", a "cv.ddoc" is created which contains the "cv.pdf" only. The structure of a datafile element is described in chapter 9.3. While adding the datafile it's unnecessary to determine the identifier. By default, DIGIDOC-XML 1.3 format fis created. |

> **NB!**  It's not allowed to send to the service a data of the SigDocXML and the Datafile at the same time, as these parameters exclude each other.

#### Response:

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Status | String | Value „OK" or an error string |
| Sesscode | Integer | Session code used for further requests in the given transaction. |
| SignedDocInfo | SignedDocInfo | If a StartSession request contains a data file or a DigiDoc file, a SignedDocInfo structure will be returned in the format demonstrated in chapter 9.1 in current document. |

### HASHCODE

Normally, a size limit of 4 MB applies to digitally signed containers and data files sent to DigiDocService. To use bigger files, a "HASHCODE" mode of operation is supported by DigiDocService, where only hashes of data files are sent to the server (in other words, file contents are not sent to the service). This can also improve performance for large data files, as sending bigger files over network can take time.

To use this HASHCODE mode, the DigiDoc or BDOC-container should be converted to the HASHCODE form before sending it to the service. (In this form, the data file contents are replaced with their hash values.) Similarly, when the container is returned by the service, it should be converted back to regular form by inserting back the data file contents. Thus, in the end, the application provider still has a regular container that can be verified by standard tools (i.e., the DigiDoc3 client software). The exact form of HASHCODE depends on the particular format used (DDOC or BDOC).

#### BDOC format and HASHCODE

#### Transforming a BDOC container to HASHCODE form

Given the BDOC format, the container should be transformed to the HASCODE form in the following steps (before sending it to the DigiDocService):

1. 1)Remove **all signed** files from the container. As the BDOC container is a ZIP-file, this can be accomplished with standard ZIP-file tools. The signed files are in the root folder of the ZIP file.
2. 2)Add hashes of the removed files into the container. Two hash files need to be added, to the following locations in the BDOC (ZIP) file:
     * ``META-INF/hashcodes-sha256.xml``
     * ``META-INF/hashcodes-sha512.xml``

The first hash file contains the SHA-256 hashes of all of the signed files. Similarly, the second file contains SHA-512 hashes for the same files. Both files have the same format: for every signed file, a full path is listed (as it appears in the BDOC file), the hash of the file in Base64, and also the length of the file in bytes. (The XML-schema is below). Hash values are calculated directly on the file contents (i.e., not over XML elements, which is different from the HASHCODE form for DDOC).

As an example, if the container has 2 documents, named " [file1.txt](http://www.id.ee/bdoc_hashcode/file1.txt)" and " [File2.docx](http://www.id.ee/bdoc_hashcode/File2.docx)" (the sample files are downloadable from [http://www.id.ee/public/bdoc\_hashcode\_example.zip](http://www.id.ee/public/bdoc_hashcode_example.zip)), the corresponding hash files have the following contents:

**META-INF/hashcodes-sha256.xml:**

```xml
<?xml version="1.0" encoding="utf-8"?>
<hashcodes>
    <file-entry full-path="file1.txt" hash="fo+6a5j64VcKWJwvXsJE8PlB3tAdQ8/uwHAL5AEWmbk=" size="189" />
    <file-entry full-path="File2.docx" hash="3v5ZupBhiNxkCmmVKbtwwJKVCKxTZrQDPpNKF02ZiPo=" size="11665"/>
</hashcodes>
```

**META-INF/hashcodes-sha512.xml:**

```xml
<?xml version="1.0" encoding="utf-8"?>
<hashcodes>
    <file-entry full-path="file1.txt" hash="WIJZPgHWMrqfHqH7Arfjo8ymMZvI0IUgG8G8UESbnHXcpEPgOKutPph1GYOcSprj08VZa0m+myhlVPH29ThjIA==" size="189" />
    <file-entry full-path="File2.docx" hash="3z7gxofgCPoX2feWB9TQhUIvOlhsxm9RVR3iEFcCZ7uPcZuRc+KS9evmBC6bAMUnQOvkygXNTPfTIKb50krYYg==" size="11665" />
</hashcodes>
```

The hash files must conform to the following XML-schema:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xs:schema version="1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="hashcodes" type="hashcodesType"/>
  <xs:complexType name="fileEntryType">
    <xs:attribute name="full-path" type="xs:string" use="required"/>
    <xs:attribute name="hash" type="xs:string" use="required"/>
    <xs:attribute name="size" type="xs:long" use="required"/>
  </xs:complexType>
  <xs:complexType name="hashcodesType">
    <xs:sequence>
      <xs:element name="file-entry" type="fileEntryType" minOccurs="0" maxOccurs="unbounded"/>
    </xs:sequence>
  </xs:complexType>
</xs:schema>
```

> **Note!** Although the above ZIP operations can be done with any standard archive tools, some care must be taken to 
> prevent accidental alterations to the file structure. Specifically, the ASiC standard mandates the following about 
> the "mimetype" file:

* The ``mimetype`` file should (continue to) be the first file in the ZIP archive.
* The ``mimetype`` file should remain **not** compressed (it should be _stored_, not for example _deflated_).

After these steps, the HASHCODE form is ready. The contents of the BDOC file will then be analogous to the following diagram (note the addition of 2 hash files and absent data files):

```bash
├── META-INF
│   ├── **hashcodes-sha256.xml**
│   ├── **hashcodes-sha512.xml**
│   ├── manifest.xml
│   └── signatures0.xml
└── mimetype
```

The files in this example are downloadable (with BDOC containers) from the following address: [http://www.id.ee/public/bdoc\_hashcode\_example.zip](http://www.id.ee/public/bdoc_hashcode_example.zip)

#### Transforming the BDOC container back to standard form

When the HASHCODE container is returned back by DigiDocService, analogous steps need to be carried out:

1. 1)The data files need to be added back into the container (the container is in ZIP-format, as all BDOC files are in ZIP-format). Note the following:

  - The data files in the container need to have a ZIP-file comment about the BDOC-library. In practice, this comment may simply be copied from other files in the archive (for example, from the „mimetype"-file). Note that the signature files (META-INF/signatureN.xml) should keep their existing comments (this is to preserve information about the tools used for signing particular signatures). An example of such comment is the following:
LIB DigiDocService/3.6.4 format: BDOC/2.1 Java: 1.7.0\_51/Oracle Corporation OS: Windows 8/amd64/6.2 JVM: Java HotSpot(TM) 64-Bit Server VM/Oracle Corporation/24.51-b03

  - Some care must be taken to prevent accidental alterations to the file structure. Specifically, the ASiC standard mandates the following about the "mimetype" file:
    - The "mimetype" file should (continue to) be the _first_ file in the ZIP archive.
    - The "mimetype" file should remain _not_ compressed (it should be _stored_, not for example _deflated_).

1. 2)Remove all the hash files hashcodes-\*.xml from the folder META-INF.

After these steps, the BDOC container is again in its normal form, and is ready to be used by for example the DigiDoc3 client software. Its contents should look similar to this:

```bash
├── META-INF
│   ├── manifest.xml
│   └── signatures0.xml
├── **file1.txt**
├── **File2.docx**
└── mimetype
```

### DDOC format and HASHCODE

#### **Example** 1: sending hash code instead of full data file to the service for signing

For instance, we intend to digitally sign following 42-bytes long (containing 2 CRLF newlines) text file named test.txt:

```
This is a test file
secondline
thirdline
```

At first, we compose following xml-element, in **canonic**** 1**form, where value „VGhpcyBpcyBhIHRlc3QgZmlsZQ0Kc2Vjb25kbGluZQ0KdGhpcmRsaW5l" is previus datafile Base64 encoded and where there is added one newline before  </DataFile> ending tag:

```xml
<DataFile xmlns="http://www.sk.ee/DigiDoc/v1.3.0#" ContentType="EMBEDDED\_BASE64" Filename="test.txt" Id="D0" MimeType="text/plain" Size="42">VGhpcyBpcyBhIHRlc3QgZmlsZQ0Kc2Vjb25kbGluZQ0KdGhpcmRsaW5l
</DataFile>
```

Assuming, that xml canonization replaced CRLF (\r\n) newlines with LF (\n) and Base64-encoded datafile is in form of 64-symbols long lines and all values, including attribute values, are UTF8 encoded, we proceed by calculating sha1 hash over previus <DataFile>..</DataFile> element, including tags. We should get HEX value of  „b7c7914ab293811e0f0002932d85860a3b934890", which we convert to binary string (consequential bytes): 0xb7, 0xc7, 0x91, ..., 0x90. And at last we Base64-encode the binary string, which gives us following result:  „t8eRSrKTgR4PAAKTLYWGCjuTSJA=".

In PHP progamming language, it would look something like that:

```php
base64\_encode(pack("H\*", "b7c7914ab293811e0f0002932d85860a3b934890"));
```

Now, lets compose a data structure for StartSession method's Datafile parameter and call it $inputData:

```
Filename="test.txt"
MimeType="text/plain"
ContentType="HASHCODE"
Size=42
DigestType="sha1"
DigestValue="t8eRSrKTgR4PAAKTLYWGCjuTSJA="
```

Now lets send this datastructure to DigiDocService, using StartSession method:

```php
StartSession(„", „", TRUE, $inputData);
```

What follows are series of calls to DigiDocService to complete the digital signing process. Lets say we have done everything that's needed and DigiDoc container is signed and ready in the service waiting for us to download it. Now we call service's GetSignedDoc method to get the container.

In the downloaded container, we have to replace xml element <DataFile ... ContentType="HASHCODE" ... Id="D0" ... > ... </DataFile> with the one we previusly composed:

```xml
<DataFile xmlns="http://www.sk.ee/DigiDoc/v1.3.0#" ContentType="EMBEDDED\_BASE64" Filename="test.txt" Id="D0" MimeType="text/plain" Size="42">VGhpcyBpcyBhIHRlc3QgZmlsZQ0Kc2Vjb25kbGluZQ0KdGhpcmRsaW5l
</DataFile>
```

For now we should have correct DigiDoc container.

#### **Example 2**: sending Digidoc container to the service, replacing full datafile with hash code.

For instance, if we have the following DataFile element in DigiDoc container:

```xml
<DataFile xmlns="http://www.sk.ee/DigiDoc/v1.3.0#" ContentType="EMBEDDED\_BASE64" Filename="test.txt" Id="D0" MimeType="text/plain" Size="42">VGhpcyBpcyBhIHRlc3QgZmlsZQ0Kc2Vjb25kbGluZQ0KdGhpcmRsaW5l
</DataFile>
```

and we wish to send hash code to the service, not full data file, then we should replace the above xml element with the following:

<DataFile xmlns="http://www.sk.ee/DigiDoc/v1.3.0#" ContentType="HASHCODE" Filename="test.txt" Id="D0" MimeType="text/plain" Size="42" DigestType="sha1" DigestValue="t8eRSrKTgR4PAAKTLYWGCjuTSJA="></DataFile>

After completing operations (verifying document, or adding signatures etc) with DigiDoc container that we sent to the service, and downloading the container, we have to make the reverse replacement so that DataFile element contains full data file. Otherwise, it is not a proper DigiDoc format file.



## CloseSession

A transaction is closed by the CloseSession request. As the result of the request all the information stored in the server within this session will be deleted. To start a new session a StartSession request should be sent once again. It's always recommended to close a transaction with the CloseSession request. If the application doesn't close the session itself, it will be closed automatically after timeout.

**Query:**

| **Parameter** | **Type** | **R** | **Description** |
| --- | --- | --- | --- |
| Sesscode | Integer | + | An identifier of the active session. |

**Response:**

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Status | String | If the request is successful, the value will be „OK". |

If the request is unsuccessful, a SOAP-FAULT object will be returned.



## CreateSignedDoc

If an application desires to define the format and version of the formable conteiner, the CreateSignedDoc request will be used for 
creating a new conteiner. After the CreateSignedDoc request takes place the AddDataFile request for adding the data. 
Now the file is ready for digital signing.

#### Query

| **Parameter** | **Type** | **R** | **Description** |
| --- | --- | --- | --- |
| Sesscode | Integer | + | An identifier of the active session. |
| Format | String | + | a format of a document container to be created (currently supported formats are DIGIDOC-XML 1.3 and BDOC 2.1) |
| Version | String | + | a version number of the format of a creatable document container (currently the supported versions for DIGIDOC-XML is 1.3 and BDOC 2.1) |

> **NB!** Only container formats DIGIDOC-XML 1.3 and BDOC 2.0 are supported. If an inappropriate combination of given 
> format and version number is used in request parameters, a SOAP error object with error message "Invalid format and version combination!" will be returned.

The description of DigiDoc formats are available on the webpage [http://www.id.ee/index.php?id=36108](http://www.id.ee/index.php?id=36108) .

#### Response

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Status | String | If the request is successful, the value will be „OK". |
| SignedDocInfo | String | SignedDocInfo structure will be returned in the format demonstrated in chapter 9.1. |




## AddDataFile

AddDataFile request enables to add an additional data file to a DigiDoc container which is in session. If one datafile is added within the StartSession, but the 
user would like to sign a few more data files in a DigiDoc container, then using this method the rest of the data files will be added before signing.  
The size limit of 4 MB applies for DigiDoc containers and datafiles sent to Service. For bigger files content type HASHCODE could be used. See description below.

NB! Adding a data file is possible in the DigiDoc file with no signatures only.

#### Query

+-------------+---------+---+---------------------------------------------------------------------------------------------------------------------------+
| Parameter   | Type    | R | Description                                                                                                               |
+=============+=========+===+===========================================================================================================================+
| Sesscode    | Integer | + | An identifier of the active session.                                                                                      |
+-------------+---------+---+---------------------------------------------------------------------------------------------------------------------------+
| FileName    | String  | + | Name of the data file without the path.                                                                                   |
+-------------+---------+---+---------------------------------------------------------------------------------------------------------------------------+
| MimeType    | String  | + | Type of the datafile                                                                                                      |
+-------------+---------+---+---------------------------------------------------------------------------------------------------------------------------+
| ContentType | String  | + | Data file's content type (HASHCODE, EMBEDDED\_BASE64)                                                                     |                                                                     
|             |         |   |                                                                                                                           |                                  
|             |         |   | * **HASHCODE** – To service is sent the hashcode only, not the entire data file's content.                                |                                  
|             |         |   |   The method how to calculate the hashcode is described in parameter _DigestType_ and the hashcode itself is in           |  
|             |         |   |   parameter _DigestValue_. Please see section 8.1. how to calculate hash from the source data file and how to send        |
|             |         |   |   it to the service.                                                                                                      |
|             |         |   | * **EMBEDDED\_BASE64 –** The content of the file is in Base64 encoding in Content parameter.                              |
+-------------+---------+---+---------------------------------------------------------------------------------------------------------------------------+
| Size        | Integer | + | The actual size of data file in bytes.                                                                                    |
+-------------+---------+---+---------------------------------------------------------------------------------------------------------------------------+
| DigestType  | String  | - | Hash code type of the data file. In case of DIGIDOC-XML format, "sha1" is supported; in case of BDOC, "sha256"            |
|             |         |   | is supported. Required in case of HASHCODE content type of file only.                                                     |
+-------------+---------+---+---------------------------------------------------------------------------------------------------------------------------+
| DigestValue | String  | - | The value of data file's hash in Base64 encoding.. Required for HASHCODE content type only.                               | 
|             |         |   | In case of the DIGIDOC-XML format, the hash is calculated over a DigiDoc <Datafile> element, using a canonicalized        |
|             |         |   | form (for more information, see chapter 8.1).In case of BDOC, the has is calculated over the binary data file content.    |
+-------------+---------+---+---------------------------------------------------------------------------------------------------------------------------+
| Content     | String  | - | The content of data file in Base64 encoding, is set if ContentType is EMBEDDED\_BASE64.                                   |
+-------------+---------+---+---------------------------------------------------------------------------------------------------------------------------+

#### Response

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Status | String | If the request is successful, the value will be „OK". |
| SignedDocInfo | SignedDocInfo | SignedDocInfo structure will be returned in the format demonstrated in chapter 9.1. |





## MobileSign

The MobileSign method invokes mobile signing of a DigiDoc file in the current session. For using the MobileSign method, at least one datafile shall be in DigiDoc container.

In case creation of "pure" mobile signature is needed – i.e. without creating DigiDoc file and/or sending it to the service – MobileCreateSignature should be used instead.

#### Query

+-----------------------------------+-----------+---+------------------------------------------------------------------------------------------+
| Parameter                         | Type      | R | Description                                                                              |
+===================================+===========+===+==========================================================================================+ 
| Sesscode                          | Integer   | + | An identifier of the active session                                                      |
+-----------------------------------+-----------+---+------------------------------------------------------------------------------------------+
| SignerIDCode                      | String    | + | Identification number of the signer (personal national ID number).It is recommended      |
|                                   |           |   | to use both input parameters IDCode and PhoneNo! In case of Lithuanian Mobile-ID users   | 
|                                   |           |   | SignerIDCode and SignerPhoneNo are mandatory.                                            |
+-----------------------------------+-----------+---+------------------------------------------------------------------------------------------+
| SignersCountry                    | String    | - | Country which issued the personal national ID number in ISO 3166-style 2-character       | 
|                                   |           |   | format (e.g. "EE")                                                                       |
+-----------------------------------+-----------+---+------------------------------------------------------------------------------------------+
| SignerPhoneNo                     | String    | + | Phone number of the signer with the country code in format +xxxxxxxxx                    | 
|                                   |           |   | (for example +3706234566). If both SignerPhoneNo and SignerIDCode parameters are given,  | 
|                                   |           |   | correspondence between personal code and phone number is verified and in case of         | 
|                                   |           |   | inconsistency SOAP error code 301 is returned.It is recommended to use both input        | 
|                                   |           |   | parameters IDCode and PhoneNo! In case of Lithuanian Mobile-ID users SignerIDCode and    | 
|                                   |           |   | SignerPhoneNo are mandatory (see chapter 5.2) . If the element "SignerPhoneNo" has       |
|                                   |           |   | been set, the country attribute set in the prefix is used (independent on the value      | 
|                                   |           |   | of the element "SignersCountry").                                                        |
+-----------------------------------+-----------+---+------------------------------------------------------------------------------------------+
| ServiceName                       | String    | + | Name of the service – previously agreed with Application Provider and DigiDocService     | 
|                                   |           |   | operator. Required, maximum length – 20 chars.                                           |
+-----------------------------------+-----------+---+------------------------------------------------------------------------------------------+
| AdditionalDataToBeDisplayed       | String    | - | Additional text shown to the signer. Optional.Maximum length is 40 bytes. In             | 
|                                   |           |   | case of Latin letters, this means also a 40 character long text, but Cyrillic characters | 
|                                   |           |   | may be encoded by two bytes and you will not be able to send more than 20 symbols.       |
+-----------------------------------+-----------+---+------------------------------------------------------------------------------------------+
| Language                          | String    | + | Language of the message displayed to the signer's phone. ISO 639 a 3-character-code      | 
|                                   |           |   | in uppercase is used (for example ``EST``, ``ENG``, ``RUS``, ``LIT``).                   |
+-----------------------------------+-----------+---+------------------------------------------------------------------------------------------+
| Role                              | String    | - | The text of the role or resolution defined by the user. Optional.                        |
+-----------------------------------+-----------+---+------------------------------------------------------------------------------------------+
| City                              | String    | - | Name of the city, where it's signed. Optional.                                           |
+-----------------------------------+-----------+---+------------------------------------------------------------------------------------------+
| StateOrProvince                   | String    | - | Name of the state/province, where it's signed. Optional.                                 |
+-----------------------------------+-----------+---+------------------------------------------------------------------------------------------+
| PostalCode                        | String    | - | Postal code of the signing location. Optional.                                           |
+-----------------------------------+-----------+---+------------------------------------------------------------------------------------------+
| CountryName                       | String    | - | Name of the country, where it's signed. Optional.                                        |
+-----------------------------------+-----------+---+------------------------------------------------------------------------------------------+
| SigningProfile                    | String    | - | * ``LT_TM`` (Long Term with Time Mark): a profile for BDOC-TM (a BDOC signature          |
|                                   |           |   |   with time-mark) and DDOC. "LT\_TM" is currently the default option.                    |
|                                   |           |   | * ``LT`` (Long Term): Used for creating standard BDOC-TS                                 | 
|                                   |           |   |   (BDOC with time-stamp / ASiC-E) signatures. Currently it is a reserved value           |
|                                   |           |   |   that simply returns the error code 101 with the following message: "BDOC-TS signature  | 
|                                   |           |   |   format is not supported in the current service version. For signing BDOC files with    | 
|                                   |           |   |   Mobile-ID, please use BDOC-TM format". Support for the "LT" profile is planned for     | 
|                                   |           |   |   future releases of the service.                                                        |
+-----------------------------------+-----------+---+------------------------------------------------------------------------------------------+
| MessagingMode                     | String    | + | Determines the mode how the response of the MobileSign is returned.                      | 
|                                   |           |   | Following modes are supported:                                                           |
|                                   |           |   |                                                                                          | 
|                                   |           |   | * ``asynchClientServer`` – Some additional status request are made                       |
|                                   |           |   |   after ``MobileSign`` request by the Application Provider                               |
|                                   |           |   | * ``asynchServerServer`` –  After signing or in case of an error the server              | 
|                                   |           |   |   sends a request to the client-application . The client application should              |    
|                                   |           |   |   be capable to act in server mode to recieve the signature information request according| 
|                                   |           |   |   to the parameters in AsyncConfiguration parameter.                                     |
+-----------------------------------+-----------+---+------------------------------------------------------------------------------------------+
| AsyncConfiguration                | Integer   | - | Determines configuration used in ``asynchServerServer`` messaging mode.                  |
|                                   |           |   | This shall be agreed previously between Application Provider and DigiDocService provider.|
+-----------------------------------+-----------+---+------------------------------------------------------------------------------------------+
| ReturnDocInfo                     | Boolean   | + | If the value is true, the DigiDoc file information is returned as a                      | 
|                                   |           |   | result of the request.                                                                   |
+-----------------------------------+-----------+---+------------------------------------------------------------------------------------------+
| ReturnDocData                     | Boolean   | + | If the value is true, a DigiDoc document in HTMLescaped format ``SignedDocData``         |
|                                   |           |   | element is returned.                                                                     |
+-----------------------------------+-----------+---+------------------------------------------------------------------------------------------+

#### Response

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Status | String | "OK" or error message. |
| StatusCode | String | If the request is successful, 0 is returned, otherwise an error code. |
| ChallengeID | String | 4-digit control code calculated from hash of the value to be signed. The control code shall be displayed to the user in order to provide means to verify authenticity of the signing request. |

If  asynchClientServer messaging mode is used then an Application Provider shall start sending GetSignedDocInfo requests to complete the signing session.

> **NB!** It is reasonable to wait at least 10 seconds before starting sending status queries  - it is improbable that message from 
> user's phone arrives earlier because of technical and human limitations. Mobile-ID transactions will time out in 4 minutes or less.

In case ``asynchServerServer`` messaging mode is used, a message will be sent from DigiDocService according to previously agreed configuration. The message is sent in XML format as following:

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Sesscode | Integer | An identifier of the active session. |
| Status | String | Status code. „OK" if no errors, other possible responses are described in description of GetSignedDocInfo request (field „Status"). |
| Data | String | a) XML structure described in section 9.1 of the document if value of the ReturnDocInfo was set "true" on the request.b) DigiDoc file as HTML encoded if ReturnDocInfo was set "false" and ReturnDocData  was set "true" in the request.c) Empty if both ReturnDocInfo and ReturnDocData were set „false" in the request. |



## GetStatusInfo

GetStatusInfo request is for getting the information about the document in session (signed) and it's status. GetStatusInfo request is also used in mobile signing in asynchronous Client-Server mode to get the signing process'es state information.

#### Request 

| **Parameter** | **Type** | **R** | **Description** |
| --- | --- | --- | --- |
| Sesscode | Integer | + | An identifier of the active session. |
| ReturnDocInfo | Boolean | + | If the value is „true", in response SignedDocInfo is set. |
| WaitSignature | Boolean | + | If the value is „true", response is not sent before message from mobile phone is received or error condition is detected. If the value is "false", the response is returned immediately and the GetStatusInfo invocation should be repeated after a short time interval (2-10 seconds). |

#### Response

+-------------------+-------------------+-----------------------------------------------------------------------------------------------+
| Parameter         | Type              | Description                                                                                   |
+===================+===================+===============================================================================================+
| Status            | String            | Status of the mobile signing process:                                                         |
|                   |                   |                                                                                               |
|                   |                   | * ``REQUEST_OK`` – initial message was received;                                              |
|                   |                   | * ``EXPIRED_TRANSACTION`` – timeout – the user did not enter the signing                      |
|                   |                   |   PIN during given period of time;                                                            |
|                   |                   | * ``USER_CANCEL`` – the user refused or cancelled the signing process;                        |
|                   |                   | * ``SIGNATURE`` – signature was created;                                                      |
|                   |                   | * ``NOT_VALID`` – signature created but not valid;                                            |
|                   |                   | * ``OUTSTANDING_TRANSACTION`` – signing in process, please make new request;                  |
|                   |                   | * ``MID_NOT_READY`` – Mobile-ID functionality of the phone is not yet ready;                  |
|                   |                   | * ``PHONE_ABSENT`` – Delivery of the message was not successful, mobile phone is probably     |
|                   |                   |   switched off or out of coverage;                                                            |
|                   |                   | * ``SENDING_ERROR`` – other error when sending message (phone is incapable of receiving       |
|                   |                   |   the message, error in messaging server etc.);                                               |
|                   |                   | * ``SIM_ERROR`` – SIM application error;                                                      |
|                   |                   | * ``REVOKED CERTIFICATE`` – certificate status revoked;                                       |
|                   |                   | * ``INTERNAL_ERROR`` – technical error,                                                       |
+-------------------+-------------------+-----------------------------------------------------------------------------------------------+
| StatusCode        | String            | Status code of the last request. In case of successful request, "OK" or an error string.      |
+-------------------+-------------------+-----------------------------------------------------------------------------------------------+
| SignedDocInfo     | SignedDocInfo     | If "ReturnDocInfo" parameter in the GetSignedDocInfo request was set "true"                   | 
|                   |                   | then ``SignedDocInfo`` structure will be returned in the format dessribed in chapter 9.1.     |
+-------------------+-------------------+-----------------------------------------------------------------------------------------------+




## GetSignedDocInfo

The GetSignedDocInfo method shall be used to retrieve status information and the actual (signed) document from the current signing session.

#### Request

| **Parameter** | **Type** | **R** | **Description** |
| --- | --- | --- | --- |
| Sesscode | Integer | + | An identifier of the active session |

#### Response

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Status | String | ``OK`` or an error message |
| SignedDocInfo | SignedDocInfo | XML structure according to the specification in section 9.1 of the document |


## GetSignedDoc

A signed document is returned from the webservice within the GetSignedDoc request. The content of the document is in HTMLencoded format. If there's a will to receive the document information in structured format in addition to signed document, the GetSignedDocInfo request should be used.

#### Request

| **Parameter** | **Type** | **R** | **Description** |
| --- | --- | --- | --- |
| Sesscode | Integer | + | An identifier of the active session |

#### Response

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Status | String | ``OK`` or an error message |
| SignedDocData | String | The signed document in the session. In case of DDOC the document is in XML format, in case of BDOC it's BASE64 encoded. As the XML tags has been transformed to HTML encoded format, therefore a HTMLDecode transduction should be done before saving the file in file system or to database. BDOC should be BASE64 decoded. |




## GetDataFile

GetDataFile request is for inquiring an original file out of a digitally signed file.

For instance if a digitally signed file is uploaded to the service within a StartSession request, it will be possible to read out every single original file with GetDataFile request.

#### Request

| **Parameter** | **Type** | **R** | **Description** |
| --- | --- | --- | --- |
| Sesscode | Integer | + | An identifier of the active session |
| DataFileId | String | + | An identifier of a data file. In Dxx format, where xx stands for the sequence number. ``DataFileId`` is readable in ``SignedDocInfo`` structure. The structure is returned to the user of the service as a result of the ``StartSession`` or ``GetSignedDocInfo`` request. |

#### Response

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Status | String | If the request is successful, the value will be „OK". |
| DataFileData | DataFileInfo | the original file information in DataFileInfo structure.The structure of ``DataFileInfo`` is described in chapter 9.3. Data files are returned in the same format as they were sent to the service with StartSession or AddDataFile methods. It means that if the service was sent the content of the data file, the current method will return the block of datafile having the content of the data file in Base64 encoding in DfData field. In case that only hash was sent to the service, only the hash is returned by the method. |

If you try to inquire a non-existing data file, you'll receive a SOAP error-object with error-message "No such DataFile!".





## RemoveDataFile

_RemoveDataFile_ request is for removing datafile from DigiDoc container. NB! Removing datafile is allowed when container to not have any signature. If container has one or more signatures, removing datafile is not possible.

#### Request

| **Parameter** | **Type** | **R** | **Description** |
| --- | --- | --- | --- |
| Sesscode | Integer | + | An identifier of the active session. |
| DataFileId | String | + | An identifier of a data file. In Dxx format, where xx stands for the sequence number. ``DataFileId`` is readable in ``SignedDocInfo`` structure. The structure is returned to the user of the service as a result of the StartSession or ``GetSignedDocInfo`` request. |

#### Response

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Status | String | If the request is successful, the value will be ``OK``. |
| SignedDocInfo | SignedDocInfo | The document in the session info after removing the datafile. ``SignedDocInfo`` structure will be returned in the format demonstrated in chapter 9.1. |

If removing the datafile is unsuccessful, a SOAP error-object will be returned with an error-message. Ie when you try to remove datafile from signed document error "Cannot change a signed doc" is returned.




## RemoveSignature

RemoveSignature request enables to remove a signature from the digitally signed file in session. As a result of the request a SignedDocInfo without the removed signature is returned.

#### Request

| **Parameter** | **Type** | **R** | **Description** |
| --- | --- | --- | --- |
| Sesscode | Integer | + | An identifier of the active session. |
| SignatureId | String | + | A unique identifier of the signature. Identifications of signatures begin with „S" and the sequence number of the signature is followed (for example S0, S1 etc.). Identifications of the signatures of the session document are available in SignedDocInfo structure.This structure is returned to the service user for example as a result of the StartSession or GetSignedDocInfo request. |

#### Response

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Status | String | If the request is successful, the value will be ``OK``. |
| SignedDocInfo | SignedDocInfo | The document in the session info after removing the signature. ``SignedDocInfo`` structure will be returned in the format demonstrated in chapter 9.1. |

If  removing the signature is unsuccessful, a SOAP error-object will be returned with an error-message.

Potential error-messages:

* **Must supply Signature id!** – the identifier of the signatures is unassigned.
* **No such Signature!** – no signature was found for the signature's identifier as a parameter of the request



## GetSignersCertificate

A request for the certificate of the signer. The request allows the service user to read the signer's certificate from a DigiDoc file (to display to the user for example).

#### Request

| **Parameter** | **Type** | **R** | **Description** |
| --- | --- | --- | --- |
| Sesscode | Integer | + | An identifier of the active session. |
| SignatureId | String | + | A unique identifier of the signature. Identifications of signatures begin with „S" and the sequence number of the signature is followed (for example S0, S1 etc.). Identifications of the signatures of the session document are available in ``SignedDocInfo`` structure. The structure is returned to the service user for example as a result of the StartSession or ``GetSignedDocInfo`` request. |

#### Response

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Status | String | If the request is successful, the value will be ``OK``. |
| CertificateData | String | requested certificate as a string in BASE64 encoding (in PEM format) |

If returning the certificate is unsuccessful, a SOAP error-object will be returned with an error-message.

Potential error-messages:

* **Must supply Signature id!** – the identifier of the signatures is unassigned.
* **No such Signature!** – no signature was found for the signature's identifier as a parameter of the request




## GetNotarysCertificate

As a result of the request a validity confirmation signer's certificate of the signature is returned (OCSP server's certificate).

#### Request

| **Parameter** | **Type** | **R** | **Description** |
| --- | --- | --- | --- |
| Sesscode | Integer | + | An identifier of the active session. |
| SignatureId | String | + | A unique identifier of the signature. Identifications of signatures begin with „S" and the sequence number of the signature is followed (for example S0, S1 etc.). Identifications of the signatures of the session document are available in SignedDocInfo structure. The structure is returned to the service user for example as a result of the StartSession or GetSignedDocInfo request. |

#### Response

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Status | String | If the request is successful, the value will be ``OK``. |
| CertificateData | String | requested certificate as a string in BASE64 encoding (in PEM format) |

If returning the certificate is unsuccessful, a SOAP error-object will be returned with an error-message.

Potential error-messages:

- **Must supply Signature id!** – the identifier of the signatures is unassigned.
- **No such Signature!** – no signature was found for the signature's identifier as a parameter of the request
- **No notary for this Signature!** – no validity confirmation for the signature as the request of the parameter.




## GetNotary

The request returns the validity confirmation of the certain signature.

#### Request

| **Parameter** | **Type** | **R** | **Description** |
| --- | --- | --- | --- |
| Sesscode | Integer | + | An identifier of the active session. |
| SignatureId | String | + | A unique identifier of the signature. Identifications of signatures begin with „S" and the sequence number of the signature is followed (for example S0, S1 etc.). Identifications of the signatures of the session document are available in ``SignedDocInfo`` structure. The structure is returned to the service user for example as a result of the StartSession or ``GetSignedDocInfo`` request. |

#### Response

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Status | String | If the request is successful, the value will be ``OK``. |
| OcspData | String | OCSP validity confirmation in Base64 encoding. |

If returning the validity confirmation is unsuccessful,  a SOAP error-object will be returned with an error-message.

Potential error-messages:

* **Must supply Signature id!** – the identifier of the signatures is unassigned.
* **No such Signature!** – no signature was found for the signature's identifier as a parameter of the request
* **No notary for this Signature!** – no validity confirmation for the signature as the request of the parameter.




## GetVersion

The request enables to check the service and to get to know it's version number.

The request has no parameters.

#### Response

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Name | String | Name of the service (currently DigiDocService). |
| Version | String | The version of the service in the form of x.x.x (for example 1.0.3)  The highest grade stands for major changes in the service, the second grade describes the changes which may eventuate in changing the protocol of the service. The last grade means some little fixes, which doesn't change the protocol. |
| Libname | String | DigiDoc library name |
| Libver | String | DigiDoc library version |





## PrepareSignature

The request is used for digital signing preparation if signing with smartcard.

As a result of the request a new so called half-done signature is added to the DigiDoc conteiner in session and the unique identifier of the signature and the hash to be signed is returned. The hash should be forwarded to the signing module of the user's computer.

#### Request
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| Parameter             | Type              | R | Description                                                                                           |
+=======================+===================+===+=======================================================================================================+
| Sesscode              | Integer           | + | An identifier of the active session.                                                                  |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| SignersCertificate    | String            | + | signer's certificate transferred to HEX string format (from binary (DER) format). Mostly the          |
|                       |                   |   | signing software (signing component) in the user's computer delivers the certificate in a             | 
|                       |                   |   | proper format.                                                                                        |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| SignersTokenId        | String            | + | identifier of the private key's slot on a smartcard. The signing software defines it's value          |
|                       |                   |   | within reading the signer's certificate and forwards it to the signing application.                   |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| Role                  | String            | - | The text of the role or resolution defined by the user.                                               |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| City                  | String            | - | Name of the city, where it's signed                                                                   |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| State                 | String            | - | Name of the state, where it's signed.                                                                 |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| PostalCode            | String            | - | Postal code of the signing location.                                                                  |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| Country               | String            | - | Name of the country, where it's signed.                                                               |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| SigningProfile        | String            | - | * ``LT_TM`` (Long Term with Time Mark): a profile for BDOC-TM (a BDOC signature with time-mark)       | 
|                       |                   |   |   and DDOC. ``LT_TM`` is currently the default option.                                                |
|                       |                   |   | * ``LT`` (Long Term): Used for creating standard BDOC-TS (BDOC with time-stamp / ASiC-E)              |
|                       |                   |   |   signatures. Currently it is a reserved value that simply returns the error code 101 with the        |
|                       |                   |   |   following message: "BDOC-TS signature format is not supported in the current service version. For   |
|                       |                   |   |   signing BDOC files with Mobile-ID, please use BDOC-TM format". Support for the "LT" profile is      |
|                       |                   |   |   planned for future releases of the service.                                                         |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+

Usually the signing application asks the user about the location information of the signing and forwards it to DigiDocService. Inserting the information about role and signing location is voluntary.

#### Response

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Status | String | If the request is successful, the value will be „OK". |
| SignatureId | String | the unique identifier of the signature. Identifications of signatures begin with „S" and the sequence number of the signature is followed (for example S0, S1 etc.). The identifier could be used later to remove the signature or request for signature attributes (signer's certificate, OCSP certificate, OCSP validity confirmation). |
| SignedInfoDigest | String | The hash to be signedas a hexadecimal string. |

If returning the validity confirmation is unsuccessful,  a SOAP error-object will be returned with an error-message.

Potential error-messages:

- **Must supply Signature certificate!** – the value of the signer's certificate is empty.






## FinalizeSignature

The request is used for finalizing the digital signing while signing with smartcard.

With FinalizeSignature request the signature prepared at PrepareSignature step is finished. A digitally signed signature is added to DigiDoc file and an OCSP validity confirmation is taken.

#### Request

| **Parameter** | **Type** | **R** | **Description** |
| --- | --- | --- | --- |
| Sesscode | Integer | + | An identifier of the active session. |
| SignatureId | String | + | The unique identifier of the signature which was returned as the result of PrepareSignaturemethod |
| SignatureValue | String | + | Value of the signature (signed hash)as a HEX string. The signing software  returns the value. |

#### Response

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Status | String | If the request is successful, the value will be „OK". |
| SignedDocInfo | SignedDocInfo | The document in the session info after adding the signature. SignedDocInfo structure will be returned in the format demonstrated in chapter 9.1. |




## MobileCreateSignature

This request is used for creating additional signature to the DigiDoc file. The "<Signature>" block is returned as a result and the 
Application Provider shall take care of inserting this block into DigiDoc file.

The request is built for one-step creation of mobile signature. The method takes care of acquiring of signer's certificate, validity 
confirmation and RFC3161-type timestamps if needed in addition to getting mobile signature from the user.

There is no need to create independent session with StartSession method when using MobileCreateSignature method. If session-based procedure is 
needed, MobileSign method should be used instead.

> NB! Container formats DIGIDOC-XML 1.3 and BDOC 2.1 are supported. If an inappropriate combination of given format and version number is used 
> in request parameters, a SOAP error object with error message " **Invalid format and version combination!**" will be returned.

#### Request

+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| Parameter             | Type              | R | Description                                                                                           |
+=======================+===================+===+=======================================================================================================+
| IDCode                | String            | + | Personal Identification Code of the userIt is recommended to use both input parameters ``IDCode``     | 
|                       |                   |   | and PhoneNo! In case of Lithuanian Mobile-ID users IDCode and PhoneNo are mandatory.                  |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| SignersCountry        | String(2)         | - | Country of origin. ISO 3166-type 2-character country codes are used (e.g. ``EE``)                     |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| PhoneNo               | String            | + | User's phone number with country code in form +xxxxxxxxx (e.g. +3706234566). If both PhoneNo          |
|                       |                   |   | and IDCode parameters are given, correspondence between personal code and phone number is             |
|                       |                   |   | verified and in case of inconsistency SOAP error code 301 is returned. It is recommended to use       |
|                       |                   |   | both input parameters IDCode and PhoneNo! In case of Lithuanian Mobile-ID users IDCode and            |
|                       |                   |   | PhoneNo are mandatory (see chapter 5.2). If the element "PhoneNo" has been set, the country           |
|                       |                   |   | attribute set in the prefix is used (independent on the value of the element "SignersCountry").       |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| Language              | String(3)         | + | Language for user dialog in mobile phone. 3-character capitalized acronyms are used.                  | 
|                       |                   |   | Possible values: ``ENG``, ``EST``, ``RUS``. ``LIT``.                                                  |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| ServiceName           | String(20)        | + | Name of the service – previously agreed with Application Provider and DigiDocService operator.        |
|                       |                   |   | Maximum length – 20 chars.                                                                            |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| MessageToDisplay      | String(40 bytes)  | - | Text displayed in addition to ServiceName and before asking authentication PIN. Maximum               |
|                       |                   |   | length is 40 bytes. In case of Latin letters, this means also a 40 character long text, but           | 
|                       |                   |   | Cyrillic characters may be encoded by two bytes and you will not be able to send more than            |
|                       |                   |   | 20 symbols.                                                                                           |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| Role                  | String            | - | Role or resolution of the signature                                                                   |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| City                  | String            | - | City where the signature is created                                                                   |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| StateOrProvince       | String            | - | State or province where the signature is created                                                      |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| PostalCode            | String            | - | Postal code of the place where the signature is created                                               |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| CountryName           | String            | - | Country where the signature is created                                                                |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| SigningProfile        | String            | - | * ``LT_TM`` (Long Term with Time Mark): a profile for BDOC-TM (a BDOC signature with time-mark)       |
|                       |                   |   |   and DDOC. ``LT_TM`` is currently the default option.                                                |
|                       |                   |   | * ``LT`` (Long Term): Used for creating standard BDOC-TS signatures (BDOC with time-stamp / ASiC-E);  |
|                       |                   |   |   it is supported for the BDOC container format.                                                      |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| Datafiles             | List              | + | List of the files to be signed. Every element has following fields:                                   |
|                       |                   |   |                                                                                                       |
|                       |                   |   | +-------------+---+-------------------------------------------------------------------------------+   |
|                       |                   |   | | Parameter   | R | Description                                                                   |   |
|                       |                   |   | +=============+===+===============================================================================+   |
|                       |                   |   | | Id          | + | unique identifier for the file. In case of DIGIDOC-XML format, the            |   |
|                       |                   |   | |             |   | identifiers of the data files start with „D" followed by a sequential         |   |
|                       |                   |   | |             |   | number of the file.                                                           |   |
|                       |                   |   | |             |   | In case of BDOC format a unique file name is transferred.                     |   |
|                       |                   |   | +-------------+---+-------------------------------------------------------------------------------+   |
|                       |                   |   | | DigestType  | + | hash algorithm identifier. In case of DIGIDOC-XML format the supported        |   |
|                       |                   |   | |             |   | type is "sha1". In cased of BDOC format, the recommended type is "sha256".    |   |
|                       |                   |   | +-------------+---+-------------------------------------------------------------------------------+   |
|                       |                   |   | | DigestValue | + | hash value of the data file in BASE64 encoding. In case of DIGIDOC-XML        |   |
|                       |                   |   | |             |   | format, hash is calculated over DigiDoc <Datafile> element canonic form.      |   |
|                       |                   |   | |             |   | Please see section 8.1 how to calculate hash over data file and send it to    |   |
|                       |                   |   | |             |   | the service. For the BDOC form, hash is calculated over the binary datafile   |   |
|                       |                   |   | |             |   | contents and then is encoded in Base64.                                       |   |
|                       |                   |   | +-------------+---+-------------------------------------------------------------------------------+   |
|                       |                   |   | | MimeType    | - | Type of the data file. In case of BDOC, the default                           |   |
|                       |                   |   | |             |   | value is ``application/octet-stream``.                                        |   |
|                       |                   |   | |             |   | Note! In case of BDOC, it is very important that in the container the         |   |
|                       |                   |   | |             |   | manifest.xml file contains the same MimeType for this file.                   |   |
|                       |                   |   | +-------------+---+-------------------------------------------------------------------------------+   |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| Format                | String            | + | Format identifier for the signed file, shall equal to  "DIGIDOC-XML" and "BDOC".                      |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| Version               | String            | + | Format version of the undersigned file (In case of DIGIDOC-XML, the supported version is "1.3",       |
|                       |                   |   | in case of BDOC, it is "2.1").                                                                        |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| SignatureID           | String            | + | * Identifier of the signature. The Application Provider shall detect identifier of the                |
|                       |                   |   |   latest signature and increment this value by one. For example, if last signature has ID of          |
|                       |                   |   |   value "S2", the value of this parameter should be "S3".                                             |
|                       |                   |   | * In case the document has no signatures, the value should be "S0".                                   |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| MessagingMode         |                   | + | Mode to be used to response for MobileCreateSignature query. Options are:                             |
|                       |                   |   |                                                                                                       |
|                       |                   |   | * ``asynchClientServer`` – Appliaction Provider will make repeated status queries.                    |
|                       |                   |   | * ``asynchServerServer`` – the response will be sent to the Application Provider                      |
|                       |                   |   |   by DigiDocService. This requires Application Provider to provide interface for                      |
|                       |                   |   |   recieving these asynchronous responses.                                                             |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| AsyncConfiguration    | Integer           | - | This parameter is required when using "asynchServerServer" messaging mode and identifies              |
|                       |                   |   | configuration mode. This value has to be previously agreed. Currently,                                |
|                       |                   |   | _Java Message Services_ (JMS) interface is supported.                                                 |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+

#### Response

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Sesscode | Integer | Identificator of the active session |
| ChallengeID | String | 4-character control code calculated on basis of  the Challenge value to be signed. This code is displayed on mobile phone's screen and shall be also displayed by Application Provider in order to ensure the user on authencity of the query. |
| Status | String | „OK" when no errors. In case of an error, SOAB error object is returned according to the specification in section 9.4 of the current document. |

If asynchClientServer messaging mode is used then GetMobileCreateSignatureStatus query shall be sent after getting a positive response.

NB! It is reasonable to wait ~10 seconds before starting sending status queries  - it is improbable that message from user's phone arrives earlier because of technical and human limitations. Mobile-ID transactions will time out in 4 minutes or less.

In case asynchServerServer messaging mode, a message will be sent to the Application Provider in accordance of previously agreed configuration. This XML message has a following structure:

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Sesscode | Integer | Identifier of the current active session |
| Status  | String | Status code. "SIGNATURE" in case of successful signing. Other possible status codes are described in GetMobileSignatureStatus responses. |
| Data | String | The resulting <Signature> block in pure XML. |




## GetMobileCreateSignatureStatus

The method is used to query status information when using asynchClientServer mobile signing mode.

#### Request

| **Parameter** | **Type** | **R** | **Description** |
| --- | --- | --- | --- |
| Sesscode | Integer | + | Session identifier |
| WaitSignature | Boolean | + | If "True", the response is not returned to the request before the signature value has arrived from the phone or an error has occurred.  If "False", the response will be returned immediately and the Application provider has to repeat the request after some time (preferably in 2-10 seconds). |

#### Response:

+-----------------------+-------------------+-----------------------------------------------------------------------------------------------------------+
| Parameter             | Type              | Description                                                                                               |
+=======================+===================+===========================================================================================================+
| Sesscode              | Integer           | Session identifier                                                                                        |
+-----------------------+-------------------+-----------------------------------------------------------------------------------------------------------+
| Status                | String            | Process status:                                                                                           |
|                       |                   |                                                                                                           | 
|                       |                   | * ``REQUEST_OK`` – the original message was successfully received;                                        |
|                       |                   | * ``EXPIRED_TRANSACTION`` – service timed out before user managed to complete the signing;                |
|                       |                   | * ``USER_CANCEL`` – user cancelled the action;                                                            |
|                       |                   | * ``SIGNATURE`` – signature was successfully created;                                                     |
|                       |                   | * ``OUTSTANDING_TRANSACTION`` – authentication is still on the way, the status query shall be repeated;   |
|                       |                   | * ``MID_NOT_READY`` – the Mobile-ID of the SIM is not yet ready for the operations;                       |
|                       |                   | * ``PHONE_ABSENT`` – phone is switched off or out of coverage;                                            |
|                       |                   | * ``SENDING_ERROR`` – other error when sending message (phone is incapable of receiving the               |
|                       |                   |   message, error in messaging server etc.);                                                               |
|                       |                   | * ``SIM_ERROR`` – SIM application error;                                                                  |
|                       |                   | * ``NOT_VALID`` -  signature is not valid                                                                 |
|                       |                   | * ``REVOKED_CERTIFICATE`` – certificate revoked                                                           |
|                       |                   | * ``INTERNAL_ERROR`` – technical error.                                                                   |
+-----------------------+-------------------+-----------------------------------------------------------------------------------------------------------+
| Signature             | String            | Signature value in PKCS#1 container in BASE64 encoding. Can be either an RSA or ECDSA signature,          |
|                       |                   | depending on the signer's certificate returned with the signature block.                                  |
+-----------------------+-------------------+-----------------------------------------------------------------------------------------------------------+

Is the value in Status field is not OUTSTANDING\_TRANSACTION then active session is closed after this request.




## GetMobileCertificate

The method is used to request user's certificates.

> **NB!** The usage of this method is limited (IP-address based access).  It is necessary to request the separate access from SK with clear argument why it is needed.

#### Request

+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| Parameter             | Type              | R | Description                                                                                           |
+=======================+===================+===+=======================================================================================================+
| IDCode                | String            | + | Personal Identification Code of the user                                                              |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| Country               | String(2)         | - | Country of origin. ISO 3166-type 2-character country codes are used (e.g. EE)                         |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| PhoneNo               | String            | + | User's phone number with country code in form +xxxxxxxxx (e.g. +3706234566). If both PhoneNo          |
|                       |                   |   | and IDCode parameters are given, correspondence between personal code and phone number is             |
|                       |                   |   | verified and in case of inconsistency SOAP error code 301 is returned. If the element "PhoneNo"       |
|                       |                   |   | has been set, the country attribute set in the prefix is used (independent on the value of the        |
|                       |                   |   | element "Country").                                                                                   |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+
| ReturnCertData        | String            | + | Determines whether and which certificate(s) to return in the response (status info is                 |
|                       |                   |   | returned in any case):                                                                                |
|                       |                   |   |                                                                                                       |
|                       |                   |   | * ``auth`` – request for default authentication certificate;                                          |
|                       |                   |   | * ``authRSA`` – request for authentication RSA certificate, if available;                             |
|                       |                   |   | * ``authECC`` – request for authentication ECC certificate, if available;                             |
|                       |                   |   | * ``sign`` – request for default certificate for digital signing;                                     |
|                       |                   |   | * ``signRSA`` – request for RSA certificate for digital signing, if available; signECC – request      |
|                       |                   |   |   for ECC certificate for digital signing, if available;                                              |
|                       |                   |   | * ``both`` – request for both (authentication and digital signing) default certificates;              | 
|                       |                   |   | * ``bothRSA`` – both RSA certificates; "bothECC" – both ECC certificates;                             |
|                       |                   |   | * ``"none`` – none.                                                                                   |
+-----------------------+-------------------+---+-------------------------------------------------------------------------------------------------------+

#### Response

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| AuthCertStatus | String | OK – the authentication certificate has not expired. Note that the certificate may still be inactive for other reasons (it may be revoked by its owner).REVOKED – certificate has expired. The application provider may additionally ask for definitive certificate status by using an OCSP service (for example using the "CheckCertificate" operation). |
| SignCertStatus | String | OK – the signing certificate has not expired. Note that the certificate may still be inactive for other reasons (it may be revoked by its owner).REVOKED – certificate has expired. The application provider may additionally ask for definitive certificate status by using an OCSP service (for example using the "CheckCertificate" operation). |
| AuthCertData | String | Authentication certificate in PEM form |
| SignCertData | String | Digital signing certificate in PEM form |

If the user does not possess Mobile-ID SIM, SOAP fault is returned in accordance with p 9.4.





## MobileSignHash

This operation starts the process of signing a hash using Mobile-ID. It is meant for signing document formats other than DDOC and BDOC (for example: PDF, ADOC, etc.) For BDOC and DDOC formats, it is recommended to use the MobileCreateSignature and MobileSign operations.

If it is necessary to fetch signer's certificate before signing (for example, to incorporate the certificate in the document prior to signing), the GetMobileCertificate operation can be used.

This operation locates the signer's certificate, fetches an OCSP response and sends the signing request to the signer's mobile device. An active session is not required.

The status of the hash signing process is checked in ClientServer mode with the GetMobileSignHashStatusV2 operation. Note! Before sending the first status request, it is recommended to wait at least 10 seconds, as the signing process cannot finish faster due to human and technology factors. Mobile-ID transactions will time out in 4 minutes or less.

This operation is using the document/literal style and is accessible from a new sub-address /v2/?wsdl.  New version of the service uses a separate WSDL, and error message format has been updated (see chapter 9.4).

> **NOTE**: The usage of this method is limited (IP-address based access).  It is necessary to request the separate access permissions for using it.

#### Request

| **Parameter** | **Type** | **R** | **Description** |
| --- | --- | --- | --- |
| IDCode | String | + | Personal Identification Code of the user |
| PhoneNo | String | +  | Phone number of the certificate number complete with the country code in the form +xxxxxxxxx (e.g. +3706234566).A match between the phone number and the ID-code will be checked and in case on non-compliance a SOAP error code 301 will be returned, |
| Language | String(3) | + | Language of the messages displayed on user's phone. ISO 3166 3-letter codes are being used. Possible values are: EST, ENG, LIT and RUS. |
| MessageToDisplay | String(40) | - | Text displayed in addition to ServiceName and before asking authentication PIN. Maximum length is 40 bytes. In case of Latin letters, this means also a 40 character long text, but Cyrillic characters may be encoded by two bytes and you will not be able to send more than 20 symbols. |
| ServiceName | String(20) | + | Name of the service – previously agreed with Application Provider and DigiDocService operator. Maximum length – 20 chars. |
| Hash | String(128) | + | A hash to be signed. Transferred as a HEX string. |
| HashType | Enumeration | + | A hash type to be signed. SHA1, SHA256 and SHA512 hashes are currently supported. |
| KeyID | String | - | Key type used for signing. RSA and ECC keys are currently supported. |

#### Response

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| Sesscode | String | Identifier of the session. |
| ChallengeID | String | - 4 (number) character control code, which is calculated on a basis of Challenge value that will be sent to the user's phone for signing.- 40 characters long HEX i.e. hash Challenge to be signed. Will be used only in case of Bite MSSP operator.This control code shall be displayed to the user by the application; with this it will be possible for the user to prove the authenticity of the request.NOTE: Application must prompt the user to check the compatibility of the control code displayed in the application and on the phone screen. |
| Status | String | "OK" if the procedure was performed successfully. If method call-up will result with an error, a SOAP error object will be returned. |

If method call-up will result with an error, a SOAP error object will be returned according to the description in chapter 9.4.



## GetMobileSignHashStatusRequest

The method is used to query status information when using asynchClientServer mobile signing mode.

This operation returns the status of the hash signing operation and, in the case of successful signing, the signature, signer's certificate and revocation data about the certificate.

#### Request

| **Parameter** | **Type** | **R** | **Description** |
| --- | --- | --- | --- |
| Sesscode | String(20) | + | Identifier of the session. |
| WaitSignature | Boolean | -  | If "True", the response is not returned to the request before the signature value has arrived from the phone or an error has occurred.  If "False", the response will be returned immediately and the Application provider has to repeat the request after some time (preferably in 2-10 seconds). |

#### Response

+-----------------------+---------------+--------------------------------------------------------------------------------------------+
| Parameter             | Type          | Description                                                                                |
+=======================+===============+============================================================================================+
| Sesscode              | String        | Identifier of the session.                                                                 |
+-----------------------+---------------+--------------------------------------------------------------------------------------------+
| Status                | String        | Process status:                                                                            |
|                       |               |                                                                                            |
|                       |               | * ``OUTSTANDING_TRANSACTION`` – authentication is still on the way, the status             |
|                       |               | * ``SIGNATURE`` – signature was successfully created;                                      |
|                       |               | * ``NOT_VALID`` – the action is completed but the signature created is not valid;          |
|                       |               | * ``EXPIRED_TRANSACTION`` – service timed out before user managed to complete the signing; |
|                       |               | * ``USER_CANCEL`` – user cancelled the action;                                             |
|                       |               | * query shall be repeated;                                                                 |
|                       |               | * ``MID_NOT_READY`` – the Mobile-ID of the SIM is not yet ready for the operations;        |
|                       |               | * ``PHONE_ABSENT`` – phone is switched off or out of coverage;                             |
|                       |               | * ``SENDING_ERROR`` – other error when sending message (phone is incapable of              |
|                       |               |   receiving the message, error in messaging server etc.);                                  |
|                       |               | * ``SIM_ERROR`` – SIM application error;                                                   |
|                       |               | * ``INTERNAL_ERROR`` – technical error                                                     |
|                       |               | * ``REVOKED_CERTIFICATE`` – certificate revoked or suspended                               |
|                       |               | * ``OCSP UNAUTHORIZED`` - the client who is using the service does not have                |
|                       |               |   access to validity confirmation service of OCSP used by DigiDocService.                  |
+-----------------------+---------------+--------------------------------------------------------------------------------------------+
| Signature             | String        | Signed hash in a PKC1 / PKCS13 container. (Will be returned                                |
|                       |               | only if Status == "SIGNATURE"). Can be either a RSA or an ECDSA signature, depending       |
|                       |               | on the returned certificate in the "CertificateData" field.                                |
+-----------------------+---------------+--------------------------------------------------------------------------------------------+
| RevocationData        | String        | Validity information of the certificate (PEM format)                                       |
+-----------------------+---------------+--------------------------------------------------------------------------------------------+
| CertificateData       | String        | Certificate in PEM format, encoded in Base64.                                              |
+-----------------------+---------------+--------------------------------------------------------------------------------------------+

If method call-up will result with an error, a SOAP error object will be returned according to the description in chapter 9.4.


