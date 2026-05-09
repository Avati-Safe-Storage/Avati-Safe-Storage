export async function fetchCustomerData(phoneNumber: string) {
  try {
    // The specific GID for the Customer sheet
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1gQl6Qm3x77zMtvN7C9tIpnwt3usnAeUgTaAyQgKpT3o/gviz/tq?tqx=out:csv&gid=1125867702';
    
    const response = await fetch(sheetUrl);
    const csvText = await response.text();
    
    // Simple CSV parser
    const rows = csvText.split('\n').map(row => {
      return row.split(',').map(cell => cell.replace(/^"|"$/g, '').trim());
    });
    
    // Find the row where Phone Number (index 2) matches
    // Headers: Customer ID, Full Name, Phone Number, Alternate Number, Email, Address, KYC ID, Onboarding Date, GSTIN
    const header = rows[0];
    const customerRow = rows.find((row, index) => index > 0 && row[2] === phoneNumber);
    
    if (customerRow) {
      return {
        customerId: customerRow[0],
        name: customerRow[1],
        phone: customerRow[2],
        alternateNumber: customerRow[3],
        email: customerRow[4],
        address: customerRow[5],
        onboardingDate: customerRow[7],
        // Using mock data for Storage/Payment info since it's not in this sheet yet
        storageId: `AVT-STO-${Math.floor(Math.random() * 9000) + 1000}`,
        warehouseLoc: "WH1-A1",
        storageType: "Standard Furniture Storage",
        pickupDate: "15-May-2026",
        pendingPayments: Math.floor(Math.random() * 5000),
        status: "Active",
        monthlyStorage: 4500,
        gst: 810,
        total: 5310,
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error);
    return null;
  }
}
