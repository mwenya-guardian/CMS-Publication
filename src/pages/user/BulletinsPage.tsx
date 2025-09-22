import React, { useState, useEffect, ReactNode } from 'react';
import { BulletinCard } from '../../components/bulletin/BulletinCard';
import { BulletinViewCard } from '../../components/bulletin/BulletinViewCard';
import { Pagination } from '../../components/common/Pagination';
import { ChurchBulletin, PublicationStatus } from '../../types/ChurchBulletin';
import { bulletinService } from '../../services/bulletinService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { exportUtils} from '../../utils/exportUtils';
import { Modal } from '../../components/common/Modal';
import ReactDOMServer from "react-dom/server";

export const BulletinsPage: React.FC = () => {
  const [bulletins, setBulletins] = useState<ChurchBulletin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBulletin, setSelectedBulletin] = useState<ChurchBulletin | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    loadBulletins();
  }, [page]);

  const loadBulletins = async () => {
    setIsLoading(true);
    try {
      const response = await bulletinService.getByStatus(PublicationStatus.PUBLISHED);
      setBulletins(response || []);
      setTotalPages(1); // Assuming no pagination for bulletins for now
    } catch (error) {
      console.error('Failed to load bulletins:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleBulletinClick = (bulletin: ChurchBulletin) => {
    setSelectedBulletin(bulletin);
    setShowModal(true);
  };

  const handleExport = async (bulletinId: string, format: 'pdf' | 'word') => {
    try {
      let blob: Blob;
      if (format === 'pdf') {
        blob = await bulletinService.exportToPdf(bulletinId);
      } else {
        blob = await bulletinService.exportToWord(bulletinId);
      }

      if(format === 'pdf') {
        exportUtils.downloadBlob(blob, `bulletin-${bulletinId}.${format}`);
      } else {
        exportUtils.downloadBlob(blob, `bulletin-${bulletinId}.docx`);
      }
    } catch (err) {
      console.error(`Error exporting ${format}:`, err);
    }
  };

  // const handlePdfGenerate = async (pdfSource: ReactNode) => {
  //   let tempdiv = document.createElement('div');
  //   tempdiv.innerHTML = ReactDOMServer.renderToStaticMarkup(
  //     pdfSource);
  //   exportUtils.generatePDF(tempdiv);
  // }
  // const triggerGenerate = () => {
  //   console.log(`Triggered before`);
  //   handlePdfGenerate(        
  //     <Modal
  //       isOpen={showModal}
  //       onClose={() => {
  //         setShowModal(false);
  //         setSelectedBulletin(null);
  //       }}
  //       title={'Church Bulletin'}
  //       size="xl"
  //     >
  //       <BulletinViewCard 
  //       bulletin={bulletins[0]}
  //       onExport={handleExport}
  //       onView={setShowModal}
  //       />
  //     </Modal>);
  //     console.log(`Triggered after`);
  // }
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Church Bulletins</h1>
        <p className="text-gray-600">
          Stay updated with the latest church bulletins and announcements.
        </p>
      </div>

      {/* Bulletins */}
      <div className="space-y-4">
        {bulletins.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-lg">No bulletins available.</p>
            <p className="text-gray-400 mt-2">
              Check back later for the latest church bulletins.
            </p>
          </div>
        ) : (
          bulletins.map((bulletin) => (
            <BulletinCard key={bulletin.id} 
            bulletin={bulletin} 
            onView={handleBulletinClick}
            onExportPdf={handleExport}
            // onGenerate={triggerGenerate}
            />
          ))
        )}
      </div>

      {/* Bulletin Detail Modal (full details) */}
      {selectedBulletin && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedBulletin(null);
          }}
          title={selectedBulletin.title || 'Church Bulletin'}
          size="xl"
        >
          <BulletinViewCard 
          bulletin={selectedBulletin}
          onExport={handleExport}
          onView={setShowModal}
          />
        </Modal>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
