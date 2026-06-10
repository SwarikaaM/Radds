// Create this reusable disclosure component
export default function MFDisclosure() {
  return (
    <div className="bg-gray-50 border-t border-gray-200 py-4 px-6">
      <p className="text-gray-400 text-[11px] leading-relaxed text-center max-w-4xl mx-auto">
        <strong className="text-gray-500">Regulatory Disclosure:</strong> Radds Capital is an AMFI-Registered Mutual Fund Distributor (ARN-334716 | ARN-292158 | ARN- 124053). 
        We are not a SEBI Registered Investment Adviser. Mutual Fund investments are subject to market risks. 
        Read all scheme-related documents carefully. Past performance is not indicative of future returns. 
        Incidental guidance provided is limited to mutual fund scheme selection and does not constitute financial planning or investment advisory services.
      </p>
    </div>
  );
}