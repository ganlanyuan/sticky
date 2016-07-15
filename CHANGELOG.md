## Change log

#### v0.1.5
- Fixed: a breakpoint issue.

#### v0.1.4
- Fixed: a DOM element load issue.
- Improved: update *go-native* to version 0.0.3.
- Improved: better variables' name. 
- Improved: throw error information when element can't be found.

#### v0.1.3
- Fixed: an Array issue that only return the last sticky object no matter how many sticky elements are passed in.

#### v0.1.2
- Fixed: an ads rendering issue because of DOM updating. Now you can set sticky container manually by wrap sticky element with a `.sticky-container`.
```html
<div class="sticky-container">
  <div class="your-sticky"></div>
</div>
```

#### v0.1.1
- Update bower.json: move `go-native` from dependencies to devDependencies.

#### v0.1.0
- Improved: rewrite with Prototype Pattern.

#### v0.0.2
- Fixed: a `bower.json` syntax issue.
- Renamed: `.js-sticky-wrapper` to `.js-sticky-container`.

#### v0.0.1
- Fixed: an issue when `sticky` selector is not provided.
- Improved: no longer force `position` property to `bottom` when sticky element is longer than window height. You can freely set it to `top` or `bottom`.

#### v0.0.0
- Use: `position: fixed`, `position: absolute`.
- Support: multiple selector.
- Support: `top`, `bottom`.
- Improve performance by using `requestAnimationFrame`, `optimizedResize`.