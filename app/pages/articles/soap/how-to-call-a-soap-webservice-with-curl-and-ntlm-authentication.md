Here's an example for a soap call with curl and ntlm authentication:

```
curl --ntlm --user "domain\user:pw"  --location --request POST 'YOUR_ENDPOINT' \
--header 'SOAPAction: YOUR_SOAP_ACTION' \
--header 'Content-Type: text/xml; charset=utf-8' \
--data-raw 'YOUR_BODY'
```

Some notes:
- `YOUR_ENDPOINT` could look like this: https://some.domain.com/HelplineServer/UserWebServices/IncidentMgmtWFWS.svc
- `YOUR_SOAP_ACTION` could look like this: http://tempuri.org/IncidentMgmtWFWS/StartIncidentByWS
- `YOUR_BODY` could look like this:

```
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
                   xmlns:hel="http://schemas.datacontract.org/2004/07/Helpline.Activities.IncidentRecordScope"
                   xmlns:tem="http://tempuri.org/">
    <SOAP-ENV:Header/>
    <SOAP-ENV:Body>
        <tem:StartIncidentByWS>
            <tem:ctx/>
            <tem:data>
                <hel:strSubject>TEST</hel:strSubject>
            </tem:data>
        </tem:StartIncidentByWS>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```

Some notes:
- If you get the error `curl: (92) HTTP/2 stream 0 was not closed cleanly: HTTP_1_1_REQUIRED (err 13)`, add the `--http1.1` flag. Reason: Not all servers are configured properly to work with http 2.
- Add the `--verbose` flag to get a more detailed output of what's happening.
- You'll need to enter domain + username + pw exactly like this: `domain``\``user``:``pw`, so backslash between domain and user and colon between user and pw.
