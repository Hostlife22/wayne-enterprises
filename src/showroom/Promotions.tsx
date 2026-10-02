import { ArrowRight, Play } from "lucide-react";
import { Skyline } from "../components/Graphics";

interface FilmPromotionProps {
  onPlay: () => void;
}
interface ConfigurePromotionProps {
  onConfigure: () => void;
}

export function FilmPromotion({ onPlay }: FilmPromotionProps) {
  return (
    <button className="editorial promo" onClick={onPlay}>
      <Skyline />
      <span className="promo-text">
        A DARKER
        <br />
        GOTHAM.
        <br />A SAFER
        <br />
        TOMORROW.
      </span>
      <span className="watch">
        <span className="play-circle">
          <Play size={10} fill="currentColor" />
        </span>{" "}
        WATCH FILM
      </span>
    </button>
  );
}

export function ConfigurePromotion({ onConfigure }: ConfigurePromotionProps) {
  return (
    <button className="configure-promo promo" onClick={onConfigure}>
      <Skyline />
      <span className="eyebrow">YOUR CITY. YOUR RULES.</span>
      <strong>
        CONFIGURE
        <br />
        YOUR BATPOD
      </strong>
      <span className="promo-bottom">
        <span className="bat-symbol">⌁</span>
        <span className="orange-arrow">
          <ArrowRight size={21} />
        </span>
      </span>
    </button>
  );
}
