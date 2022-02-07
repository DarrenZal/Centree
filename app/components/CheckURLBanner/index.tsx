import React, { FC } from "react";

import styles from "./index.module.css";
import t from "@klimadao/lib/theme/typography.module.css";

interface Props {
  onHide: () => void;
}

export const skipCheckURLBanner = () => {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem("checkURLBanner") === "skip";
};

export const CheckURLBanner: FC<Props> = ({ onHide }) => {
  const onDontRemind = () => {
    window.localStorage.setItem("checkURLBanner", "skip");
    onHide();
  };
  return (
    <div className={styles.bg}>
      <div className={styles.banner}>
        <div className={styles.okButtonWrap}>
          <button onClick={onDontRemind} className={styles.dontButton}>
            Don't Remind Me
          </button>
          <button onClick={onHide} className={styles.okButton}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
