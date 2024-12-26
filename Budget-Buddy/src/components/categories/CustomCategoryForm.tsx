import React, { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';

interface CustomCategoryFormProps {
  onAdd: (category: { name: string; color: string }) => Promise<void>;
  existingCategories: string[];
}

export function CustomCategoryForm({ onAdd, existingCategories }: CustomCategoryFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4F46E5');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (existingCategories.includes(name)) {
      setError('Category already exists');
      return;
    }

    try {
      await onAdd({ name, color });
      setName('');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter category name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Color
        </label>
        <div className="mt-1">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Category
      </button>
    </form>
  );
}