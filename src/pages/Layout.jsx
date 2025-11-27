
import React from "react";

export default function Layout({ children }) {
  return (
    <>
      <head>
        <title>Memory Map - Learn C++ Memory Management Visually</title>
        <meta name="description" content="Interactive C++ memory visualization tool. Learn stack, heap, pointers, arrays, structs, vectors, and functions with step-by-step AI explanations. Perfect for students and developers." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Memory Map - Learn C++ Memory Management" />
        <meta property="og:description" content="Master C++ memory with interactive visualizations. See stack, heap, pointers, and more in action." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧠</text></svg>" />
      </head>
      {children}
    </>
  );
}
