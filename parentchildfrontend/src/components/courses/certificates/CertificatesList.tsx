'use client';

import CertificateCard from './CertificateCard';

interface CertificatesListProps {
  certificates: any[];
}

export default function CertificatesList({ certificates }: CertificatesListProps) {
  if (!certificates?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">No certificates earned yet.</p>
        <p className="text-xs mt-1">Complete a course to earn your first certificate.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {certificates.map((cert) => (
        <CertificateCard key={cert._id || cert.id} certificate={cert} />
      ))}
    </div>
  );
}
