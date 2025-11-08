import { AlertTriangle, ExternalLink } from "lucide-react";

interface DataUnavailableProps {
  title: string;
  description: string;
  missingEndpoints: string[];
  suggestedAction?: string;
}

export function DataUnavailable({
  title,
  description,
  missingEndpoints,
  suggestedAction,
}: DataUnavailableProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-8">
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-amber-900 mb-2">
            Required Backend Endpoints:
          </h4>
          <ul className="text-sm text-amber-700 space-y-1">
            {missingEndpoints.map((endpoint, index) => (
              <li key={index} className="font-mono">
                {endpoint}
              </li>
            ))}
          </ul>
        </div>

        {suggestedAction && (
          <p className="text-sm text-gray-500">{suggestedAction}</p>
        )}
      </div>
    </div>
  );
}
