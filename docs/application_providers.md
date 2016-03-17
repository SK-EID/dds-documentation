# Suggestions and requirements for Application providers

## Digital signing

Application provider shall guarantee the following:

- According to the Digital Signature Act passed in the Estonian parliament, a digital signature solution must make it possible to:
1) unambiguously identify the person who owns the signing certificate;

2) identify the time of signing;

3) connect the digital signature with the signed data in a way that makes it impossible to undetectably change the signed data or its meaning after signing.

- The user is informed about the legal consequences of the digital signature before entering PIN2 (i.e., the PIN used for digital signatures).
- Measures are implemented to guarantee a single interpretation of signed data.
- The user shall have the possibility to be sure in the authenticity of the signed data and the attributes added to the signature (place of signing, role/resolution) should they be used.
- The data presented to the user before signing is in compliance with the actual data to be signed.
- The user shall have access to the digitally signed file which is created after the digital signing. Note that this applies to any operation that uses PIN2.  For example, when signing online payments on a web site, the signer must be allowed to access the signed container after signing. This allows the signer to verify contents of the signed data.

## Starting Mobile-ID operations

Mobile-ID operations (mobile authentication and mobile signing) can be started using DigiDocService methods:

* MobileAuthenticate,
* MobileSign and
* MobileCreateSignature 

All those methods accept Mobile-ID user's Personal Identification Code and phone number as input parameter.

If you would like to provide Mobile-ID operations for Lithuanian Mobile-ID users in your application then both input parameters are mandatory: user's Personal Identification Code and phone number. Otherwise the request fails.

**NB! It is highly recommended to use both input parameters - Mobile-ID user's Personal Identification Code and phone number also for Estonian Mobile-ID users. The requirement is planned to be turned obligatory in the future.**

Using only phone number is not recommended when security is a concern, because phone numbers are public and Mobile-ID users may get spammed.

**Using both Personal Identification Code and phone number:**

* When user makes a mistake when entering either his/her Personal Identification Code or phone number, it's very unlikely that Mobile-ID request will appear in another unintended Mobile-ID user's phone.
* Spamming is complicated because Personal Identification Codes are not public
* The user does not necessarily have to enter such data directly: for example, a user name could be tied to a particular combination of personal identification code and a phone number.

It's mandatory for application providers to prevent spamming (by IP-restrictions or by using input parameters mentioned above), otherwise AS Sertifitseerimiskeskus must limit access to DigiDocService, to guarantee that DigiDocService stays up and running for other application providers that use it.

Application, that enables users to authenticate or digitally sign documents using Mobile-ID, must clearly present challenge number (ChallengeID parameter in MobileAuthenticate response, see below) to user and warn user to check if challenge number presented by application is the same as challenge number on mobile phone screen. If challenge numbers differ, Mobile-ID operation has to be cancelled.

Challenge number should be correctly implemented and highly visible also when Mobile-ID operations are used from Mobile device browser.

## Technical suggestions and requirements

- Web applications, that enable authentication or digital signing using Mobile-ID or ID-card, should use encrypted channel (HTTPS) between browser and web server.
- Mobile-ID-enabled web applications, when polling regularly DigiDocService with requests about operation state information (whether user has already entered his/her PIN number and signing/authenticating is completed or not), should, for usability reasons, not reload web page every time request is made to DigiDocService – using Ajax is recommended.
- The file size is limited to 4 MB. Section 8.1 describes how to send larger-scale files to the Service.


