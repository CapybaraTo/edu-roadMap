import React from 'react';
import type { SkillTagProps } from './types';

const LEVEL_COLORS = {
  beginner: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  intermediate: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  expert: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  unknown: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
};

const LEVEL_LABELS = {
  beginner: '入门',
  intermediate: '进阶',
  expert: '专家',
  unknown: '未知'
};

export const SkillTag: React.FC<SkillTagProps> = ({ name, level, showLevel = true, needsImprovement = false }) => {
  const colors = LEVEL_COLORS[level];
  return (
    <div className="relative inline-flex">
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${colors.bg} ${colors.text} border ${colors.border} text-sm font-medium ${needsImprovement ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-800' : ''}`}>
        {name}
        {showLevel && (
          <>
            <span className="mx-1">·</span>
            <span className="text-xs">{LEVEL_LABELS[level]}</span>
          </>
        )}
      </span>
      {needsImprovement && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-amber-900">
          ↑
        </span>
      )}
    </div>
  );
}; 