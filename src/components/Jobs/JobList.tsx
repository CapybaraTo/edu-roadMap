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
    postDate: '2024-02-27'
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
    postDate: '2024-02-26'
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
    postDate: '2024-02-25'
  }
];

const SkillTag = ({ skill }: { skill: Skill }) => {
  const levelColors = {
    beginner: 'bg-green-900/40 text-green-100',
    intermediate: 'bg-blue-900/40 text-blue-100',
    expert: 'bg-purple-900/40 text-purple-100',
    unknown: 'bg-gray-900/40 text-gray-100'
  };

  const levelText = {
    beginner: '入门',
    intermediate: '熟练',
    expert: '精通',
    unknown: '未知'
  };

  return (
    <span
      className={`px-3 py-1 text-sm rounded-full ${levelColors[skill.level]} hover:bg-opacity-60 transition-colors flex items-center gap-1.5`}
    >
      <span>{skill.name}</span>
      <span className="text-xs px-1.5 py-0.5 rounded-full bg-black/20">
        {levelText[skill.level]}
      </span>
    </span>
  );
};

export function JobList() {
  const [jobs] = useState<Job[]>(mockJobs);

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="bg-slate-800/50 rounded-lg p-6 hover:bg-slate-800/70 transition-colors cursor-pointer border border-slate-700/50"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-2 hover:text-blue-400 transition-colors">
                {job.title}
              </h3>
              <div className="flex items-center text-gray-300 text-sm space-x-4">
                <span className="text-blue-300">{job.company}</span>
                <span>{job.location}</span>
                <span>{job.experience}</span>
                <span>{job.education}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-semibold text-green-400 mb-2">
                {job.salary}
              </div>
              <div className="text-sm text-gray-300">{job.postDate}</div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-200 text-sm line-clamp-2">
              {job.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <SkillTag key={skill.name} skill={skill} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 