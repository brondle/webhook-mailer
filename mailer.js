var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var PDFDocument = require('pdfkit');
var mg = require('nodemailer-mailgun-transport');
var fs = require('fs');
var idStorage = [];
app.use(bodyParser.json());

app.post('/', function(req, res) {
 var JSON = req.body;
 console.log(idStorage);
 if (req.body.line_items) {
  res.sendStatus(200);
  generatePDF(JSON);
 }

});

var port = process.env.PORT || 3030;
app.listen(port, function() {
 console.log('example app listening on port 3030');
});




function generatePDF(JSON) {
  if (idStorage.indexOf(JSON.order_number)>-1) {
    console.log("That's already queued.")
  } else {
    //create doc and doc variables
   var doc = new PDFDocument();
   var writeStream = fs.createWriteStream('output.pdf');
   doc.pipe(writeStream);
   var lineItems = JSON.line_items;
   var address = JSON.shipping_address;
   for (var x=0; x<lineItems.length; x++) {
    item=lineItems[x];
    if (item.quantity === 1) {
       //include delivery address, item quantity, title, price and order notes
      addAddress(doc, address);
      doc.text(item.quantity + " " + item.title + " " + item.price);
      doc.moveDown(1);
      addProperties(doc, item, JSON);
      doc.addPage();

   } else {
      //make sure each instance of an item gets its own page even if more than one of it was ordered
      for (var i=0; i < item.quantity; i ++) {
        addAddress(doc, address);
        doc.text("1     " + item.title + "       " + item.price);
        addProperties(doc, item, JSON);
        doc.addPage();
      }
   }

   doc.save();
   writeStream.on('finish', function() {
       sendMail(JSON);
    });
  }
   doc.end();
}
}


function sendMail(JSON) {
    if (idStorage.indexOf(JSON.order_number)>-1) {
      return 
    } else {
      idStorage.push(JSON.order_number);
       var auth = {
         auth: {
           api_key: 'key-e854bf8b186b09bcebd14071f3fe27e5',
           domain: 'mg.the-mealplan.com'
         }
       }

       var transporter = nodemailer.createTransport(mg(auth));
         var mailOptions = {
           from: 'brent@the-mealplan.com',
           to: 'brentlbailey@gmail.com, order@the-mealplan.com, pasang.thinay@the-mealplan.com',
           subject: JSON.order_number,
           // text: ,
           html: '<b>Order #' + + JSON.order_number +'</b>',
           attachments: [
             { 
              filename: 'output.pdf',
              path: './output.pdf'    
             }
           ],
         }

         transporter.sendMail(mailOptions, function(error, info){
           console.log('mail sent');
           if (error) {
             return console.error(error)
           }
           console.log('success!', info);
         })
       }
 }

 function addAddress(doc, address) {
    doc.text(address.first_name + " " + address.last_name);
    doc.moveDown();
    doc.text(address.phone);
    doc.moveDown();
   if (address.address2) { 
    doc.text(address.address1 + ", " + address.address2);
  } else {
    doc.text(address.address1);
  }
    doc.moveDown();
    doc.text(address.city + ", " + address.province + ", " + address.zip);
    doc.moveDown();
 } 

 function addProperties(doc, item, JSON) {
      for (p in item.properties) {
      doc.text(item.properties[p].value);
      doc.moveDown(1);
    }
    if (JSON.note) {
      doc.text("Notes: " + JSON.note);
    }
 }
