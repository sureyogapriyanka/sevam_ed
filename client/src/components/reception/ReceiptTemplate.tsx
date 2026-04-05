interface ReceiptData {
  receiptNumber: string;
  patientName: string;
  patientId: string;
  service: string;
  amount: number;
  paymentMethod: string;
  paymentDate: Date;
  doctorName?: string;
  queueNumber?: number;
  estimatedWaitTime?: number;
}

export const generateReceiptPDF = (receiptData: ReceiptData) => {
  // Create HTML content for the receipt
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt - ${receiptData.receiptNumber}</title>
      <style>
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 20mm;
          }
        }
        
        body {
          font-family: Arial, sans-serif;
          max-width: 210mm;
          margin: 0 auto;
          padding: 20mm;
          position: relative;
        }
        
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          opacity: 0.1;
          font-size: 80px;
          font-weight: bold;
          color: #000;
          pointer-events: none;
          z-index: -1;
        }
        
        .header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #1E40AF;
          padding-bottom: 10px;
        }
        
        .logo {
          width: 60px;
          height: 60px;
          margin: 0 auto 10px;
        }
        
        .company-name {
          font-size: 24px;
          font-weight: bold;
          color: #1E40AF;
          margin: 0;
        }
        
        .company-address {
          font-size: 12px;
          color: #666;
          margin: 5px 0;
        }
        
        .receipt-title {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          margin: 20px 0;
          color: #1E40AF;
        }
        
        .receipt-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 30px;
        }
        
        .detail-item {
          margin-bottom: 8px;
        }
        
        .detail-label {
          font-weight: bold;
          display: inline-block;
          width: 120px;
        }
        
        .detail-value {
          display: inline-block;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        
        th {
          background-color: #1E40AF;
          color: white;
        }
        
        .total-row {
          font-weight: bold;
        }
        
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
        }
        
        .page-number {
          position: fixed;
          bottom: 20mm;
          right: 20mm;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="watermark">SEVA ONLINE</div>
      
      <div class="header">
        <img src="/sevamed logo.png" alt="SevaMed Logo" class="logo">
        <h1 class="company-name">SEVA ONLINE MEDICAL CENTER</h1>
        <p class="company-address">123 Healthcare Avenue, Medical District</p>
        <p class="company-address">Hyderabad, Telangana 500001, India</p>
        <p class="company-address">Phone: +91 12345 67890 | Email: info@sevaonline.com</p>
      </div>
      
      <div class="receipt-title">OFFICIAL RECEIPT</div>
      
      <div class="receipt-details">
        <div>
          <div class="detail-item">
            <span class="detail-label">Receipt #:</span>
            <span class="detail-value">${receiptData.receiptNumber}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Date:</span>
            <span class="detail-value">${receiptData.paymentDate.toLocaleDateString()}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Time:</span>
            <span class="detail-value">${receiptData.paymentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Patient ID:</span>
            <span class="detail-value">${receiptData.patientId}</span>
          </div>
        </div>
        <div>
          <div class="detail-item">
            <span class="detail-label">Patient:</span>
            <span class="detail-value">${receiptData.patientName}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Service:</span>
            <span class="detail-value">${receiptData.service}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Doctor:</span>
            <span class="detail-value">${receiptData.doctorName || "N/A"}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Payment Method:</span>
            <span class="detail-value">${receiptData.paymentMethod}</span>
          </div>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${receiptData.service}</td>
            <td>₹${receiptData.amount.toFixed(2)}</td>
          </tr>
          <tr class="total-row">
            <td>Total</td>
            <td>₹${receiptData.amount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="detail-item">
        <span class="detail-label">Queue Number:</span>
        <span class="detail-value">${receiptData.queueNumber || "N/A"}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Est. Wait Time:</span>
        <span class="detail-value">${receiptData.estimatedWaitTime || 0} minutes</span>
      </div>
      
      <div class="footer">
        <p>Thank you for choosing Seva Online Medical Center</p>
        <p>This is a computer-generated receipt. No signature required.</p>
      </div>
      
      <div class="page-number">Page 1 of 1</div>
    </body>
    </html>
  `;

  // Create a new window with the receipt content
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();

    // Wait a bit for content to load, then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }
};
