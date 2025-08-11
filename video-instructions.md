# Adding Real Video Background to Hero Section

The hero section currently shows an animated chatbot demonstration. If you want to replace it with an actual video, follow these steps:

## Option 1: Replace with Your Own Video

1. **Create/Record a Video** showing:
   - AI chatbot in action booking appointments
   - Screen recording of the automation system
   - Customer testimonials
   - Before/after website comparisons

2. **Video Specifications**:
   - Format: MP4 (for best browser support)
   - Duration: 15-30 seconds (loops automatically)
   - Resolution: 1920x1080 minimum
   - File size: Under 10MB for fast loading
   - No audio needed (video is muted by default)

3. **Upload Video**:
   - Create an `assets` folder in your website directory
   - Save your video as `assets/hero-background.mp4`

4. **Update HTML** in `index.html`:
   
   Replace this section:
   ```html
   <div class="hero-video">
       <!-- Animated gradient background with chatbot simulation -->
       <div class="hero-video-placeholder">
           <div class="chat-demo">
               <!-- existing chat demo code -->
           </div>
       </div>
   </div>
   ```
   
   With this:
   ```html
   <div class="hero-video">
       <video autoplay muted loop playsinline>
           <source src="assets/hero-background.mp4" type="video/mp4">
           <!-- Fallback to animated background -->
           <div class="hero-video-placeholder">
               <div class="chat-demo">
                   <!-- keep existing chat demo as fallback -->
               </div>
           </div>
       </video>
   </div>
   ```

## Option 2: Use Stock Video

You can purchase or download free stock videos from:
- **Pexels** (free): https://www.pexels.com/videos/
- **Unsplash** (free): https://unsplash.com/videos
- **Shutterstock** (paid): https://www.shutterstock.com/video/

Search for terms like:
- "chatbot animation"
- "mobile app demo"
- "technology background"
- "digital interface"
- "business automation"

## Option 3: Create Screen Recording

1. **Record Your Screen** showing:
   - The actual chatbot widget in action
   - Booking calendar being used
   - Dashboard with live metrics
   - Email/SMS automation sequences

2. **Screen Recording Tools**:
   - **Windows**: Built-in Xbox Game Bar (Win + G)
   - **Mac**: Built-in QuickTime Player
   - **Cross-platform**: OBS Studio (free)
   - **Online**: Loom, Screencastify

3. **Recording Tips**:
   - Use clean, professional browser
   - Hide personal information
   - Show realistic business scenarios
   - Keep it short and engaging

## Current Animated Background

The current animated background includes:
- ✅ **Moving gradient** background
- ✅ **Simulated chat conversation** 
- ✅ **Typing indicators**
- ✅ **Mobile-responsive design**
- ✅ **Looping animation** (restarts every 12 seconds)
- ✅ **Interactive click effects**

This provides a professional look without needing a video file and loads faster than actual video content.

## Performance Considerations

- **Video files** increase page load time
- **Current animation** is pure CSS/JS and loads instantly
- **Compressed videos** under 5MB are recommended
- Consider using **WebM format** for smaller file sizes
- Always provide **fallback content** for older browsers

## Testing Your Video

After adding your video:
1. Test on multiple devices (desktop, mobile, tablet)
2. Check different browsers (Chrome, Firefox, Safari)
3. Verify autoplay works (some browsers block it)
4. Ensure video loops smoothly
5. Test loading speed with slow connections

The animated background will continue to work as a perfect fallback if the video fails to load or autoplay is blocked.