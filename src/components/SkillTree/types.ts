export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'expert' | 'unknown';
  category: string;
}

export interface SkillTagProps {
  name: string;
  level: Skill['level'];
  showLevel?: boolean;
  needsImprovement?: boolean;
} 