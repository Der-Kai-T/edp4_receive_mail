
const {email, password, host, port} = require("./credentials_test.json");
const fs = require("fs");
const { PdfReader } = require("pdfreader");
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
 
let pdf_content = [];
mailListener.on("attachment", function(attachment, path, seqno){
  // do something with attachment
  let txt = attachment.content.toString();
  let pdf = attachment.content;

  if(txt.startsWith("-")){
    //ignore PGP signature
  }else{
   
    new PdfReader().parseBuffer(pdf, (err, item) => {
        if (err) console.error("error:", err);
        else if (!item){
            console.warn("end of file");
            //console.log(content);
            process_content(pdf_content);
          }
        else if (item.text) pdf_content.push(item.text);
      });

      function process_content(content){
        let einsatzdaten = {};
            
        for(let i = 0; i<content.length; i++){
            let line = content[i];
            if (line == "Stichwort"){
                einsatzdaten.stichwort = content[i+1];
            }
    
            if (line == "Objekt"){
                einsatzdaten.objekt = content[i+1];
            }
    
            if (line == "Ort"){
                
                einsatzdaten.ort = content[i+1].split("[")[0].slice(0,-1);
                einsatzdaten.plz = content[i+1].split("[")[1].slice(0,-1);
                
            }
            if (line == "Ortsteil"){
                einsatzdaten.ortsteil = content[i+1];
            }
    
            if (line == "Straße"){
                einsatzdaten.strasse = content[i+1];
            }
            if (line == "Info"){
                einsatzdaten.info = content[i+1];
            }
        }
    
            
            let outstring = "";
            for(let property in einsatzdaten){
            outstring += property + " " + einsatzdaten[property] + "\n";
            }
            let ts = +new Date();
            fs.writeFile(outpath + ts + ".txt", outstring, err => {
            if(err){
                console.error(err);
            }
            })
            

            console.log(einsatzdaten);
        }
  }
});
 
mailListener.on("mail", function(mail, seqno) {
  // do something with the whole email as a single object
})
 
// it's possible to access imap object from node-imap library for performing additional actions. E.x.
//mailListener.imap.move(:msguids, :mailboxes, function(){})

