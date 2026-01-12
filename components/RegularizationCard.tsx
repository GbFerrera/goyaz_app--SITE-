import Button from './Button';

interface RegularizationCardProps {
  type: 'rural' | 'urbana' | 'reserva';
  title: string;
  description: string;
  items: string[];
  hasMap?: boolean;
}

export default function RegularizationCard({ 
  type, 
  title, 
  description, 
  items,
  hasMap = false 
}: RegularizationCardProps) {
  const typeLabels = {
    rural: 'REGULARIZAÇÃO',
    urbana: 'REGULARIZAÇÃO',
    reserva: 'RESERVA LEGAL RESPONSÁVEL'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full min-h-[500px]">
      <div className="p-6 flex-1 flex flex-col">
        <p className="text-xs font-semibold text-[#04C55F] mb-2 uppercase tracking-wide">
          {typeLabels[type]}
        </p>
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        
        <ul className="space-y-2 mb-6 flex-1">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
              <svg className="w-5 h-5 text-[#04C55F] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {item}
            </li>
          ))}
        </ul>

        {hasMap && (
          <div className="mb-6 h-40 bg-gray-200 rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 mb-4 text-center">
          Caso tenha dúvida entre em contato com nosso time de suporte
        </p>
        
        <Button variant={hasMap ? 'outline' : 'secondary'} className="w-full">
          {hasMap ? (
            <>
              Olhar acima
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          ) : (
            <>
              Enviar documentação
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
