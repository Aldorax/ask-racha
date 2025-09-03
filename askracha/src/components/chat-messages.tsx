"use client";

import { useRef, useEffect } from "react";
import { Bot, User, ExternalLink, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import type { Message } from "@/types/chat";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Define CodeProps locally — safe and clear
type CodeProps = {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
};

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {isLoading && <LoadingMessage />}
      <div ref={messagesEndRef} />
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.type === "user";
  const { theme } = useTheme();

  const getProseClasses = () => {
    const baseClasses =
      "prose prose-sm sm:prose-base max-w-none leading-relaxed";

    if (theme === "storacha") {
      return `${baseClasses} prose-storacha prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border/50`;
    } else if (theme === "dark") {
      return `${baseClasses} dark:prose-invert prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border/50`;
    } else {
      return `${baseClasses} prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border/50`;
    }
  };

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-4 duration-500`}
    >
      <div
        className={`max-w-[90%] sm:max-w-[80%] md:max-w-3xl rounded-lg p-4 lg:p-5 transition-colors ${isUser
          ? "bg-primary/90 text-primary-foreground ml-2 sm:ml-4 lg:ml-12 hover:bg-primary"
          : "bg-card text-card-foreground mr-2 sm:mr-4 lg:mr-12 border border-border/40"
          }`}
      >
        {/* Hover actions (Copy, Edit) - only for user messages */}
        {isUser && (
          <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-all duration-200 group-hover:opacity-100">
            <button
              onClick={() => navigator.clipboard.writeText(message.content)}
              className="p-1.5 rounded-md bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm transition-colors"
              title="Copy message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
            <button
              onClick={() => {/* Add edit functionality */ }}
              className="p-1.5 rounded-md bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm transition-colors"
              title="Edit message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex items-start gap-3 lg:gap-4">
          {/* Avatar */}
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isUser
              ? "bg-primary-foreground/10"
              : "bg-primary/90"
              }`}
          >
            {isUser ? (
              <User className="w-4 h-4 text-primary-foreground" />
            ) : (
              <Bot className="w-4 h-4 text-primary-foreground" />
            )}
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <div className={`${getProseClasses()} text-sm lg:text-base`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 mt-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-medium mb-2">{children}</h3>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-3 ml-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-3 ml-2">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  code: ({ inline, className, children }: CodeProps) => {
                    if (inline) {
                      return (
                        <code className="rounded-md border border-border/50 bg-secondary/50 px-1.5 py-0.5 text-sm font-medium">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className={className}>
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => {
                    let text = '';
                    const getText = (node: any): void => {
                      if (!node) return;
                      if (typeof node === 'string') text += node;
                      else if (Array.isArray(node)) node.forEach(getText);
                      else if (node.props) getText(node.props.children);
                    };
                    getText(children);

                    const handleCopy = () => {
                      navigator.clipboard.writeText(text).catch(console.error);
                    };

                    return (
                      <div className="group relative my-4">
                        <pre className="overflow-x-auto rounded-lg border border-border/50 bg-secondary/50 p-4 font-mono text-sm leading-relaxed shadow-sm">
                          {children}
                        </pre>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-xs rounded-md bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
                        >
                          Copy
                        </button>
                      </div>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>

            {/* Sources */}
            {message.sources && message.sources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/60">
                <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Sources:
                </p>
                <div className="space-y-2">
                  {message.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-md bg-muted hover:bg-muted/80 text-sm text-primary hover:text-primary/80 transition-colors border border-border hover:border-border/80"
                    >
                      <div className="font-medium">{source.title}</div>
                      <div className="text-xs text-muted-foreground mt-1 truncate">
                        {source.url}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="flex justify-start animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card text-card-foreground border border-border rounded-lg p-5 flex items-center gap-3 lg:gap-4 mr-4 lg:mr-12">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Thinking...</span>
        </div>
      </div>
    </div>
  );
}