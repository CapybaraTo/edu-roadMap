import { useEffect, useMemo, useRef, useState } from 'react';
import { useKeydown } from '../../hooks/use-keydown';
import { useLoadTopic } from '../../hooks/use-load-topic.ts';   // 监听roadmap.topic.click 和 roadmap.node.click 事件
import { useOutsideClick } from '../../hooks/use-outside-click';
import { useToggleTopic } from '../../hooks/use-toggle-topic.ts';
import { httpGet } from '../../lib/http';
import { isLoggedIn } from '../../lib/jwt';
import type { ResourceType } from '../../lib/resource-progress';
import {
  isTopicDone,
  refreshProgressCounters,
  renderTopicProgress,
  updateResourceProgress as updateResourceProgressApi,
} from '../../lib/resource-progress';
import { pageProgressMessage } from '../../stores/page';
import { TopicProgressButton } from './TopicProgressButton.tsx';   // 主题进展的按钮 
import { showLoginPopup } from '../../lib/popup.ts';
import { useToast } from '../../hooks/use-toast';
import type {
  AllowedLinkTypes,
  RoadmapContentDocument,
} from '../CustomRoadmap/CustomRoadmap.tsx';
import { markdownToHtml, sanitizeMarkdown } from '../../lib/markdown.ts';
import { cn } from '../../lib/classname.ts';
import {
  Ban,
  ExternalLink,
  ExternalLinkIcon,
  FileText,
  HeartHandshake,
  X,
} from 'lucide-react';
import { getUrlParams, parseUrl } from '../../lib/browser';
import { Spinner } from '../ReactIcons/Spinner';
// import { GitHubIcon } from '../ReactIcons/GitHubIcon.tsx';
import { GoogleIcon } from '../ReactIcons/GoogleIcon.tsx';
import { ResourceListSeparator } from './ResourceListSeparator.tsx';
import { TopicDetailLink } from './TopicDetailLink.tsx';


type TopicDetailProps = {
  resourceId?: string;
  resourceTitle?: string;
  resourceType?: ResourceType;

  isEmbed?: boolean;
  canSubmitContribution: boolean;
};

// const linkTypes: Record<AllowedLinkTypes, string> = {
//   article: 'bg-yellow-300',
//   course: 'bg-green-400',
//   opensource: 'bg-black text-white',
//   'roadmap.sh': 'bg-black text-white',
//   roadmap: 'bg-black text-white',
//   podcast: 'bg-purple-300',
//   video: 'bg-purple-300',
//   website: 'bg-blue-300',
//   official: 'bg-blue-600 text-white',
// };

