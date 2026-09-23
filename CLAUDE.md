# CLAUDE.md --- Excel Minds Academy PU College Website

## 0. Project identity

Build a premium, modern, highly polished website for:

**Excel Minds Academy PU College**

This is a **PU College / pre-university college website**, not a generic
coaching-center website.

The website should communicate: - academic excellence - a premium
learning environment - student growth - confidence and ambition - a
modern, top-class academy experience

The intended visual quality is extremely premium --- the user's
shorthand is a **"₹10 lakh website"** / "₹10,000+ quality website"
feeling. Treat this as an aesthetic-quality target, not literal
marketing copy.

------------------------------------------------------------------------

## 1. Authoritative information sources

Before writing factual content, use the following sources.

### Primary location/institution source

Google Maps: https://maps.app.goo.gl/231UHNYPajzNYDEcA?g_st=aw

Use this as the main source for: - institution name - location/address -
contact details if publicly available - opening hours if publicly
available - photos - public-facing factual information

### Instagram

Official/public Instagram reference supplied by the user:
https://www.instagram.com/excel_minds.academy?stkn=dW45cTAzZGJ2cnNn

Use it for: - visual direction - public posts/photos/videos - branding
cues - publicly stated information - understanding the academy's
real-world atmosphere

### Important factual rule

Do NOT invent: - courses - facilities - results - faculty credentials -
rankings - affiliations - student counts - placement statistics -
awards - claims such as "No.1" or "best in India"

If a fact cannot be verified from the provided sources or trustworthy
public sources, either omit it or clearly avoid presenting it as fact.

------------------------------------------------------------------------

## 2. Existing assets

There may already be assets in the project directory.

### Required behavior

First inspect the entire existing project/assets directory.

Reuse high-quality existing: - logos - photographs - campus images -
academic images - icons - videos - brand assets

Do not replace useful assets unnecessarily.

### Video folder

Create/use:

`assets/vedios/`

The user specifically requested the folder name **vedios**.

The supplied hero video is vertical/mobile-oriented. Use the supplied
video as the **mobile hero background**.

If multiple supplied MP4 files exist: - inspect their
dimensions/content - identify the intended academy hero video - do not
duplicate large files unnecessarily - preserve the original quality
where practical

The supplied videos are vertical 720×1280 assets and are approximately
26.5 seconds long.

------------------------------------------------------------------------

## 3. Responsive design is a first-class requirement

The site must be designed for **phone and laptop from the beginning**.

Do NOT build desktop first and merely shrink it for mobile.

### Desktop

Use a strong cinematic image/visual for the hero.

### Mobile

Use the supplied vertical video as the hero background.

The mobile hero video should: - autoplay where browser policy permits -
be muted - loop - use `playsInline` - have an appropriate
poster/fallback image - remain readable behind the hero content - not
cause layout jumps

If autoplay fails, the design must still look excellent with the
poster/fallback image.

------------------------------------------------------------------------

## 4. Entire website must be static

This is a **static website**.

Do NOT introduce: - backend servers - databases - authentication - CMS
requirements - unnecessary APIs - server-side application logic -
dynamic data fetching at runtime

Prefer static/local assets and static content.

If the existing project already has a framework, preserve its
architecture unless there is a strong technical reason to change it.

The final result should be deployable as a static site.

------------------------------------------------------------------------

## 5. Overall visual direction

The target is:

**premium + cinematic + academic + modern + confident + memorable**

Avoid: - generic school templates - cheap-looking gradients - excessive
rounded cards everywhere - random stock photos - clutter - giant
paragraphs - repetitive sections - excessive UI chrome - "template"
feeling - childish school aesthetics

The website should feel like a serious, premium institution.

Use: - strong typography - sophisticated spacing - visual hierarchy -
cinematic photography/video - subtle depth - refined transitions -
carefully controlled color palette - elegant hover states - intentional
motion - premium micro-interactions

The logo can be treated creatively. If the supplied logo has an unwanted
background and removing it improves the composition, use a
transparent/clean version where legally and technically appropriate.

Do not distort the logo.

------------------------------------------------------------------------

## 6. Animation direction

The user explicitly wants a **crazy amount of animation**, but it must
still feel premium.

The goal is: **high interaction density without visual chaos.**

Use a coherent motion system.

Possible motion: - cinematic hero entrance - text reveal - staggered
section reveals - image clipping/reveals - parallax - scroll-linked
transformations - horizontal scrolling sections - hover interactions -
magnetic buttons where appropriate - subtle image scale - masked
transitions - pinned sections where useful - marquee movement -
cursor/hover reactions - layered depth - smooth section transitions

Animations must: - remain performant - work on mobile - respect
`prefers-reduced-motion` - not make text unreadable - not cause
horizontal overflow - not trap the user in scrolling - not turn every
element into an animation

Prefer intentional choreography over adding random effects.

------------------------------------------------------------------------

## 7. Marquees

Include at least:

### Marquee 1

An infinite marquee for a short, premium brand/value statement.

### Marquee 2

An interactive image marquee/gallery.

The image marquee should feel **grabbable / draggable** on touch devices
where practical.

It should communicate: "this is a premium academy with a strong
real-world environment."

