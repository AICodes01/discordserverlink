"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function PageProgress() {
  return (
    <ProgressBar
      height="3px"
      color="#8b5cf6"
      options={{ showSpinner: false, easing: "ease", speed: 500 }}
      shallowRouting
    />
  );
}
