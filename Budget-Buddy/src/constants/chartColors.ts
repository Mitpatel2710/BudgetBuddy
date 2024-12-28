// Chart color constants
export const EXPENSE_CATEGORY_COLORS = {
  Housing: '#4F46E5', // Indigo
  Transportation: '#10B981', // Emerald
  Food: '#F59E0B', // Amber
  Utilities: '#3B82F6', // Blue
  Healthcare: '#EC4899', // Pink
  Entertainment: '#8B5CF6', // Purple
  Shopping: '#F97316', // Orange
  Education: '#06B6D4', // Cyan
  Insurance: '#EF4444', // Red
  'Personal Care': '#14B8A6', // Teal
  'Other Expenses': '#6B7280', // Gray
} as const;

export const CHART_COLORS = {
  income: {
    border: '#10b981',
    background: 'rgba(16, 185, 129, 0.1)',
    point: '#10b981'
  },
  expense: {
    border: '#ef4444',
    background: 'rgba(239, 68, 68, 0.1)',
    point: '#ef4444'
  }
} as const;