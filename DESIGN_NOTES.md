# Design Notes: Vanish-UI Theme Integration

## Color Palette

The new website uses the vanish-ui color scheme with slight adjustments for the landing page context:

### Primary Colors
- **Background Primary**: `#0a0a0a` - Deep black for main background
- **Background Secondary**: `#111111` - Slightly lighter for cards
- **Background Tertiary**: `#1a1a1a` - For hover states and inputs
- **Accent Primary**: `#a855f7` - Purple (matches old site)
- **Accent Secondary**: `#8b3fd9` - Darker purple for gradients

### Text Colors
- **Text Primary**: `#ffffff` - Pure white for headings
- **Text Secondary**: `#b0b0b0` - Light gray for descriptions
- **Text Muted**: `#666666` - Darker gray for footer

### Effects
- **Border Color**: `#2a2a2a` - Subtle borders
- **Hover Color**: `#1f1f1f` - Interactive element hover
- **Shadow Color**: `rgba(0, 0, 0, 0.8)` - Deep shadows
- **Glow Color**: `rgba(168, 85, 247, 0.3)` - Purple glow on hover

## Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Fallback**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)

### Font Sizes
- **Heading**: 2.8em (mobile: 2.2em)
- **Subtitle**: 1.1em
- **Card Title**: 1.6em
- **Card Description**: 0.95em
- **Footer**: 0.85em

### Font Weights
- **Heading**: 700 (Bold)
- **Card Title**: 600 (Semi-bold)
- **Body**: 400 (Regular)

## Layout

### Container
- **Max Width**: 600px
- **Padding**: 60px 40px (mobile: 40px 24px)
- **Border Radius**: 20px
- **Background**: Secondary color with border

### Service Cards
- **Padding**: 28px 32px (mobile: 24px 28px)
- **Gap**: 16px between cards
- **Border**: 2px solid border-color
- **Border Radius**: 12px

## Animations & Transitions

### Timing Function
- **Primary**: `cubic-bezier(0.4, 0, 0.2, 1)` - Smooth, natural easing
- **Duration**: 0.3s for most transitions

### Hover Effects
1. **Transform**: `translateY(-2px)` - Subtle lift
2. **Border**: Changes to accent color
3. **Shadow**: Glowing purple shadow
4. **Gradient Overlay**: Fades in from transparent to glow color
5. **Title Color**: Changes to accent purple

### Accessibility
- Respects `prefers-reduced-motion` media query
- Reduces animation duration to 0.01ms for users who prefer less motion

## Component Structure

### Main Container
```
main (flex container, centered)
  └── .container (card with shadow)
      ├── h1 (title)
      ├── .subtitle (description)
      ├── .services (flex column)
      │   └── .service-card (repeated)
      │       ├── .emoji
      │       ├── h2 (service name)
      │       └── p (service description)
      └── footer
```

## Responsive Design

### Breakpoints
- **Mobile**: < 600px
  - Reduced padding
  - Smaller font sizes
  - Adjusted card spacing

### Mobile Optimizations
- Touch-friendly card sizes (min 44px height)
- Readable font sizes (minimum 0.85em)
- Adequate spacing for thumb navigation

## Vanish-UI Inspirations

### From vanish-ui/src/app.css
1. **CSS Custom Properties**: Using CSS variables for theming
2. **Dark Theme**: Deep blacks with purple accents
3. **Smooth Transitions**: cubic-bezier easing functions
4. **Gradient Buttons**: Linear gradients for accent elements
5. **Shadow System**: Layered shadows for depth
6. **Glow Effects**: Subtle glows on interactive elements

### From vanish-ui/src/lib/stores/theme.ts
1. **Color Palette**: Exact color values from Purple theme
2. **Accent Colors**: Primary and secondary purple shades
3. **Background Layers**: Three-tier background system
4. **Text Hierarchy**: Three levels of text colors

### Enhancements Over Original
1. **Gradient Overlay**: Added gradient overlay on card hover
2. **Emoji Display**: Larger, more prominent emoji icons
3. **Lift Effect**: Cards lift on hover for better feedback
4. **Glow Shadow**: Purple glow matches accent color
5. **Smooth Animations**: All transitions use consistent timing

## Performance Considerations

### Optimizations
1. **Static Generation**: Pre-rendered at build time
2. **Minimal JavaScript**: Only SvelteKit runtime
3. **CSS Variables**: Efficient theme system
4. **Font Loading**: Google Fonts with display=swap
5. **No Images**: Uses emoji for icons (no HTTP requests)

### Bundle Size
- **HTML**: ~2KB
- **CSS**: ~3KB
- **JS**: ~15KB (SvelteKit runtime)
- **Total**: ~20KB initial load

### Performance Metrics (Expected)
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Lighthouse Score**: 95+

## Browser Support

### Modern Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Features Used
- CSS Custom Properties (widely supported)
- CSS Grid & Flexbox (widely supported)
- CSS Transitions (widely supported)
- Modern JavaScript (ES2020+)

### Fallbacks
- System fonts if Google Fonts fail to load
- Reduced motion for accessibility
- Graceful degradation for older browsers

## Future Enhancements

### Potential Additions
1. **Theme Switcher**: Allow users to choose accent colors
2. **Service Status**: Show online/offline status for each service
3. **Search**: Filter services by name or description
4. **Categories**: Group services by type
5. **Analytics**: Track which services are most popular
6. **Dark/Light Mode**: Add light theme option
7. **Animations**: Add entrance animations for cards
8. **Service Details**: Expand cards to show more info

### Easy Customizations
- Change accent color in CSS variables
- Add more services to the array
- Modify card layout (grid instead of column)
- Add icons from icon library
- Include service screenshots
