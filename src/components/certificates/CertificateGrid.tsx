import { motion } from 'motion/react';
import { Award, ExternalLink, Calendar } from 'lucide-react';

type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issued_date: string | null;
  credential_url: string | null;
  image_url: string | null;
};

interface CertificateGridProps {
  certificates: Certificate[];
}

export default function CertificateGrid({ certificates }: CertificateGridProps) {
  if (certificates.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-block p-6 rounded-full bg-surface/50 mb-4">
          <Award size={48} className="text-text-muted opacity-50" />
        </div>
        <h3 className="text-xl font-bold text-text-muted">No Certificates Yet</h3>
        <p className="text-sm text-text-muted mt-2">Certifications will be added here soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {certificates.map((cert, index) => (
        <motion.div
          key={cert.id}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="glass-card flex flex-col h-full overflow-hidden group"
        >
          {/* Image */}
          <div className="relative h-48 w-full bg-surface/80 overflow-hidden flex items-center justify-center p-4">
            {cert.image_url ? (
              <img 
                src={cert.image_url} 
                alt={cert.title} 
                className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <Award size={48} className="text-text-muted/30" />
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {cert.title}
            </h3>
            
            <p className="text-primary font-medium mb-4">{cert.issuer}</p>

            <div className="flex items-center space-x-2 text-xs text-text-muted mt-auto mb-6">
              <Calendar size={14} />
              <span>{cert.issued_date ? new Date(cert.issued_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'No date'}</span>
            </div>

            {cert.credential_url && (
              <a 
                href={cert.credential_url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center space-x-2 w-full py-2.5 bg-surface hover:bg-white/10 rounded-xl text-sm font-medium transition-colors border border-white/5"
              >
                <span>View Credential</span>
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
