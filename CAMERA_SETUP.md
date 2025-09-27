# Camera + Gemini Integration

## 🎥 Camera Capture with AI Analysis

Your project now includes a complete camera capture system that works with Gemini AI to analyze photos in real-time!

## 🚀 How to Use

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the camera page**:
   - Go to `http://localhost:3000/capture`
   - Or use your existing navigation system

3. **Use the camera**:
   - Click "Start Camera" to activate your webcam
   - Click "Capture Photo" to take a picture
   - Use the analysis buttons to get AI insights

## ✨ Features

### Camera Controls
- **Start/Stop Camera**: Control webcam access
- **Capture Photo**: Take a snapshot for analysis
- **Real-time video feed**: See yourself before capturing

### AI Analysis Options
- **Analyze Image**: General description of what Gemini sees
- **Analyze Emotions**: Mood and emotion detection
- **Analyze Composition**: Photography and lighting analysis

## 🛠️ Technical Details

### Components Created:
- `CameraCapture.tsx` - Main camera component
- Updated `/capture` page to use camera functionality
- Enhanced Gemini utilities for image processing

### Browser Permissions
- The app will request camera permissions when you click "Start Camera"
- Make sure to allow camera access in your browser

### Supported Browsers
- Chrome, Firefox, Safari (modern versions)
- Requires HTTPS in production (localhost works for development)

## 🔧 Customization

You can modify the analysis prompts in `CameraCapture.tsx`:

```typescript
// Custom analysis
await analyzeWithGemini("Your custom prompt here");
```

## 🚨 Troubleshooting

**Camera not working?**
- Check browser permissions
- Make sure no other apps are using the camera
- Try refreshing the page

**Gemini analysis failing?**
- Verify your API key in `.env.local`
- Check browser console for error messages
- Ensure you have internet connection

## 🎯 Next Steps

Your camera + AI system is ready! You can now:
- Take photos of yourself and get AI analysis
- Analyze facial expressions, mood, and composition
- Integrate this into your larger application workflow