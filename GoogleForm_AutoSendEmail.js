const generalPdfFiles = [
    'pdf ID'//general information
    // Add more as needed
];

const pdfFiles = {
    male: {
        highBMI: 'pdf ID',
        normalBMI: 'pdf ID',
        lowBMI: 'pdf ID'
    },
    female: {
        highBMI: 'pdf ID',
        normalBMI: 'pdf ID',
        lowBMI: 'pdf ID'
    }
};

function calculateBMI(height, weight) {
    // Convert height from cm to meters and calculate BMI
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
}

function selectPDF(gender, bmi) {
    if (gender === 'Male') {
        if (bmi >= 26) return pdfFiles.male.highBMI;
        else if (bmi < 18.5) return pdfFiles.male.lowBMI;
        else return pdfFiles.male.normalBMI;
    } else { // Female
        if (bmi >= 26) return pdfFiles.female.highBMI;
        else if (bmi < 18.5) return pdfFiles.female.lowBMI;
        else return pdfFiles.female.normalBMI;
    }
}

function sendEmailWithPDF(userEmail, pdfFileId) {
    const bmiFile = DriveApp.getFileById(pdfFileId);
    const bmiBlob = bmiFile.getBlob();

    // Retrieve general information PDFs and store in an array
    const attachments = generalPdfFiles.map(fileId => DriveApp.getFileById(fileId).getBlob());
    // Add the specific BMI-related PDF to the attachments array
    attachments.push(bmiBlob);

    MailApp.sendEmail({
        to: userEmail,
        subject: 'Your Daily Food Guide',
        body: 'Please find attached the information related to your BMI and other helpful resources.',
        name: 'good point',
        noReply: true,
        attachments: attachments
    });
  
    Logger.log(`Mail with PDFs has been sent to ${userEmail}!`)
}

function mySubmit(e) {
    const JSONresult = e.namedValues;
  
    const gender = JSONresult['Gender'][0];
    const height = parseFloat(JSONresult['Height'][0]);
    const weight = parseFloat(JSONresult['Weight'][0]);
    const userEmail = JSONresult['email'][0];

    const bmi = calculateBMI(height, weight);
    const pdfFileId = selectPDF(gender, bmi);
  
    Logger.log({gender, height, weight, bmi, pdfFileId});
  
    sendEmailWithPDF(userEmail, pdfFileId);
}

function createTrigger() {
    var sheet = SpreadsheetApp.openById('Google sheet ID');
    ScriptApp.newTrigger('mySubmit')
        .forSpreadsheet(sheet)
        .onFormSubmit()
        .create();
}