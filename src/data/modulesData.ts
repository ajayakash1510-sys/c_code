import { ModuleInfo } from '../types';

export const MODULES_DATA: ModuleInfo[] = [
  {
    id: 'basics',
    number: '1',
    title: '1. C Basics',
    shortTitle: 'C Basics',
    tagline: 'Structure, variables, memory types & printf/scanf',
    description:
      'Learn how a C program boots up with main(), how variables reserve memory slots in the stack, and how formatting specifiers like %d and %s communicate with standard I/O.',
    status: 'active',
    estimatedMinutes: 20,
    icon: 'Terminal',
    topics: [
      'Anatomy of #include <stdio.h> and main()',
      'Variables & memory sizes (char, int, float, double)',
      'Formatted output with printf and escape sequences',
      'User input using scanf and address-of operator (&)',
      'Comments, code style, and compile lifecycle (gcc -Wall)'
    ],
    cyberConnection: 'Understanding fixed variable sizes (4 bytes for int) is the foundation of preventing buffer overflow attacks in low-level binaries.',
    aiMlConnection: 'Embedded AI and edge neural inference engines rely on lightweight C data representations for minimal memory latency.'
  },
  {
    id: 'decisions',
    number: '2',
    title: '2. Decisions (if/else, switch)',
    shortTitle: 'Decisions',
    tagline: 'Control flow branching, condition evaluation & switch fall-through',
    description:
      'Explore how programs make choices using boolean relational checks (0 is False, non-zero is True) and how jump tables in switch-case behave when break is omitted.',
    status: 'active',
    estimatedMinutes: 25,
    icon: 'GitFork',
    topics: [
      'Relational operators: ==, !=, <, <=, >, >=',
      'Binary branch execution: if and else',
      'Multi-way cascading chains: else if',
      'Switch-case syntax & multi-branch jump tables',
      'The critical role of the break keyword and fall-through behavior'
    ],
    cyberConnection: 'Strict boundary checking on incoming network packets and inputs prevents logic flaws and unauthorized escalation.',
    aiMlConnection: 'Decision Tree classifiers and threshold activation units (e.g., Step / ReLU functions) are built directly on condition evaluation logic.'
  },
  {
    id: 'loops',
    number: '3',
    title: '3. Loops',
    shortTitle: 'Loops',
    tagline: 'for, while, and do-while iteration mechanics',
    description:
      'Demystify repetitive execution. Watch loop counter variables mutate on each cycle, inspect loop entry conditions, and avoid infinite runaway loops.',
    status: 'active',
    estimatedMinutes: 30,
    icon: 'Repeat',
    topics: [
      'The while loop: entry-controlled condition check',
      'The for loop: initialization, condition, and increment in one line',
      'The do-while loop: guaranteed single execution exit-controlled loop',
      'Controlling iterations with break and continue',
      'Avoiding off-by-one errors and infinite loop traps'
    ],
    cyberConnection: 'Analyzing loop bounds is crucial in cryptography to prevent timing side-channel attacks and denial-of-service spikes.',
    aiMlConnection: 'Gradient descent optimization and epoch-based model training are iterative loops over thousands of tensor batches.'
  },
  {
    id: 'patterns',
    number: '4',
    title: '4. Patterns and Real-World Labs',
    shortTitle: 'Patterns & Labs',
    tagline: 'Nested loops, pyramid matrices & engineering simulations',
    description:
      'Master nested loop coordinate systems (outer loop rows vs. inner loop columns) and test real-world engineering algorithms like sensor threshold filters.',
    status: 'active',
    estimatedMinutes: 35,
    icon: 'Cpu',
    topics: [
      'Nested loops mental model: (row, column) indexing',
      'Star patterns: right-angled triangles, inverted pyramids, diamonds',
      'Number grids and Pascal triangle stepping',
      'Real-world lab: Autonomous vehicle obstacle alert threshold filter',
      'Cyber lab: Port scanner iterator and brute-force key length checker'
    ],
    cyberConnection: 'Hardware security tokens use nested permutation loops to shuffle encryption state matrices.',
    aiMlConnection: 'Convolutional neural network kernels slide across image matrices using 2D nested loops.'
  },
  {
    id: 'practice',
    number: '5',
    title: '5. Practice and Quiz',
    shortTitle: 'Practice & Quiz',
    tagline: 'Predict the output, spot the bug & interactive checks',
    description:
      'Test your understanding with beginner-friendly interactive challenges. Can you predict the output without compiling, or find the missing semicolon?',
    status: 'active',
    estimatedMinutes: 20,
    icon: 'CheckSquare',
    topics: [
      'Output prediction quizzes with step-by-step solutions',
      'Spot the syntax bug: missing break, dangling else, uninitialized variables',
      'Logic puzzle: condition evaluation ordering',
      'Cybersecurity challenge: identifying an insecure unchecked condition',
      'CE Exam preparation flashcards for first-year lab practicals'
    ],
    cyberConnection: 'Fuzz testing and static analysis in cybersecurity automate the search for logic bugs and condition edge cases.',
    aiMlConnection: 'Evaluating code predictions mirrors how transformer models learn syntax token sequences.'
  }
];
