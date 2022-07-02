
const {email, password, host, port} = require("./credentials.json");
const fs = require("fs");

const stichworte = require("./stichworte.json");
var { MailListener } = require("mail-listener5");   
/*NOTE: A FUTURE VERSION (release date TBA) will not require ES6 destructuring or referring to the class after the require statement
(i.e. require('mail-listener5').MailListener). At this stage, this is necessary because index.js exports the
MailListener class as a property of module.exports.
*/

const outpath = "C:/einsatzdaten/";

//Source:
//https://www.npmjs.com/package/mail-listener5



var mailListener = new MailListener({
  username: email,
  password: password,
  host: host,
  port: 993, // imap port
  tls: true,
  connTimeout: 10000, // Default by node-imap
  authTimeout: 5000, // Default by node-imap,
  debug: null, // Or your custom function with only one incoming argument. Default: null
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor
  searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time
  fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
  attachments: true, // download attachments as they are encountered to the project directory
  attachmentOptions: { directory: "C:/mail/" } // specify a download directory for attachments
});
 
mailListener.start(); // start listening
 
// stop listening
//mailListener.stop();
 
mailListener.on("server:connected", function(){
  console.log("imapConnected");
});
 
mailListener.on("mailbox", function(mailbox){
  console.log("Total number of mails: ", mailbox.messages.total); // this field in mailbox gives the total number of emails
});
 
mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});
 
mailListener.on("error", function(err){
  console.log(err);
});
 
mailListener.on("headers", function(headers, seqno){
  // do something with mail headers
});
 
mailListener.on("body", function(body, seqno){
  // do something with mail body
})
 
mailListener.on("attachment", function(attachment, path, seqno){
  // do something with attachment
  let txt = attachment.content.toString();

  if(txt.startsWith("-")){
    //ignore PGP signature
  }else{
    console.info("Attachment found");
    console.log(txt);
    let txt_array = txt.split(" ");
    


    let einsatz = {};
    einsatz.alarmzeit       = txt_array[0];
    einsatz.stichwort       = txt_array[1];
    einsatz.einsatznummer   = txt_array[2];

    txt_array.splice(0,3);
    var rest                 = txt_array.join(" ");
    
    let rest_array          = rest.split(" - ");
    einsatz.strasse         = rest_array[0];
    einsatz.ort             = "HAMBURG";
    
    rest_array.splice(0,1);
    einsatz.meldebild       = rest_array.join(" ");
    einsatz.meldebild       = "HELS " + einsatz.einsatznummer + einsatz.meldebild;

    

    //check wether stichwort is recognised
    if(stichworte.some(stichwort => {
      return stichwort.STICHWORT == einsatz.stichwort;
    })){
      einsatz.einsatzart      = "N";
    }else{
      einsatz.stichwort = "NIL";
      einsatz.einsatzart = "S";
      einsatz.meldebild = einsatz.stichwort + " " + einsatz.meldebild;
    }
    
    let outstring = "";
    for(let property in einsatz){
      outstring += property + " " + einsatz[property] + "\n";
    }
    let ts = +new Date();
    fs.writeFile(outpath + ts + ".txt", outstring, err => {
      if(err){
        console.error(err);
      }
    })
    

    console.log(einsatz);
  }
});
 
mailListener.on("mail", function(mail, seqno) {
  // do something with the whole email as a single object
})
 
// it's possible to access imap object from node-imap library for performing additional actions. E.x.
//mailListener.imap.move(:msguids, :mailboxes, function(){})

