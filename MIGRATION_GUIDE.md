# AGS v3 Modern Architecture - Migration Guide

## ✅ Fully Migrated to AGS v3 Current API

This configuration uses the **latest AGS v3 patterns** (as of 2024+).

## 🔑 Key Changes from Old Versions

### 1. No App.config()
**OLD (v1/v2):**
```javascript
App.config({
    windows: [MyWindow()],
    style: css,
});
```

**NEW (v3):**
```typescript
// Windows self-register when imported
import "./widgets/refreshMenu/window.js";
```

### 2. Modern Import Paths
**OLD:**
```javascript
import Widget from "resource:///com/github/Aylur/ags/widget.js";
```

**NEW:**
```typescript
import { Widget, App, Variable, Utils } from "ags";
```

### 3. No Runtime SCSS Compilation
**OLD:**
```javascript
Utils.exec(`sassc ${scss} ${css}`); // At runtime
```

**NEW:**
```bash
# Pre-compile before starting AGS
./build.sh
ags
```

### 4. Windows Self-Register
**OLD:**
```javascript
export function MyWindow() {
    return Widget.Window({ ... });
}
```

**NEW:**
```typescript
// Create and it auto-registers
const MyWindow = Widget.Window({ ... });
// No export needed for registration
```

### 5. Property Names (snake_case)
**OLD:**
```javascript
Widget.Button({
    className: "my-class",
    onClicked: () => {},
});
```

**NEW:**
```typescript
Widget.Button({
    class_name: "my-class",
    on_clicked: () => {},
});
```

## 📁 File Structure

```
~/.config/ags/
├── app.ts                           ← Entry point (imports windows)
├── build.sh                         ← SCSS compilation script
├── tsconfig.json                    ← TypeScript config (optional)
├── style/
│   ├── style.scss                   ← Source styles
│   └── style.css                    ← Compiled CSS (generated)
└── widgets/
    └── refreshMenu/
        ├── window.ts                ← Window (self-registers)
        ├── components/
        │   └── section.ts
        ├── sections/
        │   ├── refreshApps.ts
        │   └── comingSoon.ts
        └── utils/
            └── commands.ts
```

## 🚀 Installation

### Prerequisites

```bash
# AGS v3
yay -S aylurs-gtk-shell

# SASS compiler (for build script)
sudo pacman -S sassc

# Nerd Fonts (for icons)
yay -S ttf-nerd-fonts-symbols-mono
```

### Install Widget

```bash
# Copy to AGS config
cp -r * ~/.config/ags/

# Build CSS
cd ~/.config/ags
./build.sh

# Start AGS
ags
```

## 🔨 Build Process

AGS v3 does **NOT** compile SCSS at runtime. You must pre-compile:

```bash
# Compile SCSS to CSS
./build.sh

# Or manually
sassc style/style.scss style/style.css
```

After editing SCSS, rebuild and restart AGS:

```bash
./build.sh
ags quit
ags
```

## 📝 How It Works

### Boot Sequence

```
1. AGS v3 starts
2. Loads app.ts
3. app.ts imports style.css (pre-compiled)
4. app.ts imports window.ts
5. window.ts creates Widget.Window() → auto-registers
6. Window appears on screen
```

### Window Self-Registration

In AGS v3, creating a window automatically registers it:

```typescript
// This is enough - no export, no App.config()
const MyWindow = Widget.Window({
    name: "my-window",
    child: Widget.Label({ label: "Hello" }),
});
```

### CSS Loading

CSS must exist before AGS starts:

```typescript
// In app.ts
import "ags/style/style.css";  // Resolves to style/style.css
```

## ➕ Adding More Windows

The architecture is modular. To add a bar:

### 1. Create window file

**`widgets/bar/window.ts`:**
```typescript
import { Widget } from "ags";

const Bar = Widget.Window({
    name: "bar",
    anchor: ["top", "left", "right"],
    exclusivity: "exclusive",
    child: Widget.Box({
        children: [
            Widget.Label({ label: "My Bar" }),
        ],
    }),
});
```

### 2. Import in app.ts

**`app.ts`:**
```typescript
import "ags/style/style.css";
import "./widgets/refreshMenu/window.js";
import "./widgets/bar/window.js";  // ← Add this
```

### 3. Restart

```bash
ags quit
ags
```

That's it! No App.config(), no exports, no manual registration.

## 🎨 Styling

Edit `style/style.scss`, then rebuild:

```bash
./build.sh
ags quit
ags
```

### CSS Variables

All colors use CSS variables for easy theming:

```scss
* {
    --primary: #89b4fa;
    --surface: #1e1e2e;
    // ... edit these
}
```

## 🔧 API Reference

### Modern Widget Creation

```typescript
import { Widget, Variable } from "ags";

// State
const myVar = Variable(false);

// Widgets
Widget.Window({ ... })
Widget.Box({ ... })
Widget.Button({
    class_name: "my-button",
    on_clicked: () => {},
    child: Widget.Label({ label: "Click me" }),
})

// Reactive binding
Widget.Label({
    label: myVar.bind().as(v => `Value: ${v}`),
})

Widget.Revealer({
    reveal_child: myVar.bind(),
    transition: "slide_up",
})
```

### Utils

```typescript
import { Utils } from "ags";

// Async command
await Utils.execAsync(['hyprctl', 'reload']);

// Sync command (blocking)
Utils.exec('ags quit');
```

## 🐛 Troubleshooting

### "Cannot find module 'ags'"

**Solution:** Using old import paths. Update to:
```typescript
import { Widget } from "ags";
```

### "style.css not found"

**Solution:** Run build script first:
```bash
./build.sh
```

### "Window not appearing"

**Solution:** Windows self-register. Just import the file:
```typescript
import "./widgets/myWindow/window.js";
```

### Property errors (className, onClicked)

**Solution:** Use snake_case:
```typescript
class_name: "...",
on_clicked: () => {},
```

## 📊 Migration Checklist

- ✅ Remove `App.config()`
- ✅ Change imports to `import { ... } from "ags"`
- ✅ Remove `export function Window()` pattern
- ✅ Change `const X = Widget.Window()` (auto-registers)
- ✅ Change camelCase to snake_case for properties
- ✅ Pre-compile SCSS (no runtime compilation)
- ✅ Import CSS in app.ts
- ✅ Remove window returns/exports

## 🎯 Pattern Examples

### Old vs New Window

**OLD:**
```javascript
export function MyWindow() {
    return Widget.Window({ ... });
}

// In config.js
App.config({
    windows: [MyWindow()],
});
```

**NEW:**
```typescript
// In window.ts
const MyWindow = Widget.Window({ ... });

// In app.ts
import "./widgets/myWindow/window.js";
```

### Old vs New Variable Binding

**OLD:**
```javascript
label: myVar.bind().as(v => v),
```

**NEW:**
```typescript
label: myVar.bind().as(v => v),  // Same!
// But use snake_case for properties
```

### Old vs New Imports

**OLD:**
```javascript
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Variable from "resource:///com/github/Aylur/ags/variable.js";
```

**NEW:**
```typescript
import { Widget, Variable, App, Utils } from "ags";
```

## 📚 Additional Resources

- **AGS Documentation:** https://aylur.github.io/ags-docs/
- **AGS v3 Examples:** https://github.com/Aylur/ags/tree/main/example
- **Widget Reference:** Check AGS docs for full widget API

---

**This configuration is production-ready for AGS v3!** 🚀

All deprecated patterns removed. Pure modern API only.
