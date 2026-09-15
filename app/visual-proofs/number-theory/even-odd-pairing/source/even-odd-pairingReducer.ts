import { ModelType } from "./even-odd-pairingConfig";
import { calculateParity } from "./even-odd-pairingMath";

export interface CounterLocation {
  slotIndex: number;
  socketIndex: 0 | 1;
}

export interface ReducerState {
  n: number;
  model: ModelType;
  placedCounters: Record<number, CounterLocation>;
  leftoverCounterId: number | null;
  unplacedOrder: number[];
  selectedCounterId: number | null;
  activeStep: number;
  hintTier: number;
  predictionChoice: "even" | "odd" | null;
  predictionRevealed: boolean;
  predictionFeedback: string | null;
  revealFormula: boolean;
  challengeNumber: number;
  challengeUserLeftover: number;
  challengeChecked: boolean;
  challengeCorrect: boolean;
  clockStep: number;
  isPlayingAnimation: boolean;
  animationSpeed: number;
  liveAnnouncement: string;
  history: Array<Omit<ReducerState, "history" | "future">>;
  future: Array<Omit<ReducerState, "history" | "future">>;
}

export type ReducerAction =
  | { type: "SET_NUMBER"; payload: number }
  | { type: "SELECT_MODEL"; payload: ModelType }
  | { type: "PICK_UP_COUNTER"; payload: number | null }
  | { type: "PLACE_COUNTER"; payload: { counterId: number; slotIndex: number; socketIndex: 0 | 1 } }
  | { type: "MARK_LEFTOVER"; payload: number }
  | { type: "RETURN_TO_BANK"; payload: number }
  | { type: "AUTO_PAIR_ALL" }
  | { type: "AUTO_PAIR_STEP" }
  | { type: "CLEAR_ALL" }
  | { type: "SHUFFLE_COUNTERS" }
  | { type: "SELECT_PREDICTION"; payload: "even" | "odd" }
  | { type: "REVEAL_PREDICTION" }
  | { type: "TOGGLE_REVEAL_FORMULA" }
  | { type: "SET_CHALLENGE_LEFTOVER"; payload: number }
  | { type: "CHECK_CHALLENGE" }
  | { type: "SET_CLOCK_STEP"; payload: number }
  | { type: "STEP_CLOCK" }
  | { type: "SET_ACTIVE_STEP"; payload: number }
  | { type: "SET_HINT_TIER"; payload: number }
  | { type: "SET_ANIMATION_PLAYING"; payload: boolean }
  | { type: "SET_ANIMATION_SPEED"; payload: number }
  | { type: "SET_LIVE_ANNOUNCEMENT"; payload: string }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET" };

function buildInitialPairs(n: number) {
  const placed: Record<number, CounterLocation> = {};
  const pairs = Math.floor(n / 2);
  let leftoverId: number | null = null;

  for (let i = 0; i < pairs; i++) {
    const c1 = i * 2 + 1;
    const c2 = i * 2 + 2;
    placed[c1] = { slotIndex: i, socketIndex: 0 };
    placed[c2] = { slotIndex: i, socketIndex: 1 };
  }

  if (n % 2 !== 0) {
    leftoverId = n;
  }

  return { placed, leftoverId, unplaced: [] };
}

const defaultInitial = buildInitialPairs(7);

export const initialState: ReducerState = {
  n: 7,
  model: "pairs",
  placedCounters: defaultInitial.placed,
  leftoverCounterId: defaultInitial.leftoverId,
  unplacedOrder: defaultInitial.unplaced,
  selectedCounterId: null,
  activeStep: 0,
  hintTier: 0,
  predictionChoice: "even",
  predictionRevealed: true,
  predictionFeedback: "14 has 7 complete pairs and 0 leftovers, so 14 is Even.",
  revealFormula: true,
  challengeNumber: 23,
  challengeUserLeftover: 1,
  challengeChecked: false,
  challengeCorrect: false,
  clockStep: 7,
  isPlayingAnimation: false,
  animationSpeed: 1,
  liveAnnouncement: "Visual proof loaded. 7 counters paired with 1 leftover: 7 is odd.",
  history: [],
  future: [],
};

