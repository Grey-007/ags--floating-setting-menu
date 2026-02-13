# AGS v3 API Comparison - Old vs Modern

## Entry Point

### ❌ Old (v1/v2)
```javascript
// config.js or index.js
const { App } = ags;
import { MyWindow } from "./window.js";

App.config({
    style: "./style.css",
    windows: [
        MyWindow(),
    ],
});
```

### ✅ New (v3 Modern)
```typescript
// app.ts
import "ags/style/style.css";
import "./widgets/myWindow/window.js";

// That's it! Windows self-register
```

---

## Imports

### ❌ Old
```javascript
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Variable from "resource:///com/github/Aylur/ags/variable.js";
import Utils from "resource:///com/github/Aylur/ags/utils.js";
import { App } from "resource:///com/github/Aylur/ags/app.js";
```

### ✅ New
```typescript
import { Widget, Variable, Utils, App } from "ags";
```

---

## Window Creation

### ❌ Old
```javascript
// window.js
export function MyWindow() {
    return Widget.Window({
        name: "my-window",
        child: Widget.Box({ ... }),
    });
}

// Then in config.js
App.config({
    windows: [MyWindow()],
});
```

### ✅ New
```typescript
// window.ts
import { Widget } from "ags";

const MyWindow = Widget.Window({
    name: "my-window",
    child: Widget.Box({ ... }),
});

// Auto-registers! No export, no App.config()

// In app.ts, just import:
import "./widgets/myWindow/window.js";
```

---

## Property Names

### ❌ Old (camelCase)
```javascript
Widget.Button({
    className: "my-button",
    onClicked: () => {},
    hexpand: true,
})

Widget.Box({
    vertical: true,
    className: "my-box",
})
```

### ✅ New (snake_case)
```typescript
Widget.Button({
    class_name: "my-button",
    on_clicked: () => {},
    hexpand: true,  // This one stays camelCase
})

Widget.Box({
    vertical: true,  // This one stays camelCase
    class_name: "my-box",
})
```

**Rule:** Event handlers and CSS classes use snake_case. Widget properties stay camelCase.

---

## SCSS Compilation

### ❌ Old (Runtime)
```javascript
// In config.js
const scss = `${App.configDir}/style.scss`;
const css = `${App.configDir}/style.css`;
Utils.exec(`sassc ${scss} ${css}`);  // Runs every time AGS starts

App.config({ style: css });
```

### ✅ New (Pre-compiled)
```bash
# Run once before starting AGS
./build.sh  # Compiles SCSS to CSS

# Or manually
sassc style/style.scss style/style.css
```

```typescript
// In app.ts
import "ags/style/style.css";  // Pre-compiled CSS
```

**Why:** Faster startup, no shell execution at runtime

---

## CSS Loading

### ❌ Old
```javascript
App.config({
    style: "./style.css",  // Path as string
});
```

### ✅ New
```typescript
import "ags/style/style.css";  // ES6 import
// Resolves to: ~/.config/ags/style/style.css
```

---

## Variable Binding

### ✅ Same!
```typescript
import { Variable } from "ags";

const myVar = Variable(false);

Widget.Label({
    label: myVar.bind().as(v => `Value: ${v}`),
})

Widget.Revealer({
    reveal_child: myVar.bind(),
})
```

**No changes here!**

---

## Utils

### ❌ Old Import
```javascript
import Utils from "resource:///com/github/Aylur/ags/utils.js";
```

### ✅ New Import
```typescript
import { Utils } from "ags";
```

### ✅ Usage (Same)
```typescript
// Async
await Utils.execAsync(['command', 'arg']);

// Sync
Utils.exec('command arg');

// Watch
Utils.watch('path/to/file', callback);
```

---

## Complete Example

### ❌ Old Project Structure
```
~/.config/ags/
├── config.js          # Has App.config()
├── style.scss
├── widgets/
│   └── window.js      # export function MyWindow()
```

**config.js:**
```javascript
const { App } = ags;
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { MyWindow } from "./widgets/window.js";

const scss = `${App.configDir}/style.scss`;
const css = `${App.configDir}/style.css`;
Utils.exec(`sassc ${scss} ${css}`);

App.config({
    style: css,
    windows: [MyWindow()],
});
```

**widgets/window.js:**
```javascript
import Widget from "resource:///com/github/Aylur/ags/widget.js";

export function MyWindow() {
    return Widget.Window({
        name: "my-window",
        className: "window",
        child: Widget.Label({ label: "Hello" }),
    });
}
```

### ✅ New Project Structure
```
~/.config/ags/
├── app.ts             # Entry point
├── build.sh           # CSS compiler
├── style/
│   ├── style.scss     # Source
│   └── style.css      # Compiled
└── widgets/
    └── window.ts      # Window self-registers
```

**app.ts:**
```typescript
import "ags/style/style.css";
import "./widgets/window.js";
```

**widgets/window.ts:**
```typescript
import { Widget } from "ags";

const MyWindow = Widget.Window({
    name: "my-window",
    class_name: "window",
    child: Widget.Label({ label: "Hello" }),
});
```

**build.sh:**
```bash
#!/bin/bash
sassc style/style.scss style/style.css
```

---

## Migration Steps

1. **Rename config.js → app.ts**

2. **Remove App.config():**
   ```typescript
   // Before
   App.config({ windows: [...], style: css });
   
   // After
   import "ags/style/style.css";
   import "./widgets/window.js";
   ```

3. **Update imports:**
   ```typescript
   // Before
   import Widget from "resource:///com/github/Aylur/ags/widget.js";
   
   // After
   import { Widget } from "ags";
   ```

4. **Fix window exports:**
   ```typescript
   // Before
   export function MyWindow() {
       return Widget.Window({ ... });
   }
   
   // After
   const MyWindow = Widget.Window({ ... });
   ```

5. **Fix property names:**
   ```typescript
   // Before
   className: "...", onClicked: () => {}
   
   // After
   class_name: "...", on_clicked: () => {}
   ```

6. **Create build script:**
   ```bash
   #!/bin/bash
   sassc style/style.scss style/style.css
   ```

7. **Move styles:**
   ```
   style.scss → style/style.scss
   ```

8. **Build CSS:**
   ```bash
   ./build.sh
   ```

9. **Test:**
   ```bash
   ags
   ```

---

## Summary

| Aspect | Old | New |
|--------|-----|-----|
| Entry | `App.config()` | Import windows |
| Imports | `resource:///...` | `from "ags"` |
| Windows | Export function | Create const |
| Props | camelCase | snake_case (events) |
| CSS | Runtime compile | Pre-compiled |
| Loading | `style: path` | `import "ags/style/..."` |

---

**Result:** Cleaner, faster, more maintainable code! 🚀
