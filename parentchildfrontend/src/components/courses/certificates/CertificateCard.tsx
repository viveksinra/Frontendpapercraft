'use client';

import Link from 'next/link';
import CertificatePreview from './CertificatePreview';
import CertificateDownloadButton from './CertificateDownloadButton';

interface CertificateCardProps {
  certificate: any;
}

export default function CertificateCard({ certificate }: CertificateCardProps) {
  const completionDate = certificate.completedAt
    ? new Date(certificate.completedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <CertificatePreview certificate={certificate} />
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-sm line-clamp-2">
          {certificate.courseTitle}
        </h3>
        {certificate.instituteName && (
          <p className="text-xs text-muted-foreground">{certificate.instituteName}</p>
        )}
        {completionDate && (
          <p className="text-xs text-muted-foreground">Completed: {completionDate}</p>
        )}
        {certificate.certificateNumber && (
          <p className="text-xs text-muted-foreground font-mono">
            #{certificate.certificateNumber}
          </p>
        )}
        <div className="flex items-center gap-2 pt-1">
          <CertificateDownloadButton courseId={certificate.courseId} />
          <Link
            href={`/verify-certificate?id=${certificate.certificateNumber || ''}`}
            className="text-xs text-primary hover:underline"
          >
            Verify
          </Link>
        </div>
      </div>
    </div>
  );
}