function pushHistory(state: ReducerState): ReducerState {
  const snapshot: Omit<ReducerState, "history" | "future"> = {
    n: state.n,
    model: state.model,
    placedCounters: { ...state.placedCounters },
    leftoverCounterId: state.leftoverCounterId,
    unplacedOrder: [...state.unplacedOrder],
    selectedCounterId: state.selectedCounterId,
    activeStep: state.activeStep,
    hintTier: state.hintTier,
    predictionChoice: state.predictionChoice,
    predictionRevealed: state.predictionRevealed,
    predictionFeedback: state.predictionFeedback,
    revealFormula: state.revealFormula,
    challengeNumber: state.challengeNumber,
    challengeUserLeftover: state.challengeUserLeftover,
    challengeChecked: state.challengeChecked,
    challengeCorrect: state.challengeCorrect,
    clockStep: state.clockStep,
    isPlayingAnimation: state.isPlayingAnimation,
    animationSpeed: state.animationSpeed,
    liveAnnouncement: state.liveAnnouncement,
  };

  const newHistory = [...state.history.slice(-20), snapshot];
  return { ...state, history: newHistory, future: [] };
}

export function proofReducer(state: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case "SET_NUMBER": {
      const nextN = Math.max(0, Math.min(24, Math.floor(action.payload)));
      if (nextN === state.n) return state;
      const paired = buildInitialPairs(nextN);
      const parity = calculateParity(nextN);
      const nextState = pushHistory(state);
      return {
        ...nextState,
        n: nextN,
        placedCounters: paired.placed,
        leftoverCounterId: paired.leftoverId,
        unplacedOrder: paired.unplaced,
        selectedCounterId: null,
        clockStep: nextN,
        liveAnnouncement: `Number set to ${nextN}. ${nextN} is ${parity.isEven ? "Even" : "Odd"} (${parity.pairs} pairs, ${parity.remainder} leftover).`,
      };
    }

    case "SELECT_MODEL": {
      if (action.payload === state.model) return state;
      return {
        ...state,
        model: action.payload,
        liveAnnouncement: `Switched to ${action.payload} model.`,
      };
    }

    case "PICK_UP_COUNTER": {
      return {
        ...state,
        selectedCounterId: action.payload,
      };
    }

    case "PLACE_COUNTER": {
      const { counterId, slotIndex, socketIndex } = action.payload;
      const nextState = pushHistory(state);

      // Remove from old placement or leftover
      const nextPlaced = { ...nextState.placedCounters };
      let nextLeftover = nextState.leftoverCounterId;
      if (nextLeftover === counterId) nextLeftover = null;

      // If another counter was in this target socket, displace it back to unplaced
      const nextUnplaced = nextState.unplacedOrder.filter((id) => id !== counterId);
      Object.entries(nextPlaced).forEach(([idStr, loc]) => {
        const id = Number(idStr);
        if (loc.slotIndex === slotIndex && loc.socketIndex === socketIndex && id !== counterId) {
          delete nextPlaced[id];
          if (!nextUnplaced.includes(id)) nextUnplaced.push(id);
        }
      });

      nextPlaced[counterId] = { slotIndex, socketIndex };

      return {
        ...nextState,
        placedCounters: nextPlaced,
        leftoverCounterId: nextLeftover,
        unplacedOrder: nextUnplaced,
        selectedCounterId: null,
        liveAnnouncement: `Counter ${counterId} docked into pair ${slotIndex + 1}, socket ${socketIndex + 1}.`,
      };
    }

    case "MARK_LEFTOVER": {
      const counterId = action.payload;
      const nextState = pushHistory(state);
      const nextPlaced = { ...nextState.placedCounters };
      delete nextPlaced[counterId];
      const nextUnplaced = nextState.unplacedOrder.filter((id) => id !== counterId);

      return {
        ...nextState,
        placedCounters: nextPlaced,
        leftoverCounterId: counterId,
        unplacedOrder: nextUnplaced,
        selectedCounterId: null,
        liveAnnouncement: `Counter ${counterId} marked as leftover.`,
      };
    }

    case "RETURN_TO_BANK": {
      const counterId = action.payload;
      const nextState = pushHistory(state);
      const nextPlaced = { ...nextState.placedCounters };
      delete nextPlaced[counterId];
      let nextLeftover = nextState.leftoverCounterId;
      if (nextLeftover === counterId) nextLeftover = null;

      const nextUnplaced = [...nextState.unplacedOrder];
      if (!nextUnplaced.includes(counterId)) {
        nextUnplaced.push(counterId);
      }

      return {
        ...nextState,
        placedCounters: nextPlaced,
        leftoverCounterId: nextLeftover,
        unplacedOrder: nextUnplaced,
        selectedCounterId: null,
        liveAnnouncement: `Counter ${counterId} returned to pool.`,
      };
    }

    case "AUTO_PAIR_ALL": {
      const paired = buildInitialPairs(state.n);
      const parity = calculateParity(state.n);
      const nextState = pushHistory(state);
      return {
        ...nextState,
        placedCounters: paired.placed,
        leftoverCounterId: paired.leftoverId,
        unplacedOrder: paired.unplaced,
        selectedCounterId: null,
        liveAnnouncement: `All ${state.n} counters auto-paired into ${parity.pairs} pairs with ${parity.remainder} leftover.`,
      };
    }

    case "AUTO_PAIR_STEP": {
      // Find the lowest unplaced counter and place it into the next empty socket
      if (state.unplacedOrder.length === 0) return state;
      const nextCounterId = [...state.unplacedOrder].sort((a, b) => a - b)[0];
      const totalSlots = Math.ceil(state.n / 2);

      // Search for first available slot/socket
      for (let s = 0; s < totalSlots; s++) {
        const isOddLastSlot = s === totalSlots - 1 && state.n % 2 !== 0;
        let hasSocket0 = false;
        let hasSocket1 = false;

        Object.values(state.placedCounters).forEach((loc) => {
          if (loc.slotIndex === s) {
            if (loc.socketIndex === 0) hasSocket0 = true;
            if (loc.socketIndex === 1) hasSocket1 = true;
          }
        });

        if (!hasSocket0) {
          return proofReducer(state, {
            type: "PLACE_COUNTER",
            payload: { counterId: nextCounterId, slotIndex: s, socketIndex: 0 },
          });
        }
        if (!hasSocket1 && !isOddLastSlot) {
          return proofReducer(state, {
            type: "PLACE_COUNTER",
            payload: { counterId: nextCounterId, slotIndex: s, socketIndex: 1 },
          });
        }
        if (isOddLastSlot && state.leftoverCounterId === null) {
          return proofReducer(state, {
            type: "MARK_LEFTOVER",
            payload: nextCounterId,
          });
        }
      }

      return state;
    }

    case "CLEAR_ALL": {
      const nextState = pushHistory(state);
      const allIds = Array.from({ length: state.n }, (_, i) => i + 1);
      return {
        ...nextState,
        placedCounters: {},
        leftoverCounterId: null,
        unplacedOrder: allIds,
        selectedCounterId: null,
        liveAnnouncement: "Cleared all paired slots. All counters returned to bank.",
      };
    }

    case "SHUFFLE_COUNTERS": {
      const shuffled = [...state.unplacedOrder].sort(() => Math.random() - 0.5);
      return {
        ...state,
        unplacedOrder: shuffled,
        liveAnnouncement: "Counters in pool shuffled.",
      };
    }

    case "SELECT_PREDICTION": {
      return {
        ...state,
        predictionChoice: action.payload,
        predictionRevealed: false,
        predictionFeedback: null,
      };
    }

    case "REVEAL_PREDICTION": {
      const choice = state.predictionChoice;
      const isCorrect = choice === "even";
      const feedback = isCorrect
        ? "Correct! 14 can be divided into 7 pairs of 2 with 0 leftovers. 14 is Even."
        : "Not quite. 14 divides evenly by 2 (14 = 2 × 7), so it leaves 0 leftovers and is Even.";

      return {
        ...state,
        predictionRevealed: true,
        predictionFeedback: feedback,
        liveAnnouncement: feedback,
      };
    }

    case "TOGGLE_REVEAL_FORMULA": {
      return {
        ...state,
        revealFormula: !state.revealFormula,
      };
    }

    case "SET_CHALLENGE_LEFTOVER": {
      return {
        ...state,
        challengeUserLeftover: Math.max(0, Math.floor(action.payload)),
        challengeChecked: false,
      };
    }

    case "CHECK_CHALLENGE": {
      const isCorrect = state.challengeUserLeftover === 1;
      return {
        ...state,
        challengeChecked: true,
        challengeCorrect: isCorrect,
        liveAnnouncement: isCorrect
          ? "Challenge passed! 23 = 2 × 11 + 1, leaving exactly 1 leftover."
          : `Leftover ${state.challengeUserLeftover} is incorrect. 23 paired in twos yields 11 pairs and 1 leftover.`,
      };
    }

    case "SET_CLOCK_STEP": {
      return {
        ...state,
        clockStep: Math.max(0, Math.min(state.n, action.payload)),
      };
    }

    case "STEP_CLOCK": {
      const nextStep = (state.clockStep + 1) % (state.n + 1);
      return {
        ...state,
        clockStep: nextStep,
      };
    }

    case "SET_ACTIVE_STEP": {
      return {
        ...state,
        activeStep: Math.max(0, Math.min(5, action.payload)),
      };
    }

    case "SET_HINT_TIER": {
      return {
        ...state,
        hintTier: Math.max(0, Math.min(5, action.payload)),
      };
    }

    case "SET_ANIMATION_PLAYING": {
      return {
        ...state,
        isPlayingAnimation: action.payload,
      };
    }

    case "SET_ANIMATION_SPEED": {
      return {
        ...state,
        animationSpeed: action.payload,
      };
    }

    case "SET_LIVE_ANNOUNCEMENT": {
      return {
        ...state,
        liveAnnouncement: action.payload,
      };
    }

    case "UNDO": {
      if (state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);
      const currentSnapshot: Omit<ReducerState, "history" | "future"> = {
        n: state.n,
        model: state.model,
        placedCounters: { ...state.placedCounters },
        leftoverCounterId: state.leftoverCounterId,
        unplacedOrder: [...state.unplacedOrder],
        selectedCounterId: state.selectedCounterId,
        activeStep: state.activeStep,
        hintTier: state.hintTier,
        predictionChoice: state.predictionChoice,
        predictionRevealed: state.predictionRevealed,
        predictionFeedback: state.predictionFeedback,
        revealFormula: state.revealFormula,
        challengeNumber: state.challengeNumber,
        challengeUserLeftover: state.challengeUserLeftover,
        challengeChecked: state.challengeChecked,
        challengeCorrect: state.challengeCorrect,
        clockStep: state.clockStep,
        isPlayingAnimation: state.isPlayingAnimation,
        animationSpeed: state.animationSpeed,
        liveAnnouncement: state.liveAnnouncement,
      };
      return {
        ...state,
        ...prev,
        history: newHistory,
        future: [currentSnapshot, ...state.future],
        liveAnnouncement: "Undo previous action.",
      };
    }

    case "REDO": {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      const currentSnapshot: Omit<ReducerState, "history" | "future"> = {
        n: state.n,
        model: state.model,
        placedCounters: { ...state.placedCounters },
        leftoverCounterId: state.leftoverCounterId,
        unplacedOrder: [...state.unplacedOrder],
        selectedCounterId: state.selectedCounterId,
        activeStep: state.activeStep,
        hintTier: state.hintTier,
        predictionChoice: state.predictionChoice,
        predictionRevealed: state.predictionRevealed,
        predictionFeedback: state.predictionFeedback,
        revealFormula: state.revealFormula,
        challengeNumber: state.challengeNumber,
        challengeUserLeftover: state.challengeUserLeftover,
        challengeChecked: state.challengeChecked,
        challengeCorrect: state.challengeCorrect,
        clockStep: state.clockStep,
        isPlayingAnimation: state.isPlayingAnimation,
        animationSpeed: state.animationSpeed,
        liveAnnouncement: state.liveAnnouncement,
      };
      return {
        ...state,
        ...next,
        history: [...state.history, currentSnapshot],
        future: newFuture,
        liveAnnouncement: "Redo action.",
      };
    }

    case "RESET": {
      return initialState;
    }

    default:
      return state;
  }
}
