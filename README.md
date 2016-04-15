## Sticky
![version](https://img.shields.io/badge/Version-0.1.2-blue.svg)  
Make elements stay visible within its container. Similar with CSS `position: sticky`.  
[demo](http://creatiointl.org/gallery/william/sticky/v0/tests/)  
[changelog](https://github.com/ganlanyuan/sticky/blob/master/CHANGELOG.md)  

## Why don't use `position: sticky`?
- Limited browser support, see [here](http://caniuse.com/#search=sticky).
- `position: sticky` only support direct parent element as container for now. 
  - If parent element has the same height with sticky element, there will be no sticky effect.
  - You can not set other container rather than direct parent element.   

But be aware of that native `position: sticky` has **better performance** and **no janking**.  
## Install
```
bower install sticky-elements --save
```

## Usage
##### 1. Include sticky
Include sticky (css, js)
```html
<link rel="stylesheet" href="sticky.css">

<!--[if (lt IE 9)]>
  <script src="sticky-helper.ie8.js"></script>
<![endif]-->
<script src="sticky.js"></script>
```
Or sticky.native (css, js) and [go-native](https://github.com/ganlanyuan/go-native) (10k),
```html
<link rel="stylesheet" href="sticky.css">

<!--[if (lt IE 9)]>
  <script src="go-native.ie8.js"></script>
<![endif]-->
<script src="go-native.js"></script>
<script src="sticky.native.js"></script>
```
##### 2. Call sticky
```javascript
sticky({
  sticky: '.my-sticky', 
  container: '.sticky-container', 
  position: 'bottom',
  padding: 10,
});
```

## Options
Default:
```javascript
{ 
  sticky: '.sticky',
  container: false,
  padding: 0,
  position: 'top',
  breakpoints: false,
}
```
- **sticky**: sticky selector.
- **container**: container selector. Must be a parent element, but not must be *direct* parent element.
- **padding**: the gap between sticky element and window frame.
- **position**: sticky position. `top`, `bottom` are available.
- **breakpoints**: the range you want sticky works in.
  - `breakpoints: [300]` means 300px and up.
  - `breakpoints: [300, 600]` means between 300px and 600px.
  - `breakpoints: [300, 600, 900]` means between 300px and 600px, or 900px up.
  - `breakpoints: [300, 600, 900, 1200]` means between 300px and 600px, or between 900px and 1200px.

## Browser Support
Tested on IE8+ and mordern browsers.

## License
This project is available under the [MIT](https://opensource.org/licenses/mit-license.php) license.  
