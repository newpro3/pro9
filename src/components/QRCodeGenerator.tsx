import React, { useState, useRef } from 'react';
import { X, Download, QrCode, FileImage, FileText, Check } from 'lucide-react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useMenuTheme } from '../hooks/useMenuTheme';

interface QRCodeGeneratorProps {
  userId: string;
  businessName: string;
  numberOfTables: number;
  onClose: () => void;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  userId,
  businessName,
  numberOfTables,
  onClose,
}) => {
  const { theme } = useMenuTheme(userId);
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [qrCodes, setQrCodes] = useState<{ [key: number]: string }>({});
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const tables = Array.from({ length: numberOfTables }, (_, i) => i + 1);

  const getThemeColors = () => {
    switch (theme) {
      case 'modern':
        return {
          primary: '#3b82f6',
          secondary: '#1e40af',
          accent: '#60a5fa',
          text: '#1f2937',
          background: '#f8fafc'
        };
      case 'elegant':
        return {
          primary: '#d97706',
          secondary: '#92400e',
          accent: '#fbbf24',
          text: '#374151',
          background: '#fefdf8'
        };
      case 'minimal':
        return {
          primary: '#374151',
          secondary: '#111827',
          accent: '#6b7280',
          text: '#111827',
          background: '#ffffff'
        };
      default: // classic
        return {
          primary: '#059669',
          secondary: '#047857',
          accent: '#10b981',
          text: '#1f2937',
          background: '#f0fdf4'
        };
    }
  };

  const handleTableSelect = (tableNumber: number) => {
    setSelectedTables(prev => 
      prev.includes(tableNumber)
        ? prev.filter(t => t !== tableNumber)
        : [...prev, tableNumber]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTables([]);
    } else {
      setSelectedTables(tables);
    }
    setSelectAll(!selectAll);
  };

  const generateQRCode = async (tableNumber: number): Promise<string> => {
    const url = `${window.location.origin}/menu/${userId}/table/${tableNumber}`;
    try {
      const qrDataURL = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      return qrDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  };

  const generateAllQRCodes = async () => {
    setGenerating(true);
    const codes: { [key: number]: string } = {};
    
    try {
      for (const tableNumber of selectedTables) {
        codes[tableNumber] = await generateQRCode(tableNumber);
      }
      setQrCodes(codes);
    } catch (error) {
      console.error('Error generating QR codes:', error);
      alert('Failed to generate QR codes');
    } finally {
      setGenerating(false);
    }
  };

  const downloadSingleQR = async (tableNumber: number, format: 'png' | 'pdf') => {
    try {
      const qrDataURL = qrCodes[tableNumber] || await generateQRCode(tableNumber);
      const colors = getThemeColors();
      
      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `table-${tableNumber}-qr.png`;
        link.href = qrDataURL;
        link.click();
      } else {
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Add themed background
        // Convert hex to RGB for PDF
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : { r: 255, g: 255, b: 255 };
        };
        
        const bgColor = hexToRgb(colors.gradientStart);
        const primaryColor = hexToRgb(colors.primary);
        const textColor = hexToRgb(colors.text);
        const secondaryColor = hexToRgb(colors.secondary);
        const accentColor = hexToRgb(colors.accent);
        
        pdf.setFillColor(bgColor.r, bgColor.g, bgColor.b);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Add title
        pdf.setTextColor(textColor.r, textColor.g, textColor.b);
        pdf.setFontSize(20);
        pdf.text(businessName, pageWidth / 2, 30, { align: 'center' });
        
        pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
        pdf.setFontSize(16);
        pdf.text(`Table ${tableNumber}`, pageWidth / 2, 50, { align: 'center' });
        
        // Add QR code
        const qrSize = 120;
        const qrX = (pageWidth - qrSize) / 2;
        const qrY = 70;
        
        pdf.addImage(qrDataURL, 'PNG', qrX, qrY, qrSize, qrSize);
        
        // Add themed border around QR code
        pdf.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
        pdf.setLineWidth(2);
        pdf.rect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);
        
        // Add URL
        pdf.setTextColor(textColor.r, textColor.g, textColor.b);
        pdf.setFontSize(10);
        const url = `${window.location.origin}/menu/${userId}/table/${tableNumber}`;
        pdf.text(url, pageWidth / 2, qrY + qrSize + 20, { align: 'center' });
        
        // Add instructions
        pdf.setTextColor(secondaryColor.r, secondaryColor.g, secondaryColor.b);
        pdf.setFontSize(12);
        pdf.text('Scan this QR code to view our menu', pageWidth / 2, qrY + qrSize + 35, { align: 'center' });
        
        // Add themed footer
        pdf.setTextColor(accentColor.r, accentColor.g, accentColor.b);
        pdf.setFontSize(8);
        pdf.text(`Generated with ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        
        pdf.save(`table-${tableNumber}-qr.pdf`);
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code');
    }
  };

  const downloadAllQRCodes = async (format: 'png' | 'pdf') => {
    if (selectedTables.length === 0) return;
    
    setGenerating(true);
    const colors = getThemeColors();
    
    try {
      if (format === 'png') {
        // Create a zip-like download by downloading each image
        for (const tableNumber of selectedTables) {
          await downloadSingleQR(tableNumber, 'png');
          // Small delay to prevent browser blocking
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } else {
        // Create a single PDF with all QR codes
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        for (let i = 0; i < selectedTables.length; i++) {
          const tableNumber = selectedTables[i];
          
          if (i > 0) {
            pdf.addPage();
          }
          
          // Add themed background
          const bgColor = hexToRgb(colors.gradientStart);
          const primaryColor = hexToRgb(colors.primary);
          const textColor = hexToRgb(colors.text);
          const secondaryColor = hexToRgb(colors.secondary);
          const accentColor = hexToRgb(colors.accent);
          
          pdf.setFillColor(bgColor.r, bgColor.g, bgColor.b);
          pdf.rect(0, 0, pageWidth, pageHeight, 'F');
          
          // Add title
          pdf.setTextColor(textColor.r, textColor.g, textColor.b);
          pdf.setFontSize(20);
          pdf.text(businessName, pageWidth / 2, 30, { align: 'center' });
          
          pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
          pdf.setFontSize(16);
          pdf.text(`Table ${tableNumber}`, pageWidth / 2, 50, { align: 'center' });
          
          // Add QR code
          const qrDataURL = qrCodes[tableNumber] || await generateQRCode(tableNumber);
          const qrSize = 120;
          const qrX = (pageWidth - qrSize) / 2;
          const qrY = 70;
          
          pdf.addImage(qrDataURL, 'PNG', qrX, qrY, qrSize, qrSize);
          
          // Add themed border around QR code
          pdf.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
          pdf.setLineWidth(2);
          pdf.rect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);
          
          // Add URL
          pdf.setTextColor(textColor.r, textColor.g, textColor.b);
          pdf.setFontSize(10);
          const url = `${window.location.origin}/menu/${userId}/table/${tableNumber}`;
          pdf.text(url, pageWidth / 2, qrY + qrSize + 20, { align: 'center' });
          
          // Add instructions
          pdf.setTextColor(secondaryColor.r, secondaryColor.g, secondaryColor.b);
          pdf.setFontSize(12);
          pdf.text('Scan this QR code to view our menu', pageWidth / 2, qrY + qrSize + 35, { align: 'center' });
          
          // Add themed footer
          pdf.setTextColor(accentColor.r, accentColor.g, accentColor.b);
          pdf.setFontSize(8);
          pdf.text(`Generated with ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }
        
        pdf.save(`${businessName.toLowerCase().replace(/\s+/g, '-')}-qr-codes.pdf`);
      }
    } catch (error) {
      console.error('Error downloading QR codes:', error);
      alert('Failed to download QR codes');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <QrCode className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">QR Code Generator</h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">Generate QR codes for your restaurant tables</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Table Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Tables</h3>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Select All</span>
                </label>
                <span className="text-sm text-gray-500">
                  {selectedTables.length} of {numberOfTables} selected
                </span>
              </div>
            </div>

            <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
              {tables.map(tableNumber => (
                <button
                  key={tableNumber}
                  onClick={() => handleTableSelect(tableNumber)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    selectedTables.includes(tableNumber)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-sm font-medium">Table</div>
                    <div className="text-lg font-bold">{tableNumber}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <button
              onClick={generateAllQRCodes}
              disabled={selectedTables.length === 0 || generating}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>{generating ? 'Generating...' : 'Generate QR Codes'}</span>
            </button>

            <div className="flex space-x-3">
              <button
                onClick={() => downloadAllQRCodes('png')}
                disabled={Object.keys(qrCodes).length === 0 || generating}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <FileImage className="w-4 h-4" />
                <span>Download PNG</span>
              </button>
              <button
                onClick={() => downloadAllQRCodes('pdf')}
                disabled={Object.keys(qrCodes).length === 0 || generating}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Generated QR Codes Preview */}
          {Object.keys(qrCodes).length > 0 && (
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated QR Codes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" ref={qrContainerRef}>
                {Object.entries(qrCodes).map(([tableNumber, qrDataURL]) => (
                  <div key={tableNumber} className="bg-gray-50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-gray-900 mb-2">Table {tableNumber}</h4>
                    <img
                      src={qrDataURL}
                      alt={`QR Code for Table ${tableNumber}`}
                      className="w-32 h-32 mx-auto mb-3 border rounded"
                    />
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => downloadSingleQR(parseInt(tableNumber), 'png')}
                        className="text-green-600 hover:text-green-700 p-1"
                        title="Download PNG"
                      >
                        <FileImage className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadSingleQR(parseInt(tableNumber), 'pdf')}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Download PDF"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 break-all">
                      {`${window.location.origin}/menu/${userId}/table/${tableNumber}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};