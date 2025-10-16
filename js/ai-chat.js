import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
// لا نحتاج لاستدعاء GoogleGenAI هنا لأننا سنتعامل مع البروكسي
// import { GoogleGenAI } from "@google/genai"; 

// --- TRANSLATIONS (تبقى كما هي) ---
const translations = {
  sorani: {
    title: "KURD AI",
    history: "تۆمارەکان",
    newChat: "چاتی نوێ",
    newChatTitle: "چاتی نوێ",
    placeholder: "دەربارەی هەر شتێک بپرسە...",
    imageModePlaceholder: "وەسفی ئەو وێنەیە بکە کە دەتەوێت دروستی بکەیت...",
    searchModePlaceholder: "پرسیارێک بکە بۆ گەڕان لە وێبدا...",
    imageModeTooltip: "دروستکردنی وێنە",
    searchModeTooltip: "گەڕانی وێب",
    uploadImageTooltip: "هاوپێچکردن",
    sendMessageTooltip: "نامە بنێرە",
    uploadImages: "وێنەکان",
    uploadText: "دەق",
    uploadDocument: "بەڵگەنامە",
    welcomeMessage: "سڵاو! من KURD AIـم. چۆن دەتوانم یارمەتیت بدەم ئەمڕۆ؟",
    typing: "...دەنوسێت",
    citationsHeader: "سەرچاوەکان:",
    errorPrompt: "تکایە شتێک بنووسە پێش ناردن.",
    errorGeneric: "هەڵەیەک ڕوویدا: ",
    errorNoImage: "نەتوانرا وێنەکە دروست بکرێت. تکایە دووبارە هەوڵبدەرەوە.",
    errorImageUpload: "هەڵە لە بارکردنی وێنەکەدا: ",
    // تم حذف رسالة الخطأ القديمة الخاصة بمفتاح API
    download: "داگرتن",
    close: "داخستن",
  },
  badini: {
    title: "KURD AI",
    history: "تۆمارەکان",
    newChat: "چاتەکا نوی",
    newChatTitle: "چاتەکا نوی",
    placeholder: "لسەر هەر تشتی پرسیار بکە...",
    imageModePlaceholder: "وێنەیێ وەسف بکە کو تە دڤێت چێکەی...",
    searchModePlaceholder: "پرسیارەکێ بکە بۆ گەرانێ د ویبێ دا...",
    imageModeTooltip: "چێکرنا وێنەی",
    searchModeTooltip: "گەرانا ویبێ",
    uploadImageTooltip: "هاڤپێچکرن",
    sendMessageTooltip: "نامەیێ فرێکە",
    uploadImages: "وێنە",
    uploadText: "دەق",
    uploadDocument: "بەلگەنامە",
    welcomeMessage: "سلاڤ! ئەز KURD AI مە. ئەڤرۆ دشێم چ هاریکاریا تە بکەم؟",
    typing: "...دنڤیسیت",
    citationsHeader: "ژێدەر:",
    errorPrompt: "هیڤی دکەین تشەکێ بنڤیسە بەری فرێکەی.",
    errorGeneric: "خەلەتیەک روویدا: ",
    errorNoImage: "نەشیا وێنە بهێتە چێکرن. هیڤی دکەین دوبارە هەول بدە.",
    errorImageUpload: "خەلەتی د بارکرنا وێنەی دا: ",
    // تم حذف رسالة الخطأ القديمة الخاصة بمفتاح API
    download: "داگرتن",
    close: "گرتن",
  }
};


