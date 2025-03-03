import React, { useState } from 'react';
import type { Skill } from './types';
import { SkillTreeView } from './SkillTreeView';
import { SkillImprovement } from './SkillImprovement';

export const SkillTreeContainer: React.FC = () => {
  const [personalSkills, setPersonalSkills] = useState<Skill[]>([]);
  const [targetSkills, setTargetSkills] = useState<Skill[]>([]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 我的技能 */}
        <div className="rounded-lg p-6 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-blue-900/40 backdrop-blur-md border border-indigo-500/20">
          <h2 className="text-xl font-semibold mb-6">我的技能水平</h2>
          <SkillTreeView 
            type="personal" 
            onSkillsChange={setPersonalSkills}
          />
        </div>

        {/* 目标岗位要求 */}
        <div className="rounded-lg p-6 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-blue-900/40 backdrop-blur-md border border-indigo-500/20">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">目标岗位要求</h2>
            <select className="w-full bg-slate-800/60 text-gray-200 rounded-md px-3 py-2 appearance-none cursor-pointer mb-4 border border-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50">
              <option value="">选择目标岗位</option>
              <option value="job001">资深前端开发工程师 - 字节跳动</option>
              <option value="job002">全栈开发工程师 - 腾讯云</option>
              <option value="job003">高级后端开发工程师 - 阿里巴巴</option>
              <option value="job004">DevOps工程师 - 美团</option>
            </select>
            <SkillTreeView 
              type="target" 
              onSkillsChange={setTargetSkills}
            />
          </div>
        </div>
      </div>

      {/* 技能提升建议 */}
      {personalSkills.length > 0 && targetSkills.length > 0 && (
        <SkillImprovement 
          personalSkills={personalSkills} 
          targetSkills={targetSkills} 
        />
      )}
    </>
  );
}; 