---
slug: html-media-audio-video-embeds
id: html-07
track: html
order: 7
title: Media — Audio, Video, Embeds
description: Embed audio and video the modern way, with captions, fallback content, and respect for browser autoplay policies. This stage covers `<video>`, `<audio>`, `<source>`, `<track>`, and embed strategies.
difficulty: beginner
estMinutes: 165
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=kUMe1FH4CHE&t=2300s
whyItMatters: Embed audio and video the modern way, with captions, fallback content, and respect for browser autoplay policies. This stage covers `<video>`, `<audio>`, `<source>`, `<track>`, and embed strategies.
deepDiveResources:
  - label: W3Schools HTML
    url: https://www.w3schools.com/html/
    kind: course
  - label: HTML Official Docs
    url: https://developer.mozilla.org/en-US/docs/Web/HTML
    kind: doc
---

# Media — Audio, Video, Embeds

## Media — Audio, Video, Embeds

### Why It Matters

Embed audio and video the modern way, with captions, fallback content, and respect for browser autoplay policies. This stage covers `<video>`, `<audio>`, `<source>`, `<track>`, and embed strategies.

Embed audio and video the modern way, with captions, fallback content, and respect for browser autoplay policies. This stage covers `<video>`, `<audio>`, `<source>`, `<track>`, and embed strategies.

### Prerequisites

- Stage 1: Getting Started with HTML
- Stage 3: Links and Images
- Stage 6: Semantic HTML and Document Outline

### Topics

- The `<video>` element: `src`, `controls`, `poster`, `preload`, `muted`, `loop`, `playsinline`
- The `<audio>` element and its attributes
- Multiple `<source>` elements with codec fallbacks
- The `<track>` element for captions, subtitles, and chapters
- Autoplay policies and why `muted` is required
- `<embed>` and `<object>` for legacy plugin content
- The `<picture>` element for art direction (recap)
- Performance: `preload="none"`, lazy loading, file size

### Key Concepts

- Always provide `controls` unless you build a custom player; without it, the user cannot play the media.
- Browsers block autoplay with sound; use `muted autoplay` for muted autoplaying background video.
- Captions are a WCAG requirement for video with audio; `<track kind="captions">` provides them.
- The `poster` attribute is the image shown before playback; without it, the first frame may be black.
- Different browsers support different codecs (H.264, VP9, AV1); use multiple `<source>` elements.

```html
<video controls preload="metadata" poster="cover.jpg" width="1280" height="720">
  <source src="movie.webm" type="video/webm">
  <source src="movie.mp4" type="video/mp4">
  <track kind="captions" src="captions.en.vtt" srclang="en" label="English" default>
  <track kind="subtitles" src="subtitles.es.vtt" srclang="es" label="Spanish">
  <p>Your browser does not support HTML5 video. <a href="movie.mp4">Download it</a>.</p>
</video>
```
Caption: Accessible video with captions

### Common Pitfalls

- `autoplay` without `muted` — blocked by all modern browsers; add `muted` and `playsinline` for iOS support.
- Missing `<track kind="captions">` on video with audio — fails WCAG 1.2.2 (Captions); always provide captions for video with audio.
- No fallback content inside `<video>`/`<audio>` — old browsers render nothing; include a download link or text fallback.
- Missing `poster` attribute — the video frame is black before play; provide a poster image for a professional look.
- Single-source video in only one codec — some browsers cannot play it; provide at least WebM + MP4.

### Real-World Applications

- YouTube embeds use `<iframe>` but YouTube's own player page is a custom HTML5 `<video>` with `<track>` captions and multiple DASH sources.
- Spotify's web player uses `<audio>` with a custom UI; the audio element is hidden and controlled via JavaScript.
- Vimeo's embed provides `<track>` captions in 30+ languages and a `poster` frame for every video.
- Apple Music web uses encrypted media extensions (EME) wrapped around a hidden `<video>` element for DRM playback.

### Interview Questions

