import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import { fetchCountries } from "../services/countriesApi";
import { chooseCountry, normalizeCountry } from "../utils/normalizeCountry";

export const GameContext = createContext(null);
const STORAGE_KEY = "@flagmaster/players/v1";
const emptyGame = {
  status: "idle",
  score: 0,
  round: 1,
  timer: 15,
  correct: 0,
  incorrect: 0,
  timeouts: 0,
  hints: [],
  feedback: null,
};

export function GameProvider({ children }) {
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storageReady, setStorageReady] = useState(false);
  const [error, setError] = useState("");
  const [storageError, setStorageError] = useState("");
  const [game, setGame] = useState(emptyGame);
  // La referencia permite bloquear pulsaciones antes del siguiente render.
  const gameRef = useRef(game);
  const deadline = useRef(0);
  const lastGuess = useRef({ text: "", at: 0 });
  const saved = useRef(false);
  const update = useCallback((change) => {
    const next =
      typeof change === "function" ? change(gameRef.current) : change;
    gameRef.current = next;
    setGame(next);
  }, []);

  const loadCountries = useCallback(async (signal) => {
    if (!signal) {
      setLoading(true);
      setError("");
    }
    try {
      const list = await fetchCountries(signal);
      setCountries(list);
      setCurrentCountry(chooseCountry(list));
    } catch (failure) {
      if (!signal?.aborted)
        setError(failure.message || "Revisá tu conexión e intentá nuevamente.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    // La petición inicial se ejecuta al montar el provider.
    Promise.resolve()
      .then(() => loadCountries(controller.signal))
      .finally(() => {
        clearTimeout(timeout);
        if (controller.signal.aborted) {
          setLoading(false);
          setError("La conexión tardó demasiado. Volvé a intentar.");
        }
      });
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [loadCountries]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (
          !Array.isArray(parsed) ||
          !parsed.every(
            (p) => typeof p.name === "string" && Number.isFinite(p.bestScore),
          )
        )
          throw new Error("invalid");
        setPlayers(parsed);
      })
      .catch(() => setStorageError("No pudimos recuperar el ranking guardado."))
      .finally(() => setStorageReady(true));
  }, []);

  const finishGame = useCallback(() => {
    if (saved.current || gameRef.current.status === "idle") return;
    saved.current = true;
    update({ ...gameRef.current, status: "finished", feedback: null });
    const score = gameRef.current.score;
    setPlayers((previous) => {
      const key = normalizeCountry(currentPlayer);
      const existing = previous.find((p) => normalizeCountry(p.name) === key);
      return [
        ...previous.filter((p) => normalizeCountry(p.name) !== key),
        {
          name: currentPlayer,
          bestScore: existing ? Math.max(existing.bestScore, score) : score,
          games: (existing?.games || 0) + 1,
        },
      ];
    });
  }, [currentPlayer, update]);

  useEffect(() => {
    if (!storageReady || !saved.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(players))
      .then(() => setStorageError(""))
      .catch(() =>
        setStorageError("No se pudo guardar el ranking en este dispositivo."),
      );
  }, [players, storageReady]);

  const nextCountry = useCallback(() => {
    if (gameRef.current.status !== "feedback") return;
    if (gameRef.current.round >= 10) {
      finishGame();
      return;
    }
    setCurrentCountry((previous) => chooseCountry(countries, previous));
    deadline.current = Date.now() + 15000;
    lastGuess.current = { text: "", at: 0 };
    update({
      ...gameRef.current,
      status: "playing",
      round: gameRef.current.round + 1,
      timer: 15,
      hints: [],
      feedback: null,
    });
  }, [countries, finishGame, update]);

  const syncTimer = useCallback(() => {
    if (gameRef.current.status !== "playing") return;
    const timer = Math.max(
      0,
      Math.ceil((deadline.current - Date.now()) / 1000),
    );
    if (!timer)
      update({
        ...gameRef.current,
        timer: 0,
        status: "feedback",
        timeouts: gameRef.current.timeouts + 1,
        feedback: {
          type: "timeout",
          text: `¡Tiempo terminado! Era ${currentCountry.name}.`,
        },
      });
    else if (timer !== gameRef.current.timer)
      update({ ...gameRef.current, timer });
  }, [currentCountry, update]);

  useEffect(() => {
    if (game.status !== "playing") return;
    const interval = setInterval(syncTimer, 200);
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") syncTimer();
    });
    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [game.status, syncTimer]);

  useEffect(() => {
    if (game.status !== "feedback") return;
    const timeout = setTimeout(nextCountry, 1800);
    return () => clearTimeout(timeout);
  }, [game.status, nextCountry]);

  const startGame = (name = currentPlayer) => {
    const cleaned = name.trim().replace(/\s+/g, " ").slice(0, 24);
    if (!cleaned || !countries.length || !storageReady) return false;
    setCurrentPlayer(cleaned);
    saved.current = false;
    setCurrentCountry((previous) => chooseCountry(countries, previous));
    deadline.current = Date.now() + 15000;
    lastGuess.current = { text: "", at: 0 };
    update({ ...emptyGame, status: "playing" });
    return true;
  };

  const guess = (answer) => {
    syncTimer();
    const text = normalizeCountry(answer);
    if (gameRef.current.status !== "playing" || !text) return false;
    const now = Date.now();
    if (
      now - lastGuess.current.at < 650 ||
      (lastGuess.current.text === text &&
        gameRef.current.feedback?.type === "error")
    )
      return false;
    lastGuess.current = { text, at: now };
    const correct = text === normalizeCountry(currentCountry.name);
    const bonus = 10 + gameRef.current.timer;
    update({
      ...gameRef.current,
      score: gameRef.current.score + (correct ? bonus : -1),
      correct: gameRef.current.correct + (correct ? 1 : 0),
      incorrect: gameRef.current.incorrect + (correct ? 0 : 1),
      status: correct ? "feedback" : "playing",
      feedback: {
        type: correct ? "success" : "error",
        text: correct
          ? `¡Correcto! ${currentCountry.name} · +${bonus} puntos`
          : "Todavía no. −1 punto. ¡Probá otra respuesta!",
      },
    });
    return true;
  };

  const requestHint = () => {
    syncTimer();
    const state = gameRef.current;
    if (state.status !== "playing" || state.timer <= 2) return;
    const positions = Array.from(currentCountry.name)
      .map((letter, index) =>
        /\p{L}/u.test(letter) && !state.hints.includes(index) ? index : -1,
      )
      .filter((index) => index >= 0);
    if (!positions.length) return;
    deadline.current -= 2000;
    update({
      ...state,
      timer: Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)),
      hints: [
        ...state.hints,
        positions[Math.floor(Math.random() * positions.length)],
      ],
    });
  };

  const ranking = useMemo(
    () =>
      [...players].sort(
        (a, b) => b.bestScore - a.bestScore || a.name.localeCompare(b.name),
      ),
    [players],
  );
  return (
    <GameContext.Provider
      value={{
        ...game,
        countries,
        currentCountry,
        currentPlayer,
        players,
        ranking,
        loading,
        error,
        storageError,
        storageReady,
        loadCountries,
        startGame,
        restartGame: () => startGame(),
        finishGame,
        nextCountry,
        guess,
        requestHint,
        resetScore: () => {
          if (gameRef.current.status === "idle")
            update({ ...gameRef.current, score: 0 });
        },
        goHome: () => update({ ...gameRef.current, status: "idle" }),
        accuracy:
          game.correct + game.incorrect
            ? Math.round((game.correct / (game.correct + game.incorrect)) * 100)
            : 0,
        personalBest:
          players.find(
            (p) => normalizeCountry(p.name) === normalizeCountry(currentPlayer),
          )?.bestScore ?? game.score,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context)
    throw new Error("useGame debe utilizarse dentro de GameProvider.");
  return context;
}
