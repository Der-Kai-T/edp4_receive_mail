# edp4_receive_mail
 
A node.js tool to receive E-Mails with attachments and prepare them for use with EDP4 (https://www.einsatzleitsoftware.de/) "Einsatzserver" which can fetch mails themself but needs the information to be placed inside the mail-content not as an attachment. As the Feuerwehr Hamburg can only transmit them in an attached file this script was created.

## Used Libarary
This script is using https://www.npmjs.com/package/mail-listener5 and it's example code. Except: Debug Output to console deactivated and automatic attachment-store set to separate Folder (Debug purposes only), can and should be deactivated uppon release.

## Installation
You need node.js to run this script. Visit https://nodejs.org/en to find out how to do this on your platform. This script doesn't need to run on the same machine as the EDP4-Server but it needs write-access to a folder on the server which is monitored by the EDP4-Einsatzserver.

``git clone`` the repository and run ``npm install`` to install all node modules

Install the EDP4-Einsatzserver and update it's configuration:

inside ``einsatzserver.ini`` activate the ``[Checkdir]`` Directive and change the path if neccessary, e.g.:
```
;Überprüfung eines Verzeichnisses auf neue Dateien
[Checkdir]
Aktiv=1
Dir=C:\EDP\einsatzdaten
```

You need to change the ``mail-listener.js`` (starting Line 79) according to the files you're getting transmitted. Afterwards you need to change the ``tags.txt`` from the Einsatzserver to match your Output. If you haven't changed somethin in the mail-listener, you can use this
```
einsatznummer :=INTERNE_NUMMER
stichwort :=STICHWORT
meldebild :=MELDUNG
strasse :=STRASSE
nummer :=HAUSNUMMER
```

You also have to change out the file ``stichworte.json`` with what is stored in your EDP4 instance. The most easyly way is to go to the EDP4 Editor (Datenversorgung), and export them there. Then use https://csvjson.com/csv2json to make them into a json-array.

Before starting the mail-listener, you need to create an ``credentials.json`` inside the same directory as the main script which contains the login-credentials for your mail-server.
```
{
    "email": "your login",
    "password": "your password",
    "host": "imap-host",
    "port": "imap-port"
}
```

Now you can run the script with ``node mail-listener.js``. It will automatically download all mails currently in the mailbox and prepare them for EDP4.

The mails are kept on the mailbox but marked read. The script will only process unread mails.

The script was used during the event Schlagermove 2022 and worked without major problems. The parsing had to be adopted as the content of the files was slightly different to the one that was used for testing.

## PDF-Files ##
PDF-Files can be processed, too. To do so, use the script ``mail-listener_pdf_ff_juechen.js`` and adapt it to your needs. Or create an issue and submit an example pdf to get support from me if I've got spare time. PDF-Processing uses the pdf-reader library (https://www.npmjs.com/package/pdfreader).

## Known Bugs and Improvements to be made
Currently there aren't any known bugs. If you find some, please submit an issue.


## Disclaimer ##
This application comes as is with no warranty. You are free to do whatever you like with the code, or whatever is allowed by the used librarys. If you want to participate in the development, feel free to do so. 