# Character Creation System

## 🎭 Overview

Your choose-your-own-adventure now includes a complete character creation system! Users can create their main character in two ways:

### 1. **Manual Creation** 🎨
- Visual character builder with customizable parts
- Choose body type, hair, eyes, clothing, and expressions
- Select personality traits from a curated list
- Write custom backstories
- Full creative control

### 2. **AI Photo Analysis** 📸
- Take a photo of themselves
- Gemini AI analyzes the image
- Suggests character name, traits, and backstory
- Quick and personalized character generation

## 🎯 How to Use

### Manual Character Creation:
1. Go to `/char` page
2. Click "Create Manually"
3. Use the 3-step wizard:
   - **Appearance**: Choose body, hair, eyes, clothes, etc.
   - **Personality**: Select up to 5 traits
   - **Story**: Write backstory and complete

### AI Photo Character Creation:
1. Go to `/char` page  
2. Click "Create from Photo"
3. Take a photo of yourself
4. Click "Generate Character"
5. Review AI suggestions and accept

## 🏗️ Technical Architecture

### Components Created:
- `CharacterCreator.tsx` - Manual character builder
- `CameraCapture.tsx` - Enhanced with character mode
- `CharacterContext.tsx` - State management and localStorage
- Character data types in `characterData.ts`

### Data Structure:
```typescript
interface Character {
  id: string;
  name: string;
  body: string;        // Asset ID for body type
  hair: string;        // Asset ID for hair style
  bangs?: string;      // Asset ID for bangs
  eyes: string;        // Asset ID for eye color
  mouth: string;       // Asset ID for expression
  clothes: string;     // Asset ID for outfit
  personality?: string[];  // Array of trait names
  backstory?: string;      // Character background
  createdAt: Date;
  createdFrom?: 'manual' | 'ai-photo';
}
```

### Storage:
- Characters saved to localStorage
- Current character persisted across sessions
- Context provides global character state

## 🎨 Asset Integration

The system is designed to work with your Google Drive assets:
- `/assets/body/` - Body types and skin tones
- `/assets/hair/` - Hair styles and colors  
- `/assets/bangs/` - Bang styles (optional)
- `/assets/eyes/` - Eye colors and styles
- `/assets/mouth/` - Expressions and mouth shapes
- `/assets/clothes/` - Outfits and clothing options

Currently uses placeholder data - update `characterData.ts` with your actual asset URLs.

## 🤖 AI Character Generation

When users take a photo, Gemini analyzes:
- Physical appearance for character suggestions
- Facial expressions for personality traits
- Overall impression for backstory ideas
- Suggests fitting character names

The AI provides structured suggestions that users can accept or modify.

## 🔄 Integration with Story System

Characters are:
- Stored in React Context for global access
- Available to story components via `useCharacterContext()`
- Persistent across navigation
- Can be referenced in adventure text

## 🚀 Next Steps

1. **Replace placeholder assets** with your Google Drive images
2. **Integrate characters into story system** - reference character traits in adventure paths
3. **Add character display** in story scenes
4. **Expand personality system** - let traits affect story outcomes
5. **Add character progression** - skills, items, relationships

## 📱 User Experience

The character creation provides:
- ✅ Two distinct creation paths (manual vs AI)
- ✅ Visual character preview
- ✅ Persistent character storage
- ✅ Integration with existing navigation
- ✅ Responsive design for mobile/desktop
- ✅ Clear user feedback and instructions

Your users can now create personalized characters that will be the heroes of their adventure stories!