- 1. Why does `autoplay` fail without `muted`? — Browsers block autoplay with sound to prevent unwanted noise; muted autoplay is allowed because it is less disruptive.
- 2. What does the `<track>` element do? — Provides timed text tracks (captions, subtitles, chapters, descriptions) for video/audio in WebVTT format.
- 3. What is the difference between captions and subtitles? — Captions are for deaf viewers (same language, includes sound effects); subtitles are translations for hearing viewers.
- 4. Why provide multiple `<source>` elements? — Browser codec support varies (H.264, VP9, AV1); multiple sources ensure playback across browsers.
- 5. What is `preload="none"` for? — Tells the browser not to preload any media data, saving bandwidth when the user is unlikely to play it.

### Mini Project

Build a Video Gallery Page: A page with a hero background video (muted autoplay) and a gallery of 3-5 video cards each with poster, controls, and captions. Suggested approach:
  - Add a hero `<video autoplay muted loop playsinline>` with a poster
  - Below, build a grid of `<video controls poster="...">` cards
  - Each video includes `<source>` for WebM and MP4 plus a `<track kind="captions">`
  - Add a `<p>` fallback inside each video with a download link
  - Use `<figure>` and `<figcaption>` to caption each video with its title

### Exercises

1. Add a second `<track kind="subtitles">` in another language and switch tracks in the player UI.
2. Set `preload="none"` on all videos and verify the page loads faster with no media requests.
3. Provide a `poster` for every video and confirm the gallery looks intentional before play.
4. Try to autoplay a video with sound and observe the browser console warning; add `muted` to fix it.
5. Provide AVIF/AV1 sources first and verify Chrome picks them while Safari falls back to MP4.
6. >>> QUIZ (Stage 7) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which attribute is REQUIRED for autoplay to work in modern browsers?
9. A) controls
10. B) loop
11. C) preload
12. D) muted (*)
13. Explanation: Browsers block autoplay with sound; `muted` (along with `playsinline` on iOS) is required for autoplay to succeed.
14. Q2: Which element provides timed captions for a video?
15. A) <caption>
16. B) <track> (*)
17. C) <subtitle>
18. D) <vtt>
19. Explanation: `<track kind="captions">` references a WebVTT file with timed text for deaf viewers.
20. Q3: What is the purpose of the `poster` attribute on `<video>`?
21. A) To set the video thumbnail before playback (*)
22. B) To add a watermark
23. C) To compress the video
24. D) To enable captions
25. Explanation: `poster` is the image shown before the video plays; without it the frame is black until playback starts.
26. Q4: Why provide multiple `<source>` elements?
27. A) For load balancing
28. B) Browser codec support varies; multiple sources ensure compatibility (*)
29. C) To enable 4K
30. D) To add captions
31. Explanation: Different browsers support different codecs (H.264, VP9, AV1); listing WebM + MP4 sources covers all modern browsers.
32. Q5: What does `preload="none"` do?
33. A) Disables the video
34. B) Mutes the video
35. C) Prevents the browser from preloading any media data (*)
36. D) Removes the controls
37. Explanation: `preload="none"` tells the browser not to fetch media metadata or data until the user clicks play, saving bandwidth.
38. Q6: Which attribute must be added for autoplay to work on iOS Safari?
39. A) playsinline (*)
40. B) ios="true"
41. C) webkit-plays
42. D) safari="auto"
43. Explanation: iOS requires `playsinline` to prevent fullscreen takeover; combined with `muted` and `autoplay`, it enables inline autoplay.
44. Q7: What format are `<track>` files written in?
45. A) SRT
46. B) JSON
47. C) WebVTT (*.vtt) (*)
48. D) XML
49. Explanation: HTML5 standardizes on WebVTT (Web Video Text Tracks) for the `<track>` element; .srt can be converted easily.
50. Q8: What is the difference between `kind="captions"` and `kind="subtitles"`?
51. A) No difference
52. B) Captions are smaller
53. C) Captions are for deaf viewers (same language); subtitles are translations (*)
54. D) Subtitles are audio
55. Explanation: Captions include sound effects and are in the same language; subtitles translate the audio for hearing viewers.
56. Q9: What goes inside `<video>` as fallback for old browsers?
57. A) Nothing
58. B) A CSS comment
59. C) An <iframe>
60. D) A <p> with a download link or text (*)
61. Explanation: Browsers that don't support `<video>` render the inner content; a download link ensures the user can still access the file.
62. Q10: Which element historically embedded plugin content like Flash?
63. A) <plugin>
64. B) <flash>
65. C) <media>
66. D) <embed> and <object> (*)
67. Explanation: `<embed>` and `<object>` were used for plugins like Flash; they still work for some content but `<video>`/`<audio>` are preferred today.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which attribute is REQUIRED for autoplay to work in modern browsers?
  options:
    - controls
    - loop
    - preload
    - muted
    - is required for autoplay to succeed.
  correctIndex: 3
  explanation: Browsers block autoplay with sound; `muted` (along with `playsinline` on iOS) is required for autoplay to succeed.
