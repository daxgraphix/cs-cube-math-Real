import { Face, MathTask, Coord3, MathOperation, TutorialStep } from './types';

export const CUBE_COLORS = {
  U: '#ffffff', // White
  D: '#ffd500', // Yellow
  R: '#b90000', // Red
  L: '#ff5900', // Orange
  F: '#009b48', // Green
  B: '#0045ad', // Blue
  CORE: '#2a2a2a' // Internal black plastic
};

export const FACE_LABELS = {
  U: 'Up',
  D: 'Down',
  L: 'Left',
  R: 'Right',
  F: 'Front',
  B: 'Back'
};

export const INITIAL_POSITIONS: Coord3[] = [];
for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      INITIAL_POSITIONS.push([x, y, z]);
    }
  }
}

const getRandomFace = (): Face => {
  const faces = Object.values(Face);
  return faces[Math.floor(Math.random() * faces.length)] as Face;
};

const getColorName = (face: Face): string => {
  switch (face) {
    case Face.R: return "Red";
    case Face.L: return "Orange";
    case Face.U: return "White";
    case Face.D: return "Yellow";
    case Face.F: return "Green";
    case Face.B: return "Blue";
  }
};

// Dynamic Difficulty Scaling
export const generateMathTask = (id: number, operation: MathOperation | 'MIXED', level: number): MathTask => {
  let q = "";
  let target = 0;
  const face = getRandomFace();
  const color = getColorName(face);

  // Difficulty Tiers:
  // 1-3: Simple 1-step (Result 1-5)
  // 4-6: Medium 1-step (Result 1-9)
  // 7-8: Multi-step Add/Sub (e.g. 2 + 2 + 1)
  // 9-10: Advanced Mixed (e.g. 2 * 3 + 1)

  const maxResult = level <= 3 ? 5 : (level <= 6 ? 9 : 12);
  const minResult = 1;
  
  let chosenOp = operation;
  if (chosenOp === 'MIXED') {
    const ops: MathOperation[] = level < 4 ? ['ADD', 'SUB'] : ['ADD', 'SUB', 'MUL', 'DIV'];
    chosenOp = ops[Math.floor(Math.random() * ops.length)];
  }

  // Helper for multi-step strings
  const makeExpression = () => {
    // Level 9-10: Mixed Operators (PEMDAS simple)
    // Only applied if we are in MIXED mode or specifically high level campaigns
    if (level >= 9 && (operation === 'MIXED' || chosenOp === 'MUL')) {
        // Pattern: (a * b) + c or (a * b) - c
        const a = Math.floor(Math.random() * 3) + 2; // 2 to 4
        const b = Math.floor(Math.random() * 2) + 2; // 2 to 3
        const product = a * b;
        
        // Ensure result stays within bounds
        const remainder = maxResult - product;
        
        if (remainder > 0) {
            const c = Math.floor(Math.random() * remainder) + 1;
            target = product + c;
            q = `(${a} × ${b}) + ${c}`;
        } else {
            // Subtraction case
            const c = Math.floor(Math.random() * (product - 1)) + 1;
            target = product - c;
            q = `(${a} × ${b}) - ${c}`;
        }
        return;
    }

    // Level 7-8: 3-term expressions for ADD/SUB
    if (level >= 7 && (chosenOp === 'ADD' || chosenOp === 'SUB')) {
        const t = Math.floor(Math.random() * (maxResult - minResult + 1)) + minResult;
        const p1 = Math.floor(Math.random() * (t - 1)) + 1;
        const remainder = t - p1;
        const p2 = Math.floor(Math.random() * remainder);
        const p3 = remainder - p2;
        target = t;
        
        if (Math.random() > 0.5) {
             q = `${p1} + ${p2} + ${p3}`;
        } else {
             const c = Math.floor(Math.random() * 3) + 1;
             const sum = target + c;
             const a = Math.floor(Math.random() * sum);
             const b = sum - a;
             q = `(${a} + ${b}) - ${c}`;
        }
        return;
    }

    // Standard logic
    let num1 = 0, num2 = 0;
    switch (chosenOp) {
        case 'ADD':
          target = Math.floor(Math.random() * (maxResult - minResult + 1)) + minResult;
          num1 = Math.floor(Math.random() * target);
          num2 = target - num1;
          q = `${num1} + ${num2}`;
          break;
        case 'SUB':
          target = Math.floor(Math.random() * (maxResult - minResult + 1)) + minResult;
          num2 = Math.floor(Math.random() * (level <= 3 ? 3 : 8)) + 1;
          num1 = target + num2;
          q = `${num1} - ${num2}`;
          break;
        case 'MUL':
          const factors: [number, number][] = [];
          for(let i=1; i<=maxResult; i++) {
            for(let j=1; j<=maxResult; j++) {
               if (i*j <= maxResult && i*j >= minResult) factors.push([i,j]);
            }
          }
          const pair = factors[Math.floor(Math.random() * factors.length)] || [1, level];
          num1 = pair[0];
          num2 = pair[1];
          target = num1 * num2;
          q = `${num1} × ${num2}`;
          break;
        case 'DIV':
          target = Math.floor(Math.random() * (maxResult - minResult + 1)) + minResult;
          num2 = Math.floor(Math.random() * (level <= 5 ? 2 : 4)) + 2; 
          num1 = target * num2;
          q = `${num1} ÷ ${num2}`;
          break;
      }
  };

  makeExpression();

  return {
    id,
    question: `Calculate: ${q}`,
    type: 'move_count',
    targetValue: target,
    requiredFace: face,
    isComplete: false,
    hint: `Calculate ${q} = ${target}. Then rotate the ${color} face ${target} times.`
  };
};

export const TUTORIAL_STEPS: TutorialStep[] = [
  { 
    id: 1, 
    text: "Hi! I'm Cuby!", 
    subText: "I'm a magic cube. I love math and spinning!",
    actionRequired: 'NONE' 
  },
  { 
    id: 2, 
    text: "Let's Dance!", 
    subText: "Drag my faces to rotate them. Try spinning the RED face.", 
    actionRequired: 'ROTATE', 
    targetFace: Face.R 
  },
  { 
    id: 3, 
    text: "Whoa, dizzy!", 
    subText: "I'm getting mixed up! Let's go back in time. Click UNDO.", 
    actionRequired: 'UNDO' 
  },
  { 
    id: 4, 
    text: "Math Time!", 
    subText: "Solve: 1 + 1. The answer is 2. Rotate the GREEN face 2 times.", 
    actionRequired: 'ROTATE', 
    targetFace: Face.F 
  },
  { 
    id: 5, 
    text: "Need Help?", 
    subText: "If you forget the math, I can help! Click the HINT button.", 
    actionRequired: 'HINT' 
  },
  { 
    id: 6, 
    text: "One More!", 
    subText: "What is 5 - 2? That's 3! Rotate the BLUE face 3 times.", 
    actionRequired: 'ROTATE', 
    targetFace: Face.B 
  },
  { 
    id: 7, 
    text: "You're a Star!", 
    subText: "You are ready for the Math Campaign. Let's go!", 
    actionRequired: 'NONE' 
  }
];