import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportUtils = {
  async generatePDF(element: HTMLElement, filename: string = 'export.pdf'): Promise<void> {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  },

  async generateMultiPagePDF(elements: HTMLElement[], filename: string = 'export.pdf'): Promise<void> {
    try {
      const pdf = new jsPDF();
      let isFirstPage = true;

      for (const element of elements) {
        if (!isFirstPage) {
          pdf.addPage();
        }

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        isFirstPage = false;
      }

      pdf.save(filename);
    } catch (error) {
      console.error('Error generating multi-page PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  },

  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  async htmlToImage(element: HTMLElement): Promise<string> {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error converting HTML to image:', error);
      throw new Error('Failed to convert HTML to image');
    }
  },
};