# TEMPOINK Gradient Overlay Guide

## How to Use Gradient Overlays

I've added CSS gradient overlay utilities to your TEMPOINK theme. Here's how to use them:

## Available Gradient Classes

### 1. **Basic Gradient Overlay** (Dark Black to White, 0.6 opacity)
```html
<div class="gradient-overlay">
  <h2>Content goes here</h2>
  <p>This content will appear above the gradient</p>
</div>
```

### 2. **Dark Gradient Overlay** (Black to lighter black)
```html
<div class="gradient-overlay-dark">
  <h2>White text works well here</h2>
</div>
```

### 3. **Light Gradient Overlay** (Light white to more white)
```html
<div class="gradient-overlay-light">
  <h2>Dark text works well here</h2>
</div>
```

## Specific Usage Examples

### Hero Section with Gradient
```html
<section class="tempoink-hero gradient-overlay">
  <div class="slide-content">
    <h2>TEMPOINK™ Temporary Tattoos</h2>
    <p>Premium quality, lasts 1-2 weeks</p>
  </div>
</section>
```

### Product Image with Gradient
```html
<div class="product-image-container gradient-overlay">
  <img src="product-image.jpg" alt="Product">
</div>
```

### Banner with Gradient
```html
<div class="banner-image gradient-overlay" style="background-image: url('banner.jpg')">
  <h2>Sale Banner Text</h2>
</div>
```

## CSS Technical Details

The gradient overlay uses:
- **Direction**: Left to right (`to right`)
- **Start**: `rgba(0, 0, 0, 0.6)` - Dark black with 60% opacity
- **End**: `rgba(255, 255, 255, 0.6)` - White with 60% opacity
- **Position**: Absolute overlay using `::before` pseudo-element
- **Z-index**: Content appears above overlay (z-index: 2)

## Customization

To modify the gradient, edit these values in `assets/tempoink-theme.css`:

```css
.gradient-overlay::before {
  background: linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(255, 255, 255, 0.6)) !important;
}
```

### Change opacity:
- Change `0.6` to any value between `0.0` (transparent) and `1.0` (fully opaque)

### Change colors:
- `rgba(0, 0, 0, 0.6)` = Black with 60% opacity
- `rgba(255, 255, 255, 0.6)` = White with 60% opacity
- `rgba(255, 0, 0, 0.6)` = Red with 60% opacity

### Change direction:
- `to right` = Left to right
- `to left` = Right to left  
- `to bottom` = Top to bottom
- `to top` = Bottom to top
- `45deg` = Diagonal angle

## Where to Apply

You can add these classes to:
- Hero sections
- Product cards
- Banner images
- Collection headers
- Any div or section that needs an overlay effect

Simply add the class name to your HTML element and the gradient will appear automatically!