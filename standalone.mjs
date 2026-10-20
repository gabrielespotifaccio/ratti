import {readFile,writeFile} from 'node:fs/promises';
// The Vite output is one self-contained JS chunk; inlining it makes a gift
// edition that also opens directly from disk, without Node or a web server.
let html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
const script=html.match(/<script[^>]*src="([^"]+)"[^>]*><\/script>/);
const style=html.match(/<link[^>]*href="([^"]+\.css)"[^>]*>/);
if(!script||!style)throw new Error('Expected a single Vite script and stylesheet');
const js=await readFile(new URL('../dist/'+script[1].replace(/^\.\//,''),import.meta.url),'utf8');
const css=await readFile(new URL('../dist/'+style[1].replace(/^\.\//,''),import.meta.url),'utf8');
html=html.replace(script[0],()=>`<script type="module">${js.replaceAll('</script','<\\/script')}</script>`).replace(style[0],()=>`<style>${css}</style>`);
await writeFile(new URL('../Apri-il-mondo.html',import.meta.url),html);
console.log('Created Apri-il-mondo.html (standalone offline edition)');
