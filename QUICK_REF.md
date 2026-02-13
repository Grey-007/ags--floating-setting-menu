# AGS v3 Quick Reference

## Installation

```bash
./install.sh
ags
```

## File Structure

```
app.ts              ← Entry point
build.sh            ← CSS compiler
style/style.scss    ← Styles (edit here)
widgets/*/window.ts ← Windows (self-register)
```

## Core Pattern

```typescript
// app.ts
import "ags/style/style.css";
import "./widgets/myWindow/window.js";

// widgets/myWindow/window.ts
import { Widget } from "ags";

const MyWindow = Widget.Window({
    name: "my-window",
    child: Widget.Box({ ... }),
});
// Auto-registers!
```

## Modern Imports

```typescript
import { Widget, Variable, Utils, App } from "ags";
```

## Modern Properties

```typescript
Widget.Button({
    class_name: "btn",      // snake_case
    on_clicked: () => {},   // snake_case
})
```

## Variables (State)

```typescript
const myVar = Variable(false);

Widget.Label({
    label: myVar.bind().as(v => `Value: ${v}`),
})
```

## Common Widgets

```typescript
Widget.Window({ name, anchor, layer, child })
Widget.Box({ children, vertical, spacing })
Widget.Button({ child, on_clicked })
Widget.Label({ label })
Widget.Revealer({ reveal_child, transition })
Widget.Spinner({ active })
```

## Anchors

```typescript
anchor: ["top", "left", "right"]     // Top bar
anchor: ["bottom", "right"]          // Bottom-right
```

## Layers

```typescript
layer: "background" | "bottom" | "top" | "overlay"
```

## Build & Run

```bash
# Build CSS
./build.sh

# Start
ags

# Restart
ags quit && ags
```

## Add Window

1. Create `widgets/myWidget/window.ts`
2. Import in `app.ts`
3. Restart AGS

## Add Command

Edit `widgets/refreshMenu/utils/commands.ts`

## Edit Styles

1. Edit `style/style.scss`
2. Run `./build.sh`
3. Restart AGS

## No More

- ❌ `App.config()`
- ❌ `resource:///...` imports
- ❌ Runtime SCSS compilation
- ❌ Manual window registration
- ❌ camelCase properties

## Yes Now

- ✅ Windows self-register
- ✅ `import { Widget } from "ags"`
- ✅ Pre-compiled CSS
- ✅ Import windows in app.ts
- ✅ snake_case properties

---

**Full docs:** README.md, MIGRATION_GUIDE.md
