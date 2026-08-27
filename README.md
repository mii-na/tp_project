# Singlish Translator Assistant

A web application that helps foreigners understand Singlish by translating it into Standard English and Japanese, while also explaining Singapore-specific words and expressions.

## Features

- Translate Singlish into Standard English
- Translate Singlish into Japanese
- Detect Singapore-specific words and expressions
- Explain the meaning, origin, and cultural background of detected words
- Save translated words to a personal library
- View translation history

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- AI: OpenRouter API
- Styling: CSS
- Data Storage: Browser localStorage

## System Overview

```text
User
 ↓
React / TypeScript
 ↓
Express Backend
 ↓
OpenRouter API
 ↓
Translation & Word Information
 ↓
React UI

The API key is stored in an environment variable and is not included in this repository.
```

### Project Structure

```text
tp_project/
├── server/
│   └── index.js              # Backend and AI processing
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── History.tsx
│   │   ├── Library.tsx
│   │   ├── Trans_Result.tsx
│   │   ├── Translator.tsx
│   │   └── WordModel.tsx
│   ├── pages/
│   │   └── Home.tsx
│   ├── types/
│   │   ├── WordInfo.ts
│   │   └── translation.ts
│   ├── materials/
│   │   └── favicon.png
│   ├── App.tsx
│   ├── App.css
│   └── index.css
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## Notes
This project was developed as part of a student project at TP.

The application uses AI-generated translations and explanations. Therefore, the accuracy of translations and cultural information may vary depending on the input and the AI model used.
