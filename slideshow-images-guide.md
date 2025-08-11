# Hero Slideshow Images Guide

The hero section now features a **subtle image slideshow** that cycles through 5 brand-relevant scenes. Currently using CSS-generated patterns as placeholders, but you can easily replace them with real images.

## 🎨 Current Slideshow Themes

### 1. Service Professional (Blue Theme)
**Current**: Geometric patterns with tech elements
**Replace With**: 
- Professional service technician working
- Clean, modern workspace setup
- Technology/automation tools in use
- Person using tablet/smartphone for business

### 2. Happy Customer (Green Theme)  
**Current**: Success-themed patterns
**Replace With**:
- Satisfied customer shaking hands with service provider
- Before/after home improvement results
- 5-star reviews on mobile device
- Happy family in well-maintained home

### 3. Modern Office (Purple Theme)
**Current**: Professional workspace patterns
**Replace With**:
- Modern office with multiple monitors showing dashboards
- Clean, professional meeting room
- Team collaborating on automation systems
- Sleek workspace with technology

### 4. Automation Dashboard (Red Theme)
**Current**: Dashboard-style geometric layout
**Replace With**:
- Computer screen showing analytics/metrics
- Dashboard with lead tracking interface
- Phone notifications and booking confirmations
- Automated systems in action

### 5. Phone Booking (Purple Theme)
**Current**: Mobile device patterns
**Replace With**:
- Hand holding smartphone with booking app
- Mobile calendar with appointments
- Text message conversation showing booking
- Customer using mobile booking system

## 📱 Image Specifications

### Technical Requirements:
- **Format**: JPG or PNG
- **Resolution**: 1920x1080 minimum (1080p)
- **File Size**: 500KB - 2MB each (optimized for web)
- **Aspect Ratio**: 16:9 (landscape)
- **Quality**: High resolution, professional photography

### Style Guidelines:
- **Professional**: Clean, high-quality images
- **Consistent**: Similar lighting/color grading across all images
- **Brand-relevant**: Related to home services, automation, or customer satisfaction
- **Subtle**: Will have overlay, so avoid busy/cluttered images
- **Modern**: Contemporary, not dated

## 🖼️ How to Add Real Images

### Step 1: Prepare Your Images
1. Create an `assets/images/` folder in your website directory
2. Optimize images for web (use tools like TinyPNG or Photoshop "Save for Web")
3. Name them descriptively:
   - `service-professional.jpg`
   - `happy-customer.jpg`
   - `modern-office.jpg`
   - `automation-dashboard.jpg`
   - `phone-booking.jpg`

### Step 2: Update CSS
Replace the CSS background patterns in `styles.css`:

```css
/* Replace existing slide backgrounds with actual images */
.slide[data-bg="service-professional"] {
    background: linear-gradient(45deg, rgba(37, 99, 235, 0.7), rgba(59, 130, 246, 0.5)),
                url('assets/images/service-professional.jpg');
}

.slide[data-bg="happy-customer"] {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.7), rgba(5, 150, 105, 0.5)),
                url('assets/images/happy-customer.jpg');
}

.slide[data-bg="modern-office"] {
    background: linear-gradient(225deg, rgba(99, 102, 241, 0.7), rgba(124, 58, 237, 0.5)),
                url('assets/images/modern-office.jpg');
}

.slide[data-bg="automation-dashboard"] {
    background: linear-gradient(315deg, rgba(239, 68, 68, 0.7), rgba(220, 38, 38, 0.5)),
                url('assets/images/automation-dashboard.jpg');
}

.slide[data-bg="phone-booking"] {
    background: linear-gradient(180deg, rgba(168, 85, 247, 0.7), rgba(147, 51, 234, 0.5)),
                url('assets/images/phone-booking.jpg');
}
```

## 📸 Stock Photo Sources

### Free Options:
- **Unsplash** (unsplash.com): High-quality, free photos
- **Pexels** (pexels.com): Professional stock photos
- **Pixabay** (pixabay.com): Large variety of business images

### Paid Options (Higher Quality):
- **Shutterstock**: Premium business photography
- **Getty Images**: Professional, exclusive content
- **Adobe Stock**: Integrated with Creative Suite

### Search Terms to Use:
- "service technician working"
- "happy customer testimonial" 
- "modern office automation"
- "mobile app dashboard"
- "phone booking appointment"
- "home service professional"
- "customer satisfaction"
- "technology automation"

## 🎯 Current Slideshow Behavior

### Timing:
- **6 seconds per slide** (30 seconds full cycle)
- **2 second fade transition** between slides
- **Smooth opacity animation**
- **Infinite loop**

### Visual Features:
- **Subtle overlay gradients** maintain text readability
- **Color-coded themes** for different business aspects
- **Professional positioning** (right side for chat demo)
- **Mobile responsive** design

### Chat Demo Integration:
- **15-second animation cycle** (synced with slideshow)
- **Interactive phone mockup** shows chatbot in action
- **Positioned on right side** (desktop) or center (mobile)
- **Click interaction** triggers engagement notification

## 🔧 Customization Options

### Slide Timing:
Change slide duration in `script.js`:
```javascript
// Change slide every 6 seconds (currently)
setInterval(showNextSlide, 6000); // Modify this number
```

### Add More Slides:
1. Add new slide div in HTML:
```html
<div class="slide" data-bg="new-theme"></div>
```

2. Add corresponding CSS:
```css
.slide[data-bg="new-theme"] {
    background: /* your styles */;
}
```

### Transition Effects:
Modify CSS transition for different effects:
```css
.slide {
    transition: opacity 2s ease-in-out; /* Current */
    /* Try: transform 2s ease, filter 1s ease, etc. */
}
```

## 💡 Pro Tips

1. **Test on slow connections** - ensure images load quickly
2. **Use WebP format** where supported for smaller file sizes
3. **Consider lazy loading** for performance optimization
4. **Maintain consistent color themes** with your brand
5. **A/B test different images** to see what converts better
6. **Monitor page load speed** with tools like PageSpeed Insights

The current CSS pattern system provides a professional look while you source and prepare real images for maximum impact!