Do not make the marquee so large that it dominates the entire site.

------------------------------------------------------------------------

## 8. Website length

The website must be **short and sweet**.

Especially on phones: - avoid excessive vertical scrolling - avoid 15+
repetitive sections - combine related information - use visual
storytelling instead of long text - prioritize the most useful
information

A compact, high-impact one-page experience is preferred unless research
shows a separate page is genuinely necessary.

------------------------------------------------------------------------

## 9. Suggested content architecture

Do not blindly implement every section below. Use only what improves the
final experience.

A possible structure:

1.  **Hero**
    -   desktop image
    -   mobile vertical video
    -   strong headline
    -   concise supporting copy
    -   primary CTA
    -   subtle scroll cue
2.  **Academy introduction**
    -   very short
    -   premium typography
    -   strong visual treatment
3.  **Academic / learning experience**
    -   concise cards or visual composition
    -   only verified information
4.  **Campus / environment**
    -   image-led section
    -   use real supplied/public images
5.  **Interactive image marquee**
    -   real academy imagery
6.  **Short proof/experience section**
    -   only verified facts
7.  **Location / contact**
    -   map/location CTA
    -   phone/contact CTA if verified
8.  **Final CTA**
    -   memorable closing visual
    -   concise call to action

The exact structure can change after research and asset inspection.

------------------------------------------------------------------------

## 10. Research and inspiration

Before implementation, browse the internet for inspiration from
high-quality: - PU colleges - premium schools - modern academies -
educational institutions - university websites

Study: - hero composition - typography - navigation - motion - editorial
layouts - image treatment - responsive behavior - interaction patterns

Use inspiration to create an **original design**.

Do NOT clone another site's: - layout - text - branding - imagery -
source code - distinctive visual identity

The goal is to synthesize patterns into an original Excel Minds Academy
identity.

------------------------------------------------------------------------

## 11. Figma MCP

Figma MCP is available.

Use Figma when it provides genuine value for: - exploring visual
references - creating/refining design direction - working with design
assets - understanding layout ideas

Do not waste time creating a full Figma mockup if the same quality can
be achieved directly in code.

The final website is the priority.

------------------------------------------------------------------------

## 12. Playwright MCP

Playwright MCP is available.

Use Playwright to verify the finished site.

At minimum test: - desktop viewport - mobile viewport - navigation -
hero - mobile video behavior - marquee behavior - major animations -
buttons/links - absence of horizontal overflow - visual layout -
console/runtime issues where visible

Check both: - normal viewport - narrow phone viewport

Do not consider the task finished until the site has been visually
inspected.

------------------------------------------------------------------------

## 13. Quality bar

The site should feel: - expensive - intentional - modern - cinematic -
polished - responsive - fast - memorable

Every section should justify its existence.

If a section looks generic, redesign it.

If an animation does not improve the experience, remove it.

If a design element feels like a template, replace it with something
more editorial and distinctive.

------------------------------------------------------------------------

## 14. Performance requirements

Premium does not mean slow.

Optimize: - images - video loading - animation performance - font
loading - layout stability - mobile performance

For the mobile hero video: - keep it muted - use appropriate loading
strategy - avoid loading unnecessary desktop-only media on mobile -
provide a poster/fallback

Avoid heavy libraries unless they are genuinely useful.

------------------------------------------------------------------------

## 15. Accessibility

Maintain: - readable contrast - semantic HTML - keyboard-accessible
controls - visible focus states - meaningful alt text - reduced-motion
support - usable mobile tap targets

Animations must never prevent access to content.

------------------------------------------------------------------------

## 16. Content tone

Copy should be: - concise - confident - modern - aspirational -
academically credible

Avoid: - exaggerated claims - fake statistics - empty marketing
buzzwords - huge paragraphs

The visual design should do most of the storytelling.

------------------------------------------------------------------------

## 17. Build workflow

Before making major changes:

### Phase 1 --- Inspect

-   inspect project structure
-   inspect all assets
-   inspect logo
-   inspect supplied videos
-   inspect existing code
-   identify framework/build system

### Phase 2 --- Research

-   research the provided Google Maps information
-   inspect the supplied Instagram presence where accessible
-   browse premium educational websites for inspiration
-   identify a visual direction

### Phase 3 --- Plan

Create a concise implementation plan covering: - page structure - visual
system - typography - color system - responsive behavior - animation
system - asset usage

### Phase 4 --- Implement

Build the website in the existing project.

### Phase 5 --- Verify

Use Playwright MCP to inspect: - desktop - mobile - animation behavior -
video - marquee - links - overflow - visual polish

### Phase 6 --- Refine

Fix anything that looks: - generic - broken - crowded - slow -
inconsistent - poorly responsive

Then do a final visual pass.

------------------------------------------------------------------------

## 18. Critical instruction

Do not start by blindly coding.

**First understand the academy, inspect the assets, research the design
space, and then build.**

The user's core requirement is not merely "make a website."

It is:

> Make Excel Minds Academy PU College feel like a premium, modern,
> top-class institution through a short, cinematic, highly interactive,
> responsive static website.

Prioritize the experience over the number of sections.
