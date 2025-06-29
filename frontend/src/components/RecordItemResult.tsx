import React from 'react';

interface RecordItemResultProps {
  recordType: string;
  useCase: any;
  isTesting?: boolean;
  onAnalyze?: (recordType: string) => void;
  testingRecordType?: string | null;
  testingDomain?: string | null;
  currentDomain?: string;
}

const RecordItemResult: React.FC<RecordItemResultProps> = ({
  recordType,
  useCase,
  isTesting = false,
  onAnalyze,
  testingRecordType,
  testingDomain,
  currentDomain
}) => {
  const isCurrentlyTesting = testingDomain === currentDomain && testingRecordType === recordType;

  if (isTesting && isCurrentlyTesting) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
        <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {recordType} Record Analysis
        </h5>
        <div className="flex flex-row items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full min-w-[60px] text-center ${
            useCase?.Status === 'Valid' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
              : useCase?.Status === 'Not present'
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
          }`}>
            {useCase?.Status || 'Unknown'}
          </span>
          {onAnalyze && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onAnalyze(recordType);
              }}
              disabled={isCurrentlyTesting}
              className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 underline inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              title={`Test ${recordType} record specifically`}
            >
              {isCurrentlyTesting ? (
                <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              {isCurrentlyTesting ? 'Analyzing...' : 'Analyze'}
            </button>
          )}
        </div>
      </div>
      <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
        <div>
          {useCase?.Goal || useCase?.Purpose || useCase?.Expected || useCase?.Notes ? (
            <span>
              {`This record's goal is: ${useCase.Goal || 'N/A'}. Its purpose: ${useCase.Purpose || 'N/A'}. Expected: ${useCase.Expected || 'N/A'}. Notes: ${useCase.Notes || 'N/A'}.`}
            </span>
          ) : (
            <span>N/A</span>
          )}
        </div>
        
        {useCase?.records && useCase.records.length > 0 ? (
          <div>
            <div className="font-medium mb-1 text-gray-900 dark:text-white">
              Records ({useCase.records.length}):
            </div>
            <div className="space-y-1">
              {useCase.records.map((record: any, index: number) => {
                let displayRecord = record;
                if (typeof record === 'object' && record !== null) {
                  const { createdAt, updatedAt, ...rest } = record;
                  displayRecord = rest;
                }
                return (
                  <div key={index} className="px-2 py-1 rounded text-xs font-mono text-gray-900 dark:text-gray-100" style={{ wordWrap: 'break-word' }}>
                    {typeof displayRecord === 'object' && displayRecord !== null
                      ? <pre className="whitespace-pre-wrap break-all m-0">{JSON.stringify(displayRecord, null, 2)}</pre>
                      : String(displayRecord)
                    }
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400">No records found</div>
        )}
        
        {useCase?.Error && (
          <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
            <span className="font-medium">Error:</span> {useCase.Error}
          </div>
        )}
      </div>
    </>
  );
};

export default RecordItemResult; 