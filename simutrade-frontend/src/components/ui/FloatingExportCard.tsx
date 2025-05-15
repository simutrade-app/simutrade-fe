import React from 'react';

interface FloatingExportCardProps {
  className?: string;
}

const FloatingExportCard: React.FC<FloatingExportCardProps> = ({
  className = '',
}) => {
  return (
    <>
      {/* Floating Card - Glassmorphism Style */}
      <div
        className={`absolute max-w-sm w-4/5 p-6 bg-white/20 backdrop-blur-md border border-white/40 rounded-xl z-10 ${className}`}
        style={{
          animation: 'float 8s ease-in-out infinite',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow:
            '0 8px 32px rgba(31, 38, 135, 0.1), inset 0 0 32px rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="space-y-5">
          <h3 className="text-2xl font-bold text-white drop-shadow-sm">
            Simulate Export
          </h3>

          <div className="space-y-4">
            <div className="relative">
              <select
                className="w-full p-3 bg-white/30 border border-white/30 rounded-lg appearance-none pr-8 text-gray-800 backdrop-blur-sm"
                aria-label="Origin Country"
              >
                <option value="" disabled selected>
                  Origin Country
                </option>
                <option>United States</option>
                <option>China</option>
                <option>Japan</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="relative">
              <select
                className="w-full p-3 bg-white/30 border border-white/30 rounded-lg appearance-none pr-8 text-gray-800 backdrop-blur-sm"
                aria-label="Destination Country"
              >
                <option value="" disabled selected>
                  Destination Country
                </option>
                <option>Germany</option>
                <option>United Kingdom</option>
                <option>France</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>

            <input
              type="text"
              placeholder="Commodity"
              className="w-full p-3 bg-white/30 border border-white/30 rounded-lg text-gray-800 backdrop-blur-sm"
            />

            <input
              type="text"
              placeholder="Volume"
              className="w-full p-3 bg-white/30 border border-white/30 rounded-lg text-gray-800 backdrop-blur-sm"
            />

            <button className="w-full py-3 px-4 bg-teal-700/90 hover:bg-teal-800 text-white font-medium rounded-lg transition duration-200 backdrop-blur-sm">
              Simulate
            </button>
          </div>

          <div className="bg-white/20 p-4 rounded-lg mt-4 backdrop-blur-sm border border-white/30">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-gray-200">Est. Cost</p>
                <p className="text-lg font-bold text-white">$4,500</p>
              </div>
              <div>
                <p className="text-gray-200">Delivery</p>
                <p className="text-lg text-white">6–10 days</p>
              </div>
              <div>
                <p className="text-gray-200">Risk Level</p>
                <div className="bg-green-400/20 text-green-100 text-center rounded-md py-1 px-2 font-medium backdrop-blur-sm border border-green-400/30">
                  Low
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add the floating animation keyframes */}
      <style>{`
        @keyframes float {
          0% {
            transform: translate(-50%, -50%);
          }
          50% {
            transform: translate(-50%, -53%);
          }
          100% {
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
};

export default FloatingExportCard;
