import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Chat, GroundingChunk } from "@google/genai";

// --- TYPES ---
type Language = 'sorani' | 'badini';
type Mode = 'chat' | 'image' | 'search';
type MessagePart = {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
  groundingChunks?: GroundingChunk[];
};
type ChatMessage = {
  role: 'user' | 'model' | 'system';
  parts: MessagePart[];
  timestamp: number;
};
type ChatConversation = {
    id: string;
    title: string;
    messages: ChatMessage[];
};
type AllChats = Record<string, ChatConversation>;


// --- TRANSLATIONS ---
const translations = {
  sorani: {
    // Header
    title: "KURD AI",
    // Sidebar
    history: "تۆمارەکان",
    newChat: "چاتی نوێ",
    newChatTitle: "چاتی نوێ",
    // Input Bar
    placeholder: "دەربارەی هەر شتێک بپرسە...",
    imageModePlaceholder: "وەسفی ئەو وێنەیە بکە کە دەتەوێت دروستی بکەیت...",
    searchModePlaceholder: "پرسیارێک بکە بۆ گەڕان لە وێبدا...",
    // Tooltips
    imageModeTooltip: "دروستکردنی وێنە",
    searchModeTooltip: "گەڕانی وێب",
    uploadImageTooltip: "هاوپێچکردن",
    sendMessageTooltip: "نامە بنێرە",
    // Attachment Menu
    uploadImages: "وێنەکان",
    uploadText: "دەق",
    uploadDocument: "بەڵگەنامە",
    // Chat Window
    welcomeMessage: "سڵاو! من KURD AIـم. چۆن دەتوانم یارمەتیت بدەم ئەمڕۆ؟",
    typing: "...دەنوسێت",
    // Citations
    citationsHeader: "سەرچاوەکان:",
    // Errors
    errorPrompt: "تکایە شتێک بنووسە پێش ناردن.",
    errorGeneric: "هەڵەیەک ڕوویدا: ",
    errorNoImage: "نەتوانرا وێنەکە دروست بکرێت. تکایە دووبارە هەوڵبدەرەوە.",
    errorImageUpload: "هەڵە لە بارکردنی وێنەکەدا: ",
    // Image Modal
    download: "داگرتن",
    close: "داخستن",
  },
  badini: {
    // Header
    title: "KURD AI",
    // Sidebar
    history: "تۆمارەکان",
    newChat: "چاتەکا نوی",
    newChatTitle: "چاتەکا نوی",
    // Input Bar
    placeholder: "لسەر هەر تشتی پرسیار بکە...",
    imageModePlaceholder: "وێنەیێ وەسف بکە کو تە دڤێت چێکەی...",
    searchModePlaceholder: "پرسیارەکێ بکە بۆ گەرانێ د ویبێ دا...",
    // Tooltips
    imageModeTooltip: "چێکرنا وێنەی",
    searchModeTooltip: "گەرانا ویبێ",
    uploadImageTooltip: "هاڤپێچکرن",
    sendMessageTooltip: "نامەیێ فرێکە",
    // Attachment Menu
    uploadImages: "وێنە",
    uploadText: "دەق",
    uploadDocument: "بەلگەنامە",
    // Chat Window
    welcomeMessage: "سلاڤ! ئەز KURD AI مە. ئەڤرۆ دشێم چ هاریکاریا تە بکەم؟",
    typing: "...دنڤیسیت",
    // Citations
    citationsHeader: "ژێدەر:",
    // Errors
    errorPrompt: "هیڤی دکەین تشەکێ بنڤیسە بەری فرێکەی.",
    errorGeneric: "خەلەتیەک روویدا: ",
    errorNoImage: "نەشیا وێنە بهێتە چێکرن. هیڤی دکەین دوبارە هەول بدە.",
    errorImageUpload: "خەلەتی د بارکرنا وێنەی دا: ",
    // Image Modal
    download: "داگرتن",
    close: "گرتن",
  }
};


// --- UTILS ---
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

