import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import moment from "moment";

const Calendar = ({ isVisible, onClose, onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [selectedMonth, setSelectedMonth] = useState(moment(currentDate));
  const [showYearSelector, setShowYearSelector] = useState(false);

  const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const screenWidth = Dimensions.get("window").width;
  const daySize = (screenWidth - 80) / 7; // 40px padding on each side

  // Generate array of years (current year ± 50 years)
  const years = Array.from({ length: 101 }, (_, i) => moment().year() - 50 + i);

  const generateDates = () => {
    const startOfMonth = moment(selectedMonth).startOf("month");
    const endOfMonth = moment(selectedMonth).endOf("month");
    const startDate = moment(startOfMonth).startOf("week");
    const endDate = moment(endOfMonth).endOf("week");

    const calendar = [];
    let week = [];

    for (
      let day = moment(startDate);
      day.isSameOrBefore(endDate);
      day.add(1, "days")
    ) {
      week.push({
        date: day.clone(),
        isCurrentMonth: day.month() === selectedMonth.month(),
        isToday: day.isSame(moment(), "day"),
        isSelected: day.isSame(moment(currentDate), "day"),
      });

      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    return calendar;
  };

  const handleDatePress = (date) => {
    setCurrentDate(date.toDate());
  };

  const handleDone = () => {
    onDateSelect(currentDate);
    onClose();
  };

  const changeMonth = (increment) => {
    setSelectedMonth(moment(selectedMonth).add(increment, "months"));
  };

  const selectYear = (year) => {
    setSelectedMonth(moment(selectedMonth).year(year));
    setShowYearSelector(false);
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.headerButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>Select Date</Text>
            <TouchableOpacity onPress={handleDone}>
              <Text style={styles.headerButton}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Month Navigation */}
          <View style={styles.monthNav}>
            <TouchableOpacity
              onPress={() => changeMonth(-1)}
              style={styles.monthButton}
            >
              <Feather name="chevron-left" size={24} color="#0066CC" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowYearSelector(!showYearSelector)}
              style={{
                flexDirection: "row",
                height: 60,
                alignItems: "center",
                // borderWidth: 1,
                // borderColor: "#333",
              }}
            >
              <Text style={styles.monthText}>
                {selectedMonth.format("MMMM YYYY")}{" "}
                {!showYearSelector ? "▼" : "▲"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => changeMonth(1)}
              style={styles.monthButton}
            >
              <Feather name="chevron-right" size={24} color="#0066CC" />
            </TouchableOpacity>
          </View>

          {showYearSelector ? (
            <View style={styles.yearSelectorContainer}>
              <ScrollView style={styles.yearSelector}>
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.yearOption,
                      year === selectedMonth.year() && styles.selectedYear,
                    ]}
                    onPress={() => selectYear(year)}
                  >
                    <Text
                      style={[
                        styles.yearText,
                        year === selectedMonth.year() &&
                          styles.selectedYearText,
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : (
            <>
              {/* Week Days */}
              <View style={styles.weekDays}>
                {weeks.map((week, index) => (
                  <Text key={index} style={styles.weekDay}>
                    {week}
                  </Text>
                ))}
              </View>

              {/* Calendar Grid */}
              <View style={styles.calendarGrid}>
                {generateDates().map((week, weekIndex) => (
                  <View key={weekIndex} style={styles.week}>
                    {week.map((day, dayIndex) => (
                      <TouchableOpacity
                        key={dayIndex}
                        style={[
                          styles.day,
                          { width: daySize, height: daySize },
                          day.isSelected && styles.selectedDay,
                          !day.isCurrentMonth && styles.otherMonthDay,
                          day.isToday && styles.today,
                        ]}
                        onPress={() => handleDatePress(day.date)}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            day.isSelected && styles.selectedDayText,
                            !day.isCurrentMonth && styles.otherMonthDayText,
                            day.isToday && styles.todayText,
                          ]}
                        >
                          {day.date.date()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: 550,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerText: {
    fontSize: 17,
    fontFamily: "Figtree-Medium",
    color: "#333",
  },
  headerButton: {
    fontSize: 16,
    color: "#0066CC",
    fontFamily: "Figtree-Medium",
  },
  monthNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  monthButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  monthText: {
    fontSize: 18,
    fontFamily: "Figtree-Medium",
    color: "#333",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  weekDay: {
    fontSize: 12,
    fontFamily: "Figtree-Medium",
    color: "#666",
  },
  calendarGrid: {
    paddingTop: 10,
    flex: 1,
  },
  week: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  day: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    margin: 2,
  },
  dayText: {
    fontSize: 16,
    fontFamily: "Figtree-Regular",
    color: "#333",
  },
  selectedDay: {
    backgroundColor: "#0066CC",
    borderRadius: 8,
  },
  selectedDayText: {
    color: "white",
    fontFamily: "Figtree-Medium",
  },
  otherMonthDay: {
    opacity: 0.4,
  },
  otherMonthDayText: {
    color: "#999",
  },
  today: {
    backgroundColor: "#E6F0FF",
    borderWidth: 1,
    borderColor: "#0066CC",
  },
  todayText: {
    color: "#0066CC",
    fontFamily: "Figtree-Medium",
  },
  yearSelectorContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  yearSelector: {
    flex: 1,
  },
  yearOption: {
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  yearText: {
    fontSize: 16,
    fontFamily: "Figtree-Regular",
    color: "#333",
  },
  selectedYear: {
    backgroundColor: "#F5F5F5",
  },
  selectedYearText: {
    color: "#0066CC",
    fontFamily: "Figtree-Medium",
  },
});

export default Calendar;
