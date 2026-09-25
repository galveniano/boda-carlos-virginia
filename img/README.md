# Photos

Drop the three story photos here, with these exact filenames:

| Filename          | Section         | Source file in the Claude Design project        |
| ----------------- | --------------- | ----------------------------------------------- |
| `historia-1.jpeg` | La primera foto | `WhatsApp Image 2026-08-16 at 18.30.28.jpeg`    |
| `historia-2.jpeg` | El primer sí    | `WhatsApp Image 2026-08-16 at 18.49.42.jpeg`    |
| `historia-3.jpeg` | La pedida       | `WhatsApp Image 2026-08-16 at 18.38.07.jpeg`    |

`og-pedida.jpg` — the preview image shown when the link is shared on
WhatsApp: a square 600×600 crop of `historia-3.jpeg`. It has its own
filename because `/img/*` is served with an immutable cache header.

Each photo is displayed at 104×126 px, so anything above ~400 px wide is
already more than enough. Larger files only make the page slower to load.

A missing photo degrades to a soft placeholder — the layout never breaks.