export function TopicDetail(props: TopicDetailProps) {
  const { canSubmitContribution, isEmbed = false, resourceTitle } = props;

  const [hasEnoughLinks, setHasEnoughLinks] = useState(false);
  const [contributionUrl, setContributionUrl] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const [error, setError] = useState('');
  const [topicHtml, setTopicHtml] = useState('');
  const [hasContent, setHasContent] = useState(false);
  const [topicTitle, setTopicTitle] = useState('');
  const [topicHtmlTitle, setTopicHtmlTitle] = useState('');
  const [links, setLinks] = useState<RoadmapContentDocument['links']>([]);
  const toast = useToast();

  const { secret } = getUrlParams() as { secret: string };
  const isGuest = useMemo(() => !isLoggedIn(), []);
  const topicRef = useRef<HTMLDivElement>(null);

  // Details of the currently loaded topic
  const [topicId, setTopicId] = useState('');
  const [resourceId, setResourceId] = useState('');
  const [resourceType, setResourceType] = useState<ResourceType>('roadmap');

  // 点击外部空白 关闭侧边栏
  useOutsideClick(topicRef, () => {
    setIsActive(false);
  });

  useKeydown('Escape', () => {
    setIsActive(false);
  });

  useToggleTopic(({ topicId, resourceType, resourceId }) => {
    if (isGuest) {
      showLoginPopup();
      return;
    }

    pageProgressMessage.set('Updating');

    // Toggle the topic status
    isTopicDone({ topicId, resourceId, resourceType })
      .then((oldIsDone) =>
        updateResourceProgressApi(
          {
            topicId,
            resourceId,
            resourceType,
          },
          oldIsDone ? 'pending' : 'done',
        ),
      )
      .then(({ done = [] }) => {
        renderTopicProgress(
          topicId,
          done.includes(topicId) ? 'done' : 'pending',
        );
        refreshProgressCounters();
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      })
      .finally(() => {
        pageProgressMessage.set('');
      });
  });

  // Load the topic detail when the topic detail is active
  useLoadTopic(({ topicId, resourceType, resourceId }) => {
    setError('');
    setIsLoading(true);
    setIsActive(true);

    setTopicId(topicId);
    setResourceType(resourceType);
    setResourceId(resourceId);

    const topicPartial = topicId.replaceAll(':', '/');
    let topicUrl =
      resourceType === 'roadmap'
        ? `/${resourceId}/${topicPartial}`
        : `/best-practices/${resourceId}/${topicPartial}`;

    httpGet<string | RoadmapContentDocument>(
      topicUrl,
      {},
      {
        ...{
          headers: {
            Accept: 'text/html',
          },
        },
      },
    )
      .then(({ response }) => {
        if (!response) {
          setError('Topic not found.');
          setIsLoading(false);
          return;
        }
        let topicHtml = '';
        if (true) {    // 
          const topicDom = new DOMParser().parseFromString(
            response as string,
            'text/html',
          );

          const links = topicDom.querySelectorAll('a');
          const urlElem: HTMLElement =
            topicDom.querySelector('[data-github-url]')!;
          const contributionUrl = urlElem?.dataset?.githubUrl || '';

          const titleElem: HTMLElement = topicDom.querySelector('h1')!;

          const otherElems = topicDom.querySelectorAll('body > *:not(h1, div)');

          const listLinks = Array.from(topicDom.querySelectorAll('ul > li > a'))
            .map((link, counter) => {
              const typePattern = /@([a-z]+)@/;
              let linkText = link.textContent || '';
              const linkHref = link.getAttribute('href') || '';
              const linkType = linkText.match(typePattern)?.[1] || 'article';
              linkText = linkText.replace(typePattern, '');

              return {
                id: `link-${linkHref}-${counter}`,
                title: linkText,
                url: linkHref,
                type: linkType as AllowedLinkTypes,
              };
            })
            .sort((a, b) => {
              // official at the top
              // opensource at second
              // article at third
              // videos at fourth
              // rest at last
              const order = ['official', 'opensource', 'article', 'video'];
              return order.indexOf(a.type) - order.indexOf(b.type);
            });

          const lastUl = topicDom.querySelector('ul:last-child');
          if (lastUl) {
            lastUl.remove();
          }

          topicHtml = topicDom.body.innerHTML;

          setLinks(listLinks);
          setHasContent(otherElems.length > 0);
          setContributionUrl(contributionUrl);
          setHasEnoughLinks(links.length >= 3);
          setTopicHtmlTitle(titleElem?.textContent || '');
        } else {
          setLinks((response as RoadmapContentDocument)?.links || []);
          setTopicTitle((response as RoadmapContentDocument)?.title || '');

          const sanitizedMarkdown = sanitizeMarkdown(
            (response as RoadmapContentDocument).description || '',
          );

          setHasContent(sanitizedMarkdown?.length > 0);
          topicHtml = markdownToHtml(sanitizedMarkdown, false);
        }

        setIsLoading(false);
        setTopicHtml(topicHtml);
      })
      .catch((err) => {
        setError('Something went wrong. Please try again later.');
        setIsLoading(false);
      });
  });

  useEffect(() => {
    if (isActive) topicRef?.current?.focus();
  }, [isActive]);

  if (!isActive) {
    return null;
  }

  const resourceTitleForSearch = resourceTitle
    ?.toLowerCase()
    ?.replace(/\s+?roadmap/gi, '');
  const googleSearchUrl = `https://www.google.com/search?q=${topicHtmlTitle?.toLowerCase()} guide for ${resourceTitleForSearch}`;
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${topicHtmlTitle?.toLowerCase()} for ${resourceTitleForSearch}`;

  const tnsLink =
    'https://thenewstack.io/devops/?utm_source=roadmap.sh&utm_medium=Referral&utm_campaign=Topic';

  return (
    <div className={'relative z-[90]'}>
      <div
        ref={topicRef}
        tabIndex={0}
        className="fixed right-0 top-0 z-40 flex h-screen w-full flex-col overflow-y-auto bg-white p-4 focus:outline-0 sm:max-w-[600px] sm:p-6"
      >
        {isLoading && (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner
              outerFill="#d1d5db"
              className="h-6 w-6 sm:h-8 sm:w-8"
              innerFill="#2563eb"
              isDualRing={false}
            />
          </div>
        )}

        {!isContributing && !isLoading && !error && (
          <>
            <div className="flex-1">
              {/* Actions for the topic */}
              <div className="mb-2">
                {!isEmbed && (
                  <TopicProgressButton
                    topicId={
                      topicId.indexOf('@') !== -1
                        ? topicId.split('@')[1]
                        : topicId
                    }
                    resourceId={resourceId}
                    resourceType={resourceType}
                    onClose={() => {
                      setIsActive(false);
                    }}
                  />
                )}

                <button
                  type="button"
                  id="close-topic"
                  className="absolute right-2.5 top-2.5 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
                  onClick={() => {
                    setIsActive(false);
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Topic Content */}
              {hasContent ? (
                <>
                  <div className="prose prose-quoteless prose-h1:mb-2.5 prose-h1:mt-7 prose-h1:text-balance prose-h2:mb-3 prose-h2:mt-0 prose-h3:mb-[5px] prose-h3:mt-[10px] prose-p:mb-2 prose-p:mt-0 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-gray-700 prose-li:m-0 prose-li:mb-0.5">
                    {topicTitle && <h1>{topicTitle}</h1>}
                    <div
                      id="topic-content"
                      dangerouslySetInnerHTML={{ __html: topicHtml }}
                    />
                  </div>
                </>
              ) : (
                <>
                  {!canSubmitContribution && (
                    <div className="flex h-[calc(100%-38px)] flex-col items-center justify-center">
                      <FileText className="h-16 w-16 text-gray-300" />
                      <p className="mt-2 text-lg font-medium text-gray-500">
                        空白内容
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Contribution */}
            </div>
          </>
        )}

        
      { links.length > 0 && (
        <>
          <ResourceListSeparator
            text="Free Resources"
            className="text-green-600"
            icon={HeartHandshake}
          />
          <ul className="ml-3 mt-4 space-y-1">
            {links.map((link) => {
              return (
                <li key={link.id}>
                  <TopicDetailLink
                    url={link.url}
                    type={link.type}
                    title={link.title}
                    onClick={() => {
                      // if it is one of our roadmaps, we want to track the click
                      if (canSubmitContribution) {
                        const parsedUrl = parseUrl(link.url);

                        window.fireEvent({
                          category: 'TopicResourceClick',
                          action: `Click: ${parsedUrl.hostname}`,
                          label: `${resourceType} / ${resourceId} / ${topicId} / ${link.url}`,
                        });
                      }
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </>
      )}

        {/* Error */}
        {!isContributing && !isLoading && error && (
          <>
            <button
              type="button"
              id="close-topic"
              className="absolute right-2.5 top-2.5 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
              onClick={() => {
                setIsActive(false);
                setIsContributing(false);
              }}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex h-full flex-col items-center justify-center">
              <Ban className="h-16 w-16 text-red-500" />
              <p className="mt-2 text-lg font-medium text-red-500">{error}</p>
            </div>
          </>
        )}
      </div>
      <div className="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"></div>
    </div>
  );
}
