var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var PDFDocument = require('pdfkit');
var mg = require('nodemailer-mailgun-transport');
var fs = require('fs');

app.use(bodyParser.json());

app.post('/', function(req, res) {
  // var JSON = req.body;
  generatePDF(req.body.line_items);
  if (req.body.line_items) {
    sendMail();
    res.send('OK');
  }

});

app.listen(3030, function() {
  console.log('example app listening on port 3030');
});




function generatePDF(lineItems) {
  var doc = new PDFDocument();
  var writeStream = fs.createWriteStream('mailer/output.pdf');
  doc.pipe(writeStream);
  for (item in lineItems) {
    for (key in item) {
      doc.text(key);
      doc.text(item[key]);
    }
  }

  console.log("doc: " + doc);
  doc.end();
}

function sendMail() {
  var auth = {
    auth: {
      api_key: 'key-e854bf8b186b09bcebd14071f3fe27e5',
      domain: 'mg.the-mealplan.com'
    }
  }


  var transporter = nodemailer.createTransport(mg(auth));
  var mailOptions = {
    from: 'brent@the-mealplan.com',
    to: 'brentlbailey@gmail.com',
    subject: 'test',
    // text: ,
    html: '<b>this is a test</b>',
    attachments: [{
       // filename: 'output.pdf',
        path: 'mailer/output.pdf'
        // contentType: "application/pdf"
      }]
  }

    transporter.sendMail(mailOptions, function(error, info){
      console.log('mail sent');
      if (error) {
        console.log(mailOptions['from']);
        return console.error(error)
      }
      console.log('success!', info);
    })
  }
