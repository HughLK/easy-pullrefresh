# easy-pullrefresh

🎯 A lightweight, dependency-free **pull to refresh library** for mobile web. Supports both **Vue** and **React**, and written in **TypeScript**.

## 🚀 Features

- ✅ **Tiny & fast**
- ✅ **No dependencies**
- ✅ **No HTML Layout Requirements**
- ✅ **Smooth damping effect**
- ✅ **Custom indicator rendering**
- ✅ **Supports both Vue & React**
- ✅ **Typescript support out-of-the-box**

---

## 📦 Installation
```bash
npm install easy-pullrefresh
```

## ⚙️ Usage
### Basic Example

```ts
import initPullRefresh from 'easy-pullrefresh'

initPullRefresh({
  container: document.querySelector('.scroll-container'),
  onRefresh: async () => {
    await fetchData()
  },
  indicatorRender: (status) => {
    if (status === 'pulling') return '<span style="color: #e8e8e8">↕ Pull to refresh...</span>'
    if (status === 'loading') return '🔄 Refreshing...'
    return ''
  }
})
```
---

## 📌 Options

| Option           | Type                          | Required | Description |
|------------------|-------------------------------|----------|-------------|
| `container`      | `HTMLElement`                 | ✅       | Scrollable container |
| `onRefresh`      | `() => Promise<void>`         | ✅       | Called when pull exceeds threshold |
| `indicatorRender`| `(status, distance) => string`          | ❌       |Render function for status indicator.  <br> The `status` can be: <br> - `'idle'`: no interaction<br> - `'pulling'`: user is pulling<br> - `'loading'`: refresh in progress. <br> The `distance` is the pull distance |
| `threshold`      | `number`                      | ❌       | Minimum pull distance to trigger `onRefresh` (default: `60`) |

---

## 💡 Advanced Tips

* Want to control animation of the indicator on pulling? Use **Lottie**, SVG or sprite frames inside `indicatorRender`.
