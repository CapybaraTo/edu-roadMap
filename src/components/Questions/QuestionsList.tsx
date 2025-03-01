// 答题界面
import { useEffect, useRef, useState } from 'react';
import { QuestionsProgress } from './QuestionsProgress.tsx';
import { CheckCircle, SkipForward, Sparkles } from 'lucide-react';
import { QuestionCard } from './QuestionCard.tsx';
import { QuestionLoader } from './QuestionLoader.tsx';
import { isLoggedIn } from '../../lib/jwt';
import type { QuestionType } from '../../lib/question-group';
import { httpGet, httpPut, httpPost } from '../../lib/http';
import { useToast } from '../../hooks/use-toast';
import { QuestionFinished } from './QuestionFinished.tsx';
import { Confetti } from '../Confetti';   // 一个布局组件
import { getUser } from '../../lib/jwt.ts'; 


// know状态列表   dontkow状态列表  skip状态下的题目列表
// 后端传过来的数据 格式
type UserQuestionProgress = {
  know: string[];
  dontKnow: string[];
  skip: string[];
};

export type QuestionProgressType = keyof UserQuestionProgress;

type QuestionsListProps = {
  groupId: string;
  questions: QuestionType[];
};

export function QuestionsList(props: QuestionsListProps) {
  const { questions: defaultQuestions, groupId } = props;
  const toast = useToast();
  const [questions, setQuestions] = useState(defaultQuestions);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currQuestionIndex, setCurrQuestionIndex] = useState(0);
  const [userProgress, setUserProgress] = useState<UserQuestionProgress>();
  const containerRef = useRef<HTMLDivElement>(null);

  async function fetchUserProgress(): Promise<
    UserQuestionProgress | undefined
  > {
    if (!isLoggedIn()) {
      return;
    }
    const userId = getUser()?.id;
    // 获取用户答题进展   得到三种状态的题目列表
    const { response, error } = await httpPost<UserQuestionProgress>(
      `${import.meta.env.PUBLIC_API_URL}/question/get-question-progress`,{
        userId,
        groupId
      }
    );
    if (error) {
      toast.error(error.message || 'Error fetching user progress');
      return;
    }
    return response;
  }

  async function prepareProgress() {
    // 发送后端请求fetchUserProgress 获取用户答题情况  结果放入userProgress
    const userProgress = await fetchUserProgress();
    setUserProgress(userProgress);
    const knownQuestions = userProgress?.know || [];
    const didNotKnowQuestions = userProgress?.dontKnow || [];
    const skipQuestions = userProgress?.skip || [];
    const pendingQuestionIndex = questions.findIndex((question) => {
      return (
        !knownQuestions.includes(question.id) &&
        !didNotKnowQuestions.includes(question.id) &&
        !skipQuestions.includes(question.id)
      );
    });
    setCurrQuestionIndex(pendingQuestionIndex);
    setIsLoading(false);
  }

  // 重置答题情况
  async function resetProgress() {
    let knownQuestions = userProgress?.know || [];
    let didNotKnowQuestions = userProgress?.dontKnow || [];
    let skipQuestions = userProgress?.skip || [];
    const userId = getUser()?.id;
    if (!isLoggedIn()) {
      setQuestions(defaultQuestions);
      knownQuestions = [];
      didNotKnowQuestions = [];
      skipQuestions = [];
    } else {
      setIsLoading(true);
      // 重置答题情况
      const { response, error } = await httpPut<UserQuestionProgress>(
        `${
          import.meta.env.PUBLIC_API_URL
        // }/v1-reset-question-progress/${groupId}`,
        }/question/reset-question-progress`,
        {
          userId,
          groupId
          // status: 'reset',
        },
      );
      if (error) {
        toast.error(error.message || 'Error resetting progress');
        return;
      }
      knownQuestions = response?.know || [];
      didNotKnowQuestions = response?.dontKnow || [];
      skipQuestions = response?.skip || [];
    }
    setCurrQuestionIndex(0);
    setUserProgress({
      know: knownQuestions,
      dontKnow: didNotKnowQuestions,
      skip: skipQuestions,
    });
    setIsLoading(false);
  }

  // 更新用户答题情况
  async function updateQuestionStatus(
    status: QuestionProgressType,
    questionId: string,
  ) {
    setIsLoading(true);
    let newProgress = userProgress || { know: [], dontKnow: [], skip: [] };
    if (!isLoggedIn()) {
      if (status === 'know') {
        newProgress.know.push(questionId);
      } else if (status == 'dontKnow') {
        newProgress.dontKnow.push(questionId);
      } else if (status == 'skip') {
        newProgress.skip.push(questionId);
      }
    } else {
      // 前端发送status questionId  questionGroupId
      const userId = getUser()?.id;
      const { response, error } = await httpPut<UserQuestionProgress>(
        `${
          import.meta.env.PUBLIC_API_URL
        }/question/update-question-status`,
        {
          userId,
          groupId,
          questionId,
          status
        },
      );
      if (error || !response) {
        toast.error(error?.message || 'Error marking question status');
        return;
      }
      newProgress = response;
    }
    // 跳转下一个题目
    const nextQuestionIndex = currQuestionIndex + 1;
    setUserProgress(newProgress);
    setIsLoading(false);
    if (!nextQuestionIndex || !questions[nextQuestionIndex]) {
      setShowConfetti(true);
    }
    setCurrQuestionIndex(nextQuestionIndex);
  }

  // 挂载时提前加载用户进度数据
  useEffect(() => {
    prepareProgress().then(() => null);
  }, [questions]);

  const knowCount = userProgress?.know.length || 0;
  const dontKnowCount = userProgress?.dontKnow.length || 0;
  const skipCount = userProgress?.skip.length || 0;
  const hasProgress = knowCount > 0 || dontKnowCount > 0 || skipCount > 0;
  const currQuestion = questions[currQuestionIndex];
  const hasFinished = !isLoading && hasProgress && currQuestionIndex === -1;
  return (
    <div className="mb-0 gap-3 text-center sm:mb-40">
      <QuestionsProgress
        knowCount={knowCount}
        didNotKnowCount={dontKnowCount}
        skippedCount={skipCount}
        totalCount={questions?.length}
        isLoading={isLoading}
        showLoginAlert={!isLoggedIn() && hasProgress}
        onResetClick={() => {
          resetProgress().finally(() => null);
        }}
        onNextClick={() => {
          if (
            currQuestionIndex !== -1 &&
            currQuestionIndex < questions.length - 1
          ) {
            updateQuestionStatus('skip', currQuestion.id).finally(() => null);
          }
        }}
        onPrevClick={() => {
          if (currQuestionIndex > 0) {
            const prevQuestion = questions[currQuestionIndex - 1];
            // remove last question from the progress of the user
            const tempUserProgress = {
              know:
                userProgress?.know.filter((id) => id !== prevQuestion.id) || [],
              dontKnow:
                userProgress?.dontKnow.filter((id) => id !== prevQuestion.id) ||
                [],
              skip:
                userProgress?.skip.filter((id) => id !== prevQuestion.id) || [],
            };

            setUserProgress(tempUserProgress);
            setCurrQuestionIndex(currQuestionIndex - 1);
          }
        }}
      />

      {showConfetti && containerRef.current && (
        <Confetti
          pieces={100}
          element={containerRef.current}
          onDone={() => {
            setShowConfetti(false);
          }}
        />
      )}

      <div
        ref={containerRef}
        className="relative mb-4 flex min-h-[250px] w-full overflow-hidden rounded-lg border border-gray-300 bg-white sm:min-h-[400px]"
      >
        {hasFinished && (
          <QuestionFinished
            totalCount={questions?.length || 0}
            knowCount={knowCount}
            didNotKnowCount={dontKnowCount}
            skippedCount={skipCount}
            onReset={() => {
              resetProgress().finally(() => null);
            }}
          />
        )}
        {/* 做过的不出现？ */}
        {!isLoading && currQuestion && <QuestionCard question={currQuestion} />}
        {isLoading && <QuestionLoader />}
      </div>

      <div
        className={`flex flex-col gap-1 transition-opacity duration-300 sm:flex-row sm:gap-3 ${
          hasFinished ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <button
          disabled={isLoading || !currQuestion}
          onClick={(e) => {
            e.stopPropagation();  // 阻止冒泡
            e.preventDefault();   // 组织默认事件
            updateQuestionStatus('know', currQuestion.id).finally(() => null);
          }}
          className="flex flex-1 items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm text-black transition-colors hover:border-black hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-50 sm:rounded-lg sm:px-4 sm:py-3 sm:text-base"
        >
          <CheckCircle className="mr-1 h-4 text-current" />
          我知道
        </button>
        <button
          onClick={() => {
            updateQuestionStatus('dontKnow', currQuestion.id).finally(
              () => null,
            );
          }}
          disabled={isLoading || !currQuestion}
          className="flex flex-1 items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm text-black transition-colors hover:border-black hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-50 sm:rounded-lg sm:px-4 sm:py-3 sm:text-base"
        >
          <Sparkles className="mr-1 h-4 text-current" />
          不清楚
        </button>
        <button
          onClick={() => {
            updateQuestionStatus('skip', currQuestion.id).finally(() => null);
          }}
          disabled={isLoading || !currQuestion}
          data-next-question="skip"
          className="flex flex-1 items-center rounded-md border border-red-600 px-2 py-2 text-sm text-red-600 hover:bg-red-600 hover:text-white disabled:pointer-events-none disabled:opacity-50 sm:rounded-lg sm:px-4 sm:py-3 sm:text-base"
        >
          <SkipForward className="mr-1 h-4" />
          跳过
        </button>
      </div>
    </div>
  );
}
