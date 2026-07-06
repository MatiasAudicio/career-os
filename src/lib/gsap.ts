"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

// Solo los plugins que usamos — cada plugin extra es bundle que el usuario descarga.
gsap.registerPlugin(useGSAP, SplitText, CustomEase);

export { gsap, SplitText, useGSAP };
