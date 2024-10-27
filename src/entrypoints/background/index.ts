// background/index.ts
const scripts = import.meta.glob<{ default: { main: () => void } }>("./*.background.ts", { eager: true });

export default defineBackground(() => {
  Object.values(scripts).forEach(script => script.default.main());
});
