# Implementation Plan: "Kind Of" Interactive Reveal Website

## Project Overview
An interactive landing page designed to reflect the project's theme of "otherness" and "in-between spaces." The user enters a screen that appears cluttered and obscured by overlapping graphics. They must physically "clear the space" by clicking and dragging away the obstructing elements to reveal the core message and text underneath.

---

## 1. Visual Assets
* **Base Layer (The Reveal):** `Desktop - 4 (1).png` (High-resolution background containing the text).
* **Interaction Layer (The Obstruction):** `image 36.png` (Transparent PNG/WebP graphic).

---

## 2. Technical Strategy

### A. Layering & Layout
* **Container:** A relative-positioned wrapper spanning `100vw` and `100vh`. `overflow: hidden` to prevent scrollbars when items are dragged off-screen.
* **Underlay:** `Desktop - 4 (1).png` set as a fixed background or a z-indexed `div` at level 0. It should be centered and non-interactive (`pointer-events: none`).
* **Overlay Canvas:** A dynamic layer (z-index: 10) where multiple instances of the obstruction graphic are injected via JavaScript.

### B. Dynamic Generation (The "Mess")
Rather than hardcoding images, use a script to populate the screen:
* **Quantity:** 40–60 clones (adjustable based on screen density) to ensure the background is effectively hidden.
* **Randomization Logic:** On page load, each instance of `image 36.png` is assigned:
    * Random `top` (0-90%) and `left` (0-90%) coordinates.
    * Random rotation (e.g., `-60deg` to `+60deg`).
    * Slightly randomized scale (e.g., `0.8` to `1.2`) to create depth.

### C. Interaction & Physics
To make the "drag-away" feel tactile and high-quality:
* **Library Suggestion:** [GSAP (GreenSock)](https://greensock.com/gsap/) with the **Draggable** and **Inertia** plugins.
* **Mechanic:**
    * **Z-Index Shuffling:** When an image is clicked/touched, its `z-index` should immediately increase so it moves *over* the other clutter.
    * **Inertia/Throwing:** Enable "flick" physics. If a user swipes quickly, the image should continue moving and slide off the edge of the viewport.
    * **Boundary:** Dragging should not be constrained; users should be able to "clean" the screen by throwing images into the "void" (off-screen).

---

## 3. Recommended Tech Stack
* **Frontend:** HTML5, CSS3, Vanilla JavaScript.
* **Animation:** GSAP (GreenSock) for smooth, high-performance dragging and physics.
* **Image Format:** Convert PNGs to **WebP** to maintain transparency while reducing file size (crucial for loading 50+ instances).

---

## 4. Mobile & Performance
* **Touch Support:** Ensure the drag library supports `touchstart` and `touchmove` for mobile users.
* **Performance:** Use CSS `will-change: transform;` on the draggable elements to ensure GPU acceleration.
* **Responsive Scaling:** The number of scattered images should decrease on smaller screens (mobile) to avoid cluttering the processor.

---

## 5. The "Kind Of" Twist (Optional)
To reinforce the project theme ("Inclusion... just not completely"), consider:
* Making 1 or 2 specific instances of the graphic **un-draggable** or programmed to "snap back" to the center if moved.
* This ensures that no matter how much the user cleans, a small piece of the "otherness" always remains.
