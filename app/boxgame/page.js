"use client";
import React, { useState } from "react";
import usePartySocket from "partysocket/react";
import styles from "./page.module.css";
import Box from "../components/Box";

export default function BoxContainer() {
  const [boxes, setBoxes] = useState([
    {
      x: 0,
      y: 0,
      id: 9,
    },
  ]);

  const ws = usePartySocket({
    host: "localhost:1999",
    room: "boxes",
    party: "boxes",
    onOpen() {
      console.log("connected");
    },
    onMessage(event) {
      console.log(JSON.parse(event.data));
    },
  });

  function handleMove(id, position) {
    // ws.send(JSON.stringify({ id: id, position: position }));
    setBoxes((prev) =>
      prev.map((box) => {
        if (box.id !== id) {
          return { ...box };
        } else {
          console.log(boxes);
          return { ...box, x: position.x, y: position.y };
        }
      })
    );
  }

  return (
    <main id="main" className={styles.boxContainer}>
      {boxes.map((box) => (
        <Box
          key={box.id}
          props={{ x: box.x, y: box.y, id: box.id }}
          handleMove={handleMove}
        />
      ))}
    </main>
  );
}