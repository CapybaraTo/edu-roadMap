import React, { useState, useEffect } from 'react';
import { SkillTag } from './SkillTag';
import type { Skill } from './types';

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

const LEVEL_VALUES = {
  beginner: 1,
  intermediate: 2,
  expert: 3,
  unknown: 0
};

export const MOCK_PERSONAL_SKILLS: Skill[] = [
  { name: 'React', level: 'intermediate', category: '前端开发' },
  { name: 'Vue.js', level: 'expert', category: '前端开发' },
  { name: 'TypeScript', level: 'intermediate', category: '前端开发' },
  { name: 'Node.js', level: 'beginner', category: '后端开发' },
  { name: 'Docker', level: 'beginner', category: '运维工具' },
  { name: 'MySQL', level: 'intermediate', category: '数据库' },
];

export const MOCK_TARGET_SKILLS: Skill[] = [
  { name: 'React', level: 'expert', category: '前端开发' },
  { name: 'TypeScript', level: 'expert', category: '前端开发' },
  { name: 'Node.js', level: 'intermediate', category: '后端开发' },
  { name: 'Webpack', level: 'intermediate', category: '前端开发' },
  { name: 'Next.js', level: 'intermediate', category: '前端开发' },
  { name: 'GraphQL', level: 'intermediate', category: '后端开发' },
  { name: 'Web性能优化', level: 'expert', category: '前端开发' },
];

interface SkillTreeViewProps {
  type: 'personal' | 'target';
  onSkillsChange?: (skills: Skill[]) => void;
}

export const SkillTreeView: React.FC<SkillTreeViewProps> = ({ type, onSkillsChange }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const skillsData = type === 'personal' ? MOCK_PERSONAL_SKILLS : MOCK_TARGET_SKILLS;
    setSkills(skillsData);
    onSkillsChange?.(skillsData);
    
    const uniqueCategories = Array.from(new Set(skillsData.map(skill => skill.category)));
    setCategories(uniqueCategories);
  }, [type, onSkillsChange]);

  return (
    <div className="space-y-6">
      {categories.map(category => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-medium text-gray-200">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {skills
              .filter(skill => skill.category === category)
              .map(skill => (
                <SkillTag
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  needsImprovement={type === 'personal' && MOCK_TARGET_SKILLS.some(
                    ts => ts.name === skill.name && 
                    ['beginner', 'intermediate', 'expert', 'unknown'].indexOf(ts.level) > 
                    ['beginner', 'intermediate', 'expert', 'unknown'].indexOf(skill.level)
                  )}
                />
              ))}
          </div>
        </div>
      ))}
      
      {skills.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          {type === 'personal' ? '请上传简历以分析你的技能水平' : '请选择目标岗位查看要求'}
        </div>
      )}

      {type === 'target' && skills.length > 0 && (
        <div className="flex justify-center mt-8">
          <a
            href="/learning-path"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <span>生成学习路径图</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}; 