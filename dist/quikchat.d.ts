/**
 * QuikChat - Zero-dependency JavaScript chat widget
 * TypeScript definitions for v1.1.15
 */

declare module 'quikchat' {
  export default class QuikChat {
    /**
     * Creates a new QuikChat instance
     * @param element - DOM element selector or element to attach chat to
     * @param onSend - Callback function when user sends a message
     * @param options - Configuration options
     */
    constructor(
      element: string | HTMLElement,
      onSend?: (instance: QuikChat, message: string) => void,
      options?: QuikChatOptions
    );

    // Message Management
    messageAddFull(options: MessageOptions): number;
    messageAddNew(
      content: string,
      userString?: string,
      align?: 'left' | 'right' | 'center',
      role?: string,
      scrollIntoView?: boolean | 'smart',
      visible?: boolean,
      tags?: string[]
    ): number;
    messageRemove(msgId: number): boolean;
    messageRemoveLast(): boolean;
    messageAppendContent(msgId: number, content: string): boolean;
    messageReplaceContent(msgId: number, content: string): boolean;
    messageGetContent(msgId: number): string;
    messageGetDOMObject(msgId: number): HTMLElement | null;
    messageGetContentDOMElement(msgId: number): HTMLElement | null;
    messageScrollToBottom(): void;
    messageSetVisibility(msgId: number, visible: boolean): boolean;
    messageGetVisibility(msgId: number): boolean;

    // Title Area
    titleAreaShow(): void;
    titleAreaHide(): void;
    titleAreaToggle(): void;
    titleAreaSetContents(content: string, align?: 'left' | 'right' | 'center'): void;
    titleAreaGetContents(): string;

    // Input Area  
    inputAreaShow(): void;
    inputAreaHide(): void;
    inputAreaToggle(): void;

    // Messages Area
    messagesAreaAlternateColors(enable?: boolean): boolean;
    messagesAreaAlternateColorsToggle(): void;
    messagesAreaAlternateColorsGet(): boolean;

    // History Management
    historyGet(start?: number, end?: number): HistoryMessage[];
    historyGetAllCopy(): HistoryMessage[];
    historyGetPage(page?: number, pageSize?: number, order?: 'asc' | 'desc'): HistoryPage;
    historySearch(filters?: SearchFilters): HistoryMessage[];
    historyGetInfo(pageSize?: number): HistoryInfo;
    historyClear(): void;
    historyGetLength(): number;
    historyGetMessage(index: number): HistoryMessage | {};
    historyGetMessageContent(index: number): string;
    historyRestoreAll(messages: HistoryMessage[]): void;

    // Callbacks
    setCallbackOnSend(callback: (instance: QuikChat, message: string) => void): void;
    setCallbackonMessageAdded(callback: (instance: QuikChat, msgId: number) => void): void;
    setCallbackonMessageAppend(callback: (instance: QuikChat, msgId: number, content: string) => void): void;
    setCallbackonMessageReplace(callback: (instance: QuikChat, msgId: number, content: string) => void): void;
    setCallbackonMessageDelete(callback: (instance: QuikChat, msgId: number) => void): void;

    // Theming
    changeTheme(theme: string): void;
    readonly theme: string;

    // Tag Management
    setTagVisibility(tag: string, visible: boolean): boolean;
    getTagVisibility(tag: string): boolean;
    getActiveTags(): string[];

    // Static Methods
    static version(): VersionInfo;
    static loremIpsum(length?: number, offset?: number, capitalize?: boolean): string;
    static tempMessageGenerator(
      element: string | HTMLElement,
      initialMessage: string,
      interval: number,
      callback?: (message: string, count: number) => string
    ): void;
    static createTempMessageDOMStr(
      initialMessage: string,
      interval?: number,
      callback?: (message: string, count: number) => string,
      options?: { containerClass?: string }
    ): string;

    // Properties
    sendOnEnter: boolean;
    sendOnShiftEnter: boolean;
    trackHistory: boolean;
    userScrolledUp: boolean;
    msgid: number;
  }

  export interface QuikChatOptions {
    theme?: string;
    trackHistory?: boolean;
    titleArea?: {
      title?: string;
      show?: boolean;
      align?: 'left' | 'right' | 'center';
    };
    messagesArea?: {
      alternating?: boolean;
    };
    inputArea?: {
      show?: boolean;
    };
    sendOnEnter?: boolean;
    sendOnShiftEnter?: boolean;
    instanceClass?: string;
  }

  export interface MessageOptions {
    content: string;
    userString?: string;
    align?: 'left' | 'right' | 'center';
    role?: string;
    userID?: number;
    timestamp?: string | false;
    updatedtime?: string | false;
    scrollIntoView?: boolean | 'smart';
    visible?: boolean;
    tags?: string[];
  }

  export interface HistoryMessage extends MessageOptions {
    msgid: number;
    messageDiv?: HTMLElement;
  }

  export interface HistoryPage {
    messages: HistoryMessage[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalPages: number;
      totalMessages: number;
      hasNext: boolean;
      hasPrevious: boolean;
      order: 'asc' | 'desc';
    };
  }

  export interface SearchFilters {
    text?: string;
    userString?: string;
    role?: string;
    tags?: string[];
    limit?: number;
  }

  export interface HistoryInfo {
    totalMessages: number;
    totalPages: number;
    oldestMessage: {
      msgid: number;
      timestamp: string;
      userString: string;
    } | null;
    newestMessage: {
      msgid: number;
      timestamp: string;
      userString: string;
    } | null;
    memoryUsage: {
      estimatedSize: number;
      averageMessageSize: number;
    };
  }

  export interface VersionInfo {
    version: string;
    license: string;
    url: string;
    fun: boolean;
  }
}