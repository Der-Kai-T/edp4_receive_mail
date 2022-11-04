const { PdfReader } = require("pdfreader");

let content = [];

let einsatzdaten = {};

new PdfReader().parseFileItems("C:/einsatzdaten/pdf/test.pdf", (err, item) => {
  if (err) console.error("error:", err);
  else if (!item){
    console.warn("end of file");
    //console.log(content);
    process_content(content);
  }
  else if (item.text) content.push(item.text)  ;
});

function process_content(content){

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


    console.log(einsatzdaten);
}

