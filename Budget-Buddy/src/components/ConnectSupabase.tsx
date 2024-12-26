import React from 'react';
import { Database, AlertCircle } from 'lucide-react';

export function ConnectSupabase() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <Database className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Connect to Supabase</h1>
        <div className="mb-6">
          <div className="flex items-center justify-center text-amber-600 mb-4">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>Database connection required</span>
          </div>
          <p className="text-sm text-gray-600">
            Please click the "Connect to Supabase" button in the top right corner to set up your database connection.
          </p>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            This will automatically configure your database connection with the necessary credentials.
          </p>
        </div>
      </div>
    </div>
  );
}