import { useState } from 'react';

interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'expert' | 'unknown';
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  experience: string;
  education: string;
  skills: Skill[];
  description: string;
  postDate: string;
  matchScore?: number; // 技能匹配度
}

// 模拟数据 - 实际应用中应该从API获取
const mockJobs: Job[] = [
  {
    id: '1',
    title: '高级前端开发工程师',
    company: '字节跳动',
    location: '北京',
    salary: '30k-50k',
    experience: '3-5年',
    education: '本科及以上',
    skills: [
      { name: 'React', level: 'expert' },
      { name: 'TypeScript', level: 'expert' },
      { name: 'Node.js', level: 'intermediate' },
      { name: 'Webpack', level: 'intermediate' }
    ],
    description: '负责字节跳动核心业务的前端开发工作，参与技术方案设计与架构优化。',
    postDate: '2024-02-27',
    matchScore: 95
  },
  {
    id: '2',
    title: '全栈开发工程师',
    company: '腾讯',
    location: '深圳',
    salary: '25k-45k',
    experience: '1-3年',
    education: '本科及以上',
    skills: [
      { name: 'Vue.js', level: 'intermediate' },
      { name: 'Python', level: 'intermediate' },
      { name: 'Django', level: 'beginner' },
      { name: 'MySQL', level: 'beginner' }
    ],
    description: '负责腾讯云产品的全栈开发，参与产品的技术选型和架构设计。',
    postDate: '2024-02-26',
    matchScore: 85
  },
  {
    id: '3',
    title: '资深Java开发工程师',
    company: '阿里巴巴',
    location: '杭州',
    salary: '35k-55k',
    experience: '5-10年',
    education: '本科及以上',
    skills: [
      { name: 'Java', level: 'expert' },
      { name: 'Spring Boot', level: 'expert' },
      { name: 'MySQL', level: 'intermediate' },
      { name: 'Redis', level: 'intermediate' }
    ],
    description: '负责电商核心系统的开发与优化，解决高并发、大数据量的技术挑战。',
    postDate: '2024-02-25',
    matchScore: 75
  }
];

const MatchScore = ({ score }: { score: number }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 80) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getScoreText = (score: number) => {
    if (score >= 90) return '极高匹配';
    if (score >= 80) return '高度匹配';
    if (score >= 70) return '良好匹配';
    return '基础匹配';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`px-3 py-1 rounded-full border ${getScoreColor(score)} flex items-center gap-2`}>
        <span className="text-sm font-medium">{getScoreText(score)}</span>
        <span className="text-xs font-bold">{score}%</span>
      </div>
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${score >= 90 ? 'bg-green-500' : score >= 80 ? 'bg-blue-500' : 'bg-yellow-500'}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

const SkillTag = ({ skill, userSkillLevel }: { skill: Skill; userSkillLevel?: string }) => {
  const levelColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-blue-100 text-blue-800',
    expert: 'bg-purple-100 text-purple-800',
    unknown: 'bg-gray-100 text-gray-800'
  };

  const levelText = {
    beginner: '入门',
    intermediate: '熟练',
    expert: '精通',
    unknown: '未知'
  };

  const isMatch = userSkillLevel && userSkillLevel === skill.level;

  return (
    <span
      className={`px-3 py-1 text-sm rounded-full ${levelColors[skill.level]} hover:bg-opacity-80 transition-colors flex items-center gap-1.5 ${
        isMatch ? 'ring-2 ring-green-400 ring-offset-2' : ''
      }`}
    >
      <span>{skill.name}</span>
      <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/20">
        {levelText[skill.level]}
      </span>
      {userSkillLevel && (
        <span className={`text-xs ${isMatch ? 'text-green-600' : 'text-orange-600'}`}>
          {isMatch ? '技能匹配' : `你的水平: ${levelText[userSkillLevel as keyof typeof levelText]}`}
        </span>
      )}
    </span>
  );
};

