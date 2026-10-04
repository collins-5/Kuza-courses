export type NoteBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; text: string; lang?: string }
  | { type: 'tip'; text: string }
  | { type: 'list'; items: string[] };

export interface Lecture {
  id: string;
  title: string;
  duration: string;
  summary: string;
  videoUrl?: string;
  notes: NoteBlock[];
  takeaways: string[];
}

export interface CurriculumModule {
  id: string;
  title: string;
  lectures: Lecture[];
}

export const mockCurriculum: CurriculumModule[] = [
  {
    id: 'm1',
    title: 'Getting started with motion',
    lectures: [
      {
        id: 'l1',
        title: 'Why motion matters',
        duration: '6:20',
        summary:
          'Good motion explains what changed on screen. Bad motion is decoration that slows people down.',
        notes: [
          { type: 'heading', text: 'Motion with a job to do' },
          {
            type: 'paragraph',
            text: 'Every animation in an interface should answer one question: what just happened, or what can I do next? A button that lifts on hover says it is clickable. A card that fades in from below says it is new content.',
          },
          {
            type: 'list',
            items: [
              'Feedback: confirm a tap, a save, an error.',
              'Orientation: show where something came from or went.',
              'Delight: small touches that make the product feel cared for.',
            ],
          },
          {
            type: 'tip',
            text: 'If you cannot say what an animation communicates, delete it. Fewer, clearer animations beat many busy ones.',
          },
        ],
        takeaways: [
          'Animate to explain, not to decorate.',
          'Keep most UI motion between 150ms and 400ms.',
        ],
      },
      {
        id: 'l2',
        title: 'Transitions: the easy way to animate',
        duration: '12:45',
        summary:
          'Transitions animate a property between two states. They are the fastest way to add polish to hover, focus and toggle states.',
        notes: [
          { type: 'heading', text: 'What is a transition?' },
          {
            type: 'paragraph',
            text: 'Normally a CSS change is instant. A transition tells the browser to move smoothly from the old value to the new one. You choose which property to animate, how long it takes, and how it accelerates.',
          },
          {
            type: 'code',
            lang: 'css',
            text: `.button {
  background: #4338ff;
  transform: translateY(0);
  transition: background 0.2s ease, transform 0.2s ease;
}

.button:hover {
  background: #2f25d6;
  transform: translateY(-2px);
}`,
          },
          { type: 'heading', text: 'The four parts of a transition' },
          {
            type: 'list',
            items: [
              'transition-property: which property animates (background, transform, opacity).',
              'transition-duration: how long it takes, such as 0.2s or 200ms.',
              'transition-timing-function: the acceleration curve, such as ease or ease-out.',
              'transition-delay: how long to wait before starting.',
            ],
          },
          {
            type: 'tip',
            text: 'Animate transform and opacity whenever you can. They stay smooth because the browser can run them on the GPU. Animating width, height or top forces the page to recalculate layout every frame.',
          },
          { type: 'heading', text: 'A common mistake' },
          {
            type: 'paragraph',
            text: 'Writing transition: all feels convenient, but it animates properties you never meant to. List the properties you want, and the result stays predictable.',
          },
        ],
        takeaways: [
          'A transition needs two states and a trigger such as :hover or a class change.',
          'List properties explicitly instead of using all.',
          'Prefer transform and opacity for smooth results.',
        ],
      },
      {
        id: 'l3',
        title: 'Easing and timing',
        duration: '9:30',
        summary:
          'Easing is the personality of an animation. Learn which curve fits entering, leaving and moving.',
        notes: [
          { type: 'heading', text: 'Choosing a curve' },
          {
            type: 'list',
            items: [
              'ease-out: starts fast, slows down. Best for things entering the screen.',
              'ease-in: starts slow, speeds up. Best for things leaving.',
              'ease-in-out: smooth both ends. Best for things moving across the screen.',
              'linear: constant speed. Only for loops like spinners.',
            ],
          },
          {
            type: 'code',
            lang: 'css',
            text: `.panel {
  transition: transform 0.35s cubic-bezier(0.33, 1, 0.68, 1);
}`,
          },
        ],
        takeaways: [
          'Entering uses ease-out, leaving uses ease-in.',
          'Custom cubic-bezier curves give you a signature feel.',
        ],
      },
    ],
  },
  {
    id: 'm2',
    title: 'Keyframe animations',
    lectures: [
      {
        id: 'l4',
        title: 'Your first @keyframes',
        duration: '11:10',
        summary:
          'Keyframes let you describe an animation with as many steps as you like, and run it without any trigger.',
        notes: [
          { type: 'heading', text: 'Defining the steps' },
          {
            type: 'paragraph',
            text: 'A @keyframes rule names an animation and lists what the element looks like at points along the way. You then attach it to an element with the animation property.',
          },
          {
            type: 'code',
            lang: 'css',
            text: `@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fade-up 0.5s ease-out both;
}`,
          },
          {
            type: 'paragraph',
            text: 'The word both at the end is the fill mode. It keeps the starting style during any delay and the ending style after the animation finishes, so the card never flashes before it animates.',
          },
          { type: 'heading', text: 'Staggering a list' },
          {
            type: 'code',
            lang: 'css',
            text: `.card {
  animation: fade-up 0.5s ease-out both;
  animation-delay: calc(var(--i) * 60ms);
}`,
          },
          {
            type: 'tip',
            text: 'Set --i on each card from your HTML or JavaScript (0, 1, 2, ...). One rule then staggers any number of items.',
          },
        ],
        takeaways: [
          '@keyframes describes the steps, the animation property plays them.',
          'Use fill mode both to avoid flashes before and after.',
          'A custom property times each item for easy staggering.',
        ],
      },
      {
        id: 'l5',
        title: 'Animation properties in depth',
        duration: '10:05',
        summary:
          'Iteration count, direction and play state give you full control over how an animation repeats.',
        notes: [
          { type: 'heading', text: 'Controlling repeats' },
          {
            type: 'list',
            items: [
              'animation-iteration-count: a number or infinite.',
              'animation-direction: normal, reverse, alternate.',
              'animation-play-state: running or paused.',
            ],
          },
        ],
        takeaways: ['alternate plays forward then backward for smooth loops.'],
      },
      {
        id: 'l6',
        title: 'Build a bouncing ball',
        duration: '14:30',
        summary:
          'Put it together: a ball that bounces with a shadow that squashes in sync. A classic animation exercise.',
        notes: [
          { type: 'heading', text: 'The setup' },
          {
            type: 'paragraph',
            text: 'We need two elements: the ball, and a shadow beneath it. Both animate for the same duration so they stay in sync.',
          },
          {
            type: 'code',
            lang: 'html',
            text: `<div class="stage">
  <div class="shadow"></div>
  <div class="ball"></div>
</div>`,
          },
          { type: 'heading', text: 'The animation' },
          {
            type: 'code',
            lang: 'css',
            text: `.ball {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: gold;
  animation: bounce 0.8s cubic-bezier(0.33, 1, 0.68, 1) infinite alternate;
}

.shadow {
  width: 64px;
  height: 10px;
  border-radius: 50%;
  background: #000;
  animation: squash 0.8s cubic-bezier(0.33, 1, 0.68, 1) infinite alternate;
}

@keyframes bounce {
  to { transform: translateY(-120px); }
}

@keyframes squash {
  from { transform: scaleX(1); opacity: 0.55; }
  to   { transform: scaleX(0.4); opacity: 0.12; }
}`,
          },
          {
            type: 'tip',
            text: 'Why does it feel natural? With alternate, the easing curve also reverses on the way down. The ball decelerates going up and accelerates falling, just like gravity.',
          },
        ],
        takeaways: [
          'alternate reverses the easing too, which sells the gravity effect.',
          'Animate related elements with the same duration and curve.',
        ],
      },
    ],
  },
  {
    id: 'm3',
    title: 'Ship it',
    lectures: [
      {
        id: 'l7',
        title: 'Performance: transform and opacity',
        duration: '8:40',
        summary:
          'Why some animations stutter and how to keep yours at a steady 60 frames per second.',
        notes: [
          { type: 'heading', text: 'Smooth by default' },
          {
            type: 'paragraph',
            text: 'Transform and opacity changes can be composited without recalculating layout. Stick to them and your animations stay fluid even on budget phones.',
          },
        ],
        takeaways: ['Avoid animating layout properties like width and top.'],
      },
      {
        id: 'l8',
        title: 'Respecting reduced motion',
        duration: '5:55',
        summary:
          'Some people feel unwell from heavy motion. One media query makes your site kinder to them.',
        notes: [
          { type: 'heading', text: 'The media query' },
          {
            type: 'code',
            lang: 'css',
            text: `@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}`,
          },
        ],
        takeaways: ['Always ship a reduced-motion fallback.'],
      },
      {
        id: 'l9',
        title: 'Project: animated landing hero',
        duration: '18:00',
        summary:
          'Combine everything into a hero section with a staggered entrance and a looping accent animation.',
        notes: [
          { type: 'heading', text: 'Your brief' },
          {
            type: 'list',
            items: [
              'A headline and subtext that fade up with a stagger.',
              'A button with a lift-on-hover transition.',
              'One looping accent animation, such as the bouncing ball.',
              'A reduced-motion fallback.',
            ],
          },
        ],
        takeaways: ['Share your finished hero with the community for feedback.'],
      },
    ],
  },
];