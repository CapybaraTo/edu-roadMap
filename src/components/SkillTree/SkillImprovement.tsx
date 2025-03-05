import React from 'react';
import { SkillTag } from './SkillTag';
import type { Skill } from './types';

const LEVEL_VALUES = {
  beginner: 1,
  intermediate: 2,
  expert: 3,
  unknown: 0
};

interface SkillImprovementProps {
  personalSkills: Skill[];
  targetSkills: Skill[];
}

export const SkillImprovement: React.FC<SkillImprovementProps> = ({ personalSkills, targetSkills }) => {
  const getImprovementNeeded = (skill: Skill) => {
    const targetSkill = targetSkills.find(ts => ts.name === skill.name);
    if (!targetSkill) return false;
    return LEVEL_VALUES[targetSkill.level] > LEVEL_VALUES[skill.level];
  };

  const getMissingSkills = () => {
    return targetSkills.filter(ts => !personalSkills.find(ps => ps.name === ts.name));
  };

  const handleViewCourses = (skillName: string) => {
    window.location.href = `/videos?keyword=${encodeURIComponent(skillName)}`;
  };

  const missingSkills = getMissingSkills();
  const skillsToImprove = personalSkills.filter(getImprovementNeeded);

  if (skillsToImprove.length === 0 && missingSkills.length === 0) {
    return (
      <div className="bg-green-900/20 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-green-400 mb-2">恭喜！</h3>
        <p className="text-green-200">你的技能水平已经完全满足目标岗位的要求</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/30 backdrop-blur-sm rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">技能提升建议</h2>
      <div className="space-y-8">
        {skillsToImprove.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-500 mb-4">需要提升的技能</h3>
            <div className="grid gap-4">
              {skillsToImprove.map(skill => {
                const targetSkill = targetSkills.find(ts => ts.name === skill.name);
                return (
                  <div key={skill.name} className="flex items-center gap-3 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 hover:from-indigo-800/40 hover:to-purple-800/40 transition-colors p-4 rounded-lg backdrop-blur-sm border border-indigo-700/30">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <SkillTag name={skill.name} level={skill.level} needsImprovement={true} />
                        <span className="text-amber-400 text-xl">→</span>
                        <SkillTag 
                          name={skill.name} 
                          level={targetSkill?.level || 'unknown'} 
                        />
                      </div>
                      <p className="text-sm text-gray-400">
                        建议：通过实践项目和深入学习，提升{skill.name}技能水平
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={`/${skill.name.toLowerCase()}`}
                        className="px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-200 rounded-md text-sm transition-colors whitespace-nowrap"
                      >
                        查看学习路线
                      </a>
                      <button
                        onClick={() => handleViewCourses(skill.name)}
                        className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-200 rounded-md text-sm transition-colors whitespace-nowrap"
                      >
                        查看相关课程
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {missingSkills.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-500 mb-4">需要学习的新技能</h3>
            <div className="grid gap-4">
              {missingSkills.map(skill => (
                <div key={skill.name} className="flex items-center gap-3 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 hover:from-indigo-800/40 hover:to-purple-800/40 transition-colors p-4 rounded-lg backdrop-blur-sm border border-indigo-700/30">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-amber-400 text-xl font-bold">+</span>
                      <SkillTag name={skill.name} level={skill.level} />
                    </div>
                    <p className="text-sm text-gray-400">
                      建议：从基础开始学习{skill.name}，循序渐进提升水平
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={`/${skill.name.toLowerCase()}`}
                      className="px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-200 rounded-md text-sm transition-colors whitespace-nowrap"
                    >
                      查看学习路线
                    </a>
                    <button
                      onClick={() => handleViewCourses(skill.name)}
                      className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-200 rounded-md text-sm transition-colors whitespace-nowrap"
                    >
                      查看相关课程
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 