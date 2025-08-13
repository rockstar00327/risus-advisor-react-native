import React from "react";
import { Pressable } from "react-native";
import DotsMenu from "../icons/DotsMenu";

const DotsMenuIcon = () => {
  return (
    <Pressable onPress={() => console.log("dots menu pressed")}>
      <DotsMenu />
    </Pressable>
  );
};

export default DotsMenuIcon;