// --- MAIN APP COMPONENT ---
const App = () => {
  // --- STATE MANAGEMENT ---
  const [language, setLanguage] = useState<Language>('sorani');
  const [allChats, setAllChats] = useState<AllChats>({});
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('chat');
  const [prompt, setPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewedImage, setViewedImage] = useState<string | null>(null);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const t = translations[language];
  const systemInstruction = language === 'sorani'
    ? 'You are a helpful AI assistant. You must respond in the Kurdish Sorani dialect.'
    : 'You are a helpful AI assistant. You must respond in the Kurdish Badini dialect.';

  const currentChat = currentChatId ? allChats[currentChatId] : null;

  // --- EFFECTS ---
  // Load chats from localStorage on initial render
  useEffect(() => {
    try {
      const savedChats = localStorage.getItem('kurd-ai-chats');
      if (savedChats) {
        const parsedChats: AllChats = JSON.parse(savedChats);
        setAllChats(parsedChats);
        const lastChatId = Object.keys(parsedChats).sort().pop();
        setCurrentChatId(lastChatId || null);
      } else {
        handleNewChat(true); // Create the very first chat
      }
    } catch (error) {
      console.error("Failed to load chats from localStorage", error);
      handleNewChat(true);
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
      if (Object.keys(allChats).length > 0) {
        localStorage.setItem('kurd-ai-chats', JSON.stringify(allChats));
      }
  }, [allChats]);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [currentChat?.messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  // --- HANDLERS ---
  const handleNewChat = (isInitial = false) => {
    const newChatId = Date.now().toString();
    const newChat: ChatConversation = {
      id: newChatId,
      title: t.newChatTitle,
      messages: [{
          role: 'system',
          parts: [{ text: t.welcomeMessage }],
          timestamp: Date.now(),
      }],
    };
    
    setAllChats(prev => ({ ...prev, [newChatId]: newChat }));
    setCurrentChatId(newChatId);
    setMode('chat');
    setPrompt('');
    setUploadedImage(null);
    if (!isInitial) {
        setSidebarOpen(false);
    }
  };

  const handleSelectChat = (chatId: string) => {
      setCurrentChatId(chatId);
      setMode('chat');
      setPrompt('');
      setUploadedImage(null);
      setSidebarOpen(false);
  };
  
  const handleModeChange = (newMode: Mode) => {
    setMode(prevMode => (prevMode === newMode ? 'chat' : newMode));
    setPrompt('');
    setUploadedImage(null);
  };
  
  const handleAttachmentTypeSelect = (acceptType: string) => {
    if (fileInputRef.current) {
        fileInputRef.current.accept = acceptType;
        fileInputRef.current.click();
    }
    setAttachmentMenuOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
      setMode('chat');
    }
    if (e.target) e.target.value = '';
  };

  const updateChat = (chatId: string, newMessage: ChatMessage, newTitle?: string) => {
      setAllChats(prev => {
          const updatedChat = {
              ...prev[chatId],
              messages: [...prev[chatId].messages, newMessage],
              title: newTitle || prev[chatId].title,
          };
          return { ...prev, [chatId]: updatedChat };
      });
  };
  
  const addErrorMessage = (text: string) => {
    if (!currentChatId) return;
    const errorMsg: ChatMessage = { role: 'system', parts: [{text}], timestamp: Date.now() };
    updateChat(currentChatId, errorMsg);
  };
  
  const handleDownloadImage = () => {
    if (!viewedImage) return;
    const link = document.createElement('a');
    link.href = viewedImage;
    const fileExtension = viewedImage.split(';')[0].split('/')[1] || 'jpeg';
    link.download = `kurd-ai-image-${Date.now()}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendMessage = async () => {
    if ((!prompt && !uploadedImage) || loading || !currentChatId) {
      if (!prompt && !uploadedImage) addErrorMessage(t.errorPrompt);
      return;
    }
    
    setLoading(true);
    
    // Prepare user message parts
    const userParts: MessagePart[] = [];
    if (uploadedImage) {
        try {
            const imagePart = await fileToGenerativePart(uploadedImage);
            userParts.push(imagePart);
        } catch (e) {
            addErrorMessage(`${t.errorImageUpload} ${e instanceof Error ? e.message : 'Unknown error'}`);
            setLoading(false);
            return;
        }
    }
    if (prompt) {
        userParts.push({ text: prompt });
    }

    // Add user message to state and update title if it's a new chat
    const userMessage: ChatMessage = { role: 'user', parts: userParts, timestamp: Date.now() };
    const isNewChat = currentChat?.title === t.newChatTitle;
    const newTitle = isNewChat ? prompt.substring(0, 30) + (prompt.length > 30 ? '...' : '') : undefined;
    updateChat(currentChatId, userMessage, newTitle);

    const currentPrompt = prompt;
    setPrompt('');
    setUploadedImage(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      if (mode === 'image') {
        const response = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: currentPrompt,
          config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
        });
        if (response.generatedImages && response.generatedImages.length > 0) {
          const base64ImageBytes = response.generatedImages[0].image.imageBytes;
          const modelMessage: ChatMessage = { role: 'model', parts: [{ inlineData: { mimeType: 'image/jpeg', data: base64ImageBytes } }], timestamp: Date.now() };
          updateChat(currentChatId, modelMessage);
        } else {
          addErrorMessage(t.errorNoImage);
        }

      } else if (mode === 'search') {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: { parts: [{ text: currentPrompt }] },
          config: { tools: [{ googleSearch: {} }], systemInstruction },
        });
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const modelMessage: ChatMessage = { role: 'model', parts: [{ text: response.text, groundingChunks }], timestamp: Date.now() };
        updateChat(currentChatId, modelMessage);

      } else { // 'chat' mode
        // For contextual chat, create a temporary session with the history of the CURRENT chat
        const contextualHistory = currentChat?.messages
            .filter(m => m.role !== 'system') // Gemini API doesn't want system roles in history
            .map(m => ({
                role: m.role,
                parts: m.parts.map(p => p.text ? {text: p.text} : p) // Simplify parts for history
            }));

        const chatSession = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
            history: contextualHistory,
        });

        const response = await chatSession.sendMessage({ message: userParts });
        const modelMessage: ChatMessage = { role: 'model', parts: [{ text: response.text }], timestamp: Date.now() };
        updateChat(currentChatId, modelMessage);
      }
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        addErrorMessage(`${t.errorGeneric}${errorMessage}`);
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  // --- RENDER ---
  const getPlaceholder = () => {
    switch (mode) {
      case 'image': return t.imageModePlaceholder;
      case 'search': return t.searchModePlaceholder;
      default: return t.placeholder;
    }
  };
  
  const sortedChats = Object.values(allChats).sort((a, b) => b.id.localeCompare(a.id));

  return (
    <div className="app-container">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <button className="sidebar-button new-chat-button" onClick={() => handleNewChat()}>
            <span>{t.newChat}</span>
            <span>➕</span>
          </button>
          <div className="history-list">
            {sortedChats.map(chatItem => (
                <button 
                    key={chatItem.id} 
                    className={`history-item ${chatItem.id === currentChatId ? 'active' : ''}`}
                    onClick={() => handleSelectChat(chatItem.id)}
                >
                    {chatItem.title}
                </button>
            ))}
          </div>
      </aside>

      <main className="main-content">
        <header>
          <div className="language-switcher">
            <button className={`lang-button ${language === 'sorani' ? 'active' : ''}`} onClick={() => setLanguage('sorani')}>Soranî</button>
            <button className={`lang-button ${language === 'badini' ? 'active' : ''}`} onClick={() => setLanguage('badini')}>Badînî</button>
          </div>
          <h1>{t.title}</h1>
          <button className="menu-button" onClick={() => setSidebarOpen(prev => !prev)}>☰</button>
        </header>

        <div className="chat-window" ref={chatWindowRef}>
          {currentChat?.messages.map((msg) => (
            <div key={msg.timestamp} className={`message-bubble ${msg.role}-message`}>
              {msg.parts.map((part, p_idx) => {
                const imageUrl = part.inlineData ? `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` : null;
                return (
                    <div key={p_idx}>
                      {part.text && <p>{part.text}</p>}
                      {imageUrl && <img src={imageUrl} alt="Generated or Uploaded content" className="chat-image" onClick={() => setViewedImage(imageUrl)} />}
                      {part.groundingChunks && part.groundingChunks.length > 0 && (
                        <div className="citations">
                            <h4>{t.citationsHeader}</h4>
                            <ul>
                                {part.groundingChunks.map((chunk, c_idx) => (
                                    <li key={c_idx}>
                                        <a href={chunk.web?.uri} target="_blank" rel="noopener noreferrer">{chunk.web?.title || chunk.web?.uri}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                      )}
                    </div>
                );
              })}
            </div>
          ))}
          {loading && (
            <div className="message-bubble model-message typing-indicator">
              <div className="dot"></div><div className="dot"></div><div className="dot"></div>
            </div>
          )}
        </div>

        <div className="input-bar">
          <div className="input-area">
              {attachmentMenuOpen && (
                  <div className="attachment-menu">
                      <button onClick={() => handleAttachmentTypeSelect('image/*')}>
                          <span>{t.uploadImages}</span>
                          <span>🖼️</span>
                      </button>
                      <button onClick={() => handleAttachmentTypeSelect('.txt,.md,.rtf')}>
                          <span>{t.uploadText}</span>
                          <span>📄</span>
                      </button>
                      <button onClick={() => handleAttachmentTypeSelect('.pdf,.doc,.docx,.zip,.rar')}>
                          <span>{t.uploadDocument}</span>
                          <span>📁</span>
                      </button>
                  </div>
              )}
              <button className="input-bar-button" onClick={() => setAttachmentMenuOpen(prev => !prev)} title={t.uploadImageTooltip}>📎</button>
              <button className={`input-bar-button mode-button ${mode === 'search' ? 'active' : ''}`} onClick={() => handleModeChange('search')} title={t.searchModeTooltip}>🌐</button>
              <button className={`input-bar-button mode-button ${mode === 'image' ? 'active' : ''}`} onClick={() => handleModeChange('image')} title={t.imageModeTooltip}>🖌️</button>
              
              <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  placeholder={getPlaceholder()}
                  rows={1}
                  disabled={loading}
              />
              {uploadedImage && <div className="attachment-preview">🖼️ {uploadedImage.name.substring(0, 15)}...</div>}

              <button className="send-button" onClick={handleSendMessage} disabled={loading || (!prompt && !uploadedImage)} title={t.sendMessageTooltip}>
                  <span>▲</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
          </div>
        </div>
      </main>
      
      {viewedImage && (
        <div className="image-modal-overlay" onClick={() => setViewedImage(null)}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={viewedImage} alt="Focused view" className="modal-image"/>
                <div className="modal-actions">
                    <button onClick={handleDownloadImage} className="modal-button download-button">{t.download}</button>
                    <button onClick={() => setViewedImage(null)} className="modal-button close-button">{t.close}</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);