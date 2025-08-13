import { View, Text, StyleSheet, FlatList } from 'react-native'
import React from 'react'
import RefreshSvg from './SVG/RefreshSvg'
import CoinPurchasedSvg from './SVG/CoinPurchasedSvg'
import CoinWithdrawSvg from './SVG/CoinWithdrawSvg'
import { TouchableOpacity } from 'react-native-gesture-handler'

const dummyData = [
  {
    id: 1,
    type: 'purchased',
    amount: '+120',
    date: 'April 19',
  },
  {
    id: 2,
    type: 'withdrawal',
    amount: '-200',
    date: 'April 13',
  },
  {
    id: 3,
    type: 'purchased',
    amount: '+500',
    date: 'April 9',
  },
  {
    id: 4,
    type: 'purchased',
    amount: '+200',
    date: 'April 1',
  },
  {
    id: 5,
    type: 'withdrawal',
    amount: '-400',
    date: 'March 28',
  },
  {
    id: 6,
    type: 'purchased',
    amount: '+120',
    date: 'March 25',
  },
  {
    id: 7,
    type: 'purchased',
    amount: '+120',
    date: 'March 25',
  },
  {
    id: 8,
    type: 'purchased',
    amount: '+120',
    date: 'March 25',
  },
  {
    id: 9,
    type: 'purchased',
    amount: '+120',
    date: 'March 25',
  },
  {
    id: 10,
    type: 'purchased',
    amount: '+120',
    date: 'March 25',
  },
  {
    id: 11,
    type: 'purchased',
    amount: '+120',
    date: 'March 25',
  },
]

const TransactionItem = ({ item }) => (
  <View style={styles.transactionItem}>
    {item.type === 'purchased' ? <CoinPurchasedSvg /> : <CoinWithdrawSvg />}
    <View style={styles.transactionInfo}>
      <Text style={styles.transactionType}>
        {item.type === 'purchased' ? 'Ricoins Purchased' : 'Withdrawal'}
      </Text>
      <Text style={styles.transactionDate}>{item.date}</Text>
    </View>
    <Text
      style={[
        styles.transactionAmount,
        { color: item.type === 'purchased' ? '#0C7879' : '#0EA5E9' },
      ]}
    >
      {item.amount}
    </Text>
  </View>
)

const TransactionHistory = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transaction history</Text>
        <TouchableOpacity>
          <RefreshSvg />
        </TouchableOpacity>
      </View>
      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TransactionItem item={item} />}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    paddingHorizontal: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Figtree-SemiBold',
    color: '#000F1A',
  },
  list: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionType: {
    fontSize: 14,
    fontFamily: 'Figtree-Medium',
    color: '#000F1A',
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Figtree-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Figtree-SemiBold',
  },
})

export default TransactionHistory