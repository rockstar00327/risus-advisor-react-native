import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
// import { LineChart } from 'react-native-chart-kit'
import { useNavigation } from "@react-navigation/native";
import moment from "moment";

import { MaterialIcons } from "@expo/vector-icons";

import AreaChartComponent from "../../components/chart/AreaChartComponent";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../constant/BaseConst";
const AnalyticsScreen = () => {
  const navigation = useNavigation();
  const [analytics, setAnalytics] = useState(null);

  const getAnalytics = async () => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const { data } = await axios.get(`${BASE_URL}/api/user/get-user-stats/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (data) {
        // console.log(data);
        setAnalytics(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAnalytics();
  }, []);

  const analyticsData = {
    postImpressions: {
      value: 0,
      period: "Past 7 days",
    },
    followers: {
      value: 12,
      period: "Previous week",
    },
    profileViewers: {
      value: 3,
      period: "Past 30 days",
    },
    searchAppearances: {
      value: 1,
      period: "Previous week",
    },
  };
  const getLast7Days = () => {
    return Array.from(
      { length: 7 },
      (_, i) =>
        moment()
          .subtract(6 - i, "days")
          .format("ddd") // Get short-form day names
    );
  };

  const last7Days = getLast7Days(); // ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"]

  // Ensure all data points align with their respective days
  const chartData = last7Days.map((day, index) => ({
    value: analytics?.line_chart_data?.[index] || 0, // Fallback to 0 if data is missing
    labelComponent: () => <Text style={styles.xTexts}>{day}</Text>,
  }));

  // console.log(chartData);

  const dPoint = () => {
    return (
      <View
        style={{
          width: 14,
          height: 14,
          backgroundColor: "white",
          borderWidth: 3,
          borderRadius: 7,
          borderColor: "#07BAD1",
        }}
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={22} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Analytics & Tools</Text>
        <View></View>
      </View>

      <View style={styles.analyticsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Analytics</Text>
          <MaterialIcons name="info" size={22} color="black" />
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{analytics?.total_likes || 0}</Text>
            <Text style={styles.statLabel}>Post impressions</Text>
            <Text style={styles.statPeriod}>Past 7 days</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {analytics?.total_followers || 0}
            </Text>
            <Text style={styles.statLabel}>Followers</Text>
            <Text style={styles.statPeriod}>Previous week</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{analytics?.total_views || 0}</Text>
            <Text style={styles.statLabel}>Profile viewers</Text>
            <Text style={styles.statPeriod}>Past 30 days</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {analytics?.total_search_appearance || 0}
            </Text>
            <Text style={styles.statLabel}>Search appearances</Text>
            <Text style={styles.statPeriod}>Previous week</Text>
          </View>
        </View>

        <Text style={styles.chartTitle}>Weekly profile appearances</Text>
        <AreaChartComponent barData={chartData} width={300} spacing={52.5} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingTop: 10,
  },
  analyticsSection: {
    marginTop: 10,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Figtree-Bold",
    marginRight: 5,
  },
  infoIcon: {
    marginLeft: 5,
    color: "#666",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statBox: {
    width: "48%",
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 3,
  },
  statPeriod: {
    fontSize: 12,
    color: "#666",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 10,
    fontFamily: "Figtree-Medium",
  },
  willAdd: {
    fontSize: 20,
    fontFamily: "Figtree-Regular",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    paddingRight: 40,
  },
  xTexts: {
    fontFamily: "Figtree-Regular",
    fontSize: 6.78,
    marginLeft: 26,
  },
});

export default AnalyticsScreen;
