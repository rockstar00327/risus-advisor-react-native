import { LinearGradient } from "expo-linear-gradient";
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const AreaChartComponent = ({ barData, width, spacing }) => {
  return (
    <View>
      <LineChart
        areaChart
        curved
        //hideDataPoints
        noOfSections={5}
        dataPointsWidth={40}
        dataPointsHeight={40}
        dataPointsColor="rgba(0,0,0,0.3)"
        isAnimated
        animationDuration={1200}
        scrollAnimation={false}
        data={barData}
        startFillColor="#ADDCFF"
        startOpacity={1}
        endFillColor="#fff"
        endOpacity={0.3}
        width={320}
        height={250}
        color="#F1F3FF"
        //rulesColor="gray"
        hideYAxisText
        hideRules
        yAxisColor={"#fff"}
        xAxisColor={"#8979FF66"}
        xAxisIndicesWidth={340}
        xAxisLabelContainerStyle={{ width: 300 }}
        xAxisLength={340}
        noOfSectionsBelowXAxis={0}
        initialSpacing={4}
        spacing={spacing}
        stepValue={5}
        // yAxisLabelPrefix="$"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 20,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginTop: 30,
    height: 300,
    alignItems: "center",
    flexDirection: "row",
  },
  chart: {
    color: "#fff",
  },
  pointLabel: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#383838",
  },
});

export default AreaChartComponent;
