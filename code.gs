const sheetName = 'ProductList'; // ชื่อแผ่นงานใน Google Sheets ที่เก็บข้อมูลสินค้า
const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

// รับข้อมูลสินค้าจาก Google Sheets
function doGet(e) {
  const data = sheet.getDataRange().getValues(); // ดึงข้อมูลทั้งหมดจากแผ่นงาน
  const products = [];

  for (let i = 1; i < data.length; i++) {
    const product = {
      name: data[i][0], // ชื่อสินค้า
      price: data[i][1], // ราคา
      description: data[i][2] // คำอธิบาย (ถ้ามี)
    };
    products.push(product);
  }

  const jsonResponse = JSON.stringify(products);
  return ContentService.createTextOutput(jsonResponse).setMimeType(ContentService.MimeType.JSON);
}

// รับข้อมูลคำสั่งซื้อจากฟอร์มและบันทึกลงใน Google Sheets
function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  
  const name = params.name;
  const email = params.email;
  const phone = params.phone;
  const department = params.department;
  const cart = params.cart;
  const signature = params.signature;

  // บันทึกคำสั่งซื้อลง Google Sheets
  const orderSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  const orderData = [];

  cart.forEach(item => {
    orderData.push([item.name, item.price, item.quantity]);
  });

  // สร้างรายการคำสั่งซื้อ
  const newOrder = [
    name,
    email,
    phone,
    department,
    JSON.stringify(cart), // แปลงตะกร้าสินค้าเป็น JSON
    signature,
    new Date()
  ];

  // บันทึกข้อมูลลงแผ่นงาน
  orderSheet.appendRow(newOrder);

  // ส่งคำตอบกลับไปยังฟร้อนเอนด์
  return ContentService.createTextOutput("Order Submitted Successfully").setMimeType(ContentService.MimeType.TEXT);
}