// --- UTILS (تبقى كما هي) ---
const fileToGenerativePart = async (file) => {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

// --- MAIN APP COMPONENT ---
const App = () => {
  // --- STATE MANAGEMENT (تبقى كما هي) ---
  const [language, setLanguage] = useState('sorani');
  const [allChats, setAllChats] = useState({});
  const [currentChatId, setCurrentChatId] = useState(null);
  const [mode, setMode] = useState('chat');
  const [prompt, setPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewedImage, setViewedImage] = useState(null);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatWindowRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const t = translations[language];
  const systemInstruction = language === 'sorani'
    ? 'You are a helpful AI assistant. You must respond in the Kurdish Sorani dialect.'
    : 'You are a helpful AI assistant. You must respond in the Kurdish Badini dialect.';

  const currentChat = currentChatId ? allChats[currentChatId] : null;

  // --- EFFECTS (تبقى كما هي) ---
  useEffect(() => {
    try {
      const savedChats = localStorage.getItem('kurd-ai-chats');
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats);
        setAllChats(parsedChats);
        const lastChatId = Object.keys(parsedChats).sort().pop();
        setCurrentChatId(lastChatId || null);
      } else {
        handleNewChat(true);
      }
    } catch (error) {
      console.error("Failed to load chats from localStorage", error);
      handleNewChat(true);
    }
  }, []);

  useEffect(() => {
      if (Object.keys(allChats).length > 0) {
        localStorage.setItem('kurd-ai-chats', JSON.stringify(allChats));
      }
  }, [allChats]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [currentChat?.messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  // --- HANDLERS (تبقى كما هي، باستثناء handleSendMessage) ---
  const handleNewChat = (isInitial = false) => {
    const newChatId = Date.now().toString();
    const newChat = {
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

  const handleSelectChat = (chatId) => {
      setCurrentChatId(chatId);
      setMode('chat');
      setPrompt('');
      setUploadedImage(null);
      setSidebarOpen(false);
  };
  
  const handleModeChange = (newMode) => {
    setMode(prevMode => (prevMode === newMode ? 'chat' : newMode));
    setPrompt('');
    setUploadedImage(null);
  };
  
  const handleAttachmentTypeSelect = (acceptType) => {
    if (fileInputRef.current) {
        fileInputRef.current.accept = acceptType;
        fileInputRef.current.click();
    }
    setAttachmentMenuOpen(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
      setMode('chat');
    }
    if (e.target) e.target.value = '';
  };

  const updateChat = (chatId, newMessage, newTitle) => {
      setAllChats(prev => {
          const updatedChat = {
              ...prev[chatId],
              messages: [...prev[chatId].messages, newMessage],
              title: newTitle || prev[chatId].title,
          };
          return { ...prev, [chatId]: updatedChat };
      });
  };
  
  const addErrorMessage = (text) => {
    if (!currentChatId) return;
    const errorMsg = { role: 'system', parts: [{text}], timestamp: Date.now() };
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

  // ==========================================================
  // ===    هذه هي الدالة التي تم تعديلها بالكامل (الأهم)    ===
  // ==========================================================
    const handleSendMessage = async () => {
    if ((!prompt && !uploadedImage) || loading || !currentChatId) {
      if (!prompt && !uploadedImage) addErrorMessage(t.errorPrompt);
      return;
    }

    setLoading(true);
    
    // --- الإعداد للرسالة (يبقى كما هو) ---
    const userParts = [];
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

    const userMessage = { role: 'user', parts: userParts, timestamp: Date.now() };
    const isNewChat = currentChat?.title === t.newChatTitle;
    const newTitle = isNewChat ? prompt.substring(0, 30) + (prompt.length > 30 ? '...' : '') : undefined;
    updateChat(currentChatId, userMessage, newTitle);

    // --- الجزء المُعدّل والنهائي ---
    try {
        // جهّز البيانات بشكل صحيح باستخدام المتغيرات الصحيحة
        const requestData = {
            prompt: prompt,       // <-- الإصلاح: استخدم 'prompt' مباشرة
            language: language  // <-- تأكد من إرسال اللغة
        };
        
        console.log("Sending to proxy:", requestData);
        // إعادة تعيين الحقول فوراً بعد تجهيز البيانات
        setPrompt('');
        setUploadedImage(null);

        // إرسال الطلب إلى البروكسي
        const response = await fetch('/api/gemini_proxy.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An unknown server error occurred');
        }

        const result = await response.json();
        const aiText = result.candidates[0].content.parts[0].text;

        const modelResponse = {
            role: 'model',
            parts: [{ text: aiText }],
            timestamp: Date.now()
        };
        
        updateChat(currentChatId, modelResponse);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        addErrorMessage(`${t.errorGeneric} ${errorMessage}`);
        console.error("Error in sendMessage:", error);
    } finally {
        setLoading(false);
    }
  };

  // --- RENDER (تبقى كما هي) ---
  const getPlaceholder = () => {
    switch (mode) {
      case 'image': return t.imageModePlaceholder;
      case 'search': return t.searchModePlaceholder;
      default: return t.placeholder;
    }
  };
  
  const sortedChats = Object.values(allChats).sort((a, b) => b.id.localeCompare(a.id));

  return (
    React.createElement("div", { className: "app-container" },
      sidebarOpen && React.createElement("div", { className: "sidebar-overlay", onClick: () => setSidebarOpen(false) }),
      React.createElement("aside", { className: `sidebar ${sidebarOpen ? 'open' : ''}` },
          React.createElement("button", { className: "sidebar-button new-chat-button", onClick: () => handleNewChat() },
            React.createElement("span", null, t.newChat),
            React.createElement("span", null, "➕")
          ),
          React.createElement("div", { className: "history-list" },
            sortedChats.map(chatItem => (
                React.createElement("button", { 
                    key: chatItem.id, 
                    className: `history-item ${chatItem.id === currentChatId ? 'active' : ''}`,
                    onClick: () => handleSelectChat(chatItem.id)
                },
                    chatItem.title
                )
            ))
          )
      ),

      React.createElement("main", { className: "main-content" },
        React.createElement("header", null,
          React.createElement("div", { className: "language-switcher" },
            React.createElement("button", { className: `lang-button ${language === 'sorani' ? 'active' : ''}`, onClick: () => setLanguage('sorani') }, "Soranî"),
            React.createElement("button", { className: `lang-button ${language === 'badini' ? 'active' : ''}`, onClick: () => setLanguage('badini') }, "Badînî")
          ),
          React.createElement("h1", null, t.title),
          React.createElement("button", { className: "menu-button", onClick: () => setSidebarOpen(prev => !prev) }, "☰")
        ),

        React.createElement("div", { className: "chat-window", ref: chatWindowRef },
          currentChat?.messages.map((msg) => (
            React.createElement("div", { key: msg.timestamp, className: `message-bubble ${msg.role}-message` },
              msg.parts.map((part, p_idx) => {
                const imageUrl = part.inlineData ? `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` : null;
                return (
                    React.createElement("div", { key: p_idx },
                      part.text && React.createElement("p", null, part.text),
                      imageUrl && React.createElement("img", { src: imageUrl, alt: "Generated or Uploaded content", className: "chat-image", onClick: () => setViewedImage(imageUrl) }),
                      part.groundingChunks && part.groundingChunks.length > 0 && (
                        React.createElement("div", { className: "citations" },
                            React.createElement("h4", null, t.citationsHeader),
                            React.createElement("ul", null,
                                part.groundingChunks.map((chunk, c_idx) => (
                                    React.createElement("li", { key: c_idx },
                                        React.createElement("a", { href: chunk.web?.uri, target: "_blank", rel: "noopener noreferrer" }, chunk.web?.title || chunk.web?.uri)
                                    )
                                ))
                            )
                        )
                      )
                    )
                );
              })
            )
          )),
          loading && (
            React.createElement("div", { className: "message-bubble model-message typing-indicator" },
              React.createElement("div", { className: "dot" }), React.createElement("div", { className: "dot" }), React.createElement("div", { className: "dot" })
            )
          )
        ),

        React.createElement("div", { className: "input-bar" },
          React.createElement("div", { className: "input-area" },
              attachmentMenuOpen && (
                  React.createElement("div", { className: "attachment-menu" },
                      React.createElement("button", { onClick: () => handleAttachmentTypeSelect('image/*') },
                          React.createElement("span", null, t.uploadImages),
                          React.createElement("span", null, "🖼️")
                      ),
                      React.createElement("button", { onClick: () => handleAttachmentTypeSelect('.txt,.md,.rtf') },
                          React.createElement("span", null, t.uploadText),
                          React.createElement("span", null, "📄")
                      ),
                      React.createElement("button", { onClick: () => handleAttachmentTypeSelect('.pdf,.doc,.docx,.zip,.rar') },
                          React.createElement("span", null, t.uploadDocument),
                          React.createElement("span", null, "📁")
                      )
                  )
              ),
              React.createElement("button", { className: "input-bar-button", onClick: () => setAttachmentMenuOpen(prev => !prev), title: t.uploadImageTooltip }, "📎"),
              React.createElement("button", { className: `input-bar-button mode-button ${mode === 'search' ? 'active' : ''}`, onClick: () => handleModeChange('search'), title: t.searchModeTooltip }, "🌐"),
              React.createElement("button", { className: `input-bar-button mode-button ${mode === 'image' ? 'active' : ''}`, onClick: () => handleModeChange('image'), title: t.imageModeTooltip }, "🖌️"),
              
              React.createElement("textarea", {
                  ref: textareaRef,
                  value: prompt,
                  onChange: (e) => setPrompt(e.target.value),
                  onKeyDown: (e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage()),
                  placeholder: getPlaceholder(),
                  rows: 1,
                  disabled: loading
              }),
              uploadedImage && React.createElement("div", { className: "attachment-preview" }, "🖼️ ", `${uploadedImage.name.substring(0, 15)}...`),

              React.createElement("button", { className: "send-button", onClick: handleSendMessage, disabled: loading || (!prompt && !uploadedImage), title: t.sendMessageTooltip },
                  React.createElement("span", null, "▲")
              ),
              React.createElement("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, style: { display: 'none' } })
          )
        )
      ),
      
      viewedImage && (
        React.createElement("div", { className: "image-modal-overlay", onClick: () => setViewedImage(null) },
            React.createElement("div", { className: "image-modal-content", onClick: (e) => e.stopPropagation() },
                React.createElement("img", { src: viewedImage, alt: "Focused view", className: "modal-image" }),
                React.createElement("div", { className: "modal-actions" },
                    React.createElement("button", { onClick: handleDownloadImage, className: "modal-button download-button" }, t.download),
                    React.createElement("button", { onClick: () => setViewedImage(null), className: "modal-button close-button" }, t.close)
                )
            )
        )
      )
    )
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(React.createElement(App));