- id: q2
  question: Which element provides timed captions for a video?
  options:
    - <caption>
    - <track>
    - <subtitle>
    - <vtt>
  correctIndex: 1
  explanation: '`<track kind="captions">` references a WebVTT file with timed text for deaf viewers.'
- id: q3
  question: What is the purpose of the `poster` attribute on `<video>`?
  options:
    - To set the video thumbnail before playback
    - To add a watermark
    - To compress the video
    - To enable captions
  correctIndex: 0
  explanation: "`poster` is the image shown before the video plays; without it the frame is black until playback starts."
- id: q4
  question: Why provide multiple `<source>` elements?
  options:
    - For load balancing
    - Browser codec support varies; multiple sources ensure compatibility
    - To enable 4K
    - To add captions
  correctIndex: 1
  explanation: Different browsers support different codecs (H.264, VP9, AV1); listing WebM + MP4 sources covers all modern browsers.
- id: q5
  question: What does `preload="none"` do?
  options:
    - Disables the video
    - Mutes the video
    - Prevents the browser from preloading any media data
    - Removes the controls
  correctIndex: 2
  explanation: '`preload="none"` tells the browser not to fetch media metadata or data until the user clicks play, saving bandwidth.'
- id: q6
  question: Which attribute must be added for autoplay to work on iOS Safari?
  options:
    - playsinline
    - ios="true"
    - webkit-plays
    - safari="auto"
  correctIndex: 0
  explanation: iOS requires `playsinline` to prevent fullscreen takeover; combined with `muted` and `autoplay`, it enables inline autoplay.
- id: q7
  question: What format are `<track>` files written in?
  options:
    - SRT
    - JSON
    - WebVTT (*.vtt)
    - XML
  correctIndex: 2
  explanation: HTML5 standardizes on WebVTT (Web Video Text Tracks) for the `<track>` element; .srt can be converted easily.
- id: q8
  question: What is the difference between `kind="captions"` and `kind="subtitles"`?
  options:
    - No difference
    - Captions are smaller
    - Captions are for deaf viewers (same language); subtitles are translations
    - Subtitles are audio
  correctIndex: 2
  explanation: Captions include sound effects and are in the same language; subtitles translate the audio for hearing viewers.
- id: q9
  question: What goes inside `<video>` as fallback for old browsers?
  options:
    - Nothing
    - A CSS comment
    - An <iframe>
    - A <p> with a download link or text
  correctIndex: 3
  explanation: Browsers that don't support `<video>` render the inner content; a download link ensures the user can still access the file.
- id: q10
  question: Which element historically embedded plugin content like Flash?
  options:
    - <plugin>
    - <flash>
    - <media>
    - <embed> and <object>
  correctIndex: 3
  explanation: "`<embed>` and `<object>` were used for plugins like Flash; they still work for some content but `<video>`/`<audio>` are preferred today."
```

