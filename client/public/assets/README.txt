PERSONAL IMAGES - drop your files in this folder
================================================

The file NAME decides where an image appears. Any of these formats work:
.png .jpg .jpeg .webp .avif .gif .svg  (if two files share a name, .avif/.webp/.png win)

  hero.png         Hero portrait inside the arch (top of the page).
                   Best: a background-removed / transparent PNG, portrait orientation,
                   about 800 x 1160 px or larger. Head near the top.

  about.png        "About Me" photo. Shown uncropped at its own aspect ratio
                   (portrait works best), about 1000 px wide or larger.

  why.jpg          Photo card in "Why Work With Me?" (third photo). Shown cropped to
                   fill a ~10:9 card, so keep your face near the centre.
                   About 1000 x 900 px or larger.

  avatar.jpg       Small round photo in "My Approach". Square works best.
                   Optional: falls back to a face close-up of hero.*.

  code-editor.png  "Development environment" images (shown at 600 x 380 ratio).
  terminal.png     Use real screenshots of your editor, terminal and database schema,
  schema.png       or leave them out to keep the built-in illustrations.

  projects/        Project screenshots (for when projects are enabled).
                   Reference them in server/prisma/seed.ts as /assets/projects/<file>.

Replacing an image: overwrite the file (or drop in a new one with the same name)
and refresh the page. Nothing else needs to change.

Images are served exactly as uploaded (no compression), so keep each file
reasonably sized (under ~1-2 MB) for fast loading.
