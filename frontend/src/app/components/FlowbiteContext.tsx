"use client";

import { Flowbite, ThemeProps } from "flowbite-react";
import { FC, PropsWithChildren } from "react";
const colors = require('tailwindcss/colors')
const theme: ThemeProps = {
  dark: true,

  theme: {
    
  }
};

const FlowbiteContext: FC<PropsWithChildren> = function ({ children }) {
  return <Flowbite theme={theme}>{children}</Flowbite>;
};

export default FlowbiteContext;