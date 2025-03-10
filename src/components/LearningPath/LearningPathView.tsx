import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const LearningPathView: React.FC = () => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      securityLevel: 'loose',
      themeVariables: {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
        primaryColor: '#3B82F6',
        primaryTextColor: '#FFFFFF',
        primaryBorderColor: '#60A5FA',
        lineColor: '#60A5FA',
        secondaryColor: '#1E40AF',
        tertiaryColor: '#DBEAFE',
      }
    });

    const graph = `graph TD
    A1("1 React深度优化 (3周)") --> A2("2TypeScript类型工程 (3周)")
    A1 -.- A1a("Hooks源码解析")
    A1 -.- A1b("虚拟DOM优化策略")
    A1 -.- A1c("SSR实现原理")
    
    A2 --> A3("3 Node.js工程化 (4周)")
    A2 -.- A2a("Utility类型编程")
    A2 -.- A2b("装饰器类型化")
    A2 -.- A2c("TSX类型推导")
    
    A3 --> A4("4 全栈模式实战 (5周)")
    A3 -.- A3a("Express核心中间件")
    A3 -.- A3b("WebSocket集成")
    A3 -.- A3c("MySQL事务控制")
    
    A4 --> A5("5 架构设计强化 (4周)")
    A4 -.- A4a("微前端qiankun")
    A4 -.- A4b("GraphQL性能优化")
    A4 -.- A4c("Docker多阶段构建")
    
    A5 --> A6("6 企业级项目交付 (4周)")
    A5 -.- A5a("权限体系设计")
    A5 -.- A5b("监控埋点系统")
    A5 -.- A5c("CI/CD流水线")`;

    if (mermaidRef.current) {
      mermaidRef.current.innerHTML = graph;
      mermaid.contentLoaded();
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-8">
        <p className="text-gray-600 mb-4">
          基于你的当前技能水平和目标岗位要求，我们为你生成了个性化的学习路径
        </p>
      </div>
      
      <div className="min-h-[400px] bg-gray-50 rounded-lg p-4 overflow-auto">
        <div ref={mermaidRef} className="mermaid flex justify-center"></div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">学习建议</h3>
        <ul className="space-y-4">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">1</span>
            <div>
              <h4 className="font-medium">专注核心技能</h4>
              <p className="text-gray-600">优先提升与目标岗位要求差距较大的关键技能</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">2</span>
            <div>
              <h4 className="font-medium">循序渐进</h4>
              <p className="text-gray-600">按照推荐的学习顺序，确保基础知识扎实</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">3</span>
            <div>
              <h4 className="font-medium">实践项目</h4>
              <p className="text-gray-600">通过实际项目来巩固和应用所学知识</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LearningPathView; 