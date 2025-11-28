# 🤖 AI Chatbot with Real-Time Tool Calling

## 🎯 Overview

This is a **production-ready GenAI chatbot** that implements **tool calling (function calling)** to interact with external APIs in real-time. Unlike traditional chatbots limited by their training data, this agent can search the web, retrieve current information, and provide up-to-date responses autonomously.

Built as my first comprehensive Generative AI project, demonstrating end-to-end full-stack AI development using JavaScript.

---

## ✨ Key Features

### 🔧 **Tool Calling / Function Calling**
- **Dynamic tool execution** based on user query context
- Agent autonomously decides when external tools are needed
- Seamless integration between LLM reasoning and tool execution

### 🌐 **Real-Time Web Search**
- Integrated **Tavily Search API** for current information retrieval
- Breaks through LLM knowledge cutoff limitations
- Provides accurate, up-to-date responses for time-sensitive queries

### 💾 **Conversation Memory**
- **Session-based chat history** using Node-cache
- Maintains context across multiple turns
- TTL (Time-To-Live) implementation for automatic cleanup
- Enables natural, contextual conversations

### 🎨 **Modern React UI**
- Clean, responsive chat interface
- Real-time message streaming
- Loading states and error handling
- Mobile-friendly design

### 🛡️ **Production-Ready Architecture**
- RESTful API design with Express.js
- Environment variable management
- Error handling and validation
- CORS configuration for deployment
- **Infinite loop prevention** for tool calling

---

## 🛠️ Tech Stack

### **Frontend**
```
- React 18.x
- Axios (API communication)
- CSS3 (Styling)
- Deployed on Render
```

### **Backend**
```
- Node.js 18.x
- Express.js (REST API)
- OpenAI API (GPT model with function calling)
- Tavily Search API (Web search tool)
- Node-cache (Session management)
- Deployed on Render
```

### **AI/ML Components**
```
- OpenAI GPT (gpt-oss-120b)
- Tool calling / Function calling implementation
- Prompt engineering for agent behavior
- Token management and optimization
```

---

## 🏗️ Architecture
```
┌─────────────────┐
│   React UI      │
│  (Frontend)     │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│  Express API    │
│  (Backend)      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐
│OpenAI │ │ Tavily  │
│  API  │ │Search API│
└───────┘ └─────────┘
    │
┌───▼──────────┐
│  Node-cache  │
│  (Memory)    │
└──────────────┘
```

### **How It Works:**

1. **User Input** → React frontend captures message
2. **API Request** → Sent to Express backend with session ID
3. **Context Retrieval** → Backend fetches conversation history from Node-cache
4. **LLM Processing** → OpenAI analyzes query and decides if tools are needed
5. **Tool Execution** → If required, Tavily web search is called autonomously
6. **Response Generation** → LLM synthesizes information and generates response
7. **Memory Update** → Conversation history is cached for future context
8. **UI Update** → Response displayed in React interface

---

## 🚀 Live Demo

### **Try it now:** https://the-chatbot-frontend.onrender.com

**Example queries to test:**
- "What's the latest news in AI?"
- "Who won the cricket match yesterday?"
- "What's the weather like today?"
- "Tell me about recent SpaceX launches"

**Watch it in action:**

https://drive.google.com/file/d/1CDDVDBT6m6DuspGyIJHlTnOQ-zPNaSWX/view?usp=sharing

---
