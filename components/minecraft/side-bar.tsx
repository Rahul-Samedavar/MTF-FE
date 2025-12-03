"use client"

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function MinecraftCompilerSidebar() {
  const links = [
    {
      label: "Python",
      url: "https://www.programiz.com/python-programming/online-compiler/",
    },
    {
      label: "C",
      url: "https://www.programiz.com/c-programming/online-compiler/",
    },
    {
      label: "C++",
      url: "https://www.programiz.com/cpp-programming/online-compiler/",
    },
    {
      label: "Java",
      url: "https://www.programiz.com/java-programming/online-compiler/",
    },
  ];

  return (
    <div
      className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3 p-2 z-50"
      style={{
        imageRendering: "pixelated",
      }}
    >
      {links.map((item) => (
        <motion.div
          key={item.label}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={() => window.open(item.url, "_blank")}
            className="w-24 text-sm font-bold border-4 rounded-none shadow-lg"
            style={{
              backgroundColor: "#6aa84f", // Minecraft grass color
              borderColor: "#38761d",
              boxShadow: "0 4px #274e13",
              imageRendering: "pixelated",
            }}
          >
            {item.label}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
