import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// Hàm xuất PDF
export const exportToPDF = async (
    data: any[], // Thay đổi từ author sang data
    filename: string,
    formatData: (item: any) => string
) => {
    const pdf = new jsPDF();
    
    data.forEach((item, index) => {
        const content = formatData(item); // Format cho mỗi item
        pdf.text(content, 10, 10 + (index * 10)); // Đặt nội dung theo từng dòng
    });
    
    pdf.save(`${filename}.pdf`);
};

// Hàm xuất CSV
export const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    const csvData = data.map(item => {
        const row: any = {};
        headers.forEach(header => {
            row[header] = item[header];
        });
        return row;
    });
    
    const csvString = headers.join(',') + '\n' +
                      csvData.map(item => headers.map(header => item[header]).join(',')).join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.click();
};

// Hàm xuất Excel
export const exportToExcel = (data: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${filename}.xlsx`);
};
