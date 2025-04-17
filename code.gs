// ฟังก์ชันที่ทำงานเมื่อมีการร้องขอ GET เพื่อแสดงหน้า HTML
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('https://script.google.com/macros/s/AKfycbz5yOsCP50PRRI4M8hcAtgMQfMJ_thInLbSv6l0fXxU4-ZJKL5JZZW_VFkPFGwn9DMnpw/exec'); // เปลี่ยน 'index' เป็นชื่อไฟล์ HTML ของคุณ
}

// ตัวอย่างฟังก์ชันที่เชื่อมต่อกับ Google Sheet
function getDataFromSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sales');
  const data = sheet.getDataRange().getValues();
  return data;
}

// ฟังก์ชันบันทึกข้อมูลที่คนขายกรอก
function recordSale(seller, amount, number, type, date) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sales');
  sheet.appendRow([seller, amount, number, type, date]);
}

// ฟังก์ชันบันทึกข้อมูลการชำระเงิน
function recordPayment(seller, amountPaid, date) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Payments');
  sheet.appendRow([seller, amountPaid, date]);
}

// ฟังก์ชันเช็คยอดค้างชำระ
function getOutstandingBalance(seller) {
  const salesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sales');
  const paymentsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Payments');
  
  const salesData = salesSheet.getDataRange().getValues();
  const paymentsData = paymentsSheet.getDataRange().getValues();
  
  let totalSales = 0;
  let totalPayments = 0;

  // คำนวณยอดขายทั้งหมดของคนขาย
  for (let i = 0; i < salesData.length; i++) {
    if (salesData[i][0] === seller) {
      totalSales += salesData[i][1]; // จำนวนเงินที่ขาย
    }
  }

  // คำนวณยอดชำระทั้งหมดของคนขาย
  for (let j = 0; j < paymentsData.length; j++) {
    if (paymentsData[j][0] === seller) {
      totalPayments += paymentsData[j][1]; // จำนวนเงินที่ชำระ
    }
  }

  return totalSales - totalPayments; // ยอดค้างชำระ
}

// ฟังก์ชันบันทึกการตั้งค่าราคา
function setPrice(seller, pricePerUnit) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Prices');
  sheet.appendRow([seller, pricePerUnit]);
}

// ฟังก์ชันดึงราคาจาก Google Sheet
function getPrice(seller) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Prices');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === seller) {
      return data[i][1]; // คืนราคาของคนขาย
    }
  }
  return null; // ถ้าไม่พบข้อมูล
}

// ฟังก์ชันเช็คยอดรวมที่ต้องชำระ
function getTotalAmountToPay(seller) {
  const salesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sales');
  const data = salesSheet.getDataRange().getValues();
  
  let totalAmount = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === seller) {
      totalAmount += data[i][1]; // ยอดขายของคนขาย
    }
  }
  return totalAmount;
}

// ฟังก์ชันจัดการการชำระเงิน
function updatePaymentStatus(seller, amountPaid) {
  const outstandingBalance = getOutstandingBalance(seller);

  if (outstandingBalance > 0 && amountPaid >= outstandingBalance) {
    const date = new Date();
    recordPayment(seller, amountPaid, date); // บันทึกการชำระเงิน
    return 'Payment successful! Balance cleared.';
  } else if (outstandingBalance > 0 && amountPaid < outstandingBalance) {
    return 'Payment is insufficient. Please pay the remaining balance.';
  } else {
    return 'No outstanding balance to pay.';
  }
}

// ฟังก์ชันการสร้างเลขที่โพย
function generateTicketNumber() {
  const date = new Date();
  const ticketNumber = "T" + Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyyMMddHHmmss");
  return ticketNumber;
}