const SkillAnalysis = ({ skills, userSkills }: { skills: Skill[]; userSkills: Record<string, string> }) => {
  const analysis = {
    matched: 0,
    higher: 0,
    lower: 0,
    missing: 0
  };

  const skillLevels: Record<Exclude<Skill['level'], 'unknown'>, number> = {
    beginner: 1,
    intermediate: 2,
    expert: 3
  };

  skills.forEach(skill => {
    const userLevel = userSkills[skill.name];
    if (!userLevel || skill.level === 'unknown' || !skillLevels[skill.level]) {
      analysis.missing++;
    } else {
      const jobLevel = skillLevels[skill.level];
      const userLevelNum = skillLevels[userLevel as keyof typeof skillLevels];
      if (jobLevel === userLevelNum) {
        analysis.matched++;
      } else if (userLevelNum > jobLevel) {
        analysis.higher++;
      } else {
        analysis.lower++;
      }
    }
  });

  const totalSkills = skills.length;
  const matchPercentage = Math.round(((analysis.matched + analysis.higher) / totalSkills) * 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">技能掌握度</span>
          <span className="text-xs text-gray-500">({totalSkills}项技能要求)</span>
        </div>
        <span className="text-lg font-bold text-blue-600">{matchPercentage}%</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="flex flex-col items-center rounded-lg bg-green-50 p-2">
          <span className="text-sm font-bold text-green-600">{analysis.matched}</span>
          <span className="text-xs text-gray-600">完全匹配</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-blue-50 p-2">
          <span className="text-sm font-bold text-blue-600">{analysis.higher}</span>
          <span className="text-xs text-gray-600">技能超过</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-yellow-50 p-2">
          <span className="text-sm font-bold text-yellow-600">{analysis.lower}</span>
          <span className="text-xs text-gray-600">技能不足</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-gray-50 p-2">
          <span className="text-sm font-bold text-gray-600">{analysis.missing}</span>
          <span className="text-xs text-gray-600">未掌握</span>
        </div>
      </div>
    </div>
  );
};

interface JobListProps {
  isRecommended?: boolean;
}

export function JobList({ isRecommended = false }: JobListProps) {
  const [jobs] = useState<Job[]>(mockJobs);

  // 模拟用户技能数据 - 实际应用中应该从API获取
  const mockUserSkills: Record<string, string> = {
    'React': 'expert',
    'TypeScript': 'expert',
    'Node.js': 'intermediate',
    'Vue.js': 'intermediate',
    'Python': 'beginner',
    'Java': 'beginner'
  };

  // 如果是推荐列表，只显示匹配度高的前2个岗位
  const displayJobs = isRecommended 
    ? jobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)).slice(0, 2)
    : jobs;

  return (
    <div className="space-y-4">
      {displayJobs.map((job) => (
        <div
          key={job.id}
          className={`bg-gradient-to-r from-white via-gray-50 to-gray-100 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer border ${
            isRecommended ? 'border-blue-200 hover:border-blue-300' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                {job.title}
              </h3>
              <div className="flex items-center text-gray-600 text-sm space-x-4">
                <span className="text-blue-600 font-medium">{job.company}</span>
                <span>{job.location}</span>
                <span>{job.experience}</span>
                <span>{job.education}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-semibold text-green-600 mb-2">
                {job.salary}
              </div>
              <div className="text-sm text-gray-500">{job.postDate}</div>
            </div>
          </div>

          {isRecommended && job.matchScore && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">岗位匹配分析</span>
                <MatchScore score={job.matchScore} />
              </div>
              <SkillAnalysis skills={job.skills} userSkills={mockUserSkills} />
              <div className="mt-2 text-xs text-gray-500">
                基于你的技能树分析，该职位与你的技能高度匹配。建议重点关注此岗位。
              </div>
            </div>
          )}

          <div className="mb-4">
            <p className="text-gray-600 text-sm line-clamp-2">
              {job.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <SkillTag 
                key={skill.name} 
                skill={skill} 
                userSkillLevel={isRecommended ? mockUserSkills[skill.name] : undefined